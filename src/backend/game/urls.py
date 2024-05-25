from django.urls import path
from game.views import *

urlpatterns = [
	path('game/<int:id>/<str:name>/', remote),
	path('game/<str:name>/', local),
	path('game/', game),
	path('', home),
]
