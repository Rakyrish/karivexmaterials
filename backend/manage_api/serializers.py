from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError as DjangoValidationError
from django.db import models, transaction
from rest_framework import serializers

from catalog.models import (
    Application,
    Category,
    Product,
    ProductImage,
    ProductSpecification,
    ProductVariant,
    PublishStatus,
    Service,
    Testimonial,
)
from catalog.serializers import file_url
from enquiries.models import Enquiry, EnquiryItem
from sitesettings.models import SiteSettings

PUBLISH_PERMISSION = "catalog.publish_product"


class RelativeImageField(serializers.ImageField):
    """Media URLs as site-relative paths (/media/...): the dashboard reaches
    Django through the Next.js proxy, so Django's own host is not public."""

    def to_representation(self, value):
        return file_url(value)


class ModelSerializer(serializers.ModelSerializer):
    serializer_field_mapping = {
        **serializers.ModelSerializer.serializer_field_mapping,
        models.ImageField: RelativeImageField,
    }


class ImageFieldMixin(ModelSerializer):
    """Optional image fields accept a new upload, or `null`/"" to remove the
    current image. Validation and resizing are done by the model."""

    def to_internal_value(self, data):
        if hasattr(data, "dict"):
            data = data.dict()
        else:
            data = dict(data)
        for name, field in self.fields.items():
            if isinstance(field, serializers.ImageField) and data.get(name) == "":
                data[name] = None
        return super().to_internal_value(data)


def run_model_validators(instance_or_model, attrs, field_names):
    """Run the model field validators (image type/size checks) on uploads."""
    model = instance_or_model if isinstance(instance_or_model, type) else type(instance_or_model)
    for name in field_names:
        value = attrs.get(name)
        if not value:
            continue
        try:
            model._meta.get_field(name).run_validators(value)
        except DjangoValidationError as exc:
            raise serializers.ValidationError({name: exc.messages}) from exc


class CategorySerializer(ImageFieldMixin):
    product_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Category
        fields = [
            "id", "name", "slug", "short_code", "intro", "quote_checklist", "seo_title",
            "seo_description", "image", "image_alt", "order", "status", "product_count", "updated_at",
        ]
        read_only_fields = ["updated_at"]
        extra_kwargs = {"slug": {"required": False}}

    def validate(self, attrs):
        run_model_validators(Category, attrs, ["image"])
        return attrs


class ApplicationSerializer(ImageFieldMixin):
    class Meta:
        model = Application
        fields = [
            "id", "name", "slug", "summary", "intro", "considerations", "seo_title",
            "seo_description", "image", "image_alt", "order", "status", "updated_at",
        ]
        read_only_fields = ["updated_at"]
        extra_kwargs = {"slug": {"required": False}}

    def validate(self, attrs):
        run_model_validators(Application, attrs, ["image"])
        return attrs


class SpecificationSerializer(ModelSerializer):
    class Meta:
        model = ProductSpecification
        fields = ["id", "label", "value", "unit", "order"]


