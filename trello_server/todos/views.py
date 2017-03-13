from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, permissions, status

from todos.serializer import ListSerializer
from todos.models import List

class ListObject(APIView):
    def get(self, request, format=None):

        board_id = request.GET.get('id')

        try:
            list_object = List.objects.get(pk=board_id)
        except List.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        print('********************', board_id, '*******************')

        # if board_id == None: 
        #   return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer = ListSerializer(list_object)

        return Response(serializer.data)
