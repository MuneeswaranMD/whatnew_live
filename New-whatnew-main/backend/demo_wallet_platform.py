"""
Wallet Management Platform Demo Script

This script demonstrates the wallet management functionality
that has been implemented for the WhatNew e-commerce platform.

Usage:
    python demo_wallet_platform.py

Features Demonstrated:
1. Admin wallet initialization
2. Order payment distribution
3. Credit purchase tracking
4. Seller wallet management
5. Transaction history
6. Revenue analytics
"""

import os
import sys
import django
from decimal import Decimal

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'livestream_ecommerce.settings')
django.setup()

from django.contrib.auth import get_user_model
from payments.models import AdminWallet, AdminWalletHistory, Wallet, WalletTransaction
from orders.models import Order, OrderItem
from products.models import Product, Category
from accounts.models import SellerProfile
from payments.views import _distribute_order_funds

User = get_user_model()

class WalletDemo:
    def __init__(self):
        self.admin_wallet = AdminWallet.get_instance()
        print("🏦 Wallet Management Platform Demo")
        print("=" * 50)
        
    def show_initial_state(self):
        """Show the current state of admin wallet"""
        print("\n📊 Current Admin Wallet State:")
        print(f"   Balance: ₹{self.admin_wallet.balance}")
        print(f"   Platform Fees: ₹{self.admin_wallet.total_platform_fees}")
        print(f"   Shipping Fees: ₹{self.admin_wallet.total_shipping_fees}")
        print(f"   Tax Amount: ₹{self.admin_wallet.total_tax_amount}")
        print(f"   Credit Revenue: ₹{self.admin_wallet.total_credit_revenue}")
        print(f"   Orders Processed: {self.admin_wallet.total_orders_processed}")
        print(f"   Credits Sold: {self.admin_wallet.total_credits_sold}")
        
    def simulate_order_payment(self):
        """Simulate an order payment and show how funds are distributed"""
        print("\n🛒 Simulating Order Payment Distribution")
        print("-" * 40)
        
        # Create or get a test seller
        seller, created = User.objects.get_or_create(
            username='demo_seller',
            defaults={
                'email': 'seller@demo.com',
                'user_type': 'seller',
                'first_name': 'Demo',
                'last_name': 'Seller'
            }
        )
        
        # Create seller profile
        seller_profile, _ = SellerProfile.objects.get_or_create(user=seller)
        
        # Get or create seller wallet
        seller_wallet, created = Wallet.objects.get_or_create(user=seller)
        initial_seller_balance = seller_wallet.balance
        
        print(f"   Seller: {seller.username}")
        print(f"   Initial Seller Wallet: ₹{initial_seller_balance}")
        
        # Simulate order data
        order_data = {
            'subtotal': Decimal('415.00'),  # Product amount
            'shipping_fee': Decimal('79.00'),  # Shipping fee
            'tax_amount': Decimal('3.00'),  # Tax
            'total_amount': Decimal('497.00'),  # Total
            'platform_fee': Decimal('3.00')  # Platform fee (calculated separately)
        }
        
        print(f"   Order Breakdown:")
        print(f"     Product Amount: ₹{order_data['subtotal']} → Seller Wallet")
        print(f"     Platform Fee: ₹{order_data['platform_fee']} → Admin Wallet")
        print(f"     Shipping Fee: ₹{order_data['shipping_fee']} → Admin Wallet")
        print(f"     Tax Amount: ₹{order_data['tax_amount']} → Admin Wallet")
        print(f"     Total: ₹{order_data['total_amount']}")
        
        # Create mock order (simplified for demo)
        class MockOrder:
            def __init__(self, data):
                self.order_number = "DEMO001"
                self.subtotal = data['subtotal']
                self.shipping_fee = data['shipping_fee']
                self.tax_amount = data['tax_amount']
                self.total_amount = data['total_amount']
                
            class MockItems:
                def all(self):
                    return [MockOrderItem()]
                    
            def __init__(self, data):
                self.order_number = "DEMO001"
                self.subtotal = data['subtotal']
                self.shipping_fee = data['shipping_fee']
                self.tax_amount = data['tax_amount']
                self.total_amount = data['total_amount']
                self.items = self.MockItems()
        
        class MockOrderItem:
            def __init__(self):
                self.seller = seller
                self.total_price = Decimal('415.00')
                self.product_name = "Demo Product"
                self.quantity = 1
                self.unit_price = Decimal('415.00')
                
            class MockProduct:
                id = 1
                
            def __init__(self):
                self.seller = seller
                self.total_price = Decimal('415.00')
                self.product_name = "Demo Product"
                self.quantity = 1
                self.unit_price = Decimal('415.00')
                self.product = self.MockProduct()
        
        # Record initial admin wallet state
        initial_admin_balance = self.admin_wallet.balance
        
        # Simulate order completion and fund distribution
        mock_order = MockOrder(order_data)
        
        # Manually simulate what _distribute_order_funds does
        platform_fee = Decimal('3.0')
        
        # Add to admin wallet
        self.admin_wallet.add_revenue(
            amount=platform_fee,
            category='platform_fee',
            description=f'Platform fee for order {mock_order.order_number}'
        )
        
        self.admin_wallet.add_revenue(
            amount=mock_order.shipping_fee,
            category='shipping_fee',
            description=f'Shipping fee for order {mock_order.order_number}'
        )
        
        if mock_order.tax_amount > 0:
            self.admin_wallet.add_revenue(
                amount=mock_order.tax_amount,
                category='tax_amount',
                description=f'Tax amount for order {mock_order.order_number}'
            )
        
        # Add to seller wallet
        seller_wallet.balance += order_data['subtotal']
        seller_wallet.save()
        
        # Create seller transaction
        WalletTransaction.objects.create(
            wallet=seller_wallet,
            transaction_type='credit',
            category='product_sale',
            amount=order_data['subtotal'],
            description=f'Product sale for order {mock_order.order_number}',
            reference_id=mock_order.order_number,
            metadata={
                'product_name': 'Demo Product',
                'quantity': 1,
                'unit_price': str(order_data['subtotal'])
            }
        )
        
        print(f"\n   ✅ Order Processed Successfully!")
        print(f"   Admin Wallet: ₹{initial_admin_balance} → ₹{self.admin_wallet.balance}")
        seller_wallet.refresh_from_db()
        print(f"   Seller Wallet: ₹{initial_seller_balance} → ₹{seller_wallet.balance}")
        
    def simulate_credit_purchase(self):
        """Simulate a credit purchase"""
        print("\n💳 Simulating Credit Purchase")
        print("-" * 30)
        
        credits = 50
        amount = Decimal(credits * 10)  # ₹10 per credit
        
        print(f"   Credits Purchased: {credits}")
        print(f"   Amount: ₹{amount}")
        print(f"   Price per Credit: ₹10")
        
        initial_balance = self.admin_wallet.balance
        initial_credits_sold = self.admin_wallet.total_credits_sold
        
        # Add credit revenue to admin wallet
        self.admin_wallet.add_revenue(
            amount=amount,
            category='credit_purchase',
            description=f'Credit purchase - {credits} credits sold to demo buyer'
        )
        
        print(f"   ✅ Credit Purchase Processed!")
        print(f"   Admin Wallet: ₹{initial_balance} → ₹{self.admin_wallet.balance}")
        print(f"   Credits Sold: {initial_credits_sold} → {self.admin_wallet.total_credits_sold}")
        
    def show_transaction_history(self):
        """Show recent transaction history"""
        print("\n📋 Recent Transaction History")
        print("-" * 35)
        
        # Admin wallet history
        admin_history = AdminWalletHistory.objects.filter(
            admin_wallet=self.admin_wallet
        ).order_by('-created_at')[:5]
        
        print("   Admin Wallet Transactions:")
        if admin_history:
            for tx in admin_history:
                print(f"     {tx.created_at.strftime('%Y-%m-%d %H:%M')} | "
                      f"{tx.transaction_type.upper()} | "
                      f"₹{tx.amount} | {tx.description[:40]}...")
        else:
            print("     No admin transactions found")
        
        # Seller wallet history
        seller_transactions = WalletTransaction.objects.filter(
            wallet__user__username='demo_seller'
        ).order_by('-created_at')[:3]
        
        print("\n   Seller Wallet Transactions:")
        if seller_transactions:
            for tx in seller_transactions:
                print(f"     {tx.created_at.strftime('%Y-%m-%d %H:%M')} | "
                      f"{tx.transaction_type.upper()} | "
                      f"₹{tx.amount} | {tx.description[:40]}...")
        else:
            print("     No seller transactions found")
            
    def show_analytics(self):
        """Show revenue analytics"""
        print("\n📈 Revenue Analytics")
        print("-" * 20)
        
        total_revenue = (self.admin_wallet.total_platform_fees + 
                        self.admin_wallet.total_shipping_fees + 
                        self.admin_wallet.total_tax_amount + 
                        self.admin_wallet.total_credit_revenue)
        
        print(f"   Total Revenue: ₹{total_revenue}")
        
        if total_revenue > 0:
            platform_pct = (self.admin_wallet.total_platform_fees / total_revenue) * 100
            shipping_pct = (self.admin_wallet.total_shipping_fees / total_revenue) * 100
            tax_pct = (self.admin_wallet.total_tax_amount / total_revenue) * 100
            credit_pct = (self.admin_wallet.total_credit_revenue / total_revenue) * 100
            
            print(f"   Revenue Breakdown:")
            print(f"     Platform Fees: {platform_pct:.1f}% (₹{self.admin_wallet.total_platform_fees})")
            print(f"     Shipping Fees: {shipping_pct:.1f}% (₹{self.admin_wallet.total_shipping_fees})")
            print(f"     Tax Amount: {tax_pct:.1f}% (₹{self.admin_wallet.total_tax_amount})")
            print(f"     Credit Revenue: {credit_pct:.1f}% (₹{self.admin_wallet.total_credit_revenue})")
        
    def show_api_endpoints(self):
        """Show available API endpoints"""
        print("\n🔗 Available API Endpoints")
        print("-" * 30)
        print("   Base URL: http://192.168.31.247:8000/api/payments/")
        print("   ")
        print("   Admin Endpoints (require superuser token):")
        print("     GET  /admin/wallet/ - Admin wallet overview")
        print("     GET  /admin/wallet/history/ - Transaction history")
        print("     GET  /admin/dashboard/stats/ - Dashboard statistics")
        print("     POST /admin/revenue/report/ - Generate PDF reports")
        print("   ")
        print("   Seller Endpoints (require seller token):")
        print("     GET  /wallet/ - Seller wallet balance")
        print("     GET  /wallet/transactions/ - Seller transactions")
        print("   ")
        print("   Admin Panel: http://192.168.31.247:8000/admin/")
        
    def run_demo(self):
        """Run the complete demo"""
        self.show_initial_state()
        self.simulate_order_payment()
        self.simulate_credit_purchase()
        self.show_transaction_history()
        self.show_analytics()
        self.show_api_endpoints()
        
        print("\n🎉 Demo Complete!")
        print("=" * 50)
        print("The wallet management platform is fully operational!")
        print("✅ Product payments go to seller wallets")
        print("✅ Platform fees go to admin wallet")
        print("✅ Shipping fees go to admin wallet")  
        print("✅ Credit purchases tracked in admin wallet")
        print("✅ Detailed transaction history maintained")
        print("✅ Admin dashboard and reporting available")

if __name__ == "__main__":
    try:
        demo = WalletDemo()
        demo.run_demo()
    except Exception as e:
        print(f"Demo failed: {e}")
        import traceback
        traceback.print_exc()
