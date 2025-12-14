from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from accounts.models import BuyerProfile, SellerProfile
from products.models import Category
from decimal import Decimal

User = get_user_model()

class Command(BaseCommand):
    help = 'Create sample data for testing'
    
    def handle(self, *args, **options):
        self.stdout.write('Creating sample data...')
        
        # Create categories
        categories = [
            {'name': 'Electronics', 'description': 'Electronic devices and gadgets'},
            {'name': 'Fashion', 'description': 'Clothing and accessories'},
            {'name': 'Home & Kitchen', 'description': 'Home appliances and kitchen items'},
            {'name': 'Sports', 'description': 'Sports equipment and accessories'},
            {'name': 'Books', 'description': 'Books and educational materials'},
        ]
        
        for cat_data in categories:
            category, created = Category.objects.get_or_create(
                name=cat_data['name'],
                defaults={'description': cat_data['description']}
            )
            if created:
                self.stdout.write(f'Created category: {category.name}')
        
        # Create admin user
        admin_user, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@example.com',
                'user_type': 'seller',
                'is_staff': True,
                'is_superuser': True,
                'phone_number': '+919876543210'
            }
        )
        if created:
            admin_user.set_password('admin123')
            admin_user.save()
            self.stdout.write('Created admin user')
        
        # Create sample buyer
        buyer_user, created = User.objects.get_or_create(
            username='buyer1',
            defaults={
                'email': 'buyer1@example.com',
                'user_type': 'buyer',
                'first_name': 'John',
                'last_name': 'Doe',
                'phone_number': '+919876543211'
            }
        )
        if created:
            buyer_user.set_password('buyer123')
            buyer_user.save()
            BuyerProfile.objects.create(user=buyer_user)
            self.stdout.write('Created sample buyer')
        
        # Create sample seller
        seller_user, created = User.objects.get_or_create(
            username='seller1',
            defaults={
                'email': 'seller1@example.com',
                'user_type': 'seller',
                'first_name': 'Jane',
                'last_name': 'Smith',
                'phone_number': '+919876543212',
                'is_active': True
            }
        )
        if created:
            seller_user.set_password('seller123')
            seller_user.save()
            SellerProfile.objects.create(
                user=seller_user,
                shop_name='Jane\'s Electronics',
                shop_address='123 Main Street, Mumbai, Maharashtra, India',
                aadhar_number='123456789012',
                pan_number='ABCDE1234F',
                verification_status='verified',
                is_account_active=True,
                credits=10
            )
            self.stdout.write('Created sample verified seller')
        
        self.stdout.write(
            self.style.SUCCESS('Successfully created sample data!')
        )
