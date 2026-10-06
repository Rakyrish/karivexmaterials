from django.test import TestCase

from .models import SiteSettings


class SiteSettingsApiTests(TestCase):
    def test_defaults_match_verified_company_contacts(self):
        data = self.client.get("/api/v1/site-settings/").json()
        self.assertEqual(data["primary_phone"], "+254 710 851911")
        self.assertEqual(data["primary_phone_href"], "tel:+254710851911")
        self.assertEqual(data["secondary_phone_href"], "tel:+254742355548")
        self.assertEqual(data["whatsapp_base_url"], "https://wa.me/254710851911")
        self.assertEqual(data["email"], "info@karivexsolutionsltd.com")
        self.assertEqual(data["relationship_wording"], "A division of KariVex Solutions Ltd")

    def test_singleton(self):
        SiteSettings.load()
        SiteSettings(email="x@example.com").save()
        self.assertEqual(SiteSettings.objects.count(), 1)

    def test_health_check(self):
        self.assertEqual(self.client.get("/healthz").json(), {"status": "ok"})
