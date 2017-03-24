from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework import viewsets
from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from register.permissions.user_permissions import UserPermission
from register.serializers import UserSerializer, UserSerializerFull, UserSerializerForUpdates

from rest_framework_jwt.settings import api_settings

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

class UserObjectUpdate(generics.RetrieveUpdateAPIView):
    permission_classes = (IsAuthenticated, UserPermission, )

    serializer_class = UserSerializerForUpdates
    queryset = User.objects.all()

    def get_object(self):
        user = self.request.user
        print(user.username)
        return get_object_or_404(User, username=user.username)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = UserSerializerFull(instance)
        print('retrieve')
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return self.retrieve(self, request, *args, **kwargs)

    def perform_update(self, serializer):
        print('perform update')
        serializer.save()

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        if 'password' in request.data:
            newPass = request.data['password']
            newPassHashed = make_password(newPass)
            request.data['password'] = newPassHashed
        return self.update(request, *args, **kwargs)

class UserObjectRetrieve(generics.RetrieveAPIView):
    permission_classes = (IsAuthenticated, UserPermission, )

    serializer_class = UserSerializerFull

    def get_queryset(self):
        return User.objects.all()