from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed

from .token import AccessToken, RefreshToken
from .errors import (
    AuthenticationFailedError,
)


class TokenObtainPairSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(
            username=data['username'],
            password=data['password']
        )

        # user not active or user credentials don't match
        if not user or not user.is_active:
            raise AuthenticationFailedError()

        access_token = AccessToken.for_user(user)
        refresh_token = RefreshToken.for_access_token(access_token)

        return {
            'access': access_token.encode(),
            'refresh': refresh_token.encode(),
        }


class TokenRefreshSerializer(serializers.Serializer):
    refresh = serializers.CharField()

    def validate(self, data):
        user = self.context['request'].user
        refresh_token = RefreshToken(data['refresh'])

        try:
            user_id = refresh_token['userId']
        except KeyError:
            raise serializers.ValidationError(
                'Token contains no valid user identification'
            )

        if user.id != user_id:
            raise serializers.ValidationError(
                'Invalid refresh token'
            )

        if not user.is_active:
            raise AuthenticationFailed('User not active')

        access_token = AccessToken.for_user(user)
        return {
            'access': access_token.encode(),
            'refresh': data['refresh'],
        }
