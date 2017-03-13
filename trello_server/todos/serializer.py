from django.contrib.auth.models import User

from rest_framework import serializers

from todos.models import List

from posts.models import Post

class ListSerializer(serializers.ModelSerializer):
    
    posts = serializers.PrimaryKeyRelatedField(many=True, queryset=Post.objects.all())

    class Meta:
        model = List
        fields = ('id', 'title', 'board', 'created', 'posts',)
