from django.urls import path

from . import views

urlpatterns = [
    path("categories/", views.CategoryListView.as_view(), name="category-list"),
    path("categories/<slug:slug>/", views.CategoryDetailView.as_view(), name="category-detail"),
    path("applications/", views.ApplicationListView.as_view(), name="application-list"),
    path("applications/<slug:slug>/", views.ApplicationDetailView.as_view(), name="application-detail"),
    path("products/", views.ProductListView.as_view(), name="product-list"),
    path("products/facets/", views.ProductFacetsView.as_view(), name="product-facets"),
    path("products/<slug:slug>/", views.ProductDetailView.as_view(), name="product-detail"),
    path("sitemap/", views.SitemapView.as_view(), name="sitemap-data"),
    path("redirects/", views.RedirectLookupView.as_view(), name="redirect-lookup"),
]
