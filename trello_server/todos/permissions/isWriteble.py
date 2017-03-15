from django.shortcuts import get_object_or_404

from rest_framework import permissions

from boards.models import Board, BoardPermission

class IsWritebleOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow
     owner of an object to create it
    """
    def has_permission(self, request, view):
        board = get_object_or_404(Board, 
                                  pk=request.data['board'])
        
        permission = get_object_or_404(BoardPermission, 
                                        board=board, 
                                        user=request.user)
        if permission.access_level == 'read':
          return False
        else: 
          return True

    """
      Allow only writable users to edit object
    """
    def has_object_permission(self, request, view, obj):
      pass