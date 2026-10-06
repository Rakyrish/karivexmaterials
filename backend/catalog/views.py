from collections import Counter

from django.db.models import Max, Q
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, generics
from rest_framework.response import Response
from rest_framework.views import APIView

from .filters import VARIANT_FACET_FIELDS, ProductFilter
from .models import (
    Application,
    AvailabilityStatus,
    Category,
    Product,
    ProductSpecification,
    ProductVariant,
    PublishStatus,
    Redirect,
)
from .serializers import (
    ApplicationSerializer,
    CategorySerializer,
    ProductCardSerializer,
    ProductDetailSerializer,
)

PUBLISHED = PublishStatus.PUBLISHED

VARIANT_FACET_LABELS = {
    "thickness": "Thickness",
    "density": "Density",
    "diameter": "Diameter",
    "box_capacity": "Box capacity",
    "pack_size": "Pack size",
    "dimensions": "Dimensions",
}


def published_products():
    return Product.objects.filter(status=PUBLISHED)


class CategoryListView(generics.ListAPIView):
    serializer_class = CategorySerializer
    pagination_class = None

    def get_queryset(self):
        return Category.objects.filter(status=PUBLISHED).order_by("order", "name")


class CategoryDetailView(generics.RetrieveAPIView):
    serializer_class = CategorySerializer
    lookup_field = "slug"

    def get_queryset(self):
        return Category.objects.filter(status=PUBLISHED)


class ApplicationListView(generics.ListAPIView):
    serializer_class = ApplicationSerializer
    pagination_class = None

    def get_queryset(self):
        return Application.objects.filter(status=PUBLISHED).order_by("order", "name")


class ApplicationDetailView(generics.RetrieveAPIView):
    serializer_class = ApplicationSerializer
    lookup_field = "slug"

    def get_queryset(self):
        return Application.objects.filter(status=PUBLISHED)


class ProductListView(generics.ListAPIView):
    serializer_class = ProductCardSerializer
    filterset_class = ProductFilter
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    ordering_fields = ["name", "updated_at", "order"]
    ordering = ["order", "name"]

    def get_queryset(self):
        return (
            published_products()
            .select_related("primary_category")
            .prefetch_related("images", "variants")
        )


class ProductDetailView(generics.RetrieveAPIView):
    serializer_class = ProductDetailSerializer
    lookup_field = "slug"

    def get_queryset(self):
        return published_products().select_related("primary_category").prefetch_related(
            "images", "documents", "specifications", "variants",
            "applications", "additional_categories",
            "related_products__primary_category",
            "related_products__images",
            "related_products__variants",
        )


class ProductFacetsView(APIView):
    """Filter options derived from real published records, scoped to a
    category or application. A facet is only returned when it has at least
    two values, so pages never show empty or pointless filters."""

    def get(self, request):
        products = published_products()
        category = request.query_params.get("category")
        application = request.query_params.get("application")
        if category:
            products = products.filter(
                Q(primary_category__slug=category) | Q(additional_categories__slug=category)
            )
        if application:
            products = products.filter(applications__slug=application)
        product_ids = list(products.values_list("id", flat=True).distinct())

        facets = []
        variants = ProductVariant.objects.filter(product_id__in=product_ids, is_active=True)
        for field in VARIANT_FACET_FIELDS:
            per_value = {}
            for product_id, value in variants.exclude(**{field: ""}).values_list("product_id", field):
                per_value.setdefault(value.strip(), set()).add(product_id)
            if len(per_value) >= 2:
                facets.append({
                    "key": field,
                    "label": VARIANT_FACET_LABELS[field],
                    "values": [
                        {"value": v, "display": v, "count": len(ids)}
                        for v, ids in sorted(per_value.items())
                    ],
                })

        spec_values = {}
        rows = ProductSpecification.objects.filter(product_id__in=product_ids).values_list(
            "label", "value", "unit", "product_id"
        )
        for label, value, unit, product_id in rows:
            entry = spec_values.setdefault(label, {}).setdefault(
                value, {"display": f"{value} {unit}".strip(), "ids": set()}
            )
            entry["ids"].add(product_id)
        for label, values in sorted(spec_values.items()):
            if len(values) >= 2:
                facets.append({
                    "key": f"spec.{label}",
                    "label": label,
                    "values": [
                        {"value": v, "display": d["display"], "count": len(d["ids"])}
                        for v, d in sorted(values.items())
                    ],
                })

        app_counts = Counter(
            Product.applications.through.objects.filter(
                product_id__in=product_ids, application__status=PUBLISHED
            ).values_list("application__slug", flat=True)
        )
        applications = [
            {"value": a.slug, "display": a.name, "count": app_counts[a.slug]}
            for a in Application.objects.filter(status=PUBLISHED, slug__in=app_counts.keys())
        ]
        labels = dict(AvailabilityStatus.choices)
        availability_counts = Counter(
            Product.objects.filter(id__in=product_ids).values_list("availability_status", flat=True)
        )
        availability = [
            {"value": value, "display": labels.get(value, value), "count": count}
            for value, count in sorted(availability_counts.items())
        ]
        return Response({
            "product_count": len(product_ids),
            "applications": applications,
            "availability": availability,
            "facets": facets,
        })


class SitemapView(APIView):
    """Everything the public sitemap needs — published records only."""

    def get(self, request):
        products = published_products().values("slug", "updated_at").order_by("slug")
        categories = Category.objects.filter(status=PUBLISHED).values("slug", "updated_at")
        applications = Application.objects.filter(status=PUBLISHED).values("slug", "updated_at")
        latest = published_products().aggregate(latest=Max("updated_at"))["latest"]
        return Response({
            "latest_product_update": latest,
            "products": list(products),
            "categories": list(categories),
            "applications": list(applications),
        })


class RedirectLookupView(APIView):
    def get(self, request):
        path = request.query_params.get("path", "")
        redirect = get_object_or_404(Redirect, old_path=path.rstrip("/") or "/")
        return Response({"old_path": redirect.old_path, "new_path": redirect.new_path})
