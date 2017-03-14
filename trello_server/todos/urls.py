from django.conf.urls import url, include

from todos import views

urlpatterns = [
	url(r'^$', views.ListObject.as_view()),
	url(r'^$', views.ListObjectCreate.as_view()),	
	url(r'^(?P<pk>[0-9]+)$', views.ListRetrieveUpdateDestroy.as_view())
]
