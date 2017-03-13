from django.conf.urls import url, include

from boards import views

urlpatterns = [
	url(r'^boards/$', views.BoardsList.as_view()),
	url(r'^get-boards/(?P<pk>[0-9]+)$', views.BoardItem.as_view()),
	url(r'^get-shares/$', views.BoardPermissionList.as_view()),
	url(r'^get-shares/(?P<pk>[0-9]+)$', views.BoardPermissionDelete.as_view())
]
