from django.urls import path

from . import views

urlpatterns = [
    path("enquiries/", views.EnquiryCreateView.as_view(), name="enquiry-create"),
    path(
        "enquiries/<str:reference_number>/",
        views.EnquiryLookupView.as_view(),
        name="enquiry-lookup",
    ),
]
