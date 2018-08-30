from django.contrib.auth.models import User
from rest_framework import serializers


class ResourceSerializer(serializers.ModelSerializer):
    key = serializers.CharField()
    created_at = serializers.DateTimeField(read_only=True)
    modified_at = serializers.DateTimeField(read_only=True)
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    def create(self, validated_data):
        ModelClass = self.Meta.model
        key = validated_data.get('key')
        item = ModelClass.objects.filter(key=key).first()
        if item:
            validated_data['id'] = item.id
            return self.update(item, validated_data)
        return super(ResourceSerializer, self).create(validated_data)


class NamedResourceSerializer(ResourceSerializer):
    title = serializers.CharField()
