from django.conf.urls import url, include

from boards import views

urlpatterns = [
    url(r'^get-users/', views.UserList.as_view()),
	url(r'^get-boards/$', views.BoardsList.as_view()),
	url(r'^get-boards/(?P<pk>[0-9]+)$', views.BoardItem.as_view())
]
