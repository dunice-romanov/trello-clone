from django.shortcuts import get_object_or_404

from rest_framework import permissions

from boards.models import Board, BoardPermission

class IsReadableOr404(permissions.BasePermission):
    """
    Custom permission to only allow
     owner of an object to create it
    """
    def has_permission(self, request, view):
        board = get_object_or_404(Board, 
                                  pk=request.GET.get('id'))
        
        permission = get_object_or_404(BoardPermission, 
                                        board=board, 
                                        user=request.user)
        return True

    """
      Allow only writable users to edit object
    """
    def has_object_permission(self, request, view, obj):
      pass