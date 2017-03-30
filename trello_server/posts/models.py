from django.db import models
from django.contrib.auth.models import User

from todos.models import List


class Post(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    text = models.TextField(default='', null=True, blank=True)
    title = models.CharField(max_length=100)
    cardlist = models.ForeignKey(List, related_name='posts', on_delete=models.CASCADE)
    position = models.IntegerField(default=0)

    class Meta:
        ordering = ('position',)


class Commentary(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    text = models.TextField()
    username = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    post = models.ForeignKey(Post, related_name='commentary', on_delete=models.CASCADE)

    class Meta:
        ordering = ('created',)


class Notification(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    username = models.OneToOneField('auth.User', on_delete=models.CASCADE)
    commentary = models.OneToOneField(Commentary, on_delete=models.CASCADE)

    class Meta:
        ordering = ('created',)
