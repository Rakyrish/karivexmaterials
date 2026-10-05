from django.conf import settings
from django.utils.decorators import method_decorator
from django_ratelimit.decorators import ratelimit
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Enquiry
from .notifications import send_enquiry_notification
from .serializers import EnquiryCreateSerializer, EnquiryReadSerializer


@method_decorator(
    ratelimit(key="ip", rate=lambda g, r: settings.ENQUIRY_RATE_LIMIT, method="POST", block=True),
    name="post",
)
class EnquiryCreateView(APIView):
    """Accepts one multi-item quotation enquiry. Server-validates required
    fields; storage succeeds even if the notification email later fails."""

    def post(self, request):
        serializer = EnquiryCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        enquiry, created = serializer.save()

        if created:
            send_enquiry_notification(enquiry)

        return Response(
            {
                **EnquiryReadSerializer(enquiry).data,
                "already_submitted": not created,
            },
            status=status.HTTP_200_OK if not created else status.HTTP_201_CREATED,
        )


class EnquiryLookupView(APIView):
    """Lets a visitor retrieve their own confirmation by reference number."""

    def get(self, request, reference_number):
        enquiry = Enquiry.objects.filter(reference_number=reference_number).first()
        if not enquiry:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(EnquiryReadSerializer(enquiry).data)
