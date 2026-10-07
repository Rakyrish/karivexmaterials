"""Authenticated management API behind the website dashboard (/dashboard).

Uses Django session login + CSRF and the same model permissions and groups
as the Django admin. Saves go through the models, so upload validation,
image optimisation, slug redirects and frontend revalidation all apply.
"""

from django.conf import settings
from django.contrib.auth import authenticate, login, logout
from django.db.models import Count, ProtectedError, Q
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie
from django_ratelimit.decorators import ratelimit
from rest_framework import generics, mixins, status, viewsets
from rest_framework.authentication import SessionAuthentication
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from catalog.models import Application, Category, Product, ProductImage, PublishStatus, Service, Testimonial
from enquiries.models import Enquiry, EnquiryStatus
from sitesettings.models import SiteSettings

from . import serializers as s
from .permissions import STAFF_PERMISSIONS, IsActiveStaff

PARSERS = [JSONParser, MultiPartParser, FormParser]

# Permissions the dashboard uses to decide what to show. The API enforces
# them independently on every request.
DASHBOARD_PERMISSIONS = [
    "catalog.view_product", "catalog.add_product", "catalog.change_product", "catalog.delete_product",
    "catalog.publish_product",
    "catalog.add_productimage", "catalog.change_productimage", "catalog.delete_productimage",
    "catalog.view_category", "catalog.add_category", "catalog.change_category", "catalog.delete_category",
    "catalog.view_application", "catalog.change_application",
    "catalog.view_service", "catalog.add_service", "catalog.change_service", "catalog.delete_service",
    "catalog.view_testimonial", "catalog.add_testimonial", "catalog.change_testimonial",
    "catalog.delete_testimonial",
    "enquiries.view_enquiry", "enquiries.change_enquiry",
    "sitesettings.view_sitesettings", "sitesettings.change_sitesettings",
]


def login_username_key(group, request):
    """Rate-limit key: the submitted username (case-insensitive)."""
    data = getattr(request, "data", None) or {}
    return str(data.get("username", "")).strip().lower() or "-"


def session_payload(request):
    user = request.user
    # The API runs with UNAUTHENTICATED_USER = None, so `user` may be None.
    if not (user and user.is_authenticated and user.is_active and user.is_staff):
        return {"authenticated": False}
    return {
        "authenticated": True,
        "user": s.UserSerializer(user).data,
        "permissions": [perm for perm in DASHBOARD_PERMISSIONS if user.has_perm(perm)],
        "site_origin": settings.SITE_PRODUCTION_ORIGIN,
    }


class SessionView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [AllowAny]

    @method_decorator(ensure_csrf_cookie)
    def get(self, request):
        return Response(session_payload(request))


@method_decorator(csrf_protect, name="dispatch")
@method_decorator(ratelimit(key="ip", rate="10/15m", method="POST", block=False), name="post")
@method_decorator(ratelimit(key=login_username_key, rate="10/15m", method="POST", block=False), name="post")
class LoginView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        if getattr(request, "limited", False):
            return Response(
                {"detail": "Too many sign-in attempts. Wait 15 minutes and try again."},
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )
        username = str(request.data.get("username", "")).strip()
        password = str(request.data.get("password", ""))
        user = authenticate(request, username=username, password=password) if username and password else None
        if user is None or not user.is_staff:
            # Same message either way: do not reveal which accounts exist.
            return Response({"detail": "Incorrect username or password."}, status=status.HTTP_400_BAD_REQUEST)
        login(request, user)
        return Response(session_payload(request))


class LogoutView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [AllowAny]

    def post(self, request):
        logout(request)
        return Response({"authenticated": False})


class StaffMixin:
    authentication_classes = [SessionAuthentication]
    permission_classes = STAFF_PERMISSIONS
    parser_classes = PARSERS
    pagination_class = None
    search_fields = ()

    def filter_list(self, queryset):
        params = self.request.query_params
        if params.get("status"):
            queryset = queryset.filter(status=params["status"])
        term = params.get("search", "").strip()
        if term and self.search_fields:
            query = Q()
            for field in self.search_fields:
                query |= Q(**{f"{field}__icontains": term})
            queryset = queryset.filter(query)
        return queryset

    def destroy(self, request, *args, **kwargs):
        try:
            return super().destroy(request, *args, **kwargs)
        except ProtectedError:
            return Response(
                {"detail": "This is still in use (for example, products belong to this category). "
                           "Move or remove those first, or hide it instead."},
                status=status.HTTP_400_BAD_REQUEST,
            )


