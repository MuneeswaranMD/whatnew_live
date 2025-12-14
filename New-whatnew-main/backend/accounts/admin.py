from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils import timezone
from .models import CustomUser, BuyerProfile, SellerProfile, Address
from .referral_models import ReferralCode, Referral, ReferralReward, ReferralStats, ReferralCampaign
from .otp_emails import send_seller_verification_success_email

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ['username', 'email', 'user_type', 'phone_number', 'is_active', 'date_joined']
    list_filter = ['user_type', 'is_active', 'date_joined']
    search_fields = ['username', 'email', 'phone_number']
    
    fieldsets = UserAdmin.fieldsets + (
        ('Additional Info', {
            'fields': ('user_type', 'phone_number')
        }),
    )

@admin.register(BuyerProfile)
class BuyerProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'date_of_birth']
    search_fields = ['user__username', 'user__email']

@admin.register(SellerProfile)
class SellerProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'shop_name', 'verification_status', 'credits', 'is_account_active']
    list_filter = ['verification_status', 'is_account_active']
    search_fields = ['user__username', 'shop_name', 'aadhar_number', 'pan_number']
    readonly_fields = ['verified_at']
    
    actions = ['verify_sellers', 'reject_sellers']
    
    def verify_sellers(self, request, queryset):
        """Verify selected sellers and send verification email"""
        verified_count = 0
        email_sent_count = 0
        
        for seller_profile in queryset:
            # Update verification status
            seller_profile.verification_status = 'verified'
            seller_profile.is_account_active = True
            seller_profile.verified_at = timezone.now()
            
            # Activate the user account
            seller_profile.user.is_active = True
            seller_profile.user.save()
            seller_profile.save()
            
            verified_count += 1
            
            # Send verification success email
            try:
                email_success = send_seller_verification_success_email(
                    seller_profile.user, 
                    seller_profile
                )
                if email_success:
                    email_sent_count += 1
            except Exception as e:
                self.message_user(
                    request, 
                    f"Verification successful for {seller_profile.user.username}, but email failed: {str(e)}", 
                    level='warning'
                )
        
        self.message_user(
            request, 
            f"Successfully verified {verified_count} seller(s). Verification emails sent to {email_sent_count} seller(s).", 
            level='success'
        )
    verify_sellers.short_description = "Verify selected sellers"
    
    def reject_sellers(self, request, queryset):
        queryset.update(verification_status='rejected', is_account_active=False)
    reject_sellers.short_description = "Reject selected sellers"

@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'user', 'address_type', 'city', 'state', 'is_default']
    list_filter = ['address_type', 'state', 'is_default']
    search_fields = ['full_name', 'user__username', 'city', 'state']

@admin.register(ReferralCode)
class ReferralCodeAdmin(admin.ModelAdmin):
    list_display = ['code', 'user', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['code', 'user__username', 'user__email']
    readonly_fields = ['code', 'created_at']

@admin.register(Referral)
class ReferralAdmin(admin.ModelAdmin):
    list_display = ['referrer', 'referred_user', 'referral_code', 'status', 'created_at', 'completed_at']
    list_filter = ['status', 'created_at', 'completed_at']
    search_fields = ['referrer__username', 'referred_user__username', 'referral_code__code']
    readonly_fields = ['created_at']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('referrer', 'referred_user', 'referral_code')

@admin.register(ReferralReward)
class ReferralRewardAdmin(admin.ModelAdmin):
    list_display = ['recipient', 'reward_type', 'amount', 'status', 'created_at', 'credited_at']
    list_filter = ['reward_type', 'status', 'created_at']
    search_fields = ['recipient__username', 'description']
    readonly_fields = ['created_at']
    
    actions = ['mark_as_credited']
    
    def mark_as_credited(self, request, queryset):
        from django.utils import timezone
        queryset.update(status='credited', credited_at=timezone.now())
    mark_as_credited.short_description = "Mark selected rewards as credited"

@admin.register(ReferralStats)
class ReferralStatsAdmin(admin.ModelAdmin):
    list_display = ['user', 'total_referrals', 'successful_referrals', 'total_earnings', 
                   'total_credits_earned', 'current_streak', 'best_streak', 'updated_at']
    search_fields = ['user__username']
    readonly_fields = ['updated_at']

@admin.register(ReferralCampaign)
class ReferralCampaignAdmin(admin.ModelAdmin):
    list_display = ['name', 'referrer_reward_amount', 'referred_user_reward_amount', 
                   'reward_type', 'status', 'start_date', 'end_date']
    list_filter = ['status', 'reward_type', 'start_date', 'end_date']
    search_fields = ['name', 'description']
    
    def get_readonly_fields(self, request, obj=None):
        if obj:  # Editing an existing object
            return ['created_at']
        return []
