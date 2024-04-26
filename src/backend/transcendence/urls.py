from django.contrib import admin
from django.urls import path, include
from users.api import app as users_app
from users.views import avatar

urlpatterns = [
    path('admin/', admin.site.urls),
    path("", include("game.urls")),
    path("api/users/", users_app.urls),
    path("avatar", avatar)
]
