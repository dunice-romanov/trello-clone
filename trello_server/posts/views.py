from rest_framework import generics, permissions, status

from posts.models import Post, Commentary
from posts.serializers import PostObjectSerializer, CommentarySerializer

class PostView(generics.RetrieveAPIView):
    """
    Serialize Post with commentaries by GET{'id': post_id}
    """
    serializer_class = PostObjectSerializer
    queryset = Post.objects.all()

class CreatePost(generics.CreateAPIView):
    """
    Serialize Post with commentaries by GET{'id': post_id}
    """
    serializer_class = PostObjectSerializer
    queryset = Post.objects.all()

class CommentaryPost(generics.CreateAPIView):
    serializer_class = CommentarySerializer

    def get_queryset(self):
        user = self.request.user
        return Board.objects.filter(owner=user)    

    def perform_create(self, serializer):
        serializer.save(username=self.request.user)