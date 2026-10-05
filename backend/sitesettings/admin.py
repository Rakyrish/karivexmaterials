from django.contrib import admin

from .models import SiteSettings


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    fieldsets = (
        ("Identity", {
            "fields": (
                "site_name", "division_descriptor", "parent_company_name",
                "relationship_wording", "tagline",
            ),
        }),
        ("Chemical Division link", {
            "fields": ("chemical_division_name", "chemical_division_url"),
        }),
        ("Contacts (verify against the live KariVex site before changing)", {
            "fields": (
                "primary_phone", "secondary_phone", "whatsapp_number_intl", "email",
                "address_line", "hours_text", "regions_served",
                "contact_source_url", "contact_verified_on",
            ),
        }),
        ("SEO / technical", {
            "fields": ("production_origin", "ga_measurement_id"),
        }),
        ("Homepage copy", {
            "fields": ("homepage_headline", "homepage_intro"),
        }),
        ("Branding", {
            "fields": ("logo_header_override",),
        }),
    )

    def has_add_permission(self, request):
        return not SiteSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False
