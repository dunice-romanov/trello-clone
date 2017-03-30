from django.conf.urls import url, include

from posts import views

urlpatterns = [
	url(r'(?P<pk>[0-9]+)$', views.PostView.as_view()),
	url(r'^$', views.CreatePost.as_view()),
	url(r'^create-commentary/$', views.CommentaryPost.as_view()),
	url(r'^notify/$', views.NotificationView.as_view())
]