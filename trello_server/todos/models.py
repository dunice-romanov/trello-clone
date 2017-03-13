from django.db import models

from boards.models import Board


class List(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=100)
    board = models.ForeignKey(Board, on_delete=models.CASCADE)

    class Meta:
        ordering = ('created',)