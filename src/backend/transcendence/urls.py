from django.contrib import admin
from django.urls import path, include
from api.api import app as api_app
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("api/", api_app.urls),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
