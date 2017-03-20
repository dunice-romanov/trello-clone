from django.contrib.auth.models import User

from rest_framework import serializers

from posts.models import Post, Commentary

class CommentarySerializer(serializers.ModelSerializer):

    username = serializers.ReadOnlyField(source='username.username')

    class Meta:
        model = Commentary
        fields = ('id', 'text', 'username', 'created', 'post')


class PostSerializer(serializers.ModelSerializer):

    class Meta:
        model = Post
        fields = ('id', 'title', 'cardlist', 'created', 'position')


class PostObjectSerializer(serializers.ModelSerializer):
    commentary = CommentarySerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields = ('id', 'position', 'text', 'title', 'cardlist', 'created', 'commentary',)