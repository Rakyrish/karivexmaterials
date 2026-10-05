import logging

from django.conf import settings
from django.core.mail import EmailMessage

from sitesettings.models import SiteSettings

logger = logging.getLogger("enquiries")


def send_enquiry_notification(enquiry):
    """Send the internal notification for a saved enquiry.

    The enquiry is already persisted before this runs, so any failure here
    (bad SMTP credentials, network issue, etc.) must never lose the saved
    enquiry — it is only recorded on the enquiry for admin visibility.
    """
    site_settings = SiteSettings.load()
    recipient = site_settings.email or settings.ENQUIRY_NOTIFICATION_FALLBACK_EMAIL

    lines = [
        f"Reference: {enquiry.reference_number}",
        f"Name: {enquiry.name}",
        f"Company: {enquiry.company or '-'}",
        f"Email: {enquiry.email}",
        f"Phone: {enquiry.phone or '-'}",
        f"Delivery location: {enquiry.delivery_location or '-'}",
        "",
        "Items:",
    ]
    for item in enquiry.items.all():
        label = item.product_name_snapshot
        if item.variant_label_snapshot:
            label += f" ({item.variant_label_snapshot})"
        lines.append(f"  - {item.quantity} {item.unit or ''} x {label}".strip())
        if item.notes:
            lines.append(f"    note: {item.notes}")

    if enquiry.project_notes:
        lines += ["", "Project notes:", enquiry.project_notes]

    body = "\n".join(lines)

    try:
        message = EmailMessage(
            subject=f"New enquiry {enquiry.reference_number} — KariVex Industrial Materials",
            body=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[recipient],
            reply_to=[enquiry.email],
        )
        message.send(fail_silently=False)
    except Exception as exc:  # noqa: BLE001 — must not raise; enquiry stays saved either way
        logger.error("Enquiry notification failed for %s: %s", enquiry.reference_number, exc)
        enquiry.notification_sent = False
        enquiry.notification_error = str(exc)
        enquiry.save(update_fields=["notification_sent", "notification_error"])
        return False

    enquiry.notification_sent = True
    enquiry.notification_error = ""
    enquiry.save(update_fields=["notification_sent", "notification_error"])
    return True
