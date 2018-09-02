from rest_framework import serializers


class ResourceSerializer(serializers.ModelSerializer):
    key = serializers.CharField()
    deleted = serializers.BooleanField(required=False)
    created_at = serializers.DateTimeField(read_only=True)
    modified_at = serializers.DateTimeField(read_only=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    def create(self, validated_data):
        ModelClass = self.Meta.model
        key = validated_data.get('key')
        item = ModelClass.objects.filter(key=key).first()
        if item:
            validated_data['id'] = item.id
            return self.update(item, validated_data)

        validated_data['user'] = self.context['request'].user
        return super(ResourceSerializer, self).create(validated_data)


class NamedResourceSerializer(ResourceSerializer):
    title = serializers.CharField()


class KeyRelatedField(serializers.RelatedField):
    def to_representation(self, value):
        return value.key

    def to_internal_value(self, data):
        return self.get_queryset().get(key=data)
