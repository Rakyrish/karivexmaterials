import io
from unittest import mock

from django.core import mail
from django.core.cache import cache
from django.core.management import call_command
from django.test import TestCase, override_settings

from catalog.models import Product, ProductVariant

from .models import Enquiry

URL = "/api/v1/enquiries/"


def payload(**overrides):
    product = Product.objects.get(slug="fire-bricks-refractory-bricks")
    data = {
        "name": "Test Buyer",
        "company": "",
        "email": "buyer@example.com",
        "phone": "+254 700 000000",
        "delivery_location": "Mombasa",
        "project_notes": "Monthly order",
        "idempotency_key": "test-key-0001",
        "items": [
            {"product_slug": "fire-bricks-refractory-bricks",
             "variant_id": product.variants.get(label="Test brick size").id,
             "quantity": "200", "unit": "bricks"},
            {"product_slug": "vermiculite", "quantity": "2.5", "notes": "for hearth"},
        ],
    }
    data.update(overrides)
    return data


@override_settings(EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend")
class EnquiryTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        call_command("seed_catalog", stdout=io.StringIO())

    def setUp(self):
        cache.clear()
        # Pizza products have no confirmed variants yet; add one for these tests.
        ProductVariant.objects.get_or_create(
            product=Product.objects.get(slug="fire-bricks-refractory-bricks"), label="Test brick size"
        )

    def post(self, data):
        return self.client.post(URL, data, content_type="application/json")

    def test_multi_item_quote_is_saved_with_snapshots_and_notified(self):
        response = self.post(payload())
        self.assertEqual(response.status_code, 201, response.content)
        body = response.json()
        self.assertTrue(body["reference_number"].startswith("KVM-"))
        self.assertNotIn("email", body)  # confirmation does not echo contact details

        enquiry = Enquiry.objects.get(reference_number=body["reference_number"])
        items = list(enquiry.items.all())
        self.assertEqual(len(items), 2)
        self.assertEqual(items[0].product_name_snapshot, "Fire Bricks for Pizza Ovens")
        self.assertEqual(items[0].variant_label_snapshot, "Test brick size")
        self.assertEqual(
            items[0].product_url_snapshot,
            "https://materials.karivexsolutionsltd.com/products/fire-bricks-refractory-bricks",
        )
        self.assertEqual(str(items[1].quantity), "2.50")

        # Later catalogue edits do not change the historical request.
        Product.objects.filter(slug="fire-bricks-refractory-bricks").update(name="Renamed")
        items[0].refresh_from_db()
        self.assertEqual(items[0].product_name_snapshot, "Fire Bricks for Pizza Ovens")

        self.assertTrue(enquiry.notification_sent)
        self.assertEqual(len(mail.outbox), 1)
        message = mail.outbox[0]
        self.assertEqual(message.to, ["info@karivexsolutionsltd.com"])
        self.assertEqual(message.reply_to, ["buyer@example.com"])
        self.assertNotIn("buyer@example.com", message.from_email)

    def test_duplicate_submit_returns_original(self):
        first = self.post(payload())
        second = self.post(payload())
        self.assertEqual(second.status_code, 200)
        self.assertTrue(second.json()["already_submitted"])
        self.assertEqual(first.json()["reference_number"], second.json()["reference_number"])
        self.assertEqual(Enquiry.objects.count(), 1)
        self.assertEqual(len(mail.outbox), 1)

    def test_required_fields_validated_server_side(self):
        response = self.post(payload(name=" ", email="not-an-email", idempotency_key=""))
        self.assertEqual(response.status_code, 400)
        self.assertIn("name", response.json())
        self.assertIn("email", response.json())
        self.assertEqual(Enquiry.objects.count(), 0)

    def test_optional_fields_are_optional(self):
        data = payload(idempotency_key="")
        for field in ["company", "phone", "delivery_location", "project_notes"]:
            data.pop(field)
        self.assertEqual(self.post(data).status_code, 201)

    def test_empty_basket_and_draft_products_rejected(self):
        self.assertEqual(self.post(payload(items=[])).status_code, 400)
        response = self.post(payload(items=[{"product_slug": "max-50", "quantity": 1}]))
        self.assertEqual(response.status_code, 400)
        hidden = self.post(payload(idempotency_key="", items=[{"product_slug": "eps-boxes", "quantity": 1}]))
        self.assertEqual(hidden.status_code, 400)
        self.assertEqual(Enquiry.objects.count(), 0)

    def test_variant_must_belong_to_product(self):
        other = Product.objects.get(slug="copper-pipe-rolls").variants.first()
        response = self.post(
            payload(items=[{"product_slug": "fire-bricks-refractory-bricks", "variant_id": other.id}])
        )
        self.assertEqual(response.status_code, 400)

    def test_contact_enquiry_without_items(self):
        response = self.post({
            "kind": "contact", "name": "Visitor", "email": "v@example.com",
            "project_notes": "Do you deliver to Kisumu?",
        })
        self.assertEqual(response.status_code, 201, response.content)
        self.assertEqual(Enquiry.objects.get().kind, "contact")

    def test_service_request(self):
        response = self.post({
            "kind": "service", "service_slug": "pizza-oven-building", "name": "Pizzeria Owner",
            "email": "owner@example.com", "delivery_location": "Nairobi",
            "project_notes": "Oven for about 8 pizzas at once",
        })
        self.assertEqual(response.status_code, 201, response.content)
        enquiry = Enquiry.objects.get()
        self.assertEqual(enquiry.kind, "service")
        self.assertEqual(enquiry.service_name_snapshot, "Pizza Oven Building")
        self.assertIn("Service: Pizza Oven Building", mail.outbox[0].body)
        self.assertEqual(response.json()["service_name_snapshot"], "Pizza Oven Building")

    def test_service_request_requires_valid_service(self):
        response = self.post({"kind": "service", "service_slug": "nope", "name": "A", "email": "a@example.com"})
        self.assertEqual(response.status_code, 400)
        self.assertIn("service_slug", response.json())

    def test_honeypot_rejects_without_saving(self):
        response = self.post(payload(website="http://spam.example"))
        self.assertEqual(response.status_code, 400)
        self.assertEqual(Enquiry.objects.count(), 0)

    def test_notification_failure_keeps_enquiry_and_is_visible(self):
        with mock.patch("django.core.mail.EmailMessage.send", side_effect=OSError("SMTP down")):
            response = self.post(payload())
        self.assertEqual(response.status_code, 201)
        enquiry = Enquiry.objects.get()
        self.assertFalse(enquiry.notification_sent)
        self.assertIn("SMTP down", enquiry.notification_error)
        self.assertEqual(enquiry.items.count(), 2)

    @override_settings(DEBUG=False, EMAIL_BACKEND="django.core.mail.backends.console.EmailBackend")
    def test_production_without_real_email_backend_is_flagged(self):
        self.post(payload())
        enquiry = Enquiry.objects.get()
        self.assertFalse(enquiry.notification_sent)
        self.assertIn("not configured", enquiry.notification_error)

    @override_settings(ENQUIRY_RATE_LIMIT="2/h")
    def test_rate_limit(self):
        codes = [self.post(payload(idempotency_key=f"rate-key-{i:04d}")).status_code for i in range(3)]
        self.assertEqual(codes, [201, 201, 429])

    def test_lookup_endpoint_removed(self):
        self.post(payload())
        ref = Enquiry.objects.get().reference_number
        self.assertEqual(self.client.get(f"{URL}{ref}/").status_code, 404)

    def test_admin_session_does_not_break_public_submit(self):
        from django.contrib.auth.models import User

        user = User.objects.create_superuser("owner", "o@example.com", "x-Test-Password-123")
        client = self.client_class(enforce_csrf_checks=True)
        client.force_login(user)
        response = client.post(URL, payload(), content_type="application/json")
        self.assertEqual(response.status_code, 201)
