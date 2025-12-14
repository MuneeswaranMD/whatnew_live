from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'livestreams', views.LiveStreamViewSet, basename='livestreams')
router.register(r'biddings', views.ProductBiddingViewSet, basename='biddings')

urlpatterns = [
    # Livestream specific endpoints
    path('livestreams/<uuid:pk>/start/', views.StartLiveStreamView.as_view(), name='start-livestream'),
    path('livestreams/<uuid:pk>/end/', views.EndLiveStreamView.as_view(), name='end-livestream'),
    path('livestreams/<uuid:pk>/join/', views.JoinLiveStreamView.as_view(), name='join-livestream'),
    path('livestreams/<uuid:pk>/leave/', views.LeaveLiveStreamView.as_view(), name='leave-livestream'),
    path('livestreams/<uuid:pk>/agora-token/', views.AgoraTokenView.as_view(), name='agora-token'),
    
    # Bidding specific endpoints
    path('biddings/<uuid:pk>/place-bid/', views.PlaceBidView.as_view(), name='place-bid'),
    path('biddings/<uuid:pk>/end/', views.EndBiddingView.as_view(), name='end-bidding'),
    
    # Credit monitor status
    path('credit-monitor/status/', views.CreditMonitorStatusView.as_view(), name='credit-monitor-status'),
    
    # Router URLs
    path('', include(router.urls)),
]
