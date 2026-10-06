from django.conf import settings
from django.core.mail import EmailMessage
from django.core.management.base import BaseCommand, CommandError

from enquiries.notifications import email_delivery_configured, notification_recipient


class Command(BaseCommand):
    help = (
        "Send one clearly-labelled test email through the configured mail settings, to check "
        "that enquiry notifications will be delivered. Does not create an enquiry. Defaults to "
        "the enquiry notification address (Site settings email, normally info@)."
    )

    def add_arguments(self, parser):
        parser.add_argument("--to", help="Recipient (default: the enquiry notification address).")

    def handle(self, *args, **options):
        recipient = options["to"] or notification_recipient()
        backend = settings.EMAIL_BACKEND.rsplit(".", 2)[-2]
        self.stdout.write(f"Backend: {settings.EMAIL_BACKEND}")
        self.stdout.write(f"Server:  {settings.EMAIL_HOST or '-'}:{settings.EMAIL_PORT} (TLS={settings.EMAIL_USE_TLS}, SSL={settings.EMAIL_USE_SSL})")
        self.stdout.write(f"From:    {settings.DEFAULT_FROM_EMAIL}")
        self.stdout.write(f"To:      {recipient}")
        if not email_delivery_configured():
            raise CommandError(
                f"EMAIL_BACKEND is '{backend}', which does not deliver real mail. Set the SMTP settings "
                "described in docs/email-setup.md first."
            )
        message = EmailMessage(
            subject="[TEST] KariVex Industrial Materials website email check",
            body=(
                "This is a test message from the KariVex Industrial Materials website.\n\n"
                "If you received it, enquiry notifications (quotations, service requests and "
                "contact messages) will be delivered to this address. No enquiry was created.\n"
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[recipient],
        )
        try:
            message.send(fail_silently=False)
        except Exception as exc:  # noqa: BLE001
            raise CommandError(f"Sending failed: {type(exc).__name__}: {exc}") from exc
        self.stdout.write(self.style.SUCCESS(f"Test email accepted by the mail server for {recipient}."))
