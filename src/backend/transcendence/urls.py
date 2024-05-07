from django.contrib import admin
from django.urls import path, include
from api.api import app as api_app

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/", api_app.urls),
]
