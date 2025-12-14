from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet, basename='categories')
router.register(r'products', views.ProductViewSet, basename='products')

urlpatterns = [
    # Product specific endpoints
    path('products/<uuid:pk>/images/', views.ProductImageListCreateView.as_view(), name='product-images'),
    path('products/images/<int:pk>/', views.ProductImageDetailView.as_view(), name='product-image-detail'),
    
    # Router URLs
    path('', include(router.urls)),
]
