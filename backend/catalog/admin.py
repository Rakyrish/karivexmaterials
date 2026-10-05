from django.contrib import admin

from .models import (
    Application,
    Category,
    Product,
    ProductDocument,
    ProductImage,
    ProductSpecification,
    ProductVariant,
)


class ProductSpecificationInline(admin.TabularInline):
    model = ProductSpecification
    extra = 1


class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 0
    fields = (
        "label", "sku", "thickness", "dimensions", "density", "diameter",
        "box_capacity", "pack_size", "sales_unit_override", "availability_status", "order",
    )


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ("image", "alt_text", "is_primary", "order")


class ProductDocumentInline(admin.TabularInline):
    model = ProductDocument
    extra = 0
    fields = ("title", "doc_type", "file", "order")


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        "name", "primary_category", "brand", "status", "availability_status", "order", "updated_at",
    )
    list_editable = ("order",)
    list_filter = ("status", "primary_category", "availability_status", "brand")
    search_fields = ("name", "slug", "sku", "synonyms", "brand")
    prepopulated_fields = {"slug": ("name",)}
    filter_horizontal = ("additional_categories", "applications", "related_products")
    autocomplete_fields = ("primary_category",)
    inlines = [
        ProductSpecificationInline,
        ProductVariantInline,
        ProductImageInline,
        ProductDocumentInline,
    ]
    fieldsets = (
        ("Identity", {
            "fields": ("name", "slug", "sku", "brand", "synonyms", "status", "order"),
        }),
        ("Classification", {
            "fields": ("primary_category", "additional_categories", "applications"),
        }),
        ("Content", {
            "fields": ("short_summary", "description"),
        }),
        ("Commercial", {
            "fields": (
                "sales_unit", "minimum_order_quantity", "moq_unit", "availability_status",
            ),
        }),
        ("Related", {"fields": ("related_products",)}),
        ("SEO", {"fields": ("seo_title", "seo_description")}),
        ("Review / internal", {"fields": ("review_notes", "source_url")}),
    )

    @admin.action(description="Mark selected products as published")
    def make_published(self, request, queryset):
        queryset.update(status="published")

    @admin.action(description="Mark selected products as draft")
    def make_draft(self, request, queryset):
        queryset.update(status="draft")

    actions = ["make_published", "make_draft"]


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "short_code", "status", "order")
    list_editable = ("order",)
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name", "short_code")


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ("name", "status", "order")
    list_editable = ("order",)
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name",)
