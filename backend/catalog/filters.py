import django_filters

from .models import Product


class ProductFilter(django_filters.FilterSet):
    category = django_filters.CharFilter(method="filter_category")
    application = django_filters.CharFilter(field_name="applications__slug")
    brand = django_filters.CharFilter(field_name="brand", lookup_expr="iexact")
    availability = django_filters.CharFilter(field_name="availability_status")

    class Meta:
        model = Product
        fields = ["category", "application", "brand", "availability"]

    def filter_category(self, queryset, name, value):
        matches = queryset.filter(primary_category__slug=value) | queryset.filter(
            additional_categories__slug=value
        )
        return matches.distinct()
