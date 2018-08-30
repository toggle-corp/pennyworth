from resource.serializers import NamedResourceSerializer
from .models import Category


class CategorySerializer(NamedResourceSerializer):
    class Meta:
        model = Category
        fields = '__all__'
