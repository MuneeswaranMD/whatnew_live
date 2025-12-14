from urllib.parse import parse_qs
from channels.middleware import BaseMiddleware

class TokenAuthMiddleware(BaseMiddleware):
    """
    Custom middleware that takes a token from the query string and authenticates the user.
    """

    def __init__(self, inner):
        super().__init__(inner)

    async def __call__(self, scope, receive, send):
        # Import Django modules only when needed
        from django.contrib.auth.models import AnonymousUser
        from django.db import close_old_connections
        
        # Close old database connections to prevent usage of timed out connections
        close_old_connections()

        # Get the token from query string
        query_string = scope.get('query_string', b'').decode()
        query_params = parse_qs(query_string)
        token = query_params.get('token', [None])[0]

        # Try to authenticate user
        scope['user'] = AnonymousUser()
        
        if token:
            try:
                token_obj = await self.get_token(token)
                if token_obj:
                    scope['user'] = token_obj.user
            except:
                pass

        return await super().__call__(scope, receive, send)

    @staticmethod
    async def get_token(token_key):
        """Get token from database"""
        try:
            from django.db import connection
            from asgiref.sync import sync_to_async
            from rest_framework.authtoken.models import Token
            
            @sync_to_async
            def _get_token():
                try:
                    return Token.objects.select_related('user').get(key=token_key)
                except Token.DoesNotExist:
                    return None
            
            return await _get_token()
        except:
            return None


def TokenAuthMiddlewareStack(inner):
    """
    Middleware stack that includes token authentication.
    """
    return TokenAuthMiddleware(inner)
