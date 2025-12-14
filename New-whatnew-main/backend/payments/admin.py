from django.contrib import admin
from django.urls import path
from django.shortcuts import render
from django.contrib.admin.views.decorators import staff_member_required
from django.utils.decorators import method_decorator
from django.views.generic import TemplateView
from .models import (
    Payment, CreditPurchase, SellerEarnings, WithdrawalRequest, 
    Wallet, WalletTransaction, AdminWallet, AdminWalletHistory
)

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'amount', 'payment_method', 'status', 'created_at']
    list_filter = ['payment_method', 'status', 'created_at']
    search_fields = ['user__username', 'razorpay_payment_id', 'razorpay_order_id']
    readonly_fields = ['id', 'created_at', 'updated_at']

@admin.register(CreditPurchase)
class CreditPurchaseAdmin(admin.ModelAdmin):
    list_display = ['seller', 'credits_purchased', 'total_amount', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['seller__username']

@admin.register(SellerEarnings)
class SellerEarningsAdmin(admin.ModelAdmin):
    list_display = ['seller', 'gross_amount', 'platform_fee', 'net_amount', 'is_withdrawn', 'created_at']
    list_filter = ['is_withdrawn', 'created_at']
    search_fields = ['seller__username']

@admin.register(WithdrawalRequest)
class WithdrawalRequestAdmin(admin.ModelAdmin):
    list_display = ['seller', 'amount', 'status', 'requested_at', 'processed_at']
    list_filter = ['status', 'requested_at']
    search_fields = ['seller__username']
    
    actions = ['approve_withdrawals', 'reject_withdrawals']
    
    def approve_withdrawals(self, request, queryset):
        from django.utils import timezone
        queryset.update(status='completed', processed_at=timezone.now())
    approve_withdrawals.short_description = "Approve selected withdrawals"
    
    def reject_withdrawals(self, request, queryset):
        from django.utils import timezone
        queryset.update(status='rejected', processed_at=timezone.now())
    reject_withdrawals.short_description = "Reject selected withdrawals"

@admin.register(Wallet)
class WalletAdmin(admin.ModelAdmin):
    list_display = ['user', 'balance', 'updated_at']
    search_fields = ['user__username']
    readonly_fields = ['created_at', 'updated_at']

@admin.register(WalletTransaction)
class WalletTransactionAdmin(admin.ModelAdmin):
    list_display = ['wallet', 'transaction_type', 'category', 'amount', 'description', 'reference_id', 'created_at']
    list_filter = ['transaction_type', 'category', 'created_at']
    search_fields = ['wallet__user__username', 'description', 'reference_id']
    readonly_fields = ['created_at']

@admin.register(AdminWallet)
class AdminWalletAdmin(admin.ModelAdmin):
    list_display = ['balance', 'total_platform_fees', 'total_shipping_fees', 'total_credit_revenue', 'total_orders_processed', 'updated_at']
    readonly_fields = ['created_at', 'updated_at']
    
    def has_add_permission(self, request):
        # Only allow one admin wallet instance
        return not AdminWallet.objects.exists()
    
    def has_delete_permission(self, request, obj=None):
        # Don't allow deletion of admin wallet
        return False

@admin.register(AdminWalletHistory)
class AdminWalletHistoryAdmin(admin.ModelAdmin):
    list_display = ['transaction_type', 'amount', 'description', 'reference_id', 'created_at', 'created_by']
    list_filter = ['transaction_type', 'created_at']
    search_fields = ['description', 'reference_id', 'order__order_number']
    readonly_fields = ['created_at']
    date_hierarchy = 'created_at'
    
    def has_add_permission(self, request):
        # History entries should only be created programmatically
        return False
    
    def has_change_permission(self, request, obj=None):
        # Don't allow editing history entries
        return False

# Custom Admin Dashboard View
@method_decorator(staff_member_required, name='dispatch')
class AdminWalletDashboardView(TemplateView):
    template_name = 'admin/payments/admin_wallet_dashboard.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Admin Wallet Dashboard'
        context['has_permission'] = self.request.user.is_superuser
        return context
    search_fields = ['wallet__user__username', 'description']
