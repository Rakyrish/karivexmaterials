from rest_framework import serializers

from catalog.models import Product, ProductVariant

from .models import Enquiry, EnquiryItem


class EnquiryItemInputSerializer(serializers.Serializer):
    product_slug = serializers.SlugField()
    variant_id = serializers.IntegerField(required=False, allow_null=True)
    quantity = serializers.IntegerField(min_value=1, default=1)
    unit = serializers.CharField(required=False, allow_blank=True, max_length=60)
    notes = serializers.CharField(required=False, allow_blank=True, max_length=300)
    product_url = serializers.CharField(required=False, allow_blank=True, max_length=300)


class EnquiryCreateSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=120)
    company = serializers.CharField(max_length=160, required=False, allow_blank=True)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=40, required=False, allow_blank=True)
    delivery_location = serializers.CharField(max_length=200, required=False, allow_blank=True)
    project_notes = serializers.CharField(required=False, allow_blank=True)
    idempotency_key = serializers.CharField(max_length=64, required=False, allow_blank=True)
    items = EnquiryItemInputSerializer(many=True)

    def validate_items(self, items):
        if not items:
            raise serializers.ValidationError("Add at least one product to the quote basket.")
        return items

    def create(self, validated_data):
        items_data = validated_data.pop("items")
        idempotency_key = validated_data.pop("idempotency_key", "") or None

        if idempotency_key:
            existing = Enquiry.objects.filter(idempotency_key=idempotency_key).first()
            if existing:
                return existing, False

        enquiry = Enquiry.objects.create(idempotency_key=idempotency_key, **validated_data)

        for item in items_data:
            product = Product.objects.filter(
                slug=item["product_slug"], status="published"
            ).first()
            variant = None
            if product and item.get("variant_id"):
                variant = product.variants.filter(id=item["variant_id"]).first()

            EnquiryItem.objects.create(
                enquiry=enquiry,
                product=product,
                variant=variant,
                product_name_snapshot=product.name if product else item["product_slug"],
                variant_label_snapshot=variant.label if variant else "",
                category_snapshot=product.primary_category.name if product else "",
                product_url_snapshot=item.get("product_url", ""),
                quantity=item.get("quantity", 1),
                unit=item.get("unit", "") or (product.sales_unit if product else ""),
                notes=item.get("notes", ""),
            )
        return enquiry, True


class EnquiryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = EnquiryItem
        fields = [
            "product_name_snapshot", "variant_label_snapshot", "category_snapshot",
            "quantity", "unit", "notes",
        ]


class EnquiryReadSerializer(serializers.ModelSerializer):
    items = EnquiryItemSerializer(many=True, read_only=True)

    class Meta:
        model = Enquiry
        fields = [
            "reference_number", "name", "company", "email", "phone",
            "delivery_location", "project_notes", "status", "created_at", "items",
        ]
