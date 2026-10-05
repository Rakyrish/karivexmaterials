from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

from core.views import health_check

admin.site.site_header = "KariVex Industrial Materials — Admin"
admin.site.site_title = "KariVex Materials Admin"
admin.site.index_title = "Catalogue & enquiries administration"

urlpatterns = [
    path("admin/", admin.site.urls),
    path("healthz", health_check, name="health-check"),
    path("api/v1/", include("catalog.urls")),
    path("api/v1/", include("sitesettings.urls")),
    path("api/v1/", include("enquiries.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
