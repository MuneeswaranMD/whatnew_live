from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from . import referral_views
from . import promo_views
from . import notification_views

router = DefaultRouter()
router.register(r'addresses', views.AddressViewSet, basename='addresses')
router.register(r'notifications', notification_views.NotificationViewSet, basename='notifications')

urlpatterns = [
    # Authentication
    path('register/buyer/', views.BuyerRegistrationView.as_view(), name='buyer-register'),
    path('register/seller/', views.SellerRegistrationView.as_view(), name='seller-register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('profile/', views.ProfileView.as_view(), name='profile'),
    path('profile/update/', views.UpdateProfileView.as_view(), name='update-profile'),
    
    # Seller specific
    path('seller/verification-status/', views.SellerVerificationStatusView.as_view(), name='seller-verification-status'),
    path('seller/credits/', views.SellerCreditsView.as_view(), name='seller-credits'),
    
    # OTP endpoints
    path('forgot-password/send-otp/', views.send_forgot_password_otp_view, name='send-forgot-password-otp'),
    path('forgot-password/verify-otp/', views.verify_forgot_password_otp_view, name='verify-forgot-password-otp'),
    path('registration/send-otp/', views.send_registration_otp_view, name='send-registration-otp'),
    path('registration/verify-otp/', views.verify_registration_otp_view, name='verify-registration-otp'),
    
    # Referral endpoints
    path('referral/code/', referral_views.ReferralCodeView.as_view(), name='referral-code'),
    path('referral/apply/', referral_views.ApplyReferralCodeView.as_view(), name='apply-referral'),
    path('referral/share/', referral_views.ShareReferralView.as_view(), name='share-referral'),
    path('referral/history/', referral_views.ReferralHistoryView.as_view(), name='referral-history'),
    path('referral/stats/', referral_views.ReferralStatsView.as_view(), name='referral-stats'),
    path('referral/rewards/', referral_views.ReferralRewardsView.as_view(), name='referral-rewards'),
    path('referral/campaigns/', referral_views.ActiveCampaignsView.as_view(), name='active-campaigns'),
    path('referral/progress/', referral_views.ReferralProgressView.as_view(), name='referral-progress'),
    path('referral/<uuid:referral_id>/complete/', referral_views.CompleteReferralView.as_view(), name='complete-referral'),
    
    # Promo code endpoints
    path('promo-codes/', promo_views.UserPromoCodesView.as_view(), name='user-promo-codes'),
    path('promo-codes/available/', promo_views.AvailablePromoCodesView.as_view(), name='available-promo-codes'),
    path('promo-codes/validate/', promo_views.validate_promo_code_view, name='validate-promo-code'),
    path('promo-codes/apply/', promo_views.apply_promo_code_view, name='apply-promo-code'),
    path('referral/level-progress/', promo_views.ReferralLevelProgressView.as_view(), name='referral-level-progress'),
    
    # Router URLs
    path('', include(router.urls)),
]
