import logging

from django.conf import settings
from django.core.mail import EmailMessage
from django.utils import timezone

from sitesettings.models import SiteSettings

logger = logging.getLogger("enquiries")

NOTIFICATION_FIELDS = ["notification_sent", "notification_error", "notification_attempted_at"]


def notification_recipient():
    return (
        settings.ENQUIRY_NOTIFICATION_EMAIL
        or SiteSettings.load().email
        or settings.ENQUIRY_NOTIFICATION_FALLBACK_EMAIL
    )


def email_delivery_configured():
    """False when the configured backend would not actually deliver mail
    (console/file/locmem/dummy) outside local development."""
    if settings.DEBUG:
        return True
    return settings.EMAIL_BACKEND not in settings.NON_DELIVERING_EMAIL_BACKENDS


def build_body(enquiry):
    lines = [
        f"Reference: {enquiry.reference_number}",
        f"Type: {enquiry.get_kind_display()}",
        *([f"Service: {enquiry.service_name_snapshot}"] if enquiry.service_name_snapshot else []),
        f"Received: {timezone.localtime(enquiry.created_at):%Y-%m-%d %H:%M} (Nairobi)",
        "",
        f"Name: {enquiry.name}",
        f"Company: {enquiry.company or '-'}",
        f"Email: {enquiry.email}",
        f"Phone: {enquiry.phone or '-'}",
        f"Delivery location: {enquiry.delivery_location or '-'}",
    ]
    items = list(enquiry.items.all())
    if items:
        lines += ["", "Requested items:"]
        for item in items:
            label = item.product_name_snapshot
            if item.variant_label_snapshot:
                label += f" — {item.variant_label_snapshot}"
            quantity = " ".join(filter(None, [item.quantity_display, item.unit]))
            lines.append(f"  - {quantity} x {label}")
            if item.notes:
                lines.append(f"      note: {item.notes}")
            if item.product_url_snapshot:
                lines.append(f"      {item.product_url_snapshot}")
    if enquiry.project_notes:
        lines += ["", "Message / project notes:", enquiry.project_notes]
    lines += [
        "",
        "Manage this enquiry: "
        f"{settings.SITE_PRODUCTION_ORIGIN}/admin/enquiries/enquiry/{enquiry.pk}/change/",
    ]
    return "\n".join(lines)


def send_enquiry_notification(enquiry):
    """Send the internal notification for an already-saved enquiry.

    Any failure (missing configuration, bad SMTP credentials, network) is
    recorded on the enquiry for admin visibility and never raised, so the
    saved enquiry is never lost. Returns True only if the mail backend
    accepted the message.
    """
    enquiry.notification_attempted_at = timezone.now()

    if not email_delivery_configured():
        enquiry.notification_sent = False
        enquiry.notification_error = (
            "Email delivery is not configured (EMAIL_BACKEND does not send real mail). "
            "The enquiry is saved; configure SMTP, then use the 'Retry email notification' action."
        )
        logger.error("Enquiry %s saved but email delivery is not configured.", enquiry.reference_number)
        enquiry.save(update_fields=NOTIFICATION_FIELDS)
        return False

    try:
        message = EmailMessage(
            subject=(
                f"[{enquiry.reference_number}] New {enquiry.get_kind_display().lower()} "
                "— KariVex Industrial Materials"
            ),
            body=build_body(enquiry),
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[notification_recipient()],
            # The visitor's address goes in Reply-To; it is never used as the sender.
            reply_to=[enquiry.email],
        )
        message.send(fail_silently=False)
    except Exception as exc:  # noqa: BLE001 — must not raise; enquiry stays saved either way
        logger.error(
            "Enquiry notification failed for %s: %s", enquiry.reference_number, type(exc).__name__
        )
        enquiry.notification_sent = False
        # SMTP exception text does not contain the configured password.
        enquiry.notification_error = f"{type(exc).__name__}: {exc}"[:1000]
        enquiry.save(update_fields=NOTIFICATION_FIELDS)
        return False

    enquiry.notification_sent = True
    enquiry.notification_error = ""
    enquiry.save(update_fields=NOTIFICATION_FIELDS)
    return True
