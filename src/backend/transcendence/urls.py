from django.contrib import admin
from django.urls import path, include
from users.api import app as users_app
from users.views import avatar
from auth.api import app as auth_app

urlpatterns = [
    path('admin/', admin.site.urls),
    path("", include("game.urls")),
    path("api/users/", users_app.urls),
	path("api/auth/", auth_app.urls)
]
