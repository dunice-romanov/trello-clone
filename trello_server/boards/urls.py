from django.conf.urls import url, include

from boards import views

urlpatterns = [
	url(r'^$', views.BoardList.as_view()),
	url(r'^create/$', views.BoardCreate.as_view()),
	url(r'^(?P<pk>[0-9]+)$', views.BoardItem.as_view()),
	url(r'^get-sharing-list', views.BoardSharesList.as_view()),
	url(r'^add-permission', views.BoardPermissionCreate.as_view()),
	url(r'^permission/(?P<pk>[0-9]+)$', views.BoardPermissionOne.as_view()),
]
