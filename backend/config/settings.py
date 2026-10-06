"""
Django settings for the KariVex Industrial Materials backend.

Environment-driven configuration. See ../.env.example for all supported
variables. No secrets are hardcoded here.
"""

import sys
from pathlib import Path

import environ
from django.core.exceptions import ImproperlyConfigured

BASE_DIR = Path(__file__).resolve().parent.parent
TESTING = len(sys.argv) > 1 and sys.argv[1] == "test"

env = environ.Env(
    DJANGO_DEBUG=(bool, False),
    DJANGO_ALLOWED_HOSTS=(list, []),
    CORS_ALLOWED_ORIGINS=(list, []),
    CSRF_TRUSTED_ORIGINS=(list, []),
    EMAIL_USE_TLS=(bool, True),
    EMAIL_USE_SSL=(bool, False),
    SITE_PRODUCTION_ORIGIN=(str, "https://materials.karivexsolutionsltd.com"),
    ENQUIRY_RATE_LIMIT=(str, "10/h"),
    TRUST_X_FORWARDED_FOR=(bool, False),
    SERVE_MEDIA=(bool, True),
)

# Single shared .env lives at the repo root (one level above backend/) so
# both the Django backend and the Next.js frontend read the same file.
env_file = BASE_DIR.parent / ".env"
if env_file.exists():
    environ.Env.read_env(str(env_file))

# ---------------------------------------------------------------------------
# Core
# ---------------------------------------------------------------------------

DEBUG = env("DJANGO_DEBUG")

_INSECURE_DEV_KEY = "django-insecure-dev-only-key-change-in-production"
SECRET_KEY = env("DJANGO_SECRET_KEY", default=_INSECURE_DEV_KEY)
if not DEBUG and (SECRET_KEY == _INSECURE_DEV_KEY or SECRET_KEY.startswith("change-me")):
    raise ImproperlyConfigured("Set a real DJANGO_SECRET_KEY when DJANGO_DEBUG=False.")

ALLOWED_HOSTS = env("DJANGO_ALLOWED_HOSTS") or (["*"] if DEBUG else [])

SITE_PRODUCTION_ORIGIN = env("SITE_PRODUCTION_ORIGIN").rstrip("/")

# ---------------------------------------------------------------------------
# Applications
# ---------------------------------------------------------------------------

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "django_filters",
    "corsheaders",
    "core",
    "catalog",
    "enquiries",
    "sitesettings",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "core.middleware.PrivateRobotsHeaderMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

# ---------------------------------------------------------------------------
# Database
# ---------------------------------------------------------------------------

DATABASES = {
    "default": env.db(
        "DATABASE_URL",
        default=f"sqlite:///{BASE_DIR / 'db.sqlite3'}",
    )
}
DATABASES["default"]["CONN_MAX_AGE"] = env.int("DB_CONN_MAX_AGE", default=60)

# ---------------------------------------------------------------------------
# Auth / passwords / sessions
# ---------------------------------------------------------------------------

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
        "OPTIONS": {"min_length": 12},
    },
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

SESSION_COOKIE_AGE = 60 * 60 * 8  # an admin working day
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = "Lax"
CSRF_COOKIE_SAMESITE = "Lax"

# ---------------------------------------------------------------------------
# Internationalization
# ---------------------------------------------------------------------------

LANGUAGE_CODE = "en-gb"
TIME_ZONE = "Africa/Nairobi"
USE_I18N = True
USE_TZ = True

# ---------------------------------------------------------------------------
# Static / media
# ---------------------------------------------------------------------------

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STORAGES = {
    "default": {"BACKEND": "django.core.files.storage.FileSystemStorage"},
    "staticfiles": {
        "BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage"
        if TESTING
        else "whitenoise.storage.CompressedManifestStaticFilesStorage"
    },
}

MEDIA_URL = "media/"
MEDIA_ROOT = Path(env("MEDIA_ROOT", default=str(BASE_DIR / "media")))
# Django serves uploaded media itself (behind the reverse proxy / Cloudflare
# cache). Set SERVE_MEDIA=False if the reverse proxy serves MEDIA_ROOT directly.
SERVE_MEDIA = env("SERVE_MEDIA")

# Upload limits (bytes). Images are additionally downscaled on save.
MAX_IMAGE_UPLOAD_BYTES = env.int("MAX_IMAGE_UPLOAD_BYTES", default=8 * 1024 * 1024)
MAX_DOCUMENT_UPLOAD_BYTES = env.int("MAX_DOCUMENT_UPLOAD_BYTES", default=15 * 1024 * 1024)
DATA_UPLOAD_MAX_MEMORY_SIZE = 2_621_440
FILE_UPLOAD_PERMISSIONS = 0o644

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ---------------------------------------------------------------------------
# CORS / CSRF
# ---------------------------------------------------------------------------
# The browser reaches the API on the same origin (the reverse proxy routes
# /api/ to Django), so CORS is normally unnecessary. It is kept configurable
# for local setups where Next.js and Django run on different ports.

CORS_ALLOWED_ORIGINS = env("CORS_ALLOWED_ORIGINS")
CORS_URLS_REGEX = r"^/api/.*$"
CSRF_TRUSTED_ORIGINS = env("CSRF_TRUSTED_ORIGINS")
CORS_ALLOW_CREDENTIALS = False

# ---------------------------------------------------------------------------
# Security
# ---------------------------------------------------------------------------

SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_REFERRER_POLICY = "strict-origin-when-cross-origin"
X_FRAME_OPTIONS = "DENY"

