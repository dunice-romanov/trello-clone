from django.shortcuts import get_object_or_404

from rest_framework import permissions

from posts.models import Post
from todos.models import List

class UserPermission(permissions.BasePermission):
    """
    Custom permission to only allow
     owner of an object to create it
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj == request.user