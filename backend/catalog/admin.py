from django.conf import settings
from django.contrib import admin, messages
from django.utils.html import format_html

from .models import (
    Application,
    Category,
    Product,
    ProductDocument,
    ProductImage,
    ProductSpecification,
    ProductVariant,
    PublishStatus,
    Redirect,
    Service,
    Testimonial,
)


def public_url(path):
    return f"{settings.SITE_PRODUCTION_ORIGIN}{path}"


class ProductSpecificationInline(admin.TabularInline):
    model = ProductSpecification
    extra = 0
    fields = ("label", "value", "unit", "order")


class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 0
    fields = (
        "label", "sku", "thickness", "dimensions", "density", "diameter",
        "box_capacity", "pack_size", "sales_unit_override", "availability_status",
        "is_active", "order",
    )


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 0
    fields = ("preview", "image", "alt_text", "is_primary", "order")
    readonly_fields = ("preview",)

    @admin.display(description="Preview")
    def preview(self, obj):
        if obj and obj.image:
            return format_html('<img src="{}" alt="" style="max-height:70px;max-width:110px">', obj.image.url)
        return "—"


class ProductDocumentInline(admin.TabularInline):
    model = ProductDocument
    extra = 0
    fields = ("title", "doc_type", "file", "is_public", "order")


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        "name", "primary_category", "status", "availability_status",
        "image_count", "order", "updated_at", "view_on_site_link",
    )
    list_editable = ("order",)
    list_filter = ("status", "primary_category", "availability_status", "applications")
    search_fields = ("name", "slug", "sku", "synonyms", "brand", "review_notes")
    prepopulated_fields = {"slug": ("name",)}
    filter_horizontal = ("additional_categories", "applications", "related_products")
    autocomplete_fields = ("primary_category",)
    save_on_top = True
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
            "fields": ("short_summary", "description", "selection_notes", "faqs"),
        }),
        ("Price (optional - confirmed prices only)", {
            "fields": ("price", "price_currency", "price_unit", "price_valid_until"),
            "description": "Leave blank for quote-only products. A confirmed price is shown on the page and "
            "published as an Offer in structured data, which can make the product eligible for Google "
            "product rich results.",
        }),
        ("Commercial (confirmed facts only)", {
            "fields": (
                "sales_unit", "minimum_order_quantity", "moq_unit", "availability_status",
            ),
        }),
        ("Related", {"fields": ("related_products",)}),
        ("SEO", {"fields": ("seo_title", "seo_description")}),
        ("Review / internal (never shown publicly)", {"fields": ("review_notes", "source_url")}),
    )
    actions = ["make_published", "make_draft", "make_archived"]

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("primary_category").prefetch_related("images")

    @admin.display(description="Images")
    def image_count(self, obj):
        return len(obj.images.all())

    @admin.display(description="Public page")
    def view_on_site_link(self, obj):
        if obj.status == PublishStatus.PUBLISHED:
            return format_html('<a href="{}" target="_blank" rel="noopener">Open</a>', public_url(obj.public_path))
        return "Draft"

    def view_on_site(self, obj):
        return public_url(obj.public_path) if obj.status == PublishStatus.PUBLISHED else None

    def _can_publish(self, request):
        return request.user.has_perm("catalog.publish_product")

    def get_readonly_fields(self, request, obj=None):
        readonly = list(super().get_readonly_fields(request, obj))
        if not self._can_publish(request):
            readonly.append("status")
        return readonly

    def get_actions(self, request):
        actions = super().get_actions(request)
        if not self._can_publish(request):
            actions.pop("make_published", None)
            actions.pop("make_draft", None)
            actions.pop("make_archived", None)
        return actions

    def _set_status(self, request, queryset, status):
        # Save individually so updated_at, redirects and frontend
        # revalidation signals all run.
        for product in queryset:
            product.status = status
            product.save()
        self.message_user(request, f"{queryset.count()} product(s) set to {status}.", messages.SUCCESS)

    @admin.action(description="Publish selected products", permissions=["publish"])
    def make_published(self, request, queryset):
        self._set_status(request, queryset, PublishStatus.PUBLISHED)

    @admin.action(description="Move selected products back to draft", permissions=["publish"])
    def make_draft(self, request, queryset):
        self._set_status(request, queryset, PublishStatus.DRAFT)

    @admin.action(description="Hide selected products (outside current focus)", permissions=["publish"])
    def make_archived(self, request, queryset):
        self._set_status(request, queryset, PublishStatus.ARCHIVED)

    def has_publish_permission(self, request):
        return self._can_publish(request)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "short_code", "status", "order")
    list_editable = ("order",)
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name", "short_code")
    fields = (
        "name", "slug", "short_code", "status", "order", "intro", "quote_checklist",
        "image", "image_alt", "seo_title", "seo_description",
    )

    def view_on_site(self, obj):
        return public_url(f"/categories/{obj.slug}")


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ("name", "status", "order")
    list_editable = ("order",)
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name",)
    fields = (
        "name", "slug", "status", "order", "summary", "intro", "considerations",
        "image", "image_alt", "seo_title", "seo_description",
    )

    def view_on_site(self, obj):
        return public_url(f"/applications/{obj.slug}")


@admin.register(Redirect)
class RedirectAdmin(admin.ModelAdmin):
    list_display = ("old_path", "new_path", "updated_at")
    search_fields = ("old_path", "new_path")


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ("name", "status", "order", "updated_at")
    list_editable = ("order",)
    list_filter = ("status",)
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name", "summary", "description")
    filter_horizontal = ("related_products",)
    fields = (
        "name", "slug", "status", "order", "summary", "description", "includes", "request_checklist",
        "faqs", "related_products", "image", "image_alt", "seo_title", "seo_description", "review_notes",
    )

    def view_on_site(self, obj):
        return public_url(f"/services/{obj.slug}") if obj.status == PublishStatus.PUBLISHED else None


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ("__str__", "topic", "rating", "consent_confirmed", "status", "is_placeholder", "order")
    list_filter = ("status", "topic", "consent_confirmed", "is_placeholder")
    list_editable = ("order",)
    search_fields = ("customer_name", "customer_role", "quote")
    readonly_fields = ("is_placeholder",)
    fields = (
        "is_placeholder", "customer_name", "customer_role", "location", "quote", "rating", "topic",
        "service", "received_on", "consent_confirmed", "status", "order",
    )

    def get_readonly_fields(self, request, obj=None):
        readonly = list(super().get_readonly_fields(request, obj))
        if not request.user.has_perm("catalog.publish_product"):
            readonly.append("status")
        return readonly
