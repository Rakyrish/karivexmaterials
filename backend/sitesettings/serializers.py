from rest_framework import serializers

from .models import SiteSettings


def tel_href(number):
    digits = SiteSettings.digits(number)
    return f"tel:+{digits}" if digits else None


class SiteSettingsSerializer(serializers.ModelSerializer):
    logo_header_override = serializers.SerializerMethodField()
    whatsapp_base_url = serializers.SerializerMethodField()
    primary_phone_href = serializers.SerializerMethodField()
    secondary_phone_href = serializers.SerializerMethodField()

    class Meta:
        model = SiteSettings
        fields = [
            "site_name", "division_descriptor", "parent_company_name",
            "relationship_wording", "tagline",
            "chemical_division_name", "chemical_division_url",
            "primary_phone", "primary_phone_href", "secondary_phone", "secondary_phone_href",
            "whatsapp_number_intl", "whatsapp_base_url",
            "email", "address_line", "hours_text", "regions_served",
            "contact_source_url", "contact_verified_on", "contact_form_enabled",
            "production_origin", "ga_measurement_id", "google_review_url",
            "homepage_headline", "homepage_intro",
            "logo_header_override",
        ]

    def get_logo_header_override(self, obj):
        return obj.logo_header_override.url if obj.logo_header_override else None

    def get_whatsapp_base_url(self, obj):
        digits = SiteSettings.digits(obj.whatsapp_number_intl)
        return f"https://wa.me/{digits}" if digits else None

    def get_primary_phone_href(self, obj):
        return tel_href(obj.primary_phone)

    def get_secondary_phone_href(self, obj):
        return tel_href(obj.secondary_phone) if obj.secondary_phone else None
