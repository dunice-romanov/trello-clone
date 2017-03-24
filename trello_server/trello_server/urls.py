from django.conf.urls import url, include
from django.conf.urls.static import static
from django.conf import settings
from django.contrib import admin

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^api-boards/', include('boards.urls')),
    url(r'^api-auth/', include('register.urls')),
    url(r'^api-lists/', include('todos.urls')),
    url(r'^api-posts/', include('posts.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
