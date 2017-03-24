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


class ProfileSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Profile
        fields = ('bio', )


class UserSerializerFull(serializers.ModelSerializer):
    
    bio = serializers.CharField(source='profile.bio')

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'bio')


class UserSerializerForUpdates(serializers.ModelSerializer):
    
    bio = serializers.CharField()

    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'email', 'first_name', 'last_name', 'bio')

    def update(self, instance, validated_data):
        instance.username = validated_data.get('username', instance.username)
        instance.password = validated_data.get('password', instance.password)
        instance.email = validated_data.get('email', instance.email)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.profile.bio = validated_data.get('bio', instance.profile.bio)
        instance.save()
        return instance



