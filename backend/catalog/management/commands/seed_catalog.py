import datetime

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from catalog.models import (
    Application,
    Category,
    Product,
    ProductSpecification,
    ProductVariant,
    Service,
)
from catalog.seed_data import APPLICATIONS, CATEGORIES, PRODUCTS, SERVICES
from sitesettings.models import SiteSettings

CATEGORY_FIELDS = ["name", "short_code", "intro", "quote_checklist", "order", "seo_title", "seo_description"]
APPLICATION_FIELDS = ["name", "summary", "intro", "considerations", "order"]
PRODUCT_FIELDS = [
    "name", "brand", "synonyms", "short_summary", "description", "selection_notes",
    "review_notes", "sales_unit", "moq_unit", "seo_title", "seo_description", "faqs",
]
SERVICE_FIELDS = [
    "name", "summary", "description", "includes", "request_checklist", "order", "review_notes",
    "seo_title", "seo_description", "faqs",
]
VARIANT_FIELDS = ["thickness", "dimensions", "density", "diameter", "box_capacity", "pack_size"]

# Date the contact details in SiteSettings defaults were checked against
# https://karivexsolutionsltd.com/ and /contact.
CONTACTS_VERIFIED_ON = datetime.date(2026, 10, 6)

OLD_HOMEPAGE_HEADLINE = "Industrial Materials for Construction, Insulation & High-Temperature Applications"


class Command(BaseCommand):
    help = (
        "Idempotently seed the KariVex Industrial Materials catalogue from catalog/seed_data.py. "
        "Records are matched by slug. Without --update, existing records are left untouched so "
        "admin edits are never overwritten. With --update, seed-managed content fields, "
        "relations, specifications and variants are refreshed from the seed source; publish "
        "status is only changed with --reset-status."
    )

    def add_arguments(self, parser):
        parser.add_argument(
            "--update", action="store_true",
            help="Refresh seed-managed content on records that already exist.",
        )
        parser.add_argument(
            "--reset-status", action="store_true",
            help="With --update, also reset each product's draft/published status to the seed value.",
        )

    @transaction.atomic
    def handle(self, *args, **options):
        update = options["update"]
        reset_status = options["reset_status"]
        if reset_status and not update:
            raise CommandError("--reset-status requires --update.")
        created = {
            "categories": 0, "applications": 0, "products": 0, "variants": 0,
            "specifications": 0, "services": 0,
        }
        updated = {"categories": 0, "applications": 0, "products": 0, "services": 0}

        category_by_code = {}
        for data in CATEGORIES:
            obj, was_created = Category.objects.get_or_create(
                slug=data["slug"],
                defaults={**{f: data.get(f, "") for f in CATEGORY_FIELDS}, "status": data.get("status", "published")},
            )
            category_by_code[data["short_code"]] = obj
            if was_created:
                created["categories"] += 1
            elif update:
                for f in CATEGORY_FIELDS:
                    setattr(obj, f, data.get(f, ""))
                if reset_status:
                    obj.status = data.get("status", "published")
                obj.save()
                updated["categories"] += 1

        application_by_slug = {}
        for data in APPLICATIONS:
            obj, was_created = Application.objects.get_or_create(
                slug=data["slug"],
                defaults={**{f: data.get(f, "") for f in APPLICATION_FIELDS}, "status": data.get("status", "published")},
            )
            application_by_slug[data["slug"]] = obj
            if was_created:
                created["applications"] += 1
            elif update:
                for f in APPLICATION_FIELDS:
                    setattr(obj, f, data.get(f, ""))
                if reset_status:
                    obj.status = data.get("status", "published")
                obj.save()
                updated["applications"] += 1

        touched = []
        for order, data in enumerate(PRODUCTS, start=1):
            primary_category = category_by_code[data["primary_category"]]
            defaults = {f: data.get(f, "") for f in PRODUCT_FIELDS}
            defaults.update({
                "primary_category": primary_category,
                "status": data.get("status", "draft"),
                "order": order,
            })
            product, was_created = Product.objects.get_or_create(slug=data["slug"], defaults=defaults)

            if was_created:
                created["products"] += 1
            elif update:
                product.primary_category = primary_category
                for f in PRODUCT_FIELDS:
                    setattr(product, f, data.get(f, ""))
                if reset_status:
                    product.status = data.get("status", "draft")
                product.save()
                updated["products"] += 1
            else:
                continue

            touched.append((product, data))
            product.additional_categories.set(
                [category_by_code[code] for code in data.get("additional_categories", [])]
            )
            product.applications.set(
                [application_by_slug[slug] for slug in data.get("applications", [])]
            )

            for spec_order, spec in enumerate(data.get("specifications", [])):
                _, spec_created = ProductSpecification.objects.update_or_create(
                    product=product, label=spec["label"],
                    defaults={"value": spec.get("value", ""), "unit": spec.get("unit", ""), "order": spec_order},
                )
                created["specifications"] += int(spec_created)

            for variant_order, variant in enumerate(data.get("variants", [])):
                _, v_created = ProductVariant.objects.update_or_create(
                    product=product, label=variant["label"],
                    defaults={**{f: variant.get(f, "") for f in VARIANT_FIELDS}, "order": variant_order},
                )
                created["variants"] += int(v_created)

        # Related products need every product to exist first.
        slugs = {p.slug: p for p in Product.objects.filter(slug__in=[d["slug"] for d in PRODUCTS])}
        for product, data in touched:
            related = [slugs[s] for s in data.get("related", []) if s in slugs]
            if update:
                product.related_products.set(related)
            elif related:
                product.related_products.add(*related)

        for data in SERVICES:
            fields = {f: data.get(f, "") for f in SERVICE_FIELDS}
            service, was_created = Service.objects.get_or_create(
                slug=data["slug"], defaults={**fields, "status": data.get("status", "draft")}
            )
            if was_created:
                created["services"] += 1
            elif update:
                for f, value in fields.items():
                    setattr(service, f, value)
                if reset_status:
                    service.status = data.get("status", "draft")
                service.save()
                updated["services"] += 1
            else:
                continue
            service.related_products.set([slugs[s] for s in data.get("related", []) if s in slugs])

        site = SiteSettings.load()
        changed = False
        if site.contact_verified_on is None:
            site.contact_verified_on = CONTACTS_VERIFIED_ON
            changed = True
        # Move an untouched pre-pizza-focus headline to the new default.
        if site.homepage_headline == OLD_HOMEPAGE_HEADLINE:
            site.homepage_headline = SiteSettings._meta.get_field("homepage_headline").default
            changed = True
        if changed:
            site.save()

        self.stdout.write(self.style.SUCCESS(f"Created: {created}."))
        if update:
            self.stdout.write(self.style.SUCCESS(f"Updated: {updated}."))
        else:
            self.stdout.write("Existing records left unchanged (use --update to refresh seed content).")
