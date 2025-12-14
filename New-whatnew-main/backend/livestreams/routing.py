from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('ws/livestream/<uuid:livestream_id>/', consumers.LivestreamConsumer.as_asgi()),
]
