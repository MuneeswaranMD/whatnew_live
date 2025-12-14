from django.db import models
from django.conf import settings
from orders.models import Order
import uuid

class Payment(models.Model):
    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
        ('refunded', 'Refunded'),
    ]
    
    PAYMENT_METHOD_CHOICES = [
        ('razorpay', 'Razorpay'),
        ('wallet', 'Wallet'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='payments')
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='payments', null=True, blank=True)
    
    # Payment details
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='INR')
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    status = models.CharField(max_length=15, choices=PAYMENT_STATUS_CHOICES, default='pending')
    
    # Razorpay details
    razorpay_order_id = models.CharField(max_length=100, null=True, blank=True)
    razorpay_payment_id = models.CharField(max_length=100, null=True, blank=True)
    razorpay_signature = models.CharField(max_length=255, null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    # Additional details
    failure_reason = models.TextField(null=True, blank=True)
    notes = models.TextField(blank=True)
    
    def __str__(self):
        return f"Payment {str(self.id)[:8]} - ₹{self.amount} ({self.status})"

class CreditPurchase(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    seller = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='credit_purchases')
    payment = models.OneToOneField(Payment, on_delete=models.CASCADE, related_name='credit_purchase')
    credits_purchased = models.PositiveIntegerField()
    price_per_credit = models.DecimalField(max_digits=10, decimal_places=2)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.credits_purchased} credits for {self.seller.username}"

class SellerEarnings(models.Model):
    seller = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='earnings')
    order_item = models.OneToOneField('orders.OrderItem', on_delete=models.CASCADE, related_name='earnings')
    gross_amount = models.DecimalField(max_digits=10, decimal_places=2)
    platform_fee = models.DecimalField(max_digits=10, decimal_places=2)
    net_amount = models.DecimalField(max_digits=10, decimal_places=2)
    is_withdrawn = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Earning ₹{self.net_amount} for {self.seller.username}"

class WithdrawalRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('rejected', 'Rejected'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    seller = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='withdrawal_requests')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    bank_details = models.JSONField()  # Store bank account details
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='pending')
    requested_at = models.DateTimeField(auto_now_add=True)
    processed_at = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True)
    
    def __str__(self):
        return f"Withdrawal ₹{self.amount} by {self.seller.username}"

class Wallet(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='wallet')
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Wallet of {self.user.username} - ₹{self.balance}"

class WalletTransaction(models.Model):
    TRANSACTION_TYPE_CHOICES = [
        ('credit', 'Credit'),
        ('debit', 'Debit'),
    ]
    
    TRANSACTION_CATEGORY_CHOICES = [
        ('platform_fee', 'Platform Fee'),
        ('shipping_fee', 'Shipping Fee'),
        ('tax_amount', 'Tax Amount'),
        ('credit_purchase', 'Credit Purchase Revenue'),
        ('product_sale', 'Product Sale'),
        ('withdrawal', 'Withdrawal'),
        ('refund', 'Refund'),
        ('other', 'Other'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE, related_name='transactions')
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPE_CHOICES)
    category = models.CharField(max_length=20, choices=TRANSACTION_CATEGORY_CHOICES, default='other')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.CharField(max_length=255)
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True, blank=True)
    credit_purchase = models.ForeignKey(CreditPurchase, on_delete=models.SET_NULL, null=True, blank=True)
    reference_id = models.CharField(max_length=100, blank=True, help_text="Order number, payment ID, etc.")
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['wallet', 'transaction_type']),
            models.Index(fields=['wallet', 'category']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"{self.transaction_type.title()} ₹{self.amount} - {self.wallet.user.username} ({self.category})"

class SellerBankDetails(models.Model):
    seller = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bank_details')
    account_holder_name = models.CharField(max_length=100)
    bank_name = models.CharField(max_length=100)
    account_number = models.CharField(max_length=20)
    ifsc_code = models.CharField(max_length=15)
    mobile_number = models.CharField(max_length=15)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Bank details for {self.seller.username}"
    
    class Meta:
        verbose_name_plural = "Seller bank details"

class AdminWallet(models.Model):
    """Enhanced admin wallet model for tracking platform revenues"""
    balance = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    total_platform_fees = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    total_shipping_fees = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    total_tax_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    total_credit_revenue = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    total_orders_processed = models.PositiveIntegerField(default=0)
    total_credits_sold = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'payments_admin_wallet'
    
    def __str__(self):
        return f"Admin Wallet - Balance: ₹{self.balance}"
    
    @classmethod
    def get_instance(cls):
        """Get or create the singleton admin wallet instance"""
        instance, created = cls.objects.get_or_create(id=1)
        return instance
    
    def add_revenue(self, amount, category, description="", order=None, credit_purchase=None):
        """Add revenue to admin wallet with category tracking"""
        from decimal import Decimal
        
        if amount <= 0:
            return False
            
        # Update balance
        self.balance += Decimal(str(amount))
        
        # Update category totals
        if category == 'platform_fee':
            self.total_platform_fees += Decimal(str(amount))
        elif category == 'shipping_fee':
            self.total_shipping_fees += Decimal(str(amount))
        elif category == 'tax_amount':
            self.total_tax_amount += Decimal(str(amount))
        elif category == 'credit_purchase':
            self.total_credit_revenue += Decimal(str(amount))
            if credit_purchase:
                self.total_credits_sold += credit_purchase.credits_purchased
        
        if order:
            self.total_orders_processed += 1
            
        self.save()
        
        # Create transaction record for admin user
        from django.contrib.auth import get_user_model
        User = get_user_model()
        admin_user = User.objects.filter(is_superuser=True).first()
        
        if admin_user:
            admin_wallet, _ = Wallet.objects.get_or_create(user=admin_user)
            admin_wallet.balance += Decimal(str(amount))
            admin_wallet.save()
            
            # Create detailed transaction record
            WalletTransaction.objects.create(
                wallet=admin_wallet,
                transaction_type='credit',
                category=category,
                amount=amount,
                description=description,
                order=order,
                credit_purchase=credit_purchase,
                reference_id=order.order_number if order else (str(credit_purchase.id) if credit_purchase else ""),
                metadata={
                    'source': 'admin_revenue',
                    'category_total': float(getattr(self, f'total_{category}s', 0) if category.endswith('_fee') else getattr(self, f'total_{category}', 0))
                }
            )
        
        return True

class AdminWalletHistory(models.Model):
    """Detailed history for admin wallet transactions"""
    admin_wallet = models.ForeignKey(AdminWallet, on_delete=models.CASCADE, related_name='history')
    transaction_type = models.CharField(max_length=20, choices=[
        ('platform_fee', 'Platform Fee'),
        ('shipping_fee', 'Shipping Fee'), 
        ('tax_amount', 'Tax Amount'),
        ('credit_purchase', 'Credit Purchase Revenue'),
        ('withdrawal', 'Admin Withdrawal'),
        ('adjustment', 'Manual Adjustment'),
    ])
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.CharField(max_length=255)
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True, blank=True)
    credit_purchase = models.ForeignKey(CreditPurchase, on_delete=models.SET_NULL, null=True, blank=True)
    reference_id = models.CharField(max_length=100, blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['transaction_type']),
            models.Index(fields=['created_at']),
            models.Index(fields=['order']),
            models.Index(fields=['credit_purchase']),
        ]
    
    def __str__(self):
        return f"Admin {self.transaction_type} - ₹{self.amount} ({self.created_at.strftime('%Y-%m-%d')})"
