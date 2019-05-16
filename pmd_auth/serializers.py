from rest_framework import serializers
from rest_framework_jwt.settings import api_settings
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):

  class Meta:
    model = User
    fields = ['username', ]


class UserSerializerWithToken(serializers.ModelSerializer):
  # since User does not have a token field, define custom method to create a new token
  token = serializers.SerializerMethodField()
  password = serializers.CharField(write_only=True)

  def get_token(self, obj):
    jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
    jwt_encode_handler = api_settings.JWT_ENCODE_HANDLR

    print('the obj: ', obj)
    payload = jwt_payload_handler(obj)
    print('the payload: ', payload)
    token = jwt_encode_handler(payload)
    return token

  # override the default create() method so set_password() can be called on the user instance to hash the password
  def create(self, validated_data):
    password = validated_data.pop('password', None)
    instance = self.Meta.model(**validated_data)

    if password is not None:
      instance.set_password(password)

    instance.save()
    return instance

  class Meta:
    model = User
    fields = ['token', 'username', 'password']
