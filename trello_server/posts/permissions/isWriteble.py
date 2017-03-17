from django.shortcuts import get_object_or_404

from rest_framework import permissions

from boards.models import Board, BoardPermission
from posts.models import Post
from todos.models import List

class IsWritebleOrReadOnly(permissions.BasePermission):
	"""
	Custom permission to only allow
	 owner of an object to create it
	"""
	def has_permission(self, request, view):
		list = get_object_or_404(List, 
								  pk=request.data['board'])
		permission = get_object_or_404(BoardPermission, 
										board=list.board, 
										user=request.user)
		if permission.access_level == 'read':
		  return False
		else: 
		  return True

class IsWritebleOrReadOnlyRetrieve(permissions.BasePermission): 
	"""
		Custom permission to only allow
		owner of an object to edit it
	"""
	def has_object_permission(self, request, view, obj):

		if request.method in permissions.SAFE_METHODS:
			return True


		print(obj.board.board)
		permission = get_object_or_404(BoardPermission, 
										board=obj.board.board, 
										user=request.user)
		if permission.access_level == 'read':
		  return False
		else: 
		  return True