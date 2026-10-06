import io
import shutil
import tempfile

from django.contrib.auth.models import Group, User
from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.management import call_command
from django.test import TestCase, override_settings
from PIL import Image

from .models import Category, Product, ProductImage, PublishStatus, Redirect, Service
from .seed_data import PRODUCTS


def png_bytes(size=(64, 48), color=(2, 21, 51)):
    buffer = io.BytesIO()
    Image.new("RGB", size, color).save(buffer, format="PNG")
    return buffer.getvalue()


class SeededCatalogTestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        call_command("seed_catalog", verbosity=0, stdout=io.StringIO())
        call_command("setup_groups", stdout=io.StringIO())


class SeedTests(SeededCatalogTestCase):
    def test_seed_is_idempotent_and_preserves_admin_edits(self):
        product = Product.objects.get(slug="ceramic-fibre-blanket")
        product.short_summary = "Edited by an administrator"
        product.save()
        counts = (Product.objects.count(), Category.objects.count())

        call_command("seed_catalog", stdout=io.StringIO())

        self.assertEqual((Product.objects.count(), Category.objects.count()), counts)
        product.refresh_from_db()
        self.assertEqual(product.short_summary, "Edited by an administrator")

    def test_update_mode_refreshes_content_but_not_status(self):
        product = Product.objects.get(slug="max-50")
        product.status = PublishStatus.PUBLISHED
        product.short_summary = "temp"
        product.save()
        call_command("seed_catalog", "--update", stdout=io.StringIO())
        product.refresh_from_db()
        self.assertNotEqual(product.short_summary, "temp")
        self.assertEqual(product.status, PublishStatus.PUBLISHED)

    def test_every_seed_item_exists_once(self):
        slugs = [p["slug"] for p in PRODUCTS]
        self.assertEqual(len(slugs), len(set(slugs)))
        self.assertEqual(Product.objects.filter(slug__in=slugs).count(), len(slugs))

    def test_unverified_identities_are_not_published(self):
        for slug in ["fondu-cement", "max-50", "maxheat-k", "maxheat-a",
                     "pharmaceutical-cold-chain-boxes", "polystyrene-insulation-sheets"]:
            self.assertNotEqual(Product.objects.get(slug=slug).status, PublishStatus.PUBLISHED, slug)
        self.assertEqual(Product.objects.get(slug="fondu-cement").status, PublishStatus.DRAFT)

    def test_pizza_focus_hides_but_keeps_other_products(self):
        published = set(Product.objects.filter(status="published").values_list("slug", flat=True))
        self.assertIn("fire-bricks-refractory-bricks", published)
        self.assertIn("ceramic-fibre-rope", published)
        self.assertNotIn("eps-boxes", published)
        self.assertEqual(Product.objects.get(slug="eps-boxes").status, PublishStatus.ARCHIVED)
        self.assertEqual(
            set(Category.objects.filter(status="published").values_list("short_code", flat=True)),
            {"OF", "OD", "OI", "OS"},
        )
        self.assertEqual(Service.objects.filter(status="published").count(), 4)


