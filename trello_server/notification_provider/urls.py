from django.conf.urls import url, include

from notification_provider import views

urlpatterns = [
	url(r'^messages/$', views.index, name='index'),
]
