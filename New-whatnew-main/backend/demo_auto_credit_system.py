#!/usr/bin/env python
"""
Demo script for Enhanced Auto Credit Monitoring System
This script demonstrates the new automatic credit deduction and inactivity monitoring features.
"""

import os
import sys
import django
from datetime import timedelta
from django.utils import timezone

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'livestream_ecommerce.settings')
django.setup()

from accounts.models import CustomUser, SellerProfile
from livestreams.models import LiveStream
from livestreams.credit_monitor import CreditMonitorService
from products.models import Category

def create_test_data():
    """Create test data for demonstration"""
    print("🔧 Creating test data...")
    
    # Create test category
    category, created = Category.objects.get_or_create(
        name="Electronics",
        defaults={'description': 'Electronic items'}
    )
    
    # Create test seller
    seller_user, created = CustomUser.objects.get_or_create(
        username="test_seller_auto",
        defaults={
            'email': 'test_seller_auto@example.com',
            'user_type': 'seller',
            'phone_number': '+1234567890'
        }
    )
    
    # Create seller profile with credits
    seller_profile, created = SellerProfile.objects.get_or_create(
        user=seller_user,
        defaults={
            'shop_name': 'Auto Test Shop',
            'shop_address': '123 Test Street',
            'aadhar_number': '123456789012',
            'pan_number': 'ABCDE1234F',
            'verification_status': 'verified',
            'credits': 5,  # 5 credits for testing
            'is_account_active': True,
            'verified_at': timezone.now()
        }
    )
    
    if created:
        print(f"✓ Created seller: {seller_user.username} with {seller_profile.credits} credits")
    else:
        # Update credits for testing
        seller_profile.credits = 5
        seller_profile.save()
        print(f"✓ Updated seller: {seller_user.username} with {seller_profile.credits} credits")
    
    return seller_user, category

def create_test_livestream(seller_user, category):
    """Create a test livestream"""
    print("\n📺 Creating test livestream...")
    
    # End any existing live streams for this seller
    LiveStream.objects.filter(seller=seller_user, status='live').update(
        status='ended',
        end_time=timezone.now()
    )
    
    livestream = LiveStream.objects.create(
        seller=seller_user,
        title="Auto Credit Test Stream",
        description="Testing automatic credit deduction and inactivity monitoring",
        category=category,
        agora_channel_name="auto_test_channel_" + str(int(timezone.now().timestamp())),
        status='scheduled'
    )
    
    print(f"✓ Created livestream: {livestream.id}")
    return livestream

def start_livestream_simulation(livestream):
    """Simulate starting a livestream"""
    print(f"\n🚀 Starting livestream simulation...")
    
    # Start the stream
    livestream.status = 'live'
    livestream.actual_start_time = timezone.now()
    livestream.last_credit_deduction = timezone.now()
    livestream.last_activity = timezone.now()
    livestream.credits_consumed = 1
    livestream.auto_end_warned = False
    livestream.save()
    
    # Deduct initial credit
    seller_profile = livestream.seller.seller_profile
    seller_profile.credits -= 1
    seller_profile.save()
    
    print(f"✓ Livestream started at {livestream.actual_start_time}")
    print(f"✓ Initial credit deducted. Remaining credits: {seller_profile.credits}")
    print(f"✓ Last activity: {livestream.last_activity}")

def simulate_time_passage(livestream, minutes):
    """Simulate the passage of time by backdating the livestream start time"""
    print(f"\n⏰ Simulating {minutes} minutes of streaming...")
    
    # Backdate the start time and last credit deduction
    past_time = timezone.now() - timedelta(minutes=minutes)
    livestream.actual_start_time = past_time
    livestream.last_credit_deduction = past_time
    livestream.save()
    
    print(f"✓ Simulated start time: {livestream.actual_start_time}")
    print(f"✓ Last credit deduction: {livestream.last_credit_deduction}")

def simulate_inactivity(livestream, minutes):
    """Simulate inactivity by backdating last activity"""
    print(f"\n😴 Simulating {minutes} minutes of inactivity...")
    
    past_time = timezone.now() - timedelta(minutes=minutes)
    livestream.last_activity = past_time
    livestream.auto_end_warned = False  # Reset warning
    livestream.save()
    
    print(f"✓ Last activity set to: {livestream.last_activity}")

def test_credit_deduction(livestream):
    """Test automatic credit deduction"""
    print(f"\n💳 Testing automatic credit deduction...")
    
    # Get current state
    seller_profile = livestream.seller.seller_profile
    credits_before = seller_profile.credits
    consumed_before = livestream.credits_consumed
    
    print(f"Before: Credits={credits_before}, Consumed={consumed_before}")
    
    # Run credit monitoring
    result = CreditMonitorService.process_credit_deduction_for_livestream(livestream.id)
    
    # Refresh data
    livestream.refresh_from_db()
    seller_profile.refresh_from_db()
    
    credits_after = seller_profile.credits
    consumed_after = livestream.credits_consumed
    
    print(f"After: Credits={credits_after}, Consumed={consumed_after}")
    print(f"Result: {'✓ Success' if result else '❌ Failed/Ended'}")
    
    if credits_before != credits_after:
        print(f"✓ Credits deducted: {credits_before - credits_after}")
    else:
        print("ℹ️ No credits deducted (not enough time passed or insufficient credits)")
    
    return result

