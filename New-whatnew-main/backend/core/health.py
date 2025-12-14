from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from django.conf import settings
import datetime

@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """
    Simple health check endpoint to verify backend connectivity
    """
    return Response({
        'status': 'healthy',
        'message': 'WNOT Livestream Ecommerce Backend is running',
        'timestamp': datetime.datetime.now().isoformat(),
        'version': '1.0.0',
        'debug': settings.DEBUG,
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([AllowAny])
def api_info(request):
    """
    API information endpoint
    """
    return Response({
        'name': 'WNOT Livestream Ecommerce API',
        'version': '1.0.0',
        'endpoints': {
            'health': '/api/health/',
            'auth': {
                'login': '/api/auth/login/',
                'register': '/api/auth/register/',
                'refresh': '/api/auth/refresh/',
                'logout': '/api/auth/logout/',
            },
            'products': '/api/products/',
            'livestreams': '/api/livestreams/',
            'orders': '/api/orders/',
            'payments': '/api/payments/',
        },
        'timestamp': datetime.datetime.now().isoformat(),
    }, status=status.HTTP_200_OK)
