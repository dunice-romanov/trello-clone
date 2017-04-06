from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User

from rest_framework import generics, permissions, status
from boards.models import BoardPermission
from channels import Group

from .models import Post, Commentary, Notification
from .serializers import PostSerializer, PostObjectSerializer, CommentarySerializer, NotificationSerializer
from .permissions.isWriteble import IsWritebleOrReadOnly, IsWritebleOrReadOnlyRetrieve  


class PostView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsWritebleOrReadOnlyRetrieve,)

    serializer_class = PostObjectSerializer
    queryset = Post.objects.all()

    def change_position_in_one_list(self, position):
        old_position = self.get_object().position
        new_position = int(position)

        cardlist_pk = self.get_object().cardlist

        if new_position > old_position:
            cardlist = Post.objects.filter(cardlist=cardlist_pk,\
                                position__gte=old_position, \
                                position__lte=new_position)
            for card in cardlist:
                card.position = card.position - 1
                card.save()
        elif new_position < old_position:
            cardlist = Post.objects.filter(cardlist=cardlist_pk,\
                                position__lte=old_position, \
                                position__gte=new_position)
            for card in cardlist:
                card.position = card.position + 1
                card.save()
    
    def get_maximum_position(self, cardlist):
        position = 1
        posts = Post.objects.filter(cardlist=cardlist)
        for post in posts:
            if position < post.position:
                position = post.position
        return position

    def add_to_another_list(self, cardlist_from, cardlist_to, new_position):
        max_position = self.get_maximum_position(cardlist_to) + 1
        if (new_position > max_position):
            new_position = max_position
            self.request.data['position'] = max_position
        else:
            print('recalc higer positions')
            posts = Post.objects.filter(cardlist=cardlist_to, position__gte=new_position)
            print(posts)
            for post in posts:
                post.position += 1
                post.save()

    def recalc_old_cardlist(self, old_cardlist, drop_position):
        posts = Post.objects.filter(cardlist=old_cardlist, position__gt=drop_position)
        print(posts)
        for post in posts:
            print(post.pk)
            post.position -= 1
            post.save()

    def change_positions(self, cardlist, position):
        posts = Post.objects.filter(position__gte=position, cardlist=cardlist)

        old_cardlist = self.get_object().cardlist
        old_position = self.get_object().position

        if old_cardlist.pk == cardlist:
            self.change_position_in_one_list(position)
        else:
            self.add_to_another_list(old_cardlist, cardlist, position)
            self.recalc_old_cardlist(old_cardlist, old_position)
        
    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        print(self)
        if 'position' in request.data and 'cardlist' in request.data:
            cardlist = request.data['cardlist']
            position = request.data['position']
            self.change_positions(int(cardlist), int(position))
        return self.update(request, *args, **kwargs)


class CreatePost(generics.CreateAPIView):
    
    permission_classes = (IsWritebleOrReadOnly,)
    serializer_class = PostObjectSerializer
    queryset = Post.objects.all()
        
    def find_higher_position(self, queryset):
        position = 0
        for query in queryset:
            if query.position > position:
                position = query.position
        return position

    def perform_create(self, serializer):
        cardlist_id = self.request.data['cardlist']
        posts = Post.objects.filter(cardlist=cardlist_id)
        higher_position = self.find_higher_position(posts)
        new_position = higher_position + 1
        serializer.save(position=new_position)


class CommentaryPost(generics.CreateAPIView):
    serializer_class = CommentarySerializer

    def get_queryset(self):
        user = self.request.user
        return Board.objects.filter(owner=user)    

    def perform_create(self, serializer):
        commentary = serializer.save(username=self.request.user)
        print(commentary)
        if 'usernames' in self.request.data:
            usernames = self.parse_usernames(self.request.data['usernames'])
            self.create_notifications(usernames, commentary)

    def parse_usernames(self, usernames):
        result_ = usernames.split(',')
        result_ = self.trim_usernames(result_)
        return self.make_unique(result_)

    def make_unique(self, usernames):
        result = list(set(usernames))
        return result

    def trim_usernames(self, usernames):
        result = []
        for username in usernames:
            result.append(username.strip())
        return result

    def create_notification(self, username, commentary):
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return;
        Notification.objects.create(username=user, commentary=commentary)

    def create_notifications(self, usernames, commentary):
        for username in usernames:
            self.create_notification(username, commentary)


class NotificationList(generics.ListAPIView):

    serializer_class = NotificationSerializer

    def get_queryset(self):
        print('in list')
        return Notification.objects.filter(username=self.request.user)


class NotificationObject(generics.DestroyAPIView):
    
    serializer_class = NotificationSerializer

    def get_queryset(self):
        return Notification.objects.filter(username=self.request.user)

