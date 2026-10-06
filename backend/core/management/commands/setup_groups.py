from django.contrib.auth.models import Group, Permission
from django.core.management.base import BaseCommand
from django.db.models import Q

CATALOG_INLINE_MODELS = ["productspecification", "productvariant", "productimage", "productdocument"]


def perms(app_label, actions, models=None):
    query = Q(content_type__app_label=app_label)
    if models:
        query &= Q(content_type__model__in=models)
    action_q = Q()
    for action in actions:
        action_q |= Q(codename__startswith=f"{action}_")
    return list(Permission.objects.filter(query & action_q))


GROUPS = {
    # Prepare catalogue content; cannot publish, delete products or see enquiries.
    "Catalogue Editors": lambda: (
        perms("catalog", ["add", "change", "view"])
        + perms("catalog", ["delete"], CATALOG_INLINE_MODELS)
        + perms("sitesettings", ["view"])
    ),
    # Handle customer enquiries; read-only catalogue.
    "Sales": lambda: (
        perms("enquiries", ["view", "change"])
        + perms("catalog", ["view"])
        + perms("sitesettings", ["view"])
    ),
    # Full content control including publishing and settings. User accounts
    # remain superuser-only.
    "Administrators": lambda: (
        perms("catalog", ["add", "change", "view", "delete", "publish"])
        + perms("sitesettings", ["change", "view"])
        + perms("enquiries", ["change", "view", "delete"])
    ),
}


class Command(BaseCommand):
    help = (
        "Idempotently create/refresh the 'Catalogue Editors', 'Sales' and 'Administrators' "
        "permission groups. Safe to re-run; never creates or changes user accounts or passwords."
    )

    def handle(self, *args, **options):
        for name, build in GROUPS.items():
            group, _ = Group.objects.get_or_create(name=name)
            group.permissions.set(build())
            self.stdout.write(f"{name}: {group.permissions.count()} permissions")
        self.stdout.write(self.style.SUCCESS(
            "Groups ready. Create staff accounts with `python manage.py createsuperuser` (owners) "
            "or in Admin > Users, tick 'Staff status' and add them to one group."
        ))
