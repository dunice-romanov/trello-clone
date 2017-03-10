from django.contrib.auth.models import User

from rest_framework import serializers

from boards.models import Board

class UserSerializer(serializers.ModelSerializer):
    boards = serializers.PrimaryKeyRelatedField(many=True,
                                                queryset=Board.objects.all())
    owner = serializers.ReadOnlyField(source='owner.username')
    
    class Meta:
        model = User
        fields = ('id', 'username', 'boards')

class BoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Board
        fields = ('id', 'title', 'owner')