class PublicApiTests(SeededCatalogTestCase):
    def test_published_product_detail(self):
        response = self.client.get("/api/v1/products/ceramic-fibre-blanket/")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["slug"], "ceramic-fibre-blanket")
        self.assertNotIn("review_notes", data)
        self.assertNotIn("source_url", data)

    def test_draft_and_unknown_products_are_404(self):
        self.assertEqual(self.client.get("/api/v1/products/max-50/").status_code, 404)
        self.assertEqual(self.client.get("/api/v1/products/eps-boxes/").status_code, 404)  # hidden
        self.assertEqual(self.client.get("/api/v1/products/does-not-exist/").status_code, 404)

    def test_list_contains_only_published(self):
        response = self.client.get("/api/v1/products/?page_size=100")
        slugs = {p["slug"] for p in response.json()["results"]}
        self.assertNotIn("max-50", slugs)
        self.assertIn("refractory-cement", slugs)
        self.assertEqual(response.json()["count"], Product.objects.filter(status="published").count())

    def test_search_handles_fibre_fiber_and_fiberglass(self):
        for query, expected in [
            ("ceramic fiber", "ceramic-fibre-blanket"),
            ("ceramic fiber rope", "ceramic-fibre-rope"),
            ("fireproof cement", "refractory-cement"),
            ("firebrick", "fire-bricks-refractory-bricks"),
            ("oven door seal", "ceramic-fibre-rope"),
            ("pizza oven floor", "hearth-materials"),
        ]:
            response = self.client.get("/api/v1/products/", {"q": query})
            slugs = [p["slug"] for p in response.json()["results"]]
            self.assertIn(expected, slugs, query)

    def test_category_filter_includes_additional_categories(self):
        response = self.client.get("/api/v1/products/", {"category": "oven-floor-hearth"})
        slugs = {p["slug"] for p in response.json()["results"]}
        self.assertIn("hearth-materials", slugs)
        self.assertIn("vermiculite", slugs)  # primary OI, additional OF
        self.assertEqual(self.client.get("/api/v1/categories/refrigeration-hvac-materials/").status_code, 404)
        category = self.client.get("/api/v1/categories/oven-floor-hearth/").json()
        self.assertEqual(category["product_count"], len(slugs))

    def test_sitemap_lists_only_published(self):
        data = self.client.get("/api/v1/sitemap/").json()
        slugs = {p["slug"] for p in data["products"]}
        self.assertEqual(slugs, set(Product.objects.filter(status="published").values_list("slug", flat=True)))

    def test_api_is_marked_noindex(self):
        response = self.client.get("/api/v1/categories/")
        self.assertIn("noindex", response.headers.get("X-Robots-Tag", ""))

    def test_facets_only_return_real_values(self):
        data = self.client.get("/api/v1/products/facets/", {"category": "pizza-oven-insulation"}).json()
        self.assertGreater(data["product_count"], 0)
        for facet in data["facets"]:
            self.assertGreaterEqual(len(facet["values"]), 2)


class SeoContentTests(SeededCatalogTestCase):
    def test_faqs_parsed_and_offer_hidden_without_price(self):
        data = self.client.get("/api/v1/products/fire-bricks-refractory-bricks/").json()
        self.assertGreaterEqual(len(data["faqs"]), 3)
        self.assertTrue(all(f["question"] and f["answer"] for f in data["faqs"]))
        self.assertIsNone(data["offer"])
        self.assertIn("Pizza Ovens", data["seo_title"])

    def test_offer_published_only_with_confirmed_price(self):
        import datetime
        from decimal import Decimal

        Product.objects.filter(slug="perlite").update(
            price=Decimal("1500"), price_unit="per bag", price_valid_until=datetime.date(2026, 12, 31)
        )
        offer = self.client.get("/api/v1/products/perlite/").json()["offer"]
        self.assertEqual(offer, {"price": "1500.00", "currency": "KES", "unit": "per bag", "valid_until": "2026-12-31"})

    def test_faq_parser(self):
        from .serializers import faq_list

        text = "Q: First?\nA: One.\n\nQ: Second?\nA: Two\ncontinued.\n\nQ: No answer?"
        self.assertEqual(faq_list(text), [
            {"question": "First?", "answer": "One."},
            {"question": "Second?", "answer": "Two continued."},
        ])


class ServiceApiTests(SeededCatalogTestCase):
    def test_services_list_and_detail(self):
        services = self.client.get("/api/v1/services/").json()
        self.assertEqual(
            [s["slug"] for s in services],
            ["pizza-oven-building", "pizza-oven-repair-relining", "pizza-oven-material-advice",
             "delivery-of-materials"],
        )
        detail = self.client.get("/api/v1/services/pizza-oven-building/").json()
        self.assertTrue(detail["includes"])
        self.assertNotIn("review_notes", detail)
        self.assertIn("fire-bricks-refractory-bricks", {p["slug"] for p in detail["related_products"]})

    def test_draft_service_hidden(self):
        Service.objects.filter(slug="delivery-of-materials").update(status="draft")
        self.assertEqual(self.client.get("/api/v1/services/delivery-of-materials/").status_code, 404)
        slugs = {s["slug"] for s in self.client.get("/api/v1/sitemap/").json()["services"]}
        self.assertNotIn("delivery-of-materials", slugs)

    def test_product_lists_its_services(self):
        data = self.client.get("/api/v1/products/ceramic-fibre-rope/").json()
        self.assertIn("pizza-oven-repair-relining", {s["slug"] for s in data["services"]})


