from django.core.management.base import BaseCommand
from django.db import transaction

from catalog.models import Application, Category, Product, ProductVariant
from catalog.seed_data import APPLICATIONS, CATEGORIES, PRODUCTS

PRODUCT_SCALAR_FIELDS = [
    "name", "brand", "synonyms", "short_summary", "description",
    "status", "review_notes", "sales_unit", "moq_unit",
]


class Command(BaseCommand):
    help = (
        "Idempotently seed the KariVex Industrial Materials catalogue from "
        "catalog/seed_data.py. Without --update, existing records (matched by slug) "
        "are left untouched so admin edits are never silently overwritten. With "
        "--update, scalar content fields and category/application relations on "
        "existing records are refreshed from the seed source."
    )

    def add_arguments(self, parser):
        parser.add_argument(
            "--update", action="store_true",
            help="Refresh content fields on records that already exist.",
        )

    @transaction.atomic
    def handle(self, *args, **options):
        update = options["update"]
        created_counts = {"categories": 0, "applications": 0, "products": 0, "variants": 0}
        updated_counts = {"categories": 0, "applications": 0, "products": 0, "variants": 0}

        category_by_code = {}
        for data in CATEGORIES:
            obj, was_created = Category.objects.get_or_create(
                slug=data["slug"],
                defaults={
                    "name": data["name"],
                    "short_code": data["short_code"],
                    "intro": data["intro"],
                    "order": data["order"],
                },
            )
            category_by_code[data["short_code"]] = obj
            if was_created:
                created_counts["categories"] += 1
            elif update:
                obj.name = data["name"]
                obj.short_code = data["short_code"]
                obj.intro = data["intro"]
                obj.order = data["order"]
                obj.save()
                updated_counts["categories"] += 1

        application_by_slug = {}
        for data in APPLICATIONS:
            obj, was_created = Application.objects.get_or_create(
                slug=data["slug"],
                defaults={"name": data["name"], "intro": data["intro"], "order": data["order"]},
            )
            application_by_slug[data["slug"]] = obj
            if was_created:
                created_counts["applications"] += 1
            elif update:
                obj.name = data["name"]
                obj.intro = data["intro"]
                obj.order = data["order"]
                obj.save()
                updated_counts["applications"] += 1

        for data in PRODUCTS:
            primary_category = category_by_code[data["primary_category"]]
            defaults = {
                "name": data["name"],
                "primary_category": primary_category,
                "brand": data.get("brand", ""),
                "synonyms": data.get("synonyms", ""),
                "short_summary": data.get("short_summary", ""),
                "description": data.get("description", ""),
                "status": data.get("status", "draft"),
                "review_notes": data.get("review_notes", ""),
                "sales_unit": data.get("sales_unit", ""),
                "moq_unit": data.get("moq_unit", ""),
            }
            product, was_created = Product.objects.get_or_create(
                slug=data["slug"], defaults=defaults
            )

            if was_created:
                created_counts["products"] += 1
            elif update:
                product.primary_category = primary_category
                for field in PRODUCT_SCALAR_FIELDS:
                    setattr(product, field, data.get(field, getattr(product, field)))
                product.save()
                updated_counts["products"] += 1

            if was_created or update:
                additional = [
                    category_by_code[code] for code in data.get("additional_categories", [])
                ]
                product.additional_categories.set(additional)
                apps = [application_by_slug[slug] for slug in data.get("applications", [])]
                product.applications.set(apps)

                for spec in data.get("specifications", []):
                    product.specifications.get_or_create(
                        label=spec["label"],
                        defaults={"value": spec.get("value", ""), "unit": spec.get("unit", "")},
                    )

                for order, variant in enumerate(data.get("variants", [])):
                    _, v_created = ProductVariant.objects.get_or_create(
                        product=product,
                        label=variant["label"],
                        defaults={
                            "thickness": variant.get("thickness", ""),
                            "dimensions": variant.get("dimensions", ""),
                            "density": variant.get("density", ""),
                            "diameter": variant.get("diameter", ""),
                            "box_capacity": variant.get("box_capacity", ""),
                            "pack_size": variant.get("pack_size", ""),
                            "order": order,
                        },
                    )
                    if v_created:
                        created_counts["variants"] += 1

        self.stdout.write(self.style.SUCCESS(
            f"Created: {created_counts}. "
            + (f"Updated: {updated_counts}." if update else "Run with --update to refresh existing records.")
        ))
