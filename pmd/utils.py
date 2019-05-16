from pmd_auth.serializers import UserSerializer

def pmd_auth_jwt_response_handler(token, user=None, request=None):
  return {
    'token': token,
    'user': UserSerializer(user, context={'request': request}).data
  }
  