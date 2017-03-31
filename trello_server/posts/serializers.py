from django.contrib.auth.models import User

from rest_framework import serializers

from posts.models import Post, Commentary, Notification

class CommentarySerializer(serializers.ModelSerializer):

    username = serializers.ReadOnlyField(source='username.username')
    avatar_url = serializers.ReadOnlyField(source='username.profile.avatar.url')
    class Meta:
        model = Commentary
        fields = ('id', 'text', 'username', 'created', 'post', 'avatar_url',)


class PostSerializer(serializers.ModelSerializer):

    class Meta:
        model = Post
        fields = ('id', 'title', 'cardlist', 'created', 'position')


class PostObjectSerializer(serializers.ModelSerializer):
    commentary = CommentarySerializer(many=True, read_only=True)

    board = serializers.ReadOnlyField(source='cardlist.board.pk')

    class Meta:
        model = Post
        fields = ('id', 'position', 'text', 'title', 'board', 'cardlist', 'created', 'commentary',)



class NotificationSerializer(serializers.ModelSerializer):
    commentary = CommentarySerializer(read_only=True)
    username = serializers.ReadOnlyField(source='username.username')

    class Meta:
        model = Notification
        fields = ('id', 'username', 'commentary', 'created',)
    