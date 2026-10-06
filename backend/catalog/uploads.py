"""Validation and optimisation for files uploaded through the admin."""

import io
import logging
import os

from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.files.base import ContentFile
from django.core.validators import FileExtensionValidator
from PIL import Image, ImageOps, UnidentifiedImageError

logger = logging.getLogger("catalog")

IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp"]
DOCUMENT_EXTENSIONS = ["pdf"]
MAX_IMAGE_EDGE = 2000

validate_image_extension = FileExtensionValidator(IMAGE_EXTENSIONS)
validate_document_extension = FileExtensionValidator(DOCUMENT_EXTENSIONS)


def validate_image_upload(file):
    if file.size and file.size > settings.MAX_IMAGE_UPLOAD_BYTES:
        raise ValidationError(
            f"Image is larger than {settings.MAX_IMAGE_UPLOAD_BYTES // (1024 * 1024)} MB."
        )
    try:
        pos = file.tell() if hasattr(file, "tell") else None
        with Image.open(file) as img:
            img.verify()
            if img.format not in {"JPEG", "PNG", "WEBP"}:
                raise ValidationError("Upload a JPEG, PNG or WebP image.")
        if pos is not None:
            file.seek(pos)
    except (UnidentifiedImageError, OSError) as exc:
        raise ValidationError("The uploaded file is not a valid image.") from exc


def validate_document_upload(file):
    if file.size and file.size > settings.MAX_DOCUMENT_UPLOAD_BYTES:
        raise ValidationError(
            f"Document is larger than {settings.MAX_DOCUMENT_UPLOAD_BYTES // (1024 * 1024)} MB."
        )
    pos = file.tell() if hasattr(file, "tell") else 0
    header = file.read(5)
    file.seek(pos)
    if header != b"%PDF-":
        raise ValidationError("Upload a PDF document.")


def optimise_image_field(field_file):
    """Downscale an uncommitted (newly uploaded) image to MAX_IMAGE_EDGE and
    strip metadata. Already-stored files are left untouched."""
    if not field_file or getattr(field_file, "_committed", True):
        return
    try:
        field_file.seek(0)
        with Image.open(field_file) as img:
            fmt = img.format
            img = ImageOps.exif_transpose(img)
            if max(img.size) > MAX_IMAGE_EDGE:
                img.thumbnail((MAX_IMAGE_EDGE, MAX_IMAGE_EDGE), Image.Resampling.LANCZOS)
            buffer = io.BytesIO()
            if fmt == "PNG":
                img.save(buffer, format="PNG", optimize=True)
                ext = ".png"
            elif fmt == "WEBP":
                img.save(buffer, format="WEBP", quality=82)
                ext = ".webp"
            else:
                if img.mode not in ("RGB", "L"):
                    img = img.convert("RGB")
                img.save(buffer, format="JPEG", quality=82, optimize=True, progressive=True)
                ext = ".jpg"
        base = os.path.splitext(os.path.basename(field_file.name))[0]
        field_file.save(base + ext, ContentFile(buffer.getvalue()), save=False)
    except (UnidentifiedImageError, OSError):
        logger.warning("Could not optimise image %s; storing original.", field_file.name)
        field_file.seek(0)
