from django.db import models
from django.contrib.auth.models import User

from todos.models import List

# Create your models here.
class Post(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    text = models.TextField()
    board = models.ForeignKey(List, related_name='posts', on_delete=models.CASCADE)

    class Meta:
        ordering = ('created',)


class Commentary(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    text = models.TextField()
    username = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    post = models.ForeignKey(Post, related_name='commentary', on_delete=models.CASCADE)

    class Meta:
        ordering = ('created',)