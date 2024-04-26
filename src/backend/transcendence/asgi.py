import os

from django.core.asgi import get_asgi_application 
from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import path
from game.consumers import *


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'transcendence.settings')

application = ProtocolTypeRouter({
		"http": get_asgi_application(),
		"websocket": URLRouter([
				#path("ws/game/<int:id>/", TicTacToeConsumer.as_asgi()),
				path("ws/game/<int:id>/", PongConsumer.as_asgi()),
			])
})