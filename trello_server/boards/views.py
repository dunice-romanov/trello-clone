from django.contrib.auth.models import User

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, permissions, status

from boards.permissions.is_owner import IsOwner
from boards.models import Board, BoardPermission
from boards.serializers import UserSerializer, BoardSerializer, BoardPermissionSerializer

class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class BoardsList(generics.ListCreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = BoardSerializer

    def get_queryset(self):
        user = self.request.user
        return Board.objects.filter(owner=user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class BoardItem(generics.RetrieveUpdateDestroyAPIView):
    permissions_classes = (permissions.IsAuthenticated,)
    serializer_class = BoardSerializer
    
    def get_queryset(self):
        user = self.request.user
        return Board.objects.filter(owner=user)


class BoardPermissionList(generics.ListCreateAPIView):
    permissions_classes = (permissions.IsAuthenticated,)
    serializer_class = BoardPermissionSerializer
    
    def get_queryset(self):
        user = self.request.user
        return BoardPermission.objects.filter(user=user)

class BoardPermissionDelete(generics.DestroyAPIView):
    permissions_classes = (permissions.IsAuthenticated,)
    serializer_class = BoardPermissionSerializer

    def get_queryset(self):
        user = self.request.user
        return BoardPermission.objects.filter(user=user)