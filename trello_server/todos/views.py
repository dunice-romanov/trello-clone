from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, permissions, status

from todos.serializer import ListSerializer
from todos.models import List
from todos.permissions.isWriteble import IsWritebleOrReadOnly
from todos.permissions.isReadable import IsReadableOr404

class ListObject(generics.ListAPIView):
    """
    Serialize Board's List by GET{'id': id}
    """
    serializer_class = ListSerializer
    permission_classes = (permissions.IsAuthenticated, IsReadableOr404, )
    
    def get_queryset(self):
        board_id = self.request.GET.get('id')
        return List.objects.filter(board=board_id)


# class ListObject(generics.ListAPIView):
#     serializer_class = ListSerializer;
#     queryset = List.objects.all()


class ListObjectCreate(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticated, IsWritebleOrReadOnly)
    queryset = List.objects.all()
    serializer_class = ListSerializer

class ListRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = List.objects.all()
    serializer_class = ListSerializer