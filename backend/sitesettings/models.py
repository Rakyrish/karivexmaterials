from django.core.exceptions import ValidationError
from django.db import models

from catalog.uploads import validate_image_extension, validate_image_upload


class SiteSettings(models.Model):
    """Singleton: all editable, business-identity and contact facts live here
    so they are stored once and reused consistently across the site."""

    site_name = models.CharField(max_length=120, default="KariVex Industrial Materials")
    division_descriptor = models.CharField(max_length=120, default="Industrial Materials Division")
    parent_company_name = models.CharField(max_length=120, default="KariVex Solutions Ltd")
    relationship_wording = models.CharField(
        max_length=160, default="A division of KariVex Solutions Ltd"
    )
    tagline = models.CharField(max_length=120, default="Strength Behind Every Project")

    chemical_division_name = models.CharField(
        max_length=120, default="KariVex Solutions Ltd — Chemical Division"
    )
    chemical_division_url = models.URLField(default="https://karivexsolutionsltd.com/")

    primary_phone = models.CharField(
        max_length=30, default="+254 710 851911", help_text="Main sales line, as displayed."
    )
    secondary_phone = models.CharField(
        max_length=30, blank=True, default="+254 742 355548", help_text="Alternative sales line."
    )
    whatsapp_number_intl = models.CharField(
        max_length=20,
        default="254710851911",
        help_text="Digits only, international format, no leading +. Used to build wa.me links.",
    )
    email = models.EmailField(default="info@karivexsolutionsltd.com")

    address_line = models.CharField(
        max_length=200,
        default="Enterprise Road, Industrial Area, Nairobi, Nairobi County 00400, Kenya",
    )
    hours_text = models.CharField(
        max_length=160, default="Monday–Friday 08:00–17:00; Saturday 08:00–13:00"
    )
    regions_served = models.CharField(
        max_length=200, default="Kenya, Uganda, Tanzania, Rwanda"
    )

    contact_source_url = models.URLField(
        default="https://karivexsolutionsltd.com/contact",
        help_text="Where these contact details were last verified.",
    )
    contact_verified_on = models.DateField(null=True, blank=True)
    contact_form_enabled = models.BooleanField(
        default=True, help_text="Untick to hide the website enquiry forms (call/email/WhatsApp stay)."
    )

    production_origin = models.URLField(default="https://materials.karivexsolutionsltd.com")
    ga_measurement_id = models.CharField(
        max_length=32, blank=True, help_text="e.g. G-XXXXXXXXXX. Leave blank to disable analytics."
    )

    homepage_headline = models.CharField(
        max_length=160,
        default="Industrial Materials for Construction, Insulation & High-Temperature Applications",
    )
    homepage_intro = models.TextField(blank=True)

    logo_header_override = models.ImageField(
        upload_to="branding/", blank=True, null=True,
        validators=[validate_image_extension, validate_image_upload],
        help_text="Optional replacement for the bundled header logo derivative.",
    )

    class Meta:
        verbose_name = "Site settings"
        verbose_name_plural = "Site settings"

    def __str__(self):
        return "Site settings"

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        pass

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj

    @staticmethod
    def digits(value):
        return "".join(ch for ch in value if ch.isdigit())

    def clean(self):
        if SiteSettings.objects.exclude(pk=self.pk).exists():
            raise ValidationError("Only one SiteSettings instance is allowed.")
