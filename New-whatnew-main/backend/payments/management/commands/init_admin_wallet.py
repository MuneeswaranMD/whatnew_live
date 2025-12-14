from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import transaction
from payments.models import AdminWallet, AdminWalletHistory, Wallet, WalletTransaction
from orders.models import Order
from decimal import Decimal
import random

User = get_user_model()

class Command(BaseCommand):
    help = 'Initialize admin wallet and create sample data for testing'

    def add_arguments(self, parser):
        parser.add_argument(
            '--create-sample-data',
            action='store_true',
            help='Create sample transactions for testing',
        )
        parser.add_argument(
            '--reset',
            action='store_true',
            help='Reset admin wallet (delete all data)',
        )

    def handle(self, *args, **options):
        if options['reset']:
            self.reset_admin_wallet()
        
        self.initialize_admin_wallet()
        
        if options['create_sample_data']:
            self.create_sample_data()

    def initialize_admin_wallet(self):
        """Initialize or get existing admin wallet"""
        self.stdout.write("Initializing admin wallet...")
        
        # Get or create admin wallet instance
        admin_wallet = AdminWallet.get_instance()
        
        self.stdout.write(
            self.style.SUCCESS(f'Admin wallet initialized with balance: ₹{admin_wallet.balance}')
        )
        
        # Get or create superuser
        admin_user = User.objects.filter(is_superuser=True).first()
        if not admin_user:
            self.stdout.write("Creating superuser...")
            admin_user = User.objects.create_user(
                username='superadmin',
                email='admin@whatnew.com',
                password='admin123',
                is_superuser=True,
                is_staff=True,
                user_type='admin',
                first_name='Super',
                last_name='Admin'
            )
            self.stdout.write(
                self.style.SUCCESS(f'Created superuser: {admin_user.username}')
            )
        
        # Get or create admin user wallet
        admin_user_wallet, created = Wallet.objects.get_or_create(user=admin_user)
        if created:
            self.stdout.write(
                self.style.SUCCESS(f'Created admin user wallet for: {admin_user.username}')
            )

    def reset_admin_wallet(self):
        """Reset admin wallet data"""
        self.stdout.write("Resetting admin wallet...")
        
        with transaction.atomic():
            # Delete all admin wallet history
            AdminWalletHistory.objects.all().delete()
            
            # Reset admin wallet
            admin_wallet = AdminWallet.get_instance()
            admin_wallet.balance = 0
            admin_wallet.total_platform_fees = 0
            admin_wallet.total_shipping_fees = 0
            admin_wallet.total_tax_amount = 0
            admin_wallet.total_credit_revenue = 0
            admin_wallet.total_orders_processed = 0
            admin_wallet.total_credits_sold = 0
            admin_wallet.save()
        
        self.stdout.write(
            self.style.SUCCESS('Admin wallet reset successfully')
        )

    def create_sample_data(self):
        """Create sample admin wallet transactions for testing"""
        self.stdout.write("Creating sample admin wallet data...")
        
        admin_wallet = AdminWallet.get_instance()
        
        # Sample platform fees
        for i in range(5):
            amount = Decimal(random.uniform(3.0, 10.0))
            admin_wallet.add_revenue(
                amount=amount,
                category='platform_fee',
                description=f'Platform fee for sample order ORDER{1000+i}'
            )
            
            AdminWalletHistory.objects.create(
                admin_wallet=admin_wallet,
                transaction_type='platform_fee',
                amount=amount,
                description=f'Platform fee for sample order ORDER{1000+i}',
                reference_id=f'ORDER{1000+i}',
                metadata={
                    'order_total': float(amount * Decimal('30')),
                    'fee_percentage': '3.0'
                }
            )
        
        # Sample shipping fees
        for i in range(5):
            amount = Decimal('79.0')
            admin_wallet.add_revenue(
                amount=amount,
                category='shipping_fee',
                description=f'Shipping fee for sample order ORDER{2000+i}'
            )
            
            AdminWalletHistory.objects.create(
                admin_wallet=admin_wallet,
                transaction_type='shipping_fee',
                amount=amount,
                description=f'Shipping fee for sample order ORDER{2000+i}',
                reference_id=f'ORDER{2000+i}',
                metadata={
                    'shipping_method': 'standard'
                }
            )
        
        # Sample credit purchases
        for i in range(3):
            credits = random.randint(50, 200)
            amount = Decimal(credits * 10)  # ₹10 per credit
            admin_wallet.add_revenue(
                amount=amount,
                category='credit_purchase',
                description=f'Credit purchase - {credits} credits sold to sample user{i}'
            )
            
            AdminWalletHistory.objects.create(
                admin_wallet=admin_wallet,
                transaction_type='credit_purchase',
                amount=amount,
                description=f'Credit purchase: {credits} credits sold to sample user{i}',
                reference_id=f'CREDIT{3000+i}',
                metadata={
                    'credits_purchased': credits,
                    'price_per_credit': '10.00',
                    'buyer': f'sample_user{i}'
                }
            )
        
        # Sample tax amounts
        for i in range(3):
            amount = Decimal(random.uniform(50.0, 150.0))
            admin_wallet.add_revenue(
                amount=amount,
                category='tax_amount',
                description=f'Tax collected for sample order ORDER{4000+i}'
            )
            
            AdminWalletHistory.objects.create(
                admin_wallet=admin_wallet,
                transaction_type='tax_amount',
                amount=amount,
                description=f'Tax collected for sample order ORDER{4000+i}',
                reference_id=f'ORDER{4000+i}',
                metadata={
                    'tax_rate': '18.0',
                    'taxable_amount': float(amount * Decimal('5.56'))  # Reverse calculate taxable amount
                }
            )
        
        self.stdout.write(
            self.style.SUCCESS(f'Created sample data. Admin wallet balance: ₹{admin_wallet.balance}')
        )
        
        # Display summary
        self.stdout.write("\n" + "="*50)
        self.stdout.write("ADMIN WALLET SUMMARY")
        self.stdout.write("="*50)
        self.stdout.write(f"Total Balance: ₹{admin_wallet.balance}")
        self.stdout.write(f"Platform Fees: ₹{admin_wallet.total_platform_fees}")
        self.stdout.write(f"Shipping Fees: ₹{admin_wallet.total_shipping_fees}")
        self.stdout.write(f"Tax Amount: ₹{admin_wallet.total_tax_amount}")
        self.stdout.write(f"Credit Revenue: ₹{admin_wallet.total_credit_revenue}")
        self.stdout.write(f"Orders Processed: {admin_wallet.total_orders_processed}")
        self.stdout.write(f"Credits Sold: {admin_wallet.total_credits_sold}")
        
        total_transactions = AdminWalletHistory.objects.filter(admin_wallet=admin_wallet).count()
        self.stdout.write(f"Total Transactions: {total_transactions}")
        self.stdout.write("="*50)

    def display_wallet_stats(self):
        """Display current wallet statistics"""
        admin_wallet = AdminWallet.get_instance()
        
        self.stdout.write("\n" + "="*50)
        self.stdout.write("CURRENT ADMIN WALLET STATUS")
        self.stdout.write("="*50)
        self.stdout.write(f"Balance: ₹{admin_wallet.balance}")
        self.stdout.write(f"Platform Fees Collected: ₹{admin_wallet.total_platform_fees}")
        self.stdout.write(f"Shipping Fees Collected: ₹{admin_wallet.total_shipping_fees}")
        self.stdout.write(f"Tax Amount Collected: ₹{admin_wallet.total_tax_amount}")
        self.stdout.write(f"Credit Purchase Revenue: ₹{admin_wallet.total_credit_revenue}")
        self.stdout.write(f"Total Orders Processed: {admin_wallet.total_orders_processed}")
        self.stdout.write(f"Total Credits Sold: {admin_wallet.total_credits_sold}")
        
        # Recent transactions
        recent_transactions = AdminWalletHistory.objects.filter(
            admin_wallet=admin_wallet
        ).order_by('-created_at')[:5]
        
        if recent_transactions:
            self.stdout.write("\nRecent Transactions:")
            for tx in recent_transactions:
                self.stdout.write(
                    f"  {tx.created_at.strftime('%Y-%m-%d %H:%M')} | "
                    f"{tx.transaction_type.upper()} | "
                    f"₹{tx.amount} | {tx.description[:50]}..."
                )
        
        self.stdout.write("="*50)
