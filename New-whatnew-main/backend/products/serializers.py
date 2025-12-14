from rest_framework import serializers
from .models import Category, Product, ProductImage

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'image', 'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'is_primary', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def validate_image(self, value):
        if value:
            try:
                # Import PIL here to avoid import issues if not installed
                from PIL import Image
                
                # Open the image to get dimensions
                img = Image.open(value)
                width, height = img.size
                
                # Check for exact dimensions: 500x500
                if not (width == 500 and height == 500):
                    raise serializers.ValidationError(
                        f'Product image must be exactly 500×500px. '
                        f'Current dimensions: {width}×{height}px'
                    )
                
                # Check file size (optional - limit to 5MB)
                if value.size > 5 * 1024 * 1024:
                    raise serializers.ValidationError('Product image file size must be less than 5MB')
                    
            except Exception as e:
                if isinstance(e, serializers.ValidationError):
                    raise e
                raise serializers.ValidationError('Invalid image file or unable to process image')
        
        return value

class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    seller_name = serializers.CharField(source='seller.username', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    available_quantity = serializers.ReadOnlyField()
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'category', 'category_name', 'base_price', 
                 'quantity', 'available_quantity', 'status', 'seller', 'seller_name', 
                 'images', 'created_at', 'updated_at']
        read_only_fields = ['id', 'seller', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        validated_data['seller'] = self.context['request'].user
        return super().create(validated_data)

class ProductListSerializer(serializers.ModelSerializer):
    primary_image = serializers.SerializerMethodField()
    seller_name = serializers.CharField(source='seller.username', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    available_quantity = serializers.ReadOnlyField()
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'category_name', 'base_price', 'available_quantity', 
                 'status', 'seller_name', 'primary_image', 'created_at']
    
    def get_primary_image(self, obj):
        primary_image = obj.images.filter(is_primary=True).first()
        if primary_image:
            return ProductImageSerializer(primary_image).data
        return None

class ProductCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'category', 'base_price', 'quantity', 'status']
        read_only_fields = ['id']
    
    def create(self, validated_data):
        validated_data['seller'] = self.context['request'].user
        return super().create(validated_data)
