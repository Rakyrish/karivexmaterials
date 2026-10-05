from django.contrib.auth.models import Group, Permission
from django.core.management.base import BaseCommand

EDITOR_APPS = ["catalog"]
EDITOR_VIEW_ONLY_APPS = ["sitesettings", "enquiries"]

ADMIN_APPS = ["catalog", "sitesettings", "enquiries"]


def perms_for(app_labels, actions=("add", "change", "view", "delete")):
    perms = Permission.objects.filter(content_type__app_label__in=app_labels)
    return [p for p in perms if any(p.codename.startswith(a + "_") for a in actions)]


class Command(BaseCommand):
    help = (
        "Idempotently create the 'Catalogue Editors' and 'Administrators' permission groups. "
        "Safe to re-run; never creates or changes user accounts or passwords."
    )

    def handle(self, *args, **options):
        editors, _ = Group.objects.get_or_create(name="Catalogue Editors")
        editor_perms = perms_for(EDITOR_APPS, ("add", "change", "view")) + perms_for(
            EDITOR_VIEW_ONLY_APPS, ("view",)
        )
        editors.permissions.set(editor_perms)

        admins, _ = Group.objects.get_or_create(name="Administrators")
        admin_perms = perms_for(ADMIN_APPS, ("add", "change", "view", "delete"))
        admins.permissions.set(admin_perms)

        self.stdout.write(self.style.SUCCESS(
            f"Catalogue Editors: {editors.permissions.count()} permissions. "
            f"Administrators: {admins.permissions.count()} permissions."
        ))
        self.stdout.write(
            "Assign staff users to one of these groups in Django admin "
            "(Users > select user > Groups). Grant is_superuser only to trusted owners."
        )
