from rest_framework.authentication import BasicAuthentication
from rest_framework import viewsets, permissions, generics
from rest_framework.response import Response
from knox.models import AuthToken
from knox.views import LoginView as KnoxLoginView

from pmd_auth.serializers import SignupUserSerializer, UserSerializer, LoginUserSerializer


class LoginViewAsKnox(KnoxLoginView):
  authentication_classes = [BasicAuthentication]


class RegistrationView(generics.GenericAPIView):
  serializer_class = SignupUserSerializer
  # per client spec: only allow Admins to create new users.
  permission_classes = (permissions.IsAdminUser, )

  def post(self, request, *args, **kwargs):
    serializer = self.get_serializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()

    return Response({
      'user': UserSerializer(user, context=self.get_serializer_context()).data,
      'token': AuthToken.objects.create(user)[1]
    })


class LoginView(generics.GenericAPIView):
  serializer_class = LoginUserSerializer

  def post(self, request, *args, **kwargs):
    serializer = self.get_serializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.validated_data
    return Response({
      'user': UserSerializer(user, context=self.get_serializer_context()).data,
      'token': AuthToken.objects.create(user)[1]
    })


class GetUserDataView(generics.RetrieveAPIView):
  permission_classes = [permissions.IsAuthenticated, ]
  serializer_class = UserSerializer

  def get_object(self):
    return self.request.user
