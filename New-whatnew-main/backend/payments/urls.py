from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'payments', views.PaymentViewSet, basename='payments')
router.register(r'credit-purchases', views.CreditPurchaseViewSet, basename='credit-purchases')
router.register(r'withdrawals', views.WithdrawalRequestViewSet, basename='withdrawals')

urlpatterns = [
    # Payment endpoints
    path('create-order/', views.CreateRazorpayOrderView.as_view(), name='create-razorpay-order'),
    path('verify-payment/', views.VerifyPaymentView.as_view(), name='verify-payment'),
    path('payment-failed/', views.PaymentFailedView.as_view(), name='payment-failed'),
    path('webhook/', views.RazorpayWebhookView.as_view(), name='razorpay-webhook'),
    
    # Credit management
    path('credits/purchase/', views.PurchaseCreditsView.as_view(), name='purchase-credits'),
    
    # Seller earnings and withdrawals
    path('seller/earnings/', views.SellerEarningsView.as_view(), name='seller-earnings'),
    path('seller/withdraw/', views.CreateWithdrawalRequestView.as_view(), name='create-withdrawal'),
    path('seller/stats/', views.SellerPaymentStatsView.as_view(), name='seller-payment-stats'),
    path('seller/bank-details/', views.SellerBankDetailsView.as_view(), name='seller-bank-details'),
    path('seller/update-bank-details/', views.UpdateBankDetailsView.as_view(), name='update-bank-details'),
    
    # Wallet
    path('wallet/', views.WalletView.as_view(), name='wallet'),
    path('wallet/transactions/', views.WalletTransactionsView.as_view(), name='wallet-transactions'),
    
    # Invoice and reporting
    path('invoice/<str:transaction_id>/view/', views.InvoiceViewView.as_view(), name='invoice-view'),
    path('invoice/<str:transaction_id>/download/', views.InvoiceDownloadView.as_view(), name='invoice-download'),
    path('invoice/<str:transaction_id>/test/', views.TestInvoiceView.as_view(), name='invoice-test'),
    path('download-report/', views.DownloadReportView.as_view(), name='download-report'),
    path('usage-history/', views.UsageHistoryView.as_view(), name='usage-history'),
    
    # Admin wallet management (superuser only)
    path('admin/wallet/', views.AdminWalletView.as_view(), name='admin-wallet'),
    path('admin/wallet/history/', views.AdminWalletHistoryView.as_view(), name='admin-wallet-history'),
    path('admin/dashboard/stats/', views.AdminDashboardStatsView.as_view(), name='admin-dashboard-stats'),
    path('admin/revenue/report/', views.AdminRevenueReportView.as_view(), name='admin-revenue-report'),
    
    # Router URLs
    path('', include(router.urls)),
]
