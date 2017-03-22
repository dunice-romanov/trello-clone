from rest_framework import permissions
from django.shortcuts import get_object_or_404
from boards.models import Board, BoardPermission

class IsOwnerOrWriter(permissions.BasePermission):
    """
    Custom permission to only allow
     owner or writer of an object to edit it
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        permission = get_object_or_404(BoardPermission, user=request.user, board=obj)
        return permission.access_level != 'read'

class IsOwnerOfBoard(permissions.BasePermission):
    def has_permission(self, request, view):
        print('request: ', request.data['board_id'], '\nuser: ', request.user)
        board = get_object_or_404(Board, pk=request.data['board_id'])
        print('owner: ', board.owner.username)
        return board.owner == request.user