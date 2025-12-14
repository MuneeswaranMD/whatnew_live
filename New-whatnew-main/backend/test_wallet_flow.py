#!/usr/bin/env python
"""
Test script to demonstrate the wallet management flow:
1. Product payments go to seller wallets
2. Platform fees, shipping fees go to admin wallet
3. Credit purchases go to admin wallet
"""

import os
import django
import sys
from decimal import Decimal

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'livestream_ecommerce.settings')
django.setup()

from django.contrib.auth import get_user_model
from orders.models import Order, OrderItem
from products.models import Product, Category
from payments.models import AdminWallet, Wallet, WalletTransaction, CreditPurchase, Payment
from payments.views import _distribute_order_funds

User = get_user_model()

def create_test_data():
    """Create test users, products, and orders"""
    print("Creating test data...")
    
    # Create users
    buyer, _ = User.objects.get_or_create(
        username='testbuyer',
        defaults={
            'email': 'buyer@test.com',
            'user_type': 'customer',
            'first_name': 'Test',
            'last_name': 'Buyer'
        }
    )
    
    seller, _ = User.objects.get_or_create(
        username='testseller',
        defaults={
            'email': 'seller@test.com',
            'user_type': 'seller',
            'first_name': 'Test',
            'last_name': 'Seller'
        }
    )
    
    # Create category
    category, _ = Category.objects.get_or_create(
        name='Test Category',
        defaults={'description': 'Test category for demo'}
    )
    
    # Create product
    product, _ = Product.objects.get_or_create(
        name='Test Product',
        defaults={
            'description': 'Test product for demo',
            'base_price': Decimal('100.00'),
            'seller': seller,
            'category': category,
            'quantity': 10,
            'status': 'active'
        }
    )
    
    return buyer, seller, product

def test_order_payment_flow():
    """Test the order payment flow"""
    print("\n=== Testing Order Payment Flow ===")
    
    buyer, seller, product = create_test_data()
    
    # Create an order manually (simulating the order creation process)
    order = Order.objects.create(
        user=buyer,
        shipping_address={
            'full_name': 'Test Buyer',
            'address_line_1': '123 Test St',
            'city': 'Test City',
            'state': 'Test State',
            'pincode': '123456',
            'phone_number': '9876543210'
        },
        subtotal=Decimal('100.00'),  # Product price
        shipping_fee=Decimal('79.00'),  # Delivery charge
        tax_amount=Decimal('0.00'),  # No tax
        total_amount=Decimal('182.00')  # 100 + 3 (platform fee) + 79 (shipping)
    )
    
    # Create order item
    order_item = OrderItem.objects.create(
        order=order,
        product=product,
        seller=seller,
        quantity=2,
        unit_price=Decimal('50.00'),
        total_price=Decimal('100.00')  # 2 * 50
    )
    
    print(f"Created order {order.order_number}")
    print(f"Order total: ₹{order.total_amount}")
    print(f"Product amount (goes to seller): ₹{order.subtotal}")
    print(f"Shipping fee (goes to admin): ₹{order.shipping_fee}")
    print(f"Platform fee (goes to admin): ₹3.00")
    
    # Get initial wallet balances
    seller_wallet, _ = Wallet.objects.get_or_create(user=seller)
    admin_wallet = AdminWallet.get_instance()
    
    initial_seller_balance = seller_wallet.balance
    initial_admin_balance = admin_wallet.balance
    
    print(f"\nInitial balances:")
    print(f"Seller wallet: ₹{initial_seller_balance}")
    print(f"Admin wallet: ₹{initial_admin_balance}")
    
    # Distribute funds (this happens during payment verification)
    _distribute_order_funds(order)
    
    # Check final balances
    seller_wallet.refresh_from_db()
    admin_wallet.refresh_from_db()
    
    print(f"\nFinal balances:")
    print(f"Seller wallet: ₹{seller_wallet.balance}")
    print(f"Admin wallet: ₹{admin_wallet.balance}")
    
    print(f"\nChanges:")
    print(f"Seller gained: ₹{seller_wallet.balance - initial_seller_balance}")
    print(f"Admin gained: ₹{admin_wallet.balance - initial_admin_balance}")
    
    # Show recent transactions
    print(f"\nSeller wallet transactions:")
    seller_transactions = WalletTransaction.objects.filter(wallet=seller_wallet).order_by('-created_at')[:3]
    for tx in seller_transactions:
        print(f"  {tx.created_at.strftime('%Y-%m-%d %H:%M')} - {tx.category}: ₹{tx.amount} - {tx.description}")
    
    print(f"\nAdmin wallet breakdown:")
    print(f"  Total Platform Fees: ₹{admin_wallet.total_platform_fees}")
    print(f"  Total Shipping Fees: ₹{admin_wallet.total_shipping_fees}")
    print(f"  Total Credit Revenue: ₹{admin_wallet.total_credit_revenue}")
    print(f"  Total Orders Processed: {admin_wallet.total_orders_processed}")

