import secrets
import string

from django.db import models
from django.utils import timezone

REFERENCE_ALPHABET = "".join(c for c in string.ascii_uppercase + string.digits if c not in "O0I1")


def generate_reference_number():
    today = timezone.localdate().strftime("%Y%m%d")
    suffix = "".join(secrets.choice(REFERENCE_ALPHABET) for _ in range(6))
    return f"KVM-{today}-{suffix}"


class EnquiryStatus(models.TextChoices):
    NEW = "new", "New"
    IN_PROGRESS = "in_progress", "In Progress"
    QUOTED = "quoted", "Quoted"
    CLOSED = "closed", "Closed"


class EnquiryKind(models.TextChoices):
    QUOTE = "quote", "Quotation request"
    CONTACT = "contact", "General enquiry"


class Enquiry(models.Model):
    reference_number = models.CharField(
        max_length=32, unique=True, default=generate_reference_number, editable=False
    )
    idempotency_key = models.CharField(
        max_length=64,
        unique=True,
        null=True,
        blank=True,
        help_text="Client-generated key preventing accidental double submission.",
    )
    kind = models.CharField(max_length=10, choices=EnquiryKind.choices, default=EnquiryKind.QUOTE)

    name = models.CharField(max_length=120)
    company = models.CharField(max_length=160, blank=True)
    email = models.EmailField()
    phone = models.CharField(max_length=40, blank=True)
    delivery_location = models.CharField(max_length=200, blank=True)
    project_notes = models.TextField(blank=True)

    status = models.CharField(
        max_length=12, choices=EnquiryStatus.choices, default=EnquiryStatus.NEW
    )
    internal_notes = models.TextField(blank=True, help_text="Staff-only notes.")

    notification_sent = models.BooleanField(default=False)
    notification_error = models.TextField(blank=True)
    notification_attempted_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name_plural = "enquiries"

    def __str__(self):
        return f"{self.reference_number} — {self.name}"


class EnquiryItem(models.Model):
    enquiry = models.ForeignKey(Enquiry, on_delete=models.CASCADE, related_name="items")

    product = models.ForeignKey(
        "catalog.Product", on_delete=models.SET_NULL, null=True, blank=True, related_name="+"
    )
    variant = models.ForeignKey(
        "catalog.ProductVariant", on_delete=models.SET_NULL, null=True, blank=True, related_name="+"
    )

    # Snapshots so later catalogue edits never change the historical request.
    product_name_snapshot = models.CharField(max_length=180)
    variant_label_snapshot = models.CharField(max_length=160, blank=True)
    sku_snapshot = models.CharField(max_length=60, blank=True)
    category_snapshot = models.CharField(max_length=120, blank=True)
    product_url_snapshot = models.CharField(max_length=300, blank=True)

    quantity = models.DecimalField(max_digits=12, decimal_places=2, default=1)
    unit = models.CharField(max_length=60, blank=True)
    notes = models.CharField(max_length=300, blank=True)

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return f"{self.quantity_display} x {self.product_name_snapshot}"

    @property
    def quantity_display(self):
        return f"{self.quantity.normalize():f}"
