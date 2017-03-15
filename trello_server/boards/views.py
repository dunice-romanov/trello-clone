from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.core.exceptions import ValidationError

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, permissions, status

from boards.permissions.is_owner import IsOwner, IsOwnerOfBoard
from boards.models import Board, BoardPermission
from boards.serializers import UserSerializer, BoardSerializer, BoardPermissionSerializer


class BoardCreate(generics.CreateAPIView):
    """
    Creates board with POST[title] for authenticated user
    After creation puts board instance in BoardPermission as owner
    """
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = BoardSerializer

    def get_queryset(self):
        user = self.request.user
        return Board.objects.filter(owner=user)

    def perform_create(self, serializer):
        user = self.request.user
        board_object = serializer.save(owner=user)
        BoardPermission.objects.create(board=board_object,
                                        user=user,
                                        access_level='owner')

class BoardItem(generics.RetrieveUpdateDestroyAPIView):
    permissions_classes = (permissions.IsAuthenticated, IsOwner,)
    serializer_class = BoardSerializer
    
    def get_queryset(self):
        user = self.request.user
        return Board.objects.filter(owner=user)
    
    def perform_destroy(self, instance):
        print('im in')
        share_boards = BoardPermission.objects.filter(board=instance).delete()
        instance.delete()


class BoardList(generics.ListAPIView):
    permissions_classes = (permissions.IsAuthenticated,)
    serializer_class = BoardPermissionSerializer
    
    def get_queryset(self):
        user = self.request.user
        return BoardPermission.objects.filter(user=user)


class BoardPermissionCreate(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticated, IsOwnerOfBoard,)
    serializer_class = BoardPermissionSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except ValidationError:
            return Response({'data': 'user not found'}, status=status.HTTP_404_NOT_FOUND)  

    def perform_create(self, serializer):
        print('\n\nperform', self.request.data['username'], '\n\n')
        try:
            user = User.objects.get(username=self.request.data['username'])
            board = Board.objects.get(pk=self.request.data['board_id'])
            serializer.save(user=user, board=board)
        except User.DoesNotExist:
            raise ValidationError('User doesnt exists')
        except Board.DoesNotExist:
            raise ValidationError('Board doesnt exists')


class BoardUnshare(generics.DestroyAPIView):
    serializer_class = BoardPermissionSerializer

    # def get_queryset(self):
    #     return BoardPermission.objects.filter(user=self.request.data['username'], board.pk=self.request)
    #                                     .filter()