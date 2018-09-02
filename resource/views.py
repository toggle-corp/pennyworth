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

    def get_params(self, key):
        if self.request.method == 'POST':
            return self.request.data.get(key)
        return self.request.query_params.get(key)

    def get_queryset(self):
        qs = self.queryset.filter(user=self.request.user)

        modified_since = self.get_params('modified_since')
        if modified_since:
            qs = qs.filter(modified_at__gt=modified_since)

        return qs
