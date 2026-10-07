import re

from django.conf import settings
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.static import serve

from core.views import health_check

admin.site.site_header = "KariVex Industrial Materials — Admin"
admin.site.site_title = "KariVex Materials Admin"
admin.site.index_title = "Catalogue & enquiries administration"
admin.site.site_url = settings.SITE_PRODUCTION_ORIGIN

urlpatterns = [
    path("admin/", admin.site.urls),
    path("healthz", health_check, name="health-check"),
    path("api/v1/", include("catalog.urls")),
    path("api/v1/", include("sitesettings.urls")),
    path("api/v1/", include("enquiries.urls")),
    # Authenticated dashboard API (session + CSRF, model permissions).
    path("api/manage/", include("manage_api.urls")),
]

if settings.SERVE_MEDIA:
    urlpatterns += [
        re_path(
            r"^%s(?P<path>.*)$" % re.escape(settings.MEDIA_URL.lstrip("/")),
            serve,
            {"document_root": settings.MEDIA_ROOT},
        ),
    ]
