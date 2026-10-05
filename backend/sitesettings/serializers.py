from rest_framework import serializers

from .models import SiteSettings


class SiteSettingsSerializer(serializers.ModelSerializer):
    logo_header_override = serializers.SerializerMethodField()
    whatsapp_base_url = serializers.SerializerMethodField()

    class Meta:
        model = SiteSettings
        fields = [
            "site_name", "division_descriptor", "parent_company_name",
            "relationship_wording", "tagline",
            "chemical_division_name", "chemical_division_url",
            "primary_phone", "secondary_phone", "whatsapp_number_intl", "whatsapp_base_url",
            "email", "address_line", "hours_text", "regions_served",
            "production_origin", "ga_measurement_id",
            "homepage_headline", "homepage_intro",
            "logo_header_override",
        ]

    def get_logo_header_override(self, obj):
        return obj.logo_header_override.url if obj.logo_header_override else None

    def get_whatsapp_base_url(self, obj):
        return f"https://wa.me/{obj.whatsapp_number_intl}"
