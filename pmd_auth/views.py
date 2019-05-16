from django.shortcuts import render
from django.http import HttpResponseRedirect
from rest_framework import permissions, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView 
from django.contrib.auth.models import User

from .serializers import UserSerializer, UserSerializerWithToken


@api_view(['GET'])
def current_user(request):
  """
  determine the current user by their token and return their data.
  Used anytime React forgets state. React will check if user has a token stored in browser.
  If found, make request to this view.
  """
  serializer = UserSerializer(request.user)
  return Response(serializer.data)

class UserList(APIView):
  """
  Create a new user. Also, get a list for all Users
  """
  permission_classes = (permissions.AllowAny, )

  def post(self, request, format=None):
    serializer = UserSerializerWithToken(data=request.data)

    if serializer.is_valid():
      serializer.save()
      return Repsponse(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
