from django.contrib.auth.models import User

from django.db import models

class Board(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=100)
    owner = models.ForeignKey('auth.User', on_delete=models.CASCADE)

    class Meta:
        ordering = ('created',)

class BoardPermission(models.Model):
    board = models.ForeignKey('Board')
    writeble = models.BooleanField(default=False)
    user = models.ForeignKey('auth.User')

    class Meta:
        ordering = ('id',)