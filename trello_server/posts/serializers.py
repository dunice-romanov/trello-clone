from django.contrib.auth.models import User

from rest_framework import serializers

from posts.models import Post, Commentary

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ('id', 'text', 'board', 'created',)

class CommentarySerializer(serializers.ModelSerializer):

    class Meta:
        model = Commentary
        fields = ('id', 'text', 'user')