from resource.views import ResourceViewSet
from .serializers import Category, CategorySerializer


class CategoryViewSet(ResourceViewSet):
    serializer_class = CategorySerializer
    queryset = Category.objects.all()
