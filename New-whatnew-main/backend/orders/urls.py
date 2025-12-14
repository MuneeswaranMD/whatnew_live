from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'orders', views.OrderViewSet, basename='orders')

urlpatterns = [
    # Cart endpoints
    path('cart/', views.CartView.as_view(), name='cart'),
    path('cart/add/', views.AddToCartView.as_view(), name='add-to-cart'),
    path('cart/remove/', views.RemoveFromCartView.as_view(), name='remove-from-cart'),
    path('cart/clear/', views.ClearCartView.as_view(), name='clear-cart'),
    
    # Order endpoints
    path('orders/create/', views.CreateOrderView.as_view(), name='create-order'),
    path('orders/<uuid:pk>/cancel/', views.CancelOrderView.as_view(), name='cancel-order'),
    path('orders/<uuid:pk>/track/', views.OrderTrackingView.as_view(), name='order-tracking'),
    
    # Seller order management
    path('seller/orders/', views.SellerOrdersView.as_view(), name='seller-orders'),
    path('seller/orders/<uuid:pk>/update-status/', views.UpdateOrderStatusView.as_view(), name='update-order-status'),
    
    # Router URLs
    path('', include(router.urls)),
]
