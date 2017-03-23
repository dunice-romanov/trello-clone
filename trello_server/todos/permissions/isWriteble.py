from django.shortcuts import get_object_or_404

from rest_framework import permissions

from boards.models import Board, BoardPermission

class IsWritebleOrReadOnly(permissions.BasePermission):
    """
    Granted access for all methods 
    if request.data['board'] is in BoardPermission with request.user
    else if not in - returns 404
    if permission 'read' - access denied
    """
    def has_permission(self, request, view):
        print('has_permission')

        if 'board' not in request.data:
            return False

        board = get_object_or_404(Board, 
                                pk=request.data['board'])

        permission = get_object_or_404(BoardPermission, 
                                        board=board, 
                                        user=request.user)
        if permission.access_level == 'read':
            return False
        else: 
            return True

class IsWritebleToUpdate(permissions.BasePermission):
    """
    Granted access for all methods 
    if obj is in BoardPermission with request.user
    else if not in - returns 404
    if permission 'read' - access denied
    """
    def has_object_permission(self, request, view, obj):
      print ('has_object_permission')
      board = obj.board
      user = request.user
      permission = get_object_or_404(BoardPermission,
                                        board=board,
                                        user=user)
      print('___', permission.access_level)
      if permission.access_level == 'read':
          return False
      else:
          return True