class VariantSerializer(ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = [
            "id", "label", "sku", "thickness", "dimensions", "density", "diameter", "box_capacity",
            "pack_size", "sales_unit_override", "availability_status", "is_active", "order",
        ]


class ProductImageSerializer(ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["id", "product", "image", "alt_text", "is_primary", "order", "width", "height"]
        read_only_fields = ["width", "height"]

    def get_fields(self):
        fields = super().get_fields()
        if self.instance is not None and not isinstance(self.instance, list):
            # A stored photo stays attached to its product; replace by uploading a new one.
            fields["product"].read_only = True
            fields["image"].read_only = True
        return fields

    def validate(self, attrs):
        run_model_validators(ProductImage, attrs, ["image"])
        return attrs

    @transaction.atomic
    def save(self, **kwargs):
        image = super().save(**kwargs)
        if image.is_primary:
            ProductImage.objects.filter(product=image.product).exclude(pk=image.pk).update(is_primary=False)
        return image


class ProductListSerializer(ModelSerializer):
    category = serializers.CharField(source="primary_category.name", read_only=True)
    thumbnail = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id", "name", "slug", "status", "availability_status", "category", "price",
            "price_currency", "thumbnail", "order", "updated_at",
        ]

    def get_thumbnail(self, obj):
        images = list(obj.images.all())
        if not images:
            return None
        return file_url(images[0].image)


class ProductSerializer(ModelSerializer):
    specifications = SpecificationSerializer(many=True, required=False)
    variants = VariantSerializer(many=True, required=False)
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            "id", "name", "slug", "sku", "brand", "synonyms", "primary_category",
            "additional_categories", "applications", "short_summary", "description", "selection_notes",
            "sales_unit", "minimum_order_quantity", "moq_unit", "availability_status", "price",
            "price_currency", "price_unit", "price_valid_until", "faqs", "related_products", "seo_title",
            "seo_description", "status", "review_notes", "source_url", "order", "specifications",
            "variants", "images", "created_at", "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]
        extra_kwargs = {"slug": {"required": False}}

    def validate_status(self, value):
        user = self.context["request"].user
        current = self.instance.status if self.instance else PublishStatus.DRAFT
        if value != current and not user.has_perm(PUBLISH_PERMISSION):
            raise serializers.ValidationError(
                "Only users with publishing rights can change a product's status. Save it as a draft "
                "and ask an administrator to publish it."
            )
        return value

    def validate(self, attrs):
        if attrs.get("price") is not None and attrs.get("price") <= 0:
            raise serializers.ValidationError({"price": "Enter the confirmed price, or leave it blank."})
        return attrs

    def _write_rows(self, product, model, rows, related_name):
        """Replace the product's rows with the submitted list (update by id,
        create new ones, delete those no longer present)."""
        existing = {row.id: row for row in getattr(product, related_name).all()}
        keep = set()
        for index, row in enumerate(rows):
            row = dict(row)
            row.setdefault("order", index)
            row_id = self.initial_row_ids.get(related_name, [None] * len(rows))[index]
            if row_id in existing:
                obj = existing[row_id]
                for key, value in row.items():
                    setattr(obj, key, value)
                obj.save()
                keep.add(row_id)
            else:
                model.objects.create(product=product, **row)
        for row_id, obj in existing.items():
            if row_id not in keep:
                obj.delete()

    def to_internal_value(self, data):
        # Nested serializers drop the read-only `id`; keep it to match rows.
        self.initial_row_ids = {
            name: [row.get("id") if isinstance(row, dict) else None for row in data.get(name) or []]
            for name in ("specifications", "variants")
            if name in data
        }
        return super().to_internal_value(data)

    @transaction.atomic
    def create(self, validated_data):
        specs = validated_data.pop("specifications", None)
        variants = validated_data.pop("variants", None)
        product = super().create(validated_data)
        if specs is not None:
            self._write_rows(product, ProductSpecification, specs, "specifications")
        if variants is not None:
            self._write_rows(product, ProductVariant, variants, "variants")
        return product

    @transaction.atomic
    def update(self, instance, validated_data):
        specs = validated_data.pop("specifications", None)
        variants = validated_data.pop("variants", None)
        product = super().update(instance, validated_data)
        if specs is not None:
            self._write_rows(product, ProductSpecification, specs, "specifications")
        if variants is not None:
            self._write_rows(product, ProductVariant, variants, "variants")
        return product


class ServiceSerializer(ImageFieldMixin):
    class Meta:
        model = Service
        fields = [
            "id", "name", "slug", "summary", "description", "includes", "request_checklist",
            "related_products", "faqs", "image", "image_alt", "seo_title", "seo_description", "order",
            "status", "review_notes", "updated_at",
        ]
        read_only_fields = ["updated_at"]
        extra_kwargs = {"slug": {"required": False}}

    def validate(self, attrs):
        run_model_validators(Service, attrs, ["image"])
        return attrs


class TestimonialSerializer(ModelSerializer):
    service_name = serializers.CharField(source="service.name", read_only=True, default=None)

    class Meta:
        model = Testimonial
        fields = [
            "id", "customer_name", "customer_role", "location", "quote", "rating", "topic", "service",
            "service_name", "received_on", "consent_confirmed", "is_placeholder", "status", "order",
            "updated_at",
        ]
        read_only_fields = ["is_placeholder", "updated_at"]

    def validate(self, attrs):
        status = attrs.get("status", getattr(self.instance, "status", PublishStatus.DRAFT))
        if status == PublishStatus.PUBLISHED:
            quote = attrs.get("quote", getattr(self.instance, "quote", ""))
            consent = attrs.get("consent_confirmed", getattr(self.instance, "consent_confirmed", False))
            placeholder = getattr(self.instance, "is_placeholder", False) and "[Placeholder]" in quote
            if placeholder:
                raise serializers.ValidationError(
                    {"status": "This is a placeholder. Replace it with a real customer's words before publishing."}
                )
            if not consent:
                raise serializers.ValidationError(
                    {"consent_confirmed": "Confirm the customer agreed to publication before publishing."}
                )
        return attrs


class EnquiryItemSerializer(ModelSerializer):
    class Meta:
        model = EnquiryItem
        fields = "__all__"


class EnquirySerializer(ModelSerializer):
    items = EnquiryItemSerializer(many=True, read_only=True)

    class Meta:
        model = Enquiry
        exclude = ["idempotency_key"]
        # Customer submissions are a record; staff change only the workflow fields.
        read_only_fields = [
            f.name for f in Enquiry._meta.fields if f.name not in ("status", "internal_notes")
        ]


class SiteSettingsSerializer(ImageFieldMixin):
    class Meta:
        model = SiteSettings
        exclude = ["id"]

    def validate(self, attrs):
        run_model_validators(SiteSettings, attrs, ["logo_header_override"])
        if "whatsapp_number_intl" in attrs:
            digits = SiteSettings.digits(attrs["whatsapp_number_intl"])
            if not digits:
                raise serializers.ValidationError({"whatsapp_number_intl": "Enter digits, e.g. 254710851911."})
            attrs["whatsapp_number_intl"] = digits
        return attrs


class UserSerializer(ModelSerializer):
    name = serializers.SerializerMethodField()
    groups = serializers.SlugRelatedField(many=True, read_only=True, slug_field="name")

    class Meta:
        model = get_user_model()
        fields = ["username", "name", "is_superuser", "groups"]

    def get_name(self, user):
        return user.get_full_name() or user.get_username()
