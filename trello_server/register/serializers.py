from django.contrib.auth.models import User

from rest_framework import serializers

from register.models import Profile

class UserSerializer(serializers.ModelSerializer):

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


    class Meta:
        model = User
        fields = ('username', 'password', 'email')


class UserSerializerFull(serializers.ModelSerializer):
    
    bio = serializers.ReadOnlyField(source='profile.bio')

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'bio', )

class UserSerializerForUpdates(serializers.ModelSerializer):

    bio = serializers.ReadOnlyField(source='profile.bio')

    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'email', 'first_name', 'last_name', 'bio', )

class ProfileSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Profile
        fields = ('bio', )