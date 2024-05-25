from django.urls import include, path
from api.api import app as api_app
from django.contrib import admin

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/", api_app.urls),
	#path('', include('game.urls')),
]