def test_inactivity_monitoring(livestream):
    """Test inactivity monitoring"""
    print(f"\n🔍 Testing inactivity monitoring...")
    
    # Test with current activity state
    result = CreditMonitorService.process_credit_deduction_for_livestream(livestream.id)
    
    # Refresh data
    livestream.refresh_from_db()
    
    print(f"Stream status: {livestream.status}")
    print(f"Auto-end warned: {livestream.auto_end_warned}")
    print(f"Result: {'✓ Active' if result else '❌ Ended'}")
    
    return result

def send_heartbeat(livestream):
    """Simulate sending a heartbeat to show activity"""
    print(f"\n💓 Sending heartbeat (simulating user activity)...")
    
    livestream.last_activity = timezone.now()
    livestream.auto_end_warned = False
    livestream.save()
    
    print(f"✓ Activity updated to: {livestream.last_activity}")

def run_demo():
    """Run the complete demo"""
    print("=" * 60)
    print("🚀 ENHANCED AUTO CREDIT MONITORING SYSTEM DEMO")
    print("=" * 60)
    
    # Create test data
    seller_user, category = create_test_data()
    livestream = create_test_livestream(seller_user, category)
    
    # Start livestream
    start_livestream_simulation(livestream)
    
    print("\n" + "=" * 60)
    print("📋 TEST 1: Normal Credit Deduction (30+ minutes)")
    print("=" * 60)
    
    # Simulate 31 minutes of streaming
    simulate_time_passage(livestream, 31)
    
    # Test credit deduction
    test_credit_deduction(livestream)
    
    print("\n" + "=" * 60)
    print("📋 TEST 2: Multiple Credit Deductions (65+ minutes)")
    print("=" * 60)
    
    # Simulate 65 minutes total (should deduct 2 more credits)
    simulate_time_passage(livestream, 65)
    
    # Test credit deduction
    test_credit_deduction(livestream)
    
    print("\n" + "=" * 60)
    print("📋 TEST 3: Inactivity Warning (10+ minutes)")
    print("=" * 60)
    
    # Simulate 12 minutes of inactivity
    simulate_inactivity(livestream, 12)
    
    # Test inactivity monitoring
    test_inactivity_monitoring(livestream)
    
    print("\n" + "=" * 60)
    print("📋 TEST 4: User Returns (Heartbeat)")
    print("=" * 60)
    
    # Send heartbeat to simulate user returning
    send_heartbeat(livestream)
    
    # Test monitoring again
    test_inactivity_monitoring(livestream)
    
    print("\n" + "=" * 60)
    print("📋 TEST 5: Auto-End Due to Inactivity (15+ minutes)")
    print("=" * 60)
    
    # Simulate 16 minutes of inactivity
    simulate_inactivity(livestream, 16)
    
    # Test inactivity monitoring (should auto-end)
    test_inactivity_monitoring(livestream)
    
    print("\n" + "=" * 60)
    print("📋 TEST 6: New Stream - Insufficient Credits")
    print("=" * 60)
    
    # Create new stream and test with 0 credits
    livestream2 = create_test_livestream(seller_user, category)
    start_livestream_simulation(livestream2)
    
    # Set credits to 0
    seller_profile = seller_user.seller_profile
    seller_profile.credits = 0
    seller_profile.save()
    print(f"✓ Set seller credits to 0")
    
    # Simulate 31 minutes and test
    simulate_time_passage(livestream2, 31)
    test_credit_deduction(livestream2)
    
    print("\n" + "=" * 60)
    print("✅ DEMO COMPLETED")
    print("=" * 60)
    
    # Summary
    livestream2.refresh_from_db()
    seller_profile.refresh_from_db()
    
    print(f"\nFinal Summary:")
    print(f"- Seller remaining credits: {seller_profile.credits}")
    print(f"- First stream status: {LiveStream.objects.get(id=livestream.id).status}")
    print(f"- Second stream status: {livestream2.status}")
    print(f"- First stream credits consumed: {LiveStream.objects.get(id=livestream.id).credits_consumed}")
    print(f"- Second stream credits consumed: {livestream2.credits_consumed}")
    
    print(f"\n🎯 Key Features Demonstrated:")
    print(f"✓ Automatic credit deduction every 30 minutes")
    print(f"✓ Multiple credit deductions for long streams")
    print(f"✓ Inactivity warning after 10 minutes")
    print(f"✓ Heartbeat mechanism to show activity")
    print(f"✓ Auto-end streams after 15 minutes of inactivity")
    print(f"✓ Auto-end streams when seller has no credits")
    
    print(f"\n📝 Next Steps:")
    print(f"1. Run the monitoring service: python manage.py monitor_credits")
    print(f"2. Or use the automatic scripts:")
    print(f"   - Windows: .\\auto_credit_monitor.ps1")
    print(f"   - Linux: ./auto_credit_monitor.sh")
    print(f"3. Frontend should send heartbeat every 5-10 minutes via /api/livestreams/{livestream.id}/heartbeat/")

if __name__ == "__main__":
    run_demo()
