from django.contrib import admin

from .models import Enquiry, EnquiryItem


class EnquiryItemInline(admin.TabularInline):
    model = EnquiryItem
    extra = 0
    readonly_fields = (
        "product", "variant", "product_name_snapshot", "variant_label_snapshot",
        "category_snapshot", "product_url_snapshot", "quantity", "unit", "notes",
    )
    can_delete = False

    def has_add_permission(self, request, obj=None):
        return False


@admin.register(Enquiry)
class EnquiryAdmin(admin.ModelAdmin):
    list_display = (
        "reference_number", "name", "company", "email", "status",
        "notification_sent", "created_at",
    )
    list_filter = ("status", "notification_sent", "created_at")
    search_fields = ("reference_number", "name", "company", "email", "phone")
    readonly_fields = (
        "reference_number", "idempotency_key", "name", "company", "email", "phone",
        "delivery_location", "project_notes", "notification_sent", "notification_error",
        "created_at", "updated_at",
    )
    fieldsets = (
        ("Reference", {"fields": ("reference_number", "status")}),
        ("Contact", {"fields": ("name", "company", "email", "phone", "delivery_location")}),
        ("Request", {"fields": ("project_notes",)}),
        ("Notification", {"fields": ("notification_sent", "notification_error")}),
        ("Timestamps", {"fields": ("created_at", "updated_at")}),
    )
    inlines = [EnquiryItemInline]

    def has_add_permission(self, request):
        return False
