from django.conf.urls import url, include
from django.views.generic import RedirectView

from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework_jwt.views import obtain_jwt_token
from rest_framework_jwt.views import refresh_jwt_token
from rest_framework_jwt.views import verify_jwt_token
from register import views

urlpatterns = [
    url(r'^$', views.UserObjectUpdate.as_view()),
    url(r'^users/(?P<pk>[0-9]+)$', views.UserObjectRetrieve.as_view()),
	url(r'^signup/$', views.UserCreate.as_view()),
    url(r'^signin/', obtain_jwt_token),
    url(r'^refresh/', refresh_jwt_token),
    url(r'^verify/', verify_jwt_token),
]

urlpatterns = format_suffix_patterns(urlpatterns)