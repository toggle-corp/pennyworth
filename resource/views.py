from rest_framework import (
    viewsets,
    permissions,
)


class ResourcePermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user


class ResourceViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated,
                          ResourcePermission]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)