# Only enable when the app sits behind a proxy that overwrites (not appends)
# X-Forwarded-Proto / X-Forwarded-For, e.g. Caddy or nginx configured as in
# deploy/. Otherwise clients could spoof these headers.
TRUST_X_FORWARDED_FOR = env("TRUST_X_FORWARDED_FOR")
if env.bool("DJANGO_BEHIND_TLS_PROXY", default=not DEBUG):
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

if not DEBUG:
    SECURE_SSL_REDIRECT = env.bool("DJANGO_SECURE_SSL_REDIRECT", default=True)
    # Health checks and the Next.js server call Django over the private
    # container network on plain HTTP; never redirect those.
    SECURE_REDIRECT_EXEMPT = [r"^healthz$", r"^api/"]
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_HSTS_SECONDS = env.int("DJANGO_HSTS_SECONDS", default=31536000)
    # Deliberately NOT includeSubDomains/preload: this app only controls
    # materials.karivexsolutionsltd.com and must not impose HSTS on siblings.
    SECURE_HSTS_INCLUDE_SUBDOMAINS = False
    SECURE_HSTS_PRELOAD = False

# ---------------------------------------------------------------------------
# REST framework
# ---------------------------------------------------------------------------

REST_FRAMEWORK = {
    # The public API is anonymous and read-only except for enquiry creation.
    # No session authentication => no admin cookie is ever honoured by the API.
    "DEFAULT_AUTHENTICATION_CLASSES": [],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.AllowAny",
    ],
    "UNAUTHENTICATED_USER": None,
    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend",
    ],
    "DEFAULT_PAGINATION_CLASS": "catalog.pagination.CatalogPagination",
    "PAGE_SIZE": 24,
    "DEFAULT_RENDERER_CLASSES": [
        "rest_framework.renderers.JSONRenderer",
    ]
    + (["rest_framework.renderers.BrowsableAPIRenderer"] if DEBUG else []),
}

ENQUIRY_RATE_LIMIT = env("ENQUIRY_RATE_LIMIT")
RATELIMIT_IP_META_KEY = "core.ratelimit.client_ip"

# django-ratelimit needs a shared cache. LocMemCache is per-process — fine for
# a single gunicorn worker; with more workers, point CACHE_URL at Redis or use
# the database cache (dbcache://ratelimit_cache, after `createcachetable`).
CACHES = {"default": env.cache("CACHE_URL", default="locmemcache://")}
if CACHES["default"]["BACKEND"].endswith("LocMemCache"):
    SILENCED_SYSTEM_CHECKS = ["django_ratelimit.E003", "django_ratelimit.W001"]

# ---------------------------------------------------------------------------
# Email
# ---------------------------------------------------------------------------

EMAIL_BACKEND = env(
    "EMAIL_BACKEND",
    default="django.core.mail.backends.console.EmailBackend",
)
EMAIL_HOST = env("EMAIL_HOST", default="")
EMAIL_PORT = env.int("EMAIL_PORT", default=587)
EMAIL_HOST_USER = env("EMAIL_HOST_USER", default="")
EMAIL_HOST_PASSWORD = env("EMAIL_HOST_PASSWORD", default="")
EMAIL_USE_TLS = env("EMAIL_USE_TLS")
EMAIL_USE_SSL = env("EMAIL_USE_SSL")
EMAIL_TIMEOUT = env.int("EMAIL_TIMEOUT", default=15)
# Local mail capture: EMAIL_BACKEND=django.core.mail.backends.filebased.EmailBackend
EMAIL_FILE_PATH = env("EMAIL_FILE_PATH", default=str(BASE_DIR.parent / ".local-mail"))
DEFAULT_FROM_EMAIL = env(
    "DEFAULT_FROM_EMAIL",
    default="KariVex Industrial Materials <no-reply@materials.karivexsolutionsltd.com>",
)
SERVER_EMAIL = DEFAULT_FROM_EMAIL
# Optional override for where enquiry notifications go. Blank => the email
# address stored in Site settings (verified company email).
ENQUIRY_NOTIFICATION_EMAIL = env("ENQUIRY_NOTIFICATION_EMAIL", default="")
ENQUIRY_NOTIFICATION_FALLBACK_EMAIL = env(
    "ENQUIRY_NOTIFICATION_FALLBACK_EMAIL",
    default="info@karivexsolutionsltd.com",
)
# Backends that do not actually deliver mail. In production, using one of
# these records the enquiry's notification as "not delivered" instead of
# pretending an email went out.
NON_DELIVERING_EMAIL_BACKENDS = {
    "django.core.mail.backends.console.EmailBackend",
    "django.core.mail.backends.dummy.EmailBackend",
    "django.core.mail.backends.filebased.EmailBackend",
}

# ---------------------------------------------------------------------------
# Frontend cache revalidation (Next.js on-demand revalidation)
# ---------------------------------------------------------------------------
# When catalogue/site-settings records change, Django POSTs the affected cache
# tags to the Next.js route handler so the public pages refresh immediately.
# Leave blank to rely on the frontend's time-based revalidation only.
FRONTEND_REVALIDATE_URL = "" if TESTING else env("FRONTEND_REVALIDATE_URL", default="")
REVALIDATE_SECRET = env("REVALIDATE_SECRET", default="")

# ---------------------------------------------------------------------------
# Logging — surface enquiry notification failures without losing the enquiry
# ---------------------------------------------------------------------------

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {"console": {"class": "logging.StreamHandler"}},
    "root": {"handlers": ["console"], "level": "INFO"},
    "loggers": {
        "enquiries": {"handlers": ["console"], "level": "INFO", "propagate": False},
        "catalog": {"handlers": ["console"], "level": "INFO", "propagate": False},
    },
}
