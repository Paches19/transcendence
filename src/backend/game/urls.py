from django.urls import path
from game.views import *

urlpatterns = [
	path('', index),  # Página de inicio
	path('game/<int:id>/<str:name>/', game),  # Página del juego
]