class RedirectTests(SeededCatalogTestCase):
    def test_slug_change_on_published_product_creates_redirect(self):
        product = Product.objects.get(slug="perlite")
        product.slug = "expanded-perlite"
        product.save()
        redirect = Redirect.objects.get(old_path="/products/perlite")
        self.assertEqual(redirect.new_path, "/products/expanded-perlite")
        response = self.client.get("/api/v1/redirects/", {"path": "/products/perlite"})
        self.assertEqual(response.json()["new_path"], "/products/expanded-perlite")

        # Renaming again collapses the chain.
        product.slug = "perlite-insulation"
        product.save()
        self.assertEqual(Redirect.objects.get(old_path="/products/perlite").new_path, "/products/perlite-insulation")

    def test_unknown_redirect_is_404(self):
        self.assertEqual(self.client.get("/api/v1/redirects/", {"path": "/products/nope"}).status_code, 404)


class AdminPermissionTests(SeededCatalogTestCase):
    def setUp(self):
        self.editor = User.objects.create_user("editor", password="x-Test-Password-123", is_staff=True)
        self.editor.groups.add(Group.objects.get(name="Catalogue Editors"))
        self.admin_user = User.objects.create_user("manager", password="x-Test-Password-123", is_staff=True)
        self.admin_user.groups.add(Group.objects.get(name="Administrators"))

    def test_admin_requires_login(self):
        response = self.client.get("/admin/catalog/product/")
        self.assertEqual(response.status_code, 302)
        self.assertIn("/admin/login/", response["Location"])

    def test_editor_cannot_publish_or_view_enquiries(self):
        self.client.force_login(self.editor)
        product = Product.objects.get(slug="fondu-cement")
        page = self.client.get(f"/admin/catalog/product/{product.pk}/change/")
        self.assertEqual(page.status_code, 200)
        self.assertNotContains(page, 'name="status"')
        self.assertEqual(self.client.get("/admin/enquiries/enquiry/").status_code, 403)
        response = self.client.post("/admin/catalog/product/", {
            "action": "make_published", "_selected_action": [product.pk],
        })
        product.refresh_from_db()
        self.assertEqual(product.status, PublishStatus.DRAFT)
        self.assertIn(response.status_code, (200, 302))

    def test_administrator_can_publish(self):
        self.client.force_login(self.admin_user)
        product = Product.objects.get(slug="fondu-cement")
        self.client.post("/admin/catalog/product/", {
            "action": "make_published", "_selected_action": [product.pk],
        })
        product.refresh_from_db()
        self.assertEqual(product.status, PublishStatus.PUBLISHED)
        self.assertEqual(self.client.get("/api/v1/products/fondu-cement/").status_code, 200)


class MediaTests(SeededCatalogTestCase):
    def setUp(self):
        self.media_root = tempfile.mkdtemp()
        self.override = override_settings(MEDIA_ROOT=self.media_root)
        self.override.enable()

    def tearDown(self):
        self.override.disable()
        shutil.rmtree(self.media_root, ignore_errors=True)

    def test_large_image_is_downscaled_and_replacement_deletes_old_file(self):
        product = Product.objects.get(slug="vermiculite")
        with self.captureOnCommitCallbacks(execute=True):
            image = ProductImage.objects.create(
                product=product, alt_text="Bag of vermiculite",
                image=SimpleUploadedFile("big.png", png_bytes((3000, 1500)), content_type="image/png"),
            )
        self.assertEqual((image.width, image.height), (2000, 1000))
        old_name = image.image.name
        storage = image.image.storage
        self.assertTrue(storage.exists(old_name))

        with self.captureOnCommitCallbacks(execute=True):
            image.image = SimpleUploadedFile("new.png", png_bytes(), content_type="image/png")
            image.save()
        self.assertFalse(storage.exists(old_name))
        self.assertTrue(storage.exists(image.image.name))

        api = self.client.get("/api/v1/products/vermiculite/").json()
        self.assertEqual(api["images"][0]["alt_text"], "Bag of vermiculite")

    def test_non_image_upload_is_rejected(self):
        from django.core.exceptions import ValidationError

        image = ProductImage(
            product=Product.objects.get(slug="perlite"), alt_text="x",
            image=SimpleUploadedFile("fake.png", b"<svg>not an image</svg>", content_type="image/png"),
        )
        with self.assertRaises(ValidationError):
            image.full_clean()
