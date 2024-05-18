from django.urls import path
from game.views import *

urlpatterns = [
	path('game/<int:id>/<str:name>/', game),
	path('', home),
]
