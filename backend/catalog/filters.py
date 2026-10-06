import django_filters
from django.db.models import Q

from .models import Product
from .search import search_q

VARIANT_FACET_FIELDS = ["thickness", "density", "diameter", "box_capacity", "pack_size", "dimensions"]


class ProductFilter(django_filters.FilterSet):
    q = django_filters.CharFilter(method="filter_search")
    category = django_filters.CharFilter(method="filter_category")
    application = django_filters.CharFilter(field_name="applications__slug")
    brand = django_filters.CharFilter(field_name="brand", lookup_expr="iexact")
    availability = django_filters.CharFilter(method="filter_availability")
    spec = django_filters.CharFilter(method="filter_spec")

    class Meta:
        model = Product
        fields = ["q", "category", "application", "brand", "availability", "spec"]

    def filter_search(self, queryset, name, value):
        return queryset.filter(search_q(value)) if value.strip() else queryset

    def filter_category(self, queryset, name, value):
        return queryset.filter(
            Q(primary_category__slug=value) | Q(additional_categories__slug=value)
        ).distinct()

    def filter_availability(self, queryset, name, value):
        return queryset.filter(
            Q(availability_status=value)
            | Q(variants__is_active=True, variants__availability_status=value)
        ).distinct()

    def filter_spec(self, queryset, name, value):
        """spec=<field>:<value>. <field> is a variant attribute (e.g. thickness)
        or 'spec.<label>' for a product specification row."""
        field, _, wanted = value.partition(":")
        if not wanted:
            return queryset
        if field in VARIANT_FACET_FIELDS:
            return queryset.filter(
                **{"variants__is_active": True, f"variants__{field}__iexact": wanted}
            ).distinct()
        if field.startswith("spec."):
            return queryset.filter(
                specifications__label__iexact=field[5:], specifications__value__iexact=wanted
            ).distinct()
        return queryset
