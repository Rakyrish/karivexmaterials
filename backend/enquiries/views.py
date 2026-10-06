import logging

from django.conf import settings
from django.db import IntegrityError, transaction
from django.utils.decorators import method_decorator
from django_ratelimit.decorators import ratelimit
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Enquiry
from .notifications import send_enquiry_notification
from .serializers import EnquiryConfirmationSerializer, EnquiryCreateSerializer

logger = logging.getLogger("enquiries")


def _confirmation(enquiry, created):
    return Response(
        {**EnquiryConfirmationSerializer(enquiry).data, "already_submitted": not created},
        status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
    )


@method_decorator(
    ratelimit(key="ip", rate=lambda group, request: settings.ENQUIRY_RATE_LIMIT, method="POST", block=False),
    name="post",
)
class EnquiryCreateView(APIView):
    """Accepts one quotation or contact enquiry.

    The enquiry is committed to the database before any notification is
    attempted, so a mail failure never loses a request. Resubmitting with
    the same idempotency key returns the original enquiry instead of a
    duplicate.
    """

    def post(self, request):
        if getattr(request, "limited", False):
            return Response(
                {"detail": "Too many requests from this connection. Please wait a while, "
                           "or contact us by phone, email or WhatsApp."},
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )

        key = request.data.get("idempotency_key") if hasattr(request.data, "get") else None
        if key:
            existing = Enquiry.objects.filter(idempotency_key=key).first()
            if existing:
                return _confirmation(existing, created=False)

        serializer = EnquiryCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        if serializer.validated_data.get("website"):
            logger.info("Rejected enquiry with honeypot field filled.")
            return Response(
                {"detail": "Your request could not be submitted. Please contact us directly."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        enquiry = None
        for _attempt in range(3):
            try:
                with transaction.atomic():
                    enquiry = serializer.save()
                break
            except IntegrityError:
                if key:
                    existing = Enquiry.objects.filter(idempotency_key=key).first()
                    if existing:
                        return _confirmation(existing, created=False)
                # Otherwise a (very unlikely) reference-number collision: retry.
                serializer = EnquiryCreateSerializer(data=request.data)
                serializer.is_valid(raise_exception=True)
        if enquiry is None:
            return Response(
                {"detail": "Your request could not be saved. Please try again."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        # Saved and committed; notification problems are recorded on the
        # enquiry for staff and never change the visitor's result.
        send_enquiry_notification(enquiry)
        return _confirmation(enquiry, created=True)
