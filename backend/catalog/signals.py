from django.db import transaction
from django.db.models.signals import m2m_changed, post_delete, post_save, pre_save
from django.dispatch import receiver

from core.revalidate import request_revalidation

from .models import (
    Application,
    Category,
    Product,
    ProductDocument,
    ProductImage,
    ProductSpecification,
    ProductVariant,
    Redirect,
    Service,
)

CATALOG_MODELS = (
    Application, Category, Product, ProductDocument, ProductImage,
    ProductSpecification, ProductVariant, Redirect, Service,
)
FILE_FIELDS = {ProductImage: "image", ProductDocument: "file", Category: "image", Application: "image", Service: "image"}


def _delete_file_later(field_file):
    if field_file and field_file.name:
        storage, name = field_file.storage, field_file.name
        transaction.on_commit(lambda: storage.delete(name))


@receiver(pre_save)
def remember_replaced_file(sender, instance, **kwargs):
    field = FILE_FIELDS.get(sender)
    if not field or not instance.pk:
        return
    old = sender.objects.filter(pk=instance.pk).only(field).first()
    if old is None:
        return
    old_file = getattr(old, field)
    new_file = getattr(instance, field)
    if old_file and old_file.name and old_file.name != getattr(new_file, "name", None):
        instance._replaced_file = old_file


@receiver(post_save)
def delete_replaced_file(sender, instance, **kwargs):
    old_file = getattr(instance, "_replaced_file", None)
    if old_file is not None:
        _delete_file_later(old_file)
        instance._replaced_file = None


@receiver(post_delete)
def delete_removed_file(sender, instance, **kwargs):
    field = FILE_FIELDS.get(sender)
    if field:
        _delete_file_later(getattr(instance, field))


@receiver(post_save)
@receiver(post_delete)
def catalog_changed(sender, **kwargs):
    if sender in CATALOG_MODELS:
        request_revalidation("catalog")


@receiver(m2m_changed)
def catalog_relations_changed(sender, **kwargs):
    if kwargs.get("action", "").startswith("post_") and kwargs.get("model") in CATALOG_MODELS:
        request_revalidation("catalog")
