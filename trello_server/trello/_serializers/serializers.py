from rest_framework import serializers

from trello.models import Text

class TextSerializer(serializers.ModelSerializer):
	class Meta:
		model = Text
		fields = ['id', 'title', 'created']