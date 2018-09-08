from resource.serializers import (
    NamedResourceSerializer,
    KeyBasedSerializer,
    KeyRelatedField,
)
from pennyworth.serializers import (
    NestedCreateMixin,
    NestedUpdateMixin,
    FileField
)
from .models import Activity, ActivityFile, Category


class ActivityFileSerializer(KeyBasedSerializer):
    file = FileField()

    class Meta:
        model = ActivityFile
        fields = '__all__'


class ActivitySerializer(NestedCreateMixin,
                         NestedUpdateMixin,
                         NamedResourceSerializer):
    files = ActivityFileSerializer(source='activityfile_set',
                                   many=True,
                                   required=False)
    category = KeyRelatedField(queryset=Category.objects.all())

    class Meta:
        model = Activity
        fields = '__all__'
