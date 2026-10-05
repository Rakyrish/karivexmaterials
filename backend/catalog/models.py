from django.core.validators import MinValueValidator
from django.db import models
from django.utils.text import slugify


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class PublishStatus(models.TextChoices):
    DRAFT = "draft", "Draft (in review)"
    PUBLISHED = "published", "Published"


class AvailabilityStatus(models.TextChoices):
    IN_STOCK = "in_stock", "In stock"
    ON_ORDER = "on_order", "Available on order"
    UNKNOWN = "unknown", "Unknown / on enquiry"


class Category(TimeStampedModel):
    name = models.CharField(max_length=120, unique=True)
    slug = models.SlugField(max_length=140, unique=True, blank=True)
    short_code = models.CharField(
        max_length=4,
        unique=True,
        help_text="Internal mapping code, e.g. A, B, C (matches the catalogue mapping doc).",
    )
    intro = models.TextField(
        blank=True,
        help_text="Original introductory copy shown at the top of the category page.",
    )
    seo_title = models.CharField(max_length=160, blank=True)
    seo_description = models.CharField(max_length=320, blank=True)
    image = models.ImageField(upload_to="categories/", blank=True, null=True)
    order = models.PositiveIntegerField(default=0)
    status = models.CharField(
        max_length=10, choices=PublishStatus.choices, default=PublishStatus.PUBLISHED
    )

    class Meta:
        verbose_name_plural = "categories"
        ordering = ["order", "name"]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Application(TimeStampedModel):
    name = models.CharField(max_length=120, unique=True)
    slug = models.SlugField(max_length=140, unique=True, blank=True)
    intro = models.TextField(
        blank=True,
        help_text="Describes product selection considerations. No performance guarantees "
        "or installation-service claims unless confirmed separately.",
    )
    seo_title = models.CharField(max_length=160, blank=True)
    seo_description = models.CharField(max_length=320, blank=True)
    order = models.PositiveIntegerField(default=0)
    status = models.CharField(
        max_length=10, choices=PublishStatus.choices, default=PublishStatus.PUBLISHED
    )

    class Meta:
        ordering = ["order", "name"]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Product(TimeStampedModel):
    slug = models.SlugField(max_length=160, unique=True, blank=True)
    name = models.CharField(max_length=180)
    sku = models.CharField(max_length=60, blank=True, help_text="Internal SKU, if assigned.")
    brand = models.CharField(
        max_length=120,
        blank=True,
        help_text="Verified brand/manufacturer only. Leave blank if unverified.",
    )
    synonyms = models.TextField(
        blank=True,
        help_text="Comma-separated search synonyms, e.g. 'fibre glass, fiberglass, glass wool'.",
    )

    primary_category = models.ForeignKey(
        Category, on_delete=models.PROTECT, related_name="primary_products"
    )
    additional_categories = models.ManyToManyField(
        Category, blank=True, related_name="secondary_products"
    )
    applications = models.ManyToManyField(Application, blank=True, related_name="products")

    short_summary = models.CharField(max_length=240, blank=True)
    description = models.TextField(
        blank=True, help_text="Original descriptive copy. Do not copy another division's wording."
    )

    sales_unit = models.CharField(
        max_length=60, blank=True, help_text="e.g. 'per sheet', 'per roll', 'per box'."
    )
    minimum_order_quantity = models.PositiveIntegerField(null=True, blank=True)
    moq_unit = models.CharField(max_length=60, blank=True)

    availability_status = models.CharField(
        max_length=10, choices=AvailabilityStatus.choices, default=AvailabilityStatus.UNKNOWN
    )

    related_products = models.ManyToManyField("self", blank=True, symmetrical=True)

    seo_title = models.CharField(max_length=160, blank=True)
    seo_description = models.CharField(max_length=320, blank=True)

    status = models.CharField(
        max_length=10, choices=PublishStatus.choices, default=PublishStatus.DRAFT
    )
    review_notes = models.TextField(
        blank=True,
        help_text="Unresolved identity notes, source references, or facts pending verification. "
        "Internal only — never rendered publicly.",
    )
    source_url = models.URLField(blank=True, help_text="Reference/source for verified facts.")

    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "name"]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    @property
    def is_published(self):
        return self.status == PublishStatus.PUBLISHED


class ProductSpecification(models.Model):
    """Verified product-level specification rows with explicit units."""

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="specifications")
    label = models.CharField(max_length=80)
    value = models.CharField(max_length=160)
    unit = models.CharField(max_length=30, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return f"{self.label}: {self.value}{(' ' + self.unit) if self.unit else ''}"


class ProductVariant(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="variants")
    label = models.CharField(
        max_length=160, help_text="Shown to the buyer, e.g. '50mm, 24kg/m³' or '1/4 in (6.35mm)'."
    )
    sku = models.CharField(max_length=60, blank=True)

    thickness = models.CharField(max_length=60, blank=True)
    dimensions = models.CharField(max_length=120, blank=True)
    density = models.CharField(max_length=60, blank=True)
    diameter = models.CharField(max_length=60, blank=True)
    box_capacity = models.CharField(max_length=60, blank=True)
    pack_size = models.CharField(max_length=60, blank=True)

    sales_unit_override = models.CharField(max_length=60, blank=True)
    availability_status = models.CharField(
        max_length=10,
        choices=AvailabilityStatus.choices,
        default=AvailabilityStatus.UNKNOWN,
    )
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return f"{self.product.name} — {self.label}"


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="products/")
    alt_text = models.CharField(max_length=200)
    is_primary = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return f"Image for {self.product.name}"


class ProductDocument(models.Model):
    class DocType(models.TextChoices):
        DATASHEET = "datasheet", "Datasheet"
        MSDS = "msds", "Safety data sheet"
        OTHER = "other", "Other"

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="documents")
    title = models.CharField(max_length=160)
    doc_type = models.CharField(max_length=12, choices=DocType.choices, default=DocType.DATASHEET)
    file = models.FileField(upload_to="documents/")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.title
