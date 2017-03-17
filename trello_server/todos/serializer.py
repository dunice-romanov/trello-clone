from django.contrib.auth.models import User

from rest_framework import serializers

from todos.models import List

from posts.models import Post
from posts.serializers import PostSerializer


class ListSerializer(serializers.ModelSerializer):
    
    posts = PostSerializer(many=True, read_only=True)
    owner = serializers.ReadOnlyField(source="board.owner.username")

    class Meta:
        model = List
        fields = ('id', 'title', 'board', 'created', 'posts', 'owner',)
