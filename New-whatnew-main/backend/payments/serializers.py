from rest_framework import serializers
from django.db import models
from .models import (
    Payment, CreditPurchase, SellerEarnings, WithdrawalRequest, 
    Wallet, WalletTransaction, SellerBankDetails, AdminWallet, AdminWalletHistory
)

class PaymentSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Payment
        fields = ['id', 'user', 'user_name', 'order', 'amount', 'currency', 'payment_method', 
                 'status', 'razorpay_order_id', 'razorpay_payment_id', 'created_at', 
                 'completed_at', 'failure_reason', 'notes']
        read_only_fields = ['id', 'user', 'created_at', 'completed_at']

class CreateRazorpayOrderSerializer(serializers.Serializer):
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    order_id = serializers.UUIDField(required=False)
    purpose = serializers.ChoiceField(choices=['order_payment', 'credit_purchase'], default='order_payment')

class VerifyPaymentSerializer(serializers.Serializer):
    razorpay_order_id = serializers.CharField()
    razorpay_payment_id = serializers.CharField()
    razorpay_signature = serializers.CharField()

class CreditPurchaseSerializer(serializers.ModelSerializer):
    seller_name = serializers.CharField(source='seller.username', read_only=True)
    payment_data = PaymentSerializer(source='payment', read_only=True)
    
    class Meta:
        model = CreditPurchase
        fields = ['id', 'seller', 'seller_name', 'payment', 'payment_data', 'credits_purchased', 
                 'price_per_credit', 'total_amount', 'status', 'created_at']
        read_only_fields = ['id', 'seller', 'status', 'created_at']

class PurchaseCreditsSerializer(serializers.Serializer):
    credits = serializers.IntegerField(min_value=1)
    amount = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    
    def validate_credits(self, value):
        # Set minimum credit purchase
        if value < 5:
            raise serializers.ValidationError("Minimum 5 credits required for purchase")
        return value

class SellerEarningsSerializer(serializers.ModelSerializer):
    order_item_data = serializers.SerializerMethodField()
    
    class Meta:
        model = SellerEarnings
        fields = ['id', 'order_item', 'order_item_data', 'gross_amount', 'platform_fee', 
                 'net_amount', 'is_withdrawn', 'created_at']
    
    def get_order_item_data(self, obj):
        return {
            'order_number': obj.order_item.order.order_number,
            'product_name': obj.order_item.product_name,
            'quantity': obj.order_item.quantity,
        }

class WithdrawalRequestSerializer(serializers.ModelSerializer):
    seller_name = serializers.CharField(source='seller.username', read_only=True)
    
    class Meta:
        model = WithdrawalRequest
        fields = ['id', 'seller', 'seller_name', 'amount', 'bank_details', 'status', 
                 'requested_at', 'processed_at', 'notes']
        read_only_fields = ['id', 'seller', 'status', 'requested_at', 'processed_at']

class CreateWithdrawalRequestSerializer(serializers.Serializer):
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    bank_account_number = serializers.CharField(max_length=20)
    confirm_account_number = serializers.CharField(max_length=20)
    bank_ifsc_code = serializers.CharField(max_length=15)
    confirm_ifsc_code = serializers.CharField(max_length=15)
    bank_name = serializers.CharField(max_length=100)
    account_holder_name = serializers.CharField(max_length=100)
    mobile_number = serializers.CharField(max_length=15)
    
    def validate_amount(self, value):
        user = self.context['request'].user
        # Get available earnings
        available_earnings = SellerEarnings.objects.filter(
            seller=user, 
            is_withdrawn=False
        ).aggregate(total=models.Sum('net_amount'))['total'] or 0
        
        if value > available_earnings:
            raise serializers.ValidationError("Insufficient earnings for withdrawal")
        
        # Minimum withdrawal amount updated to ₹10,000
        if value < 10000:
            raise serializers.ValidationError("Minimum withdrawal amount is ₹10,000")
        
        return value
    
    def validate(self, data):
        # Convert IFSC codes to uppercase
        data['bank_ifsc_code'] = data['bank_ifsc_code'].upper()
        data['confirm_ifsc_code'] = data['confirm_ifsc_code'].upper()
        
        # Validate account number confirmation
        if data['bank_account_number'] != data['confirm_account_number']:
            raise serializers.ValidationError("Account numbers do not match")
        
        # Validate IFSC code confirmation
        if data['bank_ifsc_code'] != data['confirm_ifsc_code']:
            raise serializers.ValidationError("IFSC codes do not match")
        
        # Just ensure IFSC is not empty and has reasonable length
        ifsc = data['bank_ifsc_code']
        if not ifsc or len(ifsc) < 8 or len(ifsc) > 15:
            raise serializers.ValidationError("IFSC code must be between 8-15 characters")
        
        # Validate mobile number (basic validation)
        mobile = data['mobile_number']
        if not mobile.isdigit() or len(mobile) != 10:
            raise serializers.ValidationError("Mobile number must be 10 digits")
        
        return data