class ProductViewSet(StaffMixin, viewsets.ModelViewSet):
    search_fields = ("name", "sku", "synonyms", "short_summary")

    def get_queryset(self):
        queryset = Product.objects.select_related("primary_category").prefetch_related(
            "images", "specifications", "variants", "additional_categories", "applications", "related_products"
        )
        if self.action == "list":
            queryset = self.filter_list(queryset)
            if self.request.query_params.get("category"):
                queryset = queryset.filter(primary_category_id=self.request.query_params["category"])
        return queryset

    def get_serializer_class(self):
        return s.ProductListSerializer if self.action == "list" else s.ProductSerializer


class ProductImageViewSet(StaffMixin, mixins.CreateModelMixin, mixins.UpdateModelMixin,
                          mixins.DestroyModelMixin, viewsets.GenericViewSet):
    queryset = ProductImage.objects.select_related("product")
    serializer_class = s.ProductImageSerializer


class CategoryViewSet(StaffMixin, viewsets.ModelViewSet):
    serializer_class = s.CategorySerializer
    search_fields = ("name", "intro")

    def get_queryset(self):
        queryset = Category.objects.annotate(product_count=Count("primary_products", distinct=True))
        return self.filter_list(queryset) if self.action == "list" else queryset


class ApplicationViewSet(StaffMixin, viewsets.ModelViewSet):
    serializer_class = s.ApplicationSerializer
    search_fields = ("name", "summary")

    def get_queryset(self):
        queryset = Application.objects.all()
        return self.filter_list(queryset) if self.action == "list" else queryset


class ServiceViewSet(StaffMixin, viewsets.ModelViewSet):
    serializer_class = s.ServiceSerializer
    search_fields = ("name", "summary")

    def get_queryset(self):
        queryset = Service.objects.prefetch_related("related_products")
        return self.filter_list(queryset) if self.action == "list" else queryset


class TestimonialViewSet(StaffMixin, viewsets.ModelViewSet):
    serializer_class = s.TestimonialSerializer
    search_fields = ("customer_name", "quote", "location")

    def get_queryset(self):
        queryset = Testimonial.objects.select_related("service")
        return self.filter_list(queryset) if self.action == "list" else queryset


class EnquiryViewSet(StaffMixin, mixins.ListModelMixin, mixins.RetrieveModelMixin,
                     mixins.UpdateModelMixin, viewsets.GenericViewSet):
    serializer_class = s.EnquirySerializer
    search_fields = ("reference_number", "name", "company", "email", "phone")

    def get_queryset(self):
        queryset = Enquiry.objects.prefetch_related("items")
        return self.filter_list(queryset) if self.action == "list" else queryset


class SiteSettingsView(generics.RetrieveUpdateAPIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = STAFF_PERMISSIONS
    parser_classes = PARSERS
    serializer_class = s.SiteSettingsSerializer
    queryset = SiteSettings.objects.all()

    def get_object(self):
        obj = SiteSettings.load()
        self.check_object_permissions(self.request, obj)
        return obj


class OverviewView(APIView):
    """Counts for the dashboard home; each only if the user may view it."""

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsActiveStaff]

    def get(self, request):
        user = request.user
        data = {}

        def by_status(model):
            counts = dict(model.objects.values_list("status").annotate(n=Count("id")))
            return {choice: counts.get(choice, 0) for choice in PublishStatus.values}

        if user.has_perm("catalog.view_product"):
            data["products"] = by_status(Product)
            data["products_without_photos"] = (
                Product.objects.filter(status=PublishStatus.PUBLISHED, images__isnull=True).count()
            )
        if user.has_perm("catalog.view_service"):
            data["services"] = by_status(Service)
        if user.has_perm("catalog.view_category"):
            data["categories"] = by_status(Category)
        if user.has_perm("catalog.view_testimonial"):
            data["testimonials"] = by_status(Testimonial)
        if user.has_perm("enquiries.view_enquiry"):
            data["enquiries_new"] = Enquiry.objects.filter(status=EnquiryStatus.NEW).count()
            data["enquiries_failed_email"] = Enquiry.objects.filter(
                notification_sent=False, notification_error__gt=""
            ).count()
            data["recent_enquiries"] = [
                {
                    "id": e.id, "reference_number": e.reference_number, "name": e.name, "kind": e.kind,
                    "status": e.status, "created_at": e.created_at,
                }
                for e in Enquiry.objects.order_by("-created_at")[:5]
            ]
        return Response(data)
