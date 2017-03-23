from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, permissions, status

from boards.models import Board
from todos.serializer import ListSerializer
from todos.models import List
from todos.permissions.isWriteble import IsWritebleOrReadOnly, IsWritebleToUpdate
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


class ListObjectCreate(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticated, IsWritebleOrReadOnly)
    queryset = List.objects.all()
    serializer_class = ListSerializer

    def find_higher_position(self, queryset):
        position = 0
        for query in queryset:
            if query.position > position:
                position = query.position
        return position

    def perform_create(self, serializer):
        board_id = self.request.data['board']
        lists = List.objects.filter(board=board_id)
        higher_position = self.find_higher_position(lists)
        new_position = higher_position + 1
        serializer.save(position=new_position)

        

class ListRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = List.objects.all()
    serializer_class = ListSerializer

    permission_classes = (permissions.IsAuthenticated, IsWritebleToUpdate,)

    def partial_update(self, request, *args, **kwargs):
        print('gfgffdffdfddgf')
        kwargs['partial'] = True
        if 'position' in request.data:
            print('in if')
            position = request.data['position']
            self.change_positions(self.get_object().board_id, int(position))
        return self.update(request, *args, **kwargs)

    def change_position_in_one_board(self, position):
        old_position = self.get_object().position
        new_position = int(position)

        board_pk = self.get_object().board

        if new_position > old_position:
            lists = List.objects.filter(board=board_pk,\
                                position__gte=old_position, \
                                position__lte=new_position)
            for li in lists:
                li.position = li.position - 1
                li.save()
        elif new_position < old_position:
            lists = List.objects.filter(board=board_pk,\
                                position__lte=old_position, \
                                position__gte=new_position)
            for li in lists:
                li.position = li.position + 1
                li.save()

    def change_positions(self, board_id, position):
        lists = List.objects.filter(position__gte=position, board=board_id)
        self.change_position_in_one_board(position)