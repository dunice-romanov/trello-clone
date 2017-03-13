from django.contrib.auth.models import User

from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):

    def create(self, validated_data):
        print('*********\nCREATEUSER\n***************')
        user = User.objects.create_user(**validated_data)
        return user


    class Meta:
        model = User
        fields = ('username', 'password', 'email')