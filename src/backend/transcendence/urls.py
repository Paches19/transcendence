from django.urls import path
from api.api import app as api_app
from django.contrib import admin

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/", api_app.urls),
]