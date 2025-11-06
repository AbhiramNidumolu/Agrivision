from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsStudent(BasePermission):
    """
    Allows access only to authenticated users in the 'Student' group.
    Used for uploading or requesting images.
    """

    def has_permission(self, request, view):
        user = request.user
        return (
            user.is_authenticated
            and user.groups.filter(name="Student").exists()
        )


class IsStaffOrAdmin(BasePermission):
    """
    Allows access only to authenticated users in 'Staff' or 'Admin' groups.
    Used for approving, modifying, or managing images.
    """

    def has_permission(self, request, view):
        user = request.user
        return (
            user.is_authenticated
            and user.groups.filter(name__in=["Staff", "Admin"]).exists()
        )


class IsReadOnly(BasePermission):
    """
    Allows read-only access for all safe methods (GET, HEAD, OPTIONS).
    Useful for public image listing.
    """

    def has_permission(self, request, view):
        return request.method in SAFE_METHODS
