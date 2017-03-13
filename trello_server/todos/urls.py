from django.conf.urls import url, include

from todos import views

urlpatterns = [
	url(r'^lists/$', views.ListObject.as_view()),
]
