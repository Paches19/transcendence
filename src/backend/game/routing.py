from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import path
from game.consumers import PongConsumer
from channels.auth import AuthMiddlewareStack

websocket_urlpatterns = [
    path('ws/game/', PongConsumer.as_asgi()),
]

application = ProtocolTypeRouter({
    'websocket': AuthMiddlewareStack(
        URLRouter(
            websocket_urlpatterns
        )
    ),
})