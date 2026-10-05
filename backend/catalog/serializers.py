from rest_framework import serializers

from .models import (
    Application,
    Category,
    Product,
    ProductDocument,
    ProductImage,
    ProductSpecification,
    ProductVariant,
)


class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = [
            "id", "name", "slug", "short_code", "intro",
            "seo_title", "seo_description", "image", "product_count", "updated_at",
        ]

    def get_product_count(self, obj):
        return obj.primary_products.filter(status="published").count()

    def get_image(self, obj):
        return obj.image.url if obj.image else None


class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ["id", "name", "slug", "intro", "seo_title", "seo_description", "updated_at"]


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
    class Meta:
        model = ProductImage
        fields = ["image", "alt_text", "is_primary"]


class ProductDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductDocument
        fields = ["title", "doc_type", "file"]


class ProductCardSerializer(serializers.ModelSerializer):
    """Slim representation for listing/category/search pages."""

    primary_category = CategorySerializer(read_only=True)
    primary_image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id", "slug", "name", "brand", "short_summary",
            "primary_category", "availability_status", "primary_image", "updated_at",
        ]

    def get_primary_image(self, obj):
        img = next((i for i in obj.images.all() if i.is_primary), None) or next(
            iter(obj.images.all()), None
        )
        if img:
            return {"image": img.image.url, "alt_text": img.alt_text}
        return None


class ProductDetailSerializer(serializers.ModelSerializer):
    primary_category = CategorySerializer(read_only=True)
    additional_categories = CategorySerializer(many=True, read_only=True)
    applications = ApplicationSerializer(many=True, read_only=True)
    specifications = ProductSpecificationSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    documents = ProductDocumentSerializer(many=True, read_only=True)
    related_products = ProductCardSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            "id", "slug", "name", "sku", "brand", "short_summary", "description",
            "primary_category", "additional_categories", "applications",
            "sales_unit", "minimum_order_quantity", "moq_unit", "availability_status",
            "specifications", "variants", "images", "documents", "related_products",
            "seo_title", "seo_description", "updated_at",
        ]
