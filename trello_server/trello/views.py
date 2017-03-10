from rest_framework import generics

from trello.models import Text
from trello._serializers.serializers import TextSerializer

class TextView(generics.ListCreateAPIView):
	queryset = Text.objects.all()
	serializer_class = TextSerializer