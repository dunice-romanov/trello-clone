from django.conf.urls import url, include

from todos import views

urlpatterns = [
	url(r'^$', views.ListObject.as_view()),
	url(r'^$', views.ListObjectAdd.as_view()),	
]
