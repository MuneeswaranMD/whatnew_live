from rest_framework import viewsets, generics, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.exceptions import PermissionDenied, ValidationError
from django.db.models import Q
from .models import Category, Product, ProductImage
from .serializers import (
    CategorySerializer, ProductSerializer, ProductListSerializer,
    ProductCreateUpdateSerializer, ProductImageSerializer
)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            # Only staff can modify categories
            return [IsAuthenticated()]
        return [IsAuthenticatedOrReadOnly()]

class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        queryset = Product.objects.select_related('seller', 'category').prefetch_related('images')
        
        # Filter by seller if requested
        seller_id = self.request.query_params.get('seller', None)
        if seller_id:
            queryset = queryset.filter(seller_id=seller_id)
        
        # Filter by category
        category_id = self.request.query_params.get('category', None)
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        
        # Filter by status
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        else:
            # Default to showing only active products for public view
            if not self.request.user.is_authenticated or self.action == 'list':
                queryset = queryset.filter(status='active')
        
        # Search functionality
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | 
                Q(description__icontains=search) |
                Q(category__name__icontains=search)
            )
        
        return queryset.order_by('-created_at')
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ProductListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return ProductCreateUpdateSerializer
        return ProductSerializer
    
    def perform_create(self, serializer):
        # Only sellers can create products
        if self.request.user.user_type != 'seller':
            raise PermissionDenied("Only sellers can create products")
        
        seller_profile = getattr(self.request.user, 'seller_profile', None)
        if not seller_profile or not seller_profile.is_account_active:
            raise ValidationError("Seller account not verified")
        
        serializer.save(seller=self.request.user)
    
    def perform_update(self, serializer):
        # Only product owner can update
        if self.get_object().seller != self.request.user:
            raise PermissionDenied("You can only update your own products")
        serializer.save()
    
    def perform_destroy(self, serializer):
        # Only product owner can delete
        if self.get_object().seller != self.request.user:
            raise PermissionDenied("You can only delete your own products")
        serializer.delete()
    
    @action(detail=False, methods=['get'])
    def my_products(self, request):
        """Get products for the authenticated seller"""
        if request.user.user_type != 'seller':
            return Response({'error': 'Only sellers can access this endpoint'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        products = Product.objects.filter(seller=request.user).order_by('-created_at')
        serializer = ProductListSerializer(products, many=True)
        return Response(serializer.data)

class ProductImageListCreateView(generics.ListCreateAPIView):
    serializer_class = ProductImageSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        product_id = self.kwargs['pk']
        return ProductImage.objects.filter(product_id=product_id)
    
    def perform_create(self, serializer):
        product_id = self.kwargs['pk']
        try:
            product = Product.objects.get(id=product_id, seller=self.request.user)
        except Product.DoesNotExist:
            raise PermissionDenied("Product not found or you don't have permission")
        
        # Check if this should be primary image
        is_primary = serializer.validated_data.get('is_primary', False)
        if is_primary:
            # Make other images non-primary
            ProductImage.objects.filter(product=product).update(is_primary=False)
        elif not ProductImage.objects.filter(product=product).exists():
            # If this is the first image, make it primary
            serializer.validated_data['is_primary'] = True
        
        serializer.save(product=product)

class ProductImageDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProductImageSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return ProductImage.objects.select_related('product')
    
    def perform_update(self, serializer):
        image = self.get_object()
        if image.product.seller != self.request.user:
            raise PermissionDenied("You can only update your own product images")
        
        # Handle primary image logic
        if serializer.validated_data.get('is_primary', False):
            ProductImage.objects.filter(product=image.product).update(is_primary=False)
        
        serializer.save()
    
    def perform_destroy(self, serializer):
        image = self.get_object()
        if image.product.seller != self.request.user:
            raise PermissionDenied("You can only delete your own product images")
        serializer.delete()
