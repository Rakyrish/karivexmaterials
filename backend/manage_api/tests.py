import io
import shutil
import tempfile

from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.core.cache import cache
from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.management import call_command
from django.test import TestCase, override_settings
from PIL import Image
from rest_framework.test import APIClient

from catalog.models import Category, Product, ProductImage, PublishStatus, Testimonial
from sitesettings.models import SiteSettings

MEDIA_ROOT = tempfile.mkdtemp()


def png_upload(name="photo.png", size=(40, 30)):
    buffer = io.BytesIO()
    Image.new("RGB", size, (200, 80, 20)).save(buffer, format="PNG")
    return SimpleUploadedFile(name, buffer.getvalue(), content_type="image/png")


@override_settings(MEDIA_ROOT=MEDIA_ROOT)
class ManageApiTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        call_command("setup_groups", verbosity=0)
        User = get_user_model()
        cls.editor = User.objects.create_user("editor", password="pw-editor-123", is_staff=True)
        cls.editor.groups.add(Group.objects.get(name="Catalogue Editors"))
        cls.admin = User.objects.create_user("boss", password="pw-boss-123", is_staff=True)
        cls.admin.groups.add(Group.objects.get(name="Administrators"))
        cls.sales = User.objects.create_user("sales", password="pw-sales-123", is_staff=True)
        cls.sales.groups.add(Group.objects.get(name="Sales"))
        cls.customer = User.objects.create_user("customer", password="pw-cust-123")
        cls.category = Category.objects.create(name="Oven materials", short_code="OM")

    @classmethod
    def tearDownClass(cls):
        super().tearDownClass()
        shutil.rmtree(MEDIA_ROOT, ignore_errors=True)

    def setUp(self):
        cache.clear()

    def client_for(self, user):
        client = APIClient()
        client.force_login(user)
        return client

    def product_payload(self, **extra):
        return {"name": "Fire bricks", "primary_category": self.category.id, **extra}

    # --- authentication -------------------------------------------------

    def test_anonymous_is_refused(self):
        for url in ["/api/manage/products/", "/api/manage/settings/", "/api/manage/overview/"]:
            self.assertIn(APIClient().get(url).status_code, (401, 403), url)

    def test_session_reports_signed_out_and_sets_csrf_cookie(self):
        response = APIClient().get("/api/manage/session/")
        self.assertEqual(response.json(), {"authenticated": False})
        self.assertIn("csrftoken", response.cookies)

    def test_login_requires_csrf_token(self):
        client = APIClient(enforce_csrf_checks=True)
        response = client.post("/api/manage/login/", {"username": "boss", "password": "pw-boss-123"}, format="json")
        self.assertEqual(response.status_code, 403)

    def test_login_with_csrf_then_logout(self):
        client = APIClient(enforce_csrf_checks=True)
        token = client.get("/api/manage/session/").cookies["csrftoken"].value
        response = client.post(
            "/api/manage/login/", {"username": "boss", "password": "pw-boss-123"},
            format="json", HTTP_X_CSRFTOKEN=token,
        )
        self.assertEqual(response.status_code, 200, response.content)
        self.assertTrue(response.json()["authenticated"])
        self.assertIn("catalog.publish_product", response.json()["permissions"])
        # Login rotates the CSRF token; writes need the new one.
        token = client.cookies["csrftoken"].value
        self.assertEqual(client.get("/api/manage/products/").status_code, 200)
        self.assertEqual(client.post("/api/manage/products/", self.product_payload(), format="json").status_code, 403)
        self.assertEqual(
            client.post("/api/manage/products/", self.product_payload(), format="json",
                        HTTP_X_CSRFTOKEN=token).status_code, 201,
        )
        client.post("/api/manage/logout/", HTTP_X_CSRFTOKEN=token)
        self.assertIn(client.get("/api/manage/products/").status_code, (401, 403))

    def test_wrong_password_and_non_staff_get_the_same_answer(self):
        bad = APIClient().post("/api/manage/login/", {"username": "boss", "password": "nope"}, format="json")
        non_staff = APIClient().post(
            "/api/manage/login/", {"username": "customer", "password": "pw-cust-123"}, format="json"
        )
        self.assertEqual(bad.status_code, 400)
        self.assertEqual(bad.json(), non_staff.json())

    def test_login_is_rate_limited(self):
        client = APIClient()
        for _ in range(10):
            client.post("/api/manage/login/", {"username": "boss", "password": "wrong"}, format="json")
        response = client.post("/api/manage/login/", {"username": "boss", "password": "pw-boss-123"}, format="json")
        self.assertEqual(response.status_code, 429)

    # --- permissions ----------------------------------------------------

    def test_editor_creates_drafts_but_cannot_publish(self):
        client = self.client_for(self.editor)
        response = client.post("/api/manage/products/", self.product_payload(status="published"), format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("status", response.json())
        response = client.post("/api/manage/products/", self.product_payload(), format="json")
        self.assertEqual(response.status_code, 201)
        product_id = response.json()["id"]
        self.assertEqual(Product.objects.get(pk=product_id).status, PublishStatus.DRAFT)
        response = client.patch(f"/api/manage/products/{product_id}/", {"status": "published"}, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(client.delete(f"/api/manage/products/{product_id}/").status_code, 403)

    def test_admin_publishes(self):
        client = self.client_for(self.admin)
        product_id = client.post("/api/manage/products/", self.product_payload(), format="json").json()["id"]
        response = client.patch(f"/api/manage/products/{product_id}/", {"status": "published"}, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Product.objects.get(pk=product_id).status, PublishStatus.PUBLISHED)

    def test_sales_cannot_edit_catalogue_or_settings(self):
        client = self.client_for(self.sales)
        self.assertEqual(client.get("/api/manage/products/").status_code, 200)
        self.assertEqual(client.post("/api/manage/products/", self.product_payload(), format="json").status_code, 403)
        self.assertEqual(client.patch("/api/manage/settings/", {"tagline": "x"}, format="json").status_code, 403)
        self.assertEqual(client.get("/api/manage/enquiries/").status_code, 200)

    def test_editor_cannot_see_enquiries(self):
        self.assertEqual(self.client_for(self.editor).get("/api/manage/enquiries/").status_code, 403)

    # --- content --------------------------------------------------------

    def test_specifications_and_variants_are_replaced(self):
        client = self.client_for(self.editor)
        payload = self.product_payload(
            specifications=[{"label": "Size", "value": "230 x 114 x 76", "unit": "mm"}],
            variants=[{"label": "Standard"}, {"label": "Split"}],
        )
        data = client.post("/api/manage/products/", payload, format="json").json()
        self.assertEqual(len(data["variants"]), 2)
        keep = data["variants"][0]
        data = client.patch(
            f"/api/manage/products/{data['id']}/",
            {"variants": [{"id": keep["id"], "label": "Standard brick"}], "specifications": []},
            format="json",
        ).json()
        self.assertEqual([v["label"] for v in data["variants"]], ["Standard brick"])
        self.assertEqual(data["variants"][0]["id"], keep["id"])
        self.assertEqual(data["specifications"], [])

    def test_photo_upload_validates_and_sets_primary(self):
        client = self.client_for(self.editor)
        product = Product.objects.create(name="Mortar", primary_category=self.category)
        fake = SimpleUploadedFile("photo.png", b"not an image", content_type="image/png")
        response = client.post(
            "/api/manage/product-images/", {"product": product.id, "image": fake, "alt_text": "x"}, format="multipart"
        )
        self.assertEqual(response.status_code, 400)
        first = client.post(
            "/api/manage/product-images/",
            {"product": product.id, "image": png_upload(), "alt_text": "Bag of mortar", "is_primary": True},
            format="multipart",
        )
        self.assertEqual(first.status_code, 201, first.content)
        second = client.post(
            "/api/manage/product-images/",
            {"product": product.id, "image": png_upload("b.png"), "alt_text": "Mixed mortar", "is_primary": True},
            format="multipart",
        )
        self.assertEqual(second.status_code, 201)
        self.assertEqual(list(ProductImage.objects.filter(is_primary=True).values_list("id", flat=True)),
                         [second.json()["id"]])

    def test_settings_update_and_logo_removal(self):
        client = self.client_for(self.admin)
        response = client.patch(
            "/api/manage/settings/", {"tagline": "Hot ovens, cool roofs", "logo_header_override": png_upload()},
            format="multipart",
        )
        self.assertEqual(response.status_code, 200, response.content)
        self.assertTrue(SiteSettings.load().logo_header_override)
        response = client.patch("/api/manage/settings/", {"logo_header_override": None, "whatsapp_number_intl": "+254 710 851911"}, format="json")
        self.assertEqual(response.status_code, 200, response.content)
        settings = SiteSettings.load()
        self.assertFalse(settings.logo_header_override)
        self.assertEqual(settings.whatsapp_number_intl, "254710851911")
        self.assertEqual(settings.tagline, "Hot ovens, cool roofs")

    def test_testimonial_needs_consent_to_publish(self):
        client = self.client_for(self.admin)
        payload = {"customer_name": "Jane W.", "quote": "Great oven.", "status": "published"}
        response = client.post("/api/manage/testimonials/", payload, format="json")
        self.assertEqual(response.status_code, 400)
        response = client.post("/api/manage/testimonials/", {**payload, "consent_confirmed": True}, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Testimonial.objects.get().status, PublishStatus.PUBLISHED)

    def test_category_in_use_cannot_be_deleted(self):
        Product.objects.create(name="Bricks", primary_category=self.category)
        response = self.client_for(self.admin).delete(f"/api/manage/categories/{self.category.id}/")
        self.assertEqual(response.status_code, 400)

    def test_public_api_ignores_dashboard_session(self):
        # A signed-in session must not unlock draft content on the public API.
        Product.objects.create(name="Secret draft", primary_category=self.category, slug="secret-draft")
        client = self.client_for(self.admin)
        self.assertEqual(client.get("/api/v1/products/secret-draft/").status_code, 404)
