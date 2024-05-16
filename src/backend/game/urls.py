from django.urls import path
from game.views import *

urlpatterns = [
	path('', home),  # Página de inicio
	path('game/<int:id>/<str:name>/', game),  # Página del juego
]
