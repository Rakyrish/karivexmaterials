from rest_framework.permissions import BasePermission, DjangoModelPermissions


class IsActiveStaff(BasePermission):
    """Only active staff accounts may use the management API at all."""

    message = "Sign in with a staff account."

    def has_permission(self, request, view):
        user = request.user
        return bool(user and user.is_authenticated and user.is_active and user.is_staff)


class ModelPermissions(DjangoModelPermissions):
    """Django model permissions, including `view` for reads, so the same
    groups that govern the Django admin govern the dashboard."""

    perms_map = {
        "GET": ["%(app_label)s.view_%(model_name)s"],
        "OPTIONS": ["%(app_label)s.view_%(model_name)s"],
        "HEAD": ["%(app_label)s.view_%(model_name)s"],
        "POST": ["%(app_label)s.add_%(model_name)s"],
        "PUT": ["%(app_label)s.change_%(model_name)s"],
        "PATCH": ["%(app_label)s.change_%(model_name)s"],
        "DELETE": ["%(app_label)s.delete_%(model_name)s"],
    }


STAFF_PERMISSIONS = [IsActiveStaff, ModelPermissions]
