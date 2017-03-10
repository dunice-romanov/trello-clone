from django.contrib.auth.models import User

from rest_framework import generics, permissions

from boards.permissions.is_owner import IsOwner
from boards.models import Board
from boards.serializers import UserSerializer, BoardSerializer

class UserList(generics.ListCreateAPIView):
	queryset = User.objects.all()
	serializer_class = UserSerializer

class BoardsList(generics.ListCreateAPIView):
	permission_classes = (permissions.IsAuthenticated,)
	serializer_class = BoardSerializer

	def get_queryset(self):
		user = self.request.user
		return Board.objects.filter(owner=user)


class BoardItem(generics.RetrieveUpdateDestroyAPIView):
	permission_classes = (permissions.IsAuthenticated,)

	queryset = Board.objects.all()
	serializer_class = BoardSerializer

	def perform_create(self, serializer):
		serializer.save(owner=self.request.user)