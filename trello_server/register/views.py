from django.contrib.auth.models import User

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from register.serializers import UserSerializer

from rest_framework_jwt.settings import api_settings



class UserList(generics.ListAPIView):
    """
    Response list of users by get request

    Works only for authorized user
    """
    permission_classes = (IsAuthenticated,) 
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserCreate(APIView):
    """
    List all users, or create a new user and return his token.
    """
    permission_classes = (AllowAny,)
    """
    Creates user by post request with post[username, password]

    If creates - returns his token,
    Else - returns response error
    """
    def post(self, request, format=None):
        serializer = UserSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            user = User.objects.get(username=serializer.data['username'])
            
            jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
            jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER
            payload = jwt_payload_handler(user)
            token = jwt_encode_handler(payload)
            response_dict = {
                'token': token
            }
            return Response(response_dict, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

