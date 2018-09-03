from resource.serializers import NamedResourceSerializer, KeyRelatedField
from .models import Activity, Category


class ActivitySerializer(NamedResourceSerializer):
    category = KeyRelatedField(queryset=Category.objects.all())

    class Meta:
        model = Activity
        fields = '__all__'
