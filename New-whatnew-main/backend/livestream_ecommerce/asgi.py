"""
ASGI config for livestream_ecommerce project.
"""

import os
import django

# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'livestream_ecommerce.settings')

# Setup Django
django.setup()

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from .middleware import TokenAuthMiddlewareStack
import livestreams.routing
import chat.routing

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AllowedHostsOriginValidator(
        TokenAuthMiddlewareStack(
            URLRouter([
                *livestreams.routing.websocket_urlpatterns,
                *chat.routing.websocket_urlpatterns,
            ])
        )
    ),
})
