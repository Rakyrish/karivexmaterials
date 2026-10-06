"""Owner request (2026-10-06): show +254 742 355548 as the primary sales
number and +254 710 851911 as the alternative. Only swaps records that still
hold the previous defaults, so later admin edits are not overwritten."""

from django.db import migrations

OLD_PRIMARY, OLD_SECONDARY = "+254 710 851911", "+254 742 355548"


def swap(apps, schema_editor):
    SiteSettings = apps.get_model("sitesettings", "SiteSettings")
    SiteSettings.objects.filter(primary_phone=OLD_PRIMARY, secondary_phone=OLD_SECONDARY).update(
        primary_phone=OLD_SECONDARY, secondary_phone=OLD_PRIMARY
    )


def unswap(apps, schema_editor):
    SiteSettings = apps.get_model("sitesettings", "SiteSettings")
    SiteSettings.objects.filter(primary_phone=OLD_SECONDARY, secondary_phone=OLD_PRIMARY).update(
        primary_phone=OLD_PRIMARY, secondary_phone=OLD_SECONDARY
    )


class Migration(migrations.Migration):
    dependencies = [("sitesettings", "0004_alter_sitesettings_primary_phone_and_more")]

    operations = [migrations.RunPython(swap, unswap)]
