import re
from decimal import Decimal

from django.conf import settings
from rest_framework import serializers

from catalog.models import Product, PublishStatus, Service

from .models import Enquiry, EnquiryItem, EnquiryKind

MAX_ITEMS = 50
PHONE_RE = re.compile(r"^\+?[0-9 ()\-]{7,20}$")


class EnquiryItemInputSerializer(serializers.Serializer):
    product_slug = serializers.SlugField(max_length=160)
    variant_id = serializers.IntegerField(required=False, allow_null=True)
    quantity = serializers.DecimalField(
        max_digits=12, decimal_places=2, min_value=Decimal("0.01"), default=Decimal("1")
    )
    unit = serializers.CharField(required=False, allow_blank=True, max_length=60)
    notes = serializers.CharField(required=False, allow_blank=True, max_length=300)


class EnquiryCreateSerializer(serializers.Serializer):
    kind = serializers.ChoiceField(choices=EnquiryKind.choices, default=EnquiryKind.QUOTE)
    service_slug = serializers.SlugField(max_length=140, required=False, allow_blank=True)
    name = serializers.CharField(max_length=120)
    company = serializers.CharField(max_length=160, required=False, allow_blank=True)
    email = serializers.EmailField(max_length=254)
    phone = serializers.CharField(max_length=40, required=False, allow_blank=True)
    delivery_location = serializers.CharField(max_length=200, required=False, allow_blank=True)
    project_notes = serializers.CharField(max_length=5000, required=False, allow_blank=True)
    idempotency_key = serializers.RegexField(
        r"^[A-Za-z0-9_-]{8,64}$", required=False, allow_blank=True
    )
    # Honeypot: real visitors never see or fill this field.
    website = serializers.CharField(required=False, allow_blank=True, max_length=200)
    items = EnquiryItemInputSerializer(many=True, required=False, default=list)

    def validate_name(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Please enter your name.")
        return value

    def validate_phone(self, value):
        value = value.strip()
        if value and not PHONE_RE.match(value):
            raise serializers.ValidationError("Enter a valid phone number, e.g. +254 7XX XXX XXX.")
        return value

    def validate_items(self, items):
        if len(items) > MAX_ITEMS:
            raise serializers.ValidationError(f"A single request can include up to {MAX_ITEMS} lines.")
        return items

    def validate(self, attrs):
        kind = attrs.get("kind", EnquiryKind.QUOTE)
        items = attrs.get("items") or []
        if kind == EnquiryKind.QUOTE and not items:
            raise serializers.ValidationError({"items": "Add at least one product to the quote basket."})
        if kind == EnquiryKind.CONTACT and not attrs.get("project_notes", "").strip():
            raise serializers.ValidationError({"project_notes": "Please tell us what you need."})
        attrs["service"] = None
        if kind == EnquiryKind.SERVICE:
            service = Service.objects.filter(
                slug=attrs.get("service_slug") or "", status=PublishStatus.PUBLISHED
            ).first()
            if service is None:
                raise serializers.ValidationError({"service_slug": "Choose a service."})
            attrs["service"] = service

        resolved = []
        errors = {}
        slugs = {item["product_slug"] for item in items}
        products = {
            p.slug: p
            for p in Product.objects.filter(slug__in=slugs, status=PublishStatus.PUBLISHED)
            .select_related("primary_category")
            .prefetch_related("variants")
        }
        for index, item in enumerate(items):
            product = products.get(item["product_slug"])
            if product is None:
                errors[index] = "This product is no longer available. Remove it and try again."
                continue
            variant = None
            if item.get("variant_id"):
                variant = next(
                    (v for v in product.variants.all() if v.id == item["variant_id"] and v.is_active),
                    None,
                )
                if variant is None:
                    errors[index] = "The selected option is no longer available for this product."
                    continue
            resolved.append({**item, "product": product, "variant": variant})
        if errors:
            raise serializers.ValidationError({"items": errors})
        attrs["resolved_items"] = resolved
        return attrs

    def create(self, validated_data):
        items = validated_data.pop("resolved_items")
        validated_data.pop("items", None)
        validated_data.pop("website", None)
        validated_data.pop("service_slug", None)
        if validated_data.get("service"):
            validated_data["service_name_snapshot"] = validated_data["service"].name
        validated_data["idempotency_key"] = validated_data.pop("idempotency_key", "") or None

        enquiry = Enquiry.objects.create(**validated_data)
        origin = settings.SITE_PRODUCTION_ORIGIN
        EnquiryItem.objects.bulk_create([
            EnquiryItem(
                enquiry=enquiry,
                product=item["product"],
                variant=item["variant"],
                product_name_snapshot=item["product"].name,
                variant_label_snapshot=item["variant"].label if item["variant"] else "",
                sku_snapshot=(item["variant"].sku if item["variant"] else "") or item["product"].sku,
                category_snapshot=item["product"].primary_category.name,
                product_url_snapshot=f"{origin}{item['product'].public_path}",
                quantity=item["quantity"],
                unit=(item.get("unit") or "").strip()
                or (item["variant"].sales_unit_override if item["variant"] else "")
                or item["product"].sales_unit,
                notes=(item.get("notes") or "").strip(),
            )
            for item in items
        ])
        return enquiry


class EnquiryItemSerializer(serializers.ModelSerializer):
    quantity = serializers.SerializerMethodField()

    class Meta:
        model = EnquiryItem
        fields = ["product_name_snapshot", "variant_label_snapshot", "quantity", "unit", "notes"]

    def get_quantity(self, obj):
        return obj.quantity_display


class EnquiryConfirmationSerializer(serializers.ModelSerializer):
    """What the submitter sees after sending. Deliberately excludes contact
    details and internal notification status."""

    items = EnquiryItemSerializer(many=True, read_only=True)

    class Meta:
        model = Enquiry
        fields = ["reference_number", "kind", "service_name_snapshot", "created_at", "items"]
