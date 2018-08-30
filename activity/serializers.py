from resource.serializers import NamedResourceSerializer
from .models import Activity


class ActivitySerializer(NamedResourceSerializer):
    class Meta:
        model = Activity
        fields = '__all__'
