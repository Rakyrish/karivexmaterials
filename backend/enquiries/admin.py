from django.contrib import admin, messages

from .models import Enquiry, EnquiryItem
from .notifications import send_enquiry_notification


class EnquiryItemInline(admin.TabularInline):
    model = EnquiryItem
    extra = 0
    fields = (
        "product_name_snapshot", "variant_label_snapshot", "sku_snapshot", "quantity", "unit",
        "notes", "category_snapshot", "product_url_snapshot", "product",
    )
    readonly_fields = fields
    can_delete = False

    def has_add_permission(self, request, obj=None):
        return False


class NotificationFilter(admin.SimpleListFilter):
    title = "notification"
    parameter_name = "notification"

    def lookups(self, request, model_admin):
        return [("failed", "Not delivered"), ("sent", "Sent")]

    def queryset(self, request, queryset):
        if self.value() == "failed":
            return queryset.filter(notification_sent=False)
        if self.value() == "sent":
            return queryset.filter(notification_sent=True)
        return queryset


@admin.register(Enquiry)
class EnquiryAdmin(admin.ModelAdmin):
    list_display = (
        "reference_number", "kind", "service_name_snapshot", "name", "company", "item_count", "status",
        "notification_sent", "created_at",
    )
    list_filter = ("status", "kind", NotificationFilter, "created_at")
    search_fields = (
        "reference_number", "name", "company", "email", "phone", "items__product_name_snapshot",
    )
    date_hierarchy = "created_at"
    readonly_fields = (
        "reference_number", "kind", "service_name_snapshot", "idempotency_key", "name", "company", "email", "phone",
        "delivery_location", "project_notes", "notification_sent", "notification_error",
        "notification_attempted_at", "created_at", "updated_at",
    )
    fieldsets = (
        ("Reference", {
            "fields": ("reference_number", "kind", "service_name_snapshot", "status", "internal_notes"),
        }),
        ("Contact", {"fields": ("name", "company", "email", "phone", "delivery_location")}),
        ("Request", {"fields": ("project_notes",)}),
        ("Notification", {
            "fields": ("notification_sent", "notification_error", "notification_attempted_at"),
        }),
        ("Timestamps", {"fields": ("created_at", "updated_at")}),
    )
    inlines = [EnquiryItemInline]
    actions = ["retry_notification"]

    def get_queryset(self, request):
        return super().get_queryset(request).prefetch_related("items")

    @admin.display(description="Lines")
    def item_count(self, obj):
        return len(obj.items.all())

    def has_add_permission(self, request):
        return False

    def changelist_view(self, request, extra_context=None):
        failed = Enquiry.objects.filter(notification_sent=False).count()
        if failed:
            noun = "enquiry" if failed == 1 else "enquiries"
            self.message_user(
                request,
                f"{failed} {noun} saved without a delivered email notification. Use the "
                "'Not delivered' notification filter and follow them up here.",
                messages.WARNING,
            )
        return super().changelist_view(request, extra_context)

    @admin.action(description="Retry email notification", permissions=["change"])
    def retry_notification(self, request, queryset):
        sent = sum(1 for enquiry in queryset if send_enquiry_notification(enquiry))
        failed = queryset.count() - sent
        if sent:
            self.message_user(request, f"{sent} notification(s) sent.", messages.SUCCESS)
        if failed:
            self.message_user(
                request, f"{failed} notification(s) still failing — see the error field.",
                messages.ERROR,
            )
