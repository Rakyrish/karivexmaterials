from django.urls import path
from rest_framework.routers import SimpleRouter

from . import views

router = SimpleRouter(trailing_slash=True)
router.register("products", views.ProductViewSet, basename="manage-product")
router.register("product-images", views.ProductImageViewSet, basename="manage-product-image")
router.register("categories", views.CategoryViewSet, basename="manage-category")
router.register("applications", views.ApplicationViewSet, basename="manage-application")
router.register("services", views.ServiceViewSet, basename="manage-service")
router.register("testimonials", views.TestimonialViewSet, basename="manage-testimonial")
router.register("enquiries", views.EnquiryViewSet, basename="manage-enquiry")

urlpatterns = [
    path("session/", views.SessionView.as_view(), name="manage-session"),
    path("login/", views.LoginView.as_view(), name="manage-login"),
    path("logout/", views.LogoutView.as_view(), name="manage-logout"),
    path("overview/", views.OverviewView.as_view(), name="manage-overview"),
    path("settings/", views.SiteSettingsView.as_view(), name="manage-settings"),
    *router.urls,
]
