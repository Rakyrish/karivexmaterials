from django.db.models import Q
from rest_framework import serializers

from .models import (
    Application,
    Category,
    Product,
    ProductDocument,
    ProductImage,
    ProductSpecification,
    ProductVariant,
    PublishStatus,
)


def published_product_count(queryset_filter):
    return (
        Product.objects.filter(status=PublishStatus.PUBLISHED)
        .filter(queryset_filter)
        .distinct()
        .count()
    )


def lines(text):
    return [line.strip(" -•\t") for line in (text or "").splitlines() if line.strip(" -•\t")]


def file_url(field_file):
    return field_file.url if field_file else None


class CategoryRefSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["name", "slug", "short_code"]


class ApplicationRefSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ["name", "slug"]


class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    quote_checklist = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = [
            "id", "name", "slug", "short_code", "intro", "quote_checklist",
            "seo_title", "seo_description", "image", "image_alt", "product_count", "updated_at",
        ]

    def get_product_count(self, obj):
        return published_product_count(Q(primary_category=obj) | Q(additional_categories=obj))

    def get_image(self, obj):
        return file_url(obj.image)

    def get_quote_checklist(self, obj):
        return lines(obj.quote_checklist)


class ApplicationSerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    considerations = serializers.SerializerMethodField()

    class Meta:
        model = Application
        fields = [
            "id", "name", "slug", "summary", "intro", "considerations",
            "seo_title", "seo_description", "image", "image_alt", "product_count", "updated_at",
        ]

    def get_product_count(self, obj):
        return published_product_count(Q(applications=obj))

    def get_image(self, obj):
        return file_url(obj.image)

    def get_considerations(self, obj):
        return lines(obj.considerations)


class ProductSpecificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductSpecification
        fields = ["label", "value", "unit"]


class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = [
            "id", "label", "sku", "thickness", "dimensions", "density", "diameter",
            "box_capacity", "pack_size", "sales_unit_override", "availability_status",
        ]


class ProductImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ["image", "alt_text", "width", "height", "is_primary"]

    def get_image(self, obj):
        return file_url(obj.image)


class ProductDocumentSerializer(serializers.ModelSerializer):
    file = serializers.SerializerMethodField()

    class Meta:
        model = ProductDocument
        fields = ["title", "doc_type", "file"]

    def get_file(self, obj):
        return file_url(obj.file)


def primary_image(obj):
    images = list(obj.images.all())
    img = next((i for i in images if i.is_primary), None) or next(iter(images), None)
    if img:
        return ProductImageSerializer(img).data
    return None


class ProductCardSerializer(serializers.ModelSerializer):
    """Slim representation for listing/category/search pages."""

    primary_category = CategoryRefSerializer(read_only=True)
    primary_image = serializers.SerializerMethodField()
    variant_count = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id", "slug", "name", "brand", "short_summary",
            "primary_category", "availability_status", "primary_image",
            "variant_count", "updated_at",
        ]

    def get_primary_image(self, obj):
        return primary_image(obj)

    def get_variant_count(self, obj):
        return sum(1 for v in obj.variants.all() if v.is_active)


class ProductDetailSerializer(serializers.ModelSerializer):
    primary_category = CategoryRefSerializer(read_only=True)
    additional_categories = serializers.SerializerMethodField()
    applications = serializers.SerializerMethodField()
    specifications = ProductSpecificationSerializer(many=True, read_only=True)
    variants = serializers.SerializerMethodField()
    images = ProductImageSerializer(many=True, read_only=True)
    documents = serializers.SerializerMethodField()
    related_products = serializers.SerializerMethodField()
    selection_notes = serializers.SerializerMethodField()
    synonyms = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id", "slug", "name", "sku", "brand", "synonyms", "short_summary", "description",
            "selection_notes", "primary_category", "additional_categories", "applications",
            "sales_unit", "minimum_order_quantity", "moq_unit", "availability_status",
            "specifications", "variants", "images", "documents", "related_products",
            "seo_title", "seo_description", "updated_at",
        ]

    def get_additional_categories(self, obj):
        cats = [c for c in obj.additional_categories.all() if c.status == PublishStatus.PUBLISHED]
        return CategoryRefSerializer(cats, many=True).data

    def get_applications(self, obj):
        apps = [a for a in obj.applications.all() if a.status == PublishStatus.PUBLISHED]
        return ApplicationRefSerializer(apps, many=True).data

    def get_variants(self, obj):
        return ProductVariantSerializer([v for v in obj.variants.all() if v.is_active], many=True).data

    def get_documents(self, obj):
        return ProductDocumentSerializer([d for d in obj.documents.all() if d.is_public], many=True).data

    def get_related_products(self, obj):
        related = [p for p in obj.related_products.all() if p.status == PublishStatus.PUBLISHED]
        if not related:
            # Fall back to other published products in the same primary category.
            related = list(
                Product.objects.filter(
                    status=PublishStatus.PUBLISHED, primary_category=obj.primary_category
                )
                .exclude(pk=obj.pk)
                .select_related("primary_category")
                .prefetch_related("images", "variants")[:4]
            )
        return ProductCardSerializer(related, many=True).data

    def get_selection_notes(self, obj):
        return lines(obj.selection_notes)

    def get_synonyms(self, obj):
        return [s.strip() for s in obj.synonyms.split(",") if s.strip()]