class UpdateBankDetailsSerializer(serializers.Serializer):
    bank_account_number = serializers.CharField(max_length=20)
    confirm_account_number = serializers.CharField(max_length=20)
    bank_ifsc_code = serializers.CharField(max_length=15)
    confirm_ifsc_code = serializers.CharField(max_length=15)
    bank_name = serializers.CharField(max_length=100)
    account_holder_name = serializers.CharField(max_length=100)
    mobile_number = serializers.CharField(max_length=15)
    
    def validate(self, data):
        # Convert IFSC codes to uppercase
        data['bank_ifsc_code'] = data['bank_ifsc_code'].upper()
        data['confirm_ifsc_code'] = data['confirm_ifsc_code'].upper()
        
        # Validate account number confirmation
        if data['bank_account_number'] != data['confirm_account_number']:
            raise serializers.ValidationError("Account numbers do not match")
        
        # Validate IFSC code confirmation
        if data['bank_ifsc_code'] != data['confirm_ifsc_code']:
            raise serializers.ValidationError("IFSC codes do not match")
        
        # Just ensure IFSC is not empty and has reasonable length
        ifsc = data['bank_ifsc_code']
        if not ifsc or len(ifsc) < 8 or len(ifsc) > 15:
            raise serializers.ValidationError("IFSC code must be between 8-15 characters")
        
        # Validate mobile number (basic validation)
        mobile = data['mobile_number']
        if not mobile.isdigit() or len(mobile) != 10:
            raise serializers.ValidationError("Mobile number must be 10 digits")
        
        return data

class SellerPaymentStatsSerializer(serializers.Serializer):
    total_earnings = serializers.DecimalField(max_digits=10, decimal_places=2, default=0)
    available_balance = serializers.DecimalField(max_digits=10, decimal_places=2, default=0)
    pending_withdrawals = serializers.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_withdrawals = serializers.DecimalField(max_digits=10, decimal_places=2, default=0)
    this_month_earnings = serializers.DecimalField(max_digits=10, decimal_places=2, default=0)

class WalletSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Wallet
        fields = ['id', 'user', 'user_name', 'balance', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

class WalletTransactionSerializer(serializers.ModelSerializer):
    order_number = serializers.CharField(source='order.order_number', read_only=True)
    credit_purchase_id = serializers.CharField(source='credit_purchase.id', read_only=True)
    
    class Meta:
        model = WalletTransaction
        fields = ['id', 'transaction_type', 'category', 'amount', 'description', 
                 'order_number', 'credit_purchase_id', 'reference_id', 'metadata', 'created_at']
        read_only_fields = ['id', 'created_at']

class SellerBankDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SellerBankDetails
        fields = ['id', 'account_holder_name', 'bank_name', 'account_number', 'ifsc_code', 'mobile_number', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class AdminWalletSerializer(serializers.ModelSerializer):
    total_revenue = serializers.SerializerMethodField()
    
    class Meta:
        model = AdminWallet
        fields = ['balance', 'total_platform_fees', 'total_shipping_fees', 'total_tax_amount', 
                 'total_credit_revenue', 'total_orders_processed', 'total_credits_sold',
                 'total_revenue', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
    
    def get_total_revenue(self, obj):
        return obj.total_platform_fees + obj.total_shipping_fees + obj.total_tax_amount + obj.total_credit_revenue

class AdminWalletHistorySerializer(serializers.ModelSerializer):
    order_number = serializers.CharField(source='order.order_number', read_only=True)
    credit_purchase_id = serializers.CharField(source='credit_purchase.id', read_only=True)
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)
    
    class Meta:
        model = AdminWalletHistory
        fields = ['id', 'transaction_type', 'amount', 'description', 'order_number', 
                 'credit_purchase_id', 'reference_id', 'metadata', 'created_at', 'created_by_name']
        read_only_fields = ['id', 'created_at']

class AdminDashboardStatsSerializer(serializers.Serializer):
    """Admin dashboard statistics"""
    total_revenue = serializers.DecimalField(max_digits=15, decimal_places=2, default=0)
    platform_fees = serializers.DecimalField(max_digits=15, decimal_places=2, default=0)
    shipping_fees = serializers.DecimalField(max_digits=15, decimal_places=2, default=0)
    tax_amount = serializers.DecimalField(max_digits=15, decimal_places=2, default=0)
    credit_revenue = serializers.DecimalField(max_digits=15, decimal_places=2, default=0)
    total_orders = serializers.IntegerField(default=0)
    total_credits_sold = serializers.IntegerField(default=0)
    
    # Monthly stats
    this_month_revenue = serializers.DecimalField(max_digits=15, decimal_places=2, default=0)
    this_month_orders = serializers.IntegerField(default=0)
    this_month_credits = serializers.IntegerField(default=0)
    
    # Daily stats  
    today_revenue = serializers.DecimalField(max_digits=15, decimal_places=2, default=0)
    today_orders = serializers.IntegerField(default=0)
    today_credits = serializers.IntegerField(default=0)
