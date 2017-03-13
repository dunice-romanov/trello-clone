from django.conf.urls import url, include

from posts import views

urlpatterns = [
	url(r'(?P<pk>[0-9]+)$', views.PostView.as_view()),
	url(r'^$', views.CommentaryPost.as_view()),
]