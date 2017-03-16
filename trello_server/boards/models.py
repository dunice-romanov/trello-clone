from django.contrib.auth.models import User

from django.db import models

class AccessLevel: 
    """
    Permission access levels
    """
    ACCESS_LEVEL_OWNER = 'owner'
    ACCESS_LEVEL_READONLY = 'read'
    ACCESS_LEVEL_WRITEBLE = 'write'

class Board(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=100)
    owner = models.ForeignKey('auth.User', on_delete=models.CASCADE)

    class Meta:
        ordering = ('created',)

class BoardPermission(models.Model):
    """
    access_levels: read, write, owner
    """
    board = models.ForeignKey('Board')
    access_level = models.CharField(max_length=10, default='read')
    user = models.ForeignKey('auth.User')

    class Meta:
        ordering = ('id',)
        unique_together = ('board', 'user',)