from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, generics

from .filters import ProductFilter
from .models import Application, Category, Product
from .serializers import (
    ApplicationSerializer,
    CategorySerializer,
    ProductCardSerializer,
    ProductDetailSerializer,
)


class CategoryListView(generics.ListAPIView):
    serializer_class = CategorySerializer
    pagination_class = None

    def get_queryset(self):
        return Category.objects.filter(status="published").order_by("order", "name")


class CategoryDetailView(generics.RetrieveAPIView):
    serializer_class = CategorySerializer
    lookup_field = "slug"

    def get_queryset(self):
        return Category.objects.filter(status="published")


class ApplicationListView(generics.ListAPIView):
    serializer_class = ApplicationSerializer
    pagination_class = None

    def get_queryset(self):
        return Application.objects.filter(status="published").order_by("order", "name")


class ApplicationDetailView(generics.RetrieveAPIView):
    serializer_class = ApplicationSerializer
    lookup_field = "slug"

    def get_queryset(self):
        return Application.objects.filter(status="published")


class ProductListView(generics.ListAPIView):
    serializer_class = ProductCardSerializer
    filterset_class = ProductFilter
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "synonyms", "short_summary", "description", "brand", "sku"]
    ordering_fields = ["name", "updated_at", "order"]
    ordering = ["order", "name"]

    def get_queryset(self):
        return (
            Product.objects.filter(status="published")
            .select_related("primary_category")
            .prefetch_related("images")
        )


class ProductDetailView(generics.RetrieveAPIView):
    serializer_class = ProductDetailSerializer
    lookup_field = "slug"

    def get_queryset(self):
        return Product.objects.filter(status="published").prefetch_related(
            "images", "documents", "specifications", "variants",
            "applications", "additional_categories", "related_products__images",
        )
