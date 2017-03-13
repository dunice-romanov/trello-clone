from django.contrib.auth.models import User

from rest_framework import serializers

from boards.models import Board, BoardPermission

class UserSerializer(serializers.ModelSerializer):
    boards = serializers.PrimaryKeyRelatedField(many=True,
                                                queryset=Board.objects.all())

    class Meta:
        model = User
        fields = ('id', 'username', 'boards')


class BoardSerializer(serializers.ModelSerializer):
    #owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Board
        fields = ('id', 'title', 'owner')


class BoardPermissionSerializer(serializers.ModelSerializer):

    class Meta:
        model = BoardPermission
        fields = ('user', 'writeble', 'board')