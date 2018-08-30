from resource.views import ResourceViewSet
from .serializers import Activity, ActivitySerializer


class ActivityViewSet(ResourceViewSet):
    serializer_class = ActivitySerializer
    queryset = Activity.objects.all()