def test_credit_purchase_flow():
    """Test the credit purchase flow"""
    print("\n=== Testing Credit Purchase Flow ===")
    
    buyer, seller, product = create_test_data()
    
    # Create a credit purchase (simulating the credit purchase process)
    payment = Payment.objects.create(
        user=seller,
        amount=Decimal('500.00'),
        payment_method='razorpay',
        status='completed'
    )
    
    credit_purchase = CreditPurchase.objects.create(
        seller=seller,
        payment=payment,
        credits_purchased=50,
        price_per_credit=Decimal('10.00'),
        total_amount=Decimal('500.00'),
        status='completed'
    )
    
    print(f"Created credit purchase for {seller.username}")
    print(f"Credits purchased: {credit_purchase.credits_purchased}")
    print(f"Total amount: ₹{credit_purchase.total_amount}")
    
    # Get initial admin wallet balance
    admin_wallet = AdminWallet.get_instance()
    initial_admin_balance = admin_wallet.balance
    initial_credit_revenue = admin_wallet.total_credit_revenue
    
    print(f"\nInitial admin wallet:")
    print(f"  Balance: ₹{initial_admin_balance}")
    print(f"  Credit Revenue: ₹{initial_credit_revenue}")
    
    # Add credit revenue to admin wallet (this happens during payment verification)
    admin_wallet.add_revenue(
        amount=credit_purchase.total_amount,
        category='credit_purchase',
        description=f'Credit purchase revenue - {credit_purchase.credits_purchased} credits sold to {seller.username}',
        credit_purchase=credit_purchase
    )
    
    # Check final balances
    admin_wallet.refresh_from_db()
    
    print(f"\nFinal admin wallet:")
    print(f"  Balance: ₹{admin_wallet.balance}")
    print(f"  Credit Revenue: ₹{admin_wallet.total_credit_revenue}")
    print(f"  Credits Sold: {admin_wallet.total_credits_sold}")
    
    print(f"\nChanges:")
    print(f"Admin gained: ₹{admin_wallet.balance - initial_admin_balance}")
    print(f"Credit revenue increased: ₹{admin_wallet.total_credit_revenue - initial_credit_revenue}")

def show_admin_dashboard_summary():
    """Show admin dashboard summary"""
    print("\n=== Admin Dashboard Summary ===")
    
    admin_wallet = AdminWallet.get_instance()
    
    print(f"Total Platform Balance: ₹{admin_wallet.balance}")
    print(f"\nRevenue Breakdown:")
    print(f"  Platform Fees: ₹{admin_wallet.total_platform_fees}")
    print(f"  Shipping Fees: ₹{admin_wallet.total_shipping_fees}")
    print(f"  Tax Collections: ₹{admin_wallet.total_tax_amount}")
    print(f"  Credit Sales: ₹{admin_wallet.total_credit_revenue}")
    
    total_revenue = (admin_wallet.total_platform_fees + 
                    admin_wallet.total_shipping_fees + 
                    admin_wallet.total_tax_amount + 
                    admin_wallet.total_credit_revenue)
    
    print(f"  Total Revenue: ₹{total_revenue}")
    
    print(f"\nBusiness Metrics:")
    print(f"  Orders Processed: {admin_wallet.total_orders_processed}")
    print(f"  Credits Sold: {admin_wallet.total_credits_sold}")
    
    # Show some recent transactions
    from payments.models import AdminWalletHistory
    recent_history = AdminWalletHistory.objects.order_by('-created_at')[:5]
    
    print(f"\nRecent Admin Transactions:")
    for history in recent_history:
        print(f"  {history.created_at.strftime('%Y-%m-%d %H:%M')} - {history.transaction_type}: ₹{history.amount}")

if __name__ == '__main__':
    print("Wallet Management Platform Demo")
    print("=" * 40)
    
    try:
        # Test order payment flow
        test_order_payment_flow()
        
        # Test credit purchase flow  
        test_credit_purchase_flow()
        
        # Show admin dashboard
        show_admin_dashboard_summary()
        
        print("\n" + "=" * 40)
        print("Demo completed successfully!")
        print("\nKey Features Demonstrated:")
        print("✓ Product payments go to seller wallets")
        print("✓ Platform fees go to admin wallet")
        print("✓ Shipping fees go to admin wallet")  
        print("✓ Credit purchase revenue goes to admin wallet")
        print("✓ Detailed transaction history with categories")
        print("✓ Admin wallet tracks all revenue streams")
        
    except Exception as e:
        print(f"Error during demo: {e}")
        import traceback
        traceback.print_exc()
