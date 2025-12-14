from rest_framework import serializers
from .promo_models import PromoCode, ReferralLevelProgress, PromoCodeUsage

class PromoCodeSerializer(serializers.ModelSerializer):
    discount_display = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    level_name = serializers.SerializerMethodField()
    
    class Meta:
        model = PromoCode
        fields = ['id', 'code', 'level', 'level_name', 'discount_type', 'discount_value', 
                 'discount_display', 'minimum_order_amount', 'maximum_discount', 
                 'is_used', 'used_at', 'status', 'valid_from', 'valid_until', 'created_at']
    
    def get_discount_display(self, obj):
        if obj.discount_type == 'percentage':
            return f"{obj.discount_value}% off"
        else:
            return f"₹{obj.discount_value} off"
    
    def get_status(self, obj):
        if obj.is_used:
            return "used"
        elif not obj.is_active:
            return "inactive"
        else:
            return "available"
    
    def get_level_name(self, obj):
        level_names = {
            1: "Level 1 (5 referrals)",
            2: "Level 2 (15 referrals)", 
            3: "Level 3 (25 referrals)",
            4: "Level 4 (35 referrals)",
            5: "Level 5 (60 referrals)",
        }
        return level_names.get(obj.level, f"Level {obj.level}")

class ReferralLevelProgressSerializer(serializers.ModelSerializer):
    next_level_threshold = serializers.SerializerMethodField()
    next_level_discount = serializers.SerializerMethodField()
    progress_percentage = serializers.SerializerMethodField()
    
    class Meta:
        model = ReferralLevelProgress
        fields = ['current_referrals', 'current_level', 'next_level_threshold', 
                 'next_level_discount', 'progress_percentage']
    
    def get_next_level_threshold(self, obj):
        thresholds = [5, 15, 25, 35, 60]
        for threshold in thresholds:
            if obj.current_referrals < threshold:
                return threshold
        return None  # Max level reached
    
    def get_next_level_discount(self, obj):
        discounts = {5: 5, 15: 13, 25: 20, 35: 22, 60: 25}
        next_threshold = self.get_next_level_threshold(obj)
        return discounts.get(next_threshold)
    
    def get_progress_percentage(self, obj):
        next_threshold = self.get_next_level_threshold(obj)
        if not next_threshold:
            return 100  # Max level reached
        
        # Find previous threshold
        thresholds = [0, 5, 15, 25, 35, 60]
        prev_threshold = 0
        for i, threshold in enumerate(thresholds):
            if threshold >= next_threshold:
                prev_threshold = thresholds[i-1] if i > 0 else 0
                break
        
        if next_threshold == prev_threshold:
            return 100
        
        progress = ((obj.current_referrals - prev_threshold) / (next_threshold - prev_threshold)) * 100
        return min(100, max(0, progress))

class ApplyPromoCodeSerializer(serializers.Serializer):
    promo_code = serializers.CharField(max_length=20)
    order_amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    
    def validate_promo_code(self, value):
        try:
            promo_code = PromoCode.objects.get(code=value.upper(), is_active=True)
            if promo_code.is_used:
                raise serializers.ValidationError("This promo code has already been used.")
            return value.upper()
        except PromoCode.DoesNotExist:
            raise serializers.ValidationError("Invalid promo code.")
    
    def validate(self, data):
        promo_code = PromoCode.objects.get(code=data['promo_code'], is_active=True)
        order_amount = data['order_amount']
        
        # Check minimum order amount
        if order_amount < promo_code.minimum_order_amount:
            raise serializers.ValidationError(
                f"Minimum order amount for this promo code is ₹{promo_code.minimum_order_amount}"
            )
        
        # Check if user owns this promo code
        user = self.context['request'].user
        if promo_code.user != user:
            raise serializers.ValidationError("This promo code does not belong to you.")
        
        return data
