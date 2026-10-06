from django.apps import AppConfig


class SitesettingsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "sitesettings"
    verbose_name = "Site settings"

    def ready(self):
        from django.db.models.signals import post_save

        from core.revalidate import request_revalidation

        from .models import SiteSettings

        def settings_changed(sender, **kwargs):
            request_revalidation("settings")

        post_save.connect(settings_changed, sender=SiteSettings, dispatch_uid="sitesettings_revalidate")
