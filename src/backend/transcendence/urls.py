from django.contrib import admin
from django.urls import path, include
from users.api import app as users_app

urlpatterns = [
    path('admin/', admin.site.urls),
    path("", include("game.urls")),
    path("api/users/", users_app.urls),
]
