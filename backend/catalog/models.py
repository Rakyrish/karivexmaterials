from django.db import models
from django.utils.text import slugify

from .uploads import (
    optimise_image_field,
    validate_document_extension,
    validate_document_upload,
    validate_image_extension,
    validate_image_upload,
)

IMAGE_VALIDATORS = [validate_image_extension, validate_image_upload]
DOCUMENT_VALIDATORS = [validate_document_extension, validate_document_upload]


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
    quote_checklist = models.TextField(
        blank=True,
        help_text="One item per line: details buyers should include in a quotation request "
        "for this category.",
    )
    seo_title = models.CharField(max_length=160, blank=True)
    seo_description = models.CharField(max_length=320, blank=True)
    image = models.ImageField(
        upload_to="categories/", blank=True, null=True, validators=IMAGE_VALIDATORS
    )
    image_alt = models.CharField(max_length=200, blank=True)
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
        optimise_image_field(self.image)
        super().save(*args, **kwargs)


class Application(TimeStampedModel):
    name = models.CharField(max_length=120, unique=True)
    slug = models.SlugField(max_length=140, unique=True, blank=True)
    summary = models.CharField(max_length=240, blank=True)
    intro = models.TextField(
        blank=True,
        help_text="Describes product selection considerations. No performance guarantees "
        "or installation-service claims unless confirmed separately.",
    )
    considerations = models.TextField(
        blank=True,
        help_text="One selection consideration per line, shown as a checklist.",
    )
    seo_title = models.CharField(max_length=160, blank=True)
    seo_description = models.CharField(max_length=320, blank=True)
    image = models.ImageField(
        upload_to="applications/", blank=True, null=True, validators=IMAGE_VALIDATORS
    )
    image_alt = models.CharField(max_length=200, blank=True)
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
        optimise_image_field(self.image)
        super().save(*args, **kwargs)


class Product(TimeStampedModel):
    slug = models.SlugField(
        max_length=160,
        unique=True,
        blank=True,
        help_text="Public URL: /products/<slug>. Changing it on a published product creates "
        "a permanent redirect from the old URL automatically.",
    )
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
        blank=True,
        help_text="Original descriptive copy. Blank lines separate paragraphs. Do not copy "
        "another division's wording.",
    )
    selection_notes = models.TextField(
        blank=True,
        help_text="One item per line: what a buyer should confirm or tell us when requesting "
        "this product. Shown on the product page.",
    )

    sales_unit = models.CharField(
        max_length=60, blank=True, help_text="Confirmed unit only, e.g. 'sheet', 'roll', 'box'."
    )
    minimum_order_quantity = models.DecimalField(
        max_digits=12, decimal_places=2, null=True, blank=True,
        help_text="Leave blank unless confirmed.",
    )
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
    source_url = models.URLField(
        blank=True, help_text="Internal reference/source for verified facts. Not shown publicly."
    )

    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "name"]
        permissions = [("publish_product", "Can publish or unpublish products")]

    def __str__(self):
        return self.name

    @property
    def is_published(self):
        return self.status == PublishStatus.PUBLISHED

    @property
    def public_path(self):
        return f"/products/{self.slug}"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        previous = None
        if self.pk:
            previous = Product.objects.filter(pk=self.pk).values("slug", "status").first()
        super().save(*args, **kwargs)
        if previous and previous["slug"] != self.slug and previous["status"] == PublishStatus.PUBLISHED:
            Redirect.record_move(f"/products/{previous['slug']}", self.public_path)
        elif self.is_published:
            # This URL now serves a real product; it must not redirect elsewhere.
            Redirect.objects.filter(old_path=self.public_path).delete()


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
        max_length=160, help_text="Shown to the buyer, e.g. '50 mm' or '1/4 in (6.35 mm)'."
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
    is_active = models.BooleanField(default=True, help_text="Untick to hide from buyers.")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return f"{self.product.name} — {self.label}"


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="products/", validators=IMAGE_VALIDATORS)
    alt_text = models.CharField(
        max_length=200, help_text="Describe what the photograph actually shows."
    )
    width = models.PositiveIntegerField(null=True, blank=True, editable=False)
    height = models.PositiveIntegerField(null=True, blank=True, editable=False)
    is_primary = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["-is_primary", "order", "id"]

    def __str__(self):
        return f"Image for {self.product.name}"

    def save(self, *args, **kwargs):
        optimise_image_field(self.image)
        try:
            self.width, self.height = self.image.width, self.image.height
        except (OSError, ValueError):
            pass
        super().save(*args, **kwargs)


class ProductDocument(models.Model):
    class DocType(models.TextChoices):
        DATASHEET = "datasheet", "Datasheet"
        MSDS = "msds", "Safety data sheet"
        OTHER = "other", "Other"

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="documents")
    title = models.CharField(max_length=160)
    doc_type = models.CharField(max_length=12, choices=DocType.choices, default=DocType.DATASHEET)
    file = models.FileField(upload_to="documents/", validators=DOCUMENT_VALIDATORS)
    is_public = models.BooleanField(
        default=True, help_text="Untick to keep an internal reference document off the website."
    )
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.title


class Redirect(TimeStampedModel):
    """Permanent redirects for public URLs that have moved (e.g. a renamed
    product slug). Created automatically on slug changes; editable in admin."""

    old_path = models.CharField(max_length=300, unique=True, help_text="e.g. /products/old-slug")
    new_path = models.CharField(max_length=300, help_text="e.g. /products/new-slug")

    class Meta:
        ordering = ["old_path"]

    def __str__(self):
        return f"{self.old_path} → {self.new_path}"

    @classmethod
    def record_move(cls, old_path, new_path):
        # Collapse chains: anything that pointed at old_path now points at new_path.
        cls.objects.filter(new_path=old_path).update(new_path=new_path)
        # A path that is live again must not redirect away.
        cls.objects.filter(old_path=new_path).delete()
        cls.objects.update_or_create(old_path=old_path, defaults={"new_path": new_path})
