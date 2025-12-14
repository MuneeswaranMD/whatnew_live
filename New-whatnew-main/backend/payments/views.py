from rest_framework import viewsets, generics, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db import transaction
from django.conf import settings
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import razorpay
import hmac
import hashlib
from .models import (
    Payment, CreditPurchase, SellerEarnings, WithdrawalRequest, 
    Wallet, WalletTransaction, SellerBankDetails, AdminWallet, AdminWalletHistory
)
from orders.models import Order
from .serializers import (
    PaymentSerializer, CreateRazorpayOrderSerializer, VerifyPaymentSerializer,
    CreditPurchaseSerializer, PurchaseCreditsSerializer, SellerEarningsSerializer,
    WithdrawalRequestSerializer, CreateWithdrawalRequestSerializer,
    WalletSerializer, WalletTransactionSerializer, UpdateBankDetailsSerializer,
    SellerPaymentStatsSerializer, SellerBankDetailsSerializer, AdminWalletSerializer,
    AdminWalletHistorySerializer, AdminDashboardStatsSerializer
)

# Initialize Razorpay client
razorpay_client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

def _distribute_order_funds(order):
    """
    Distribute order funds to appropriate wallets:
    - Product price goes to seller's wallet (only the product amount)
    - Platform fee and shipping fee go to admin wallet
    """
    from django.contrib.auth import get_user_model
    from decimal import Decimal
    
    User = get_user_model()
    
    # Get or create admin wallet instance
    admin_wallet = AdminWallet.get_instance()
    
    # Calculate platform fee (this should be extracted from order logic)
    # For now, we'll calculate based on the current order structure
    platform_fee = Decimal('3.0')  # Fixed platform fee per order
    
    # Add admin revenues with detailed tracking
    admin_wallet.add_revenue(
        amount=platform_fee,
        category='platform_fee',
        description=f'Platform fee for order {order.order_number}',
        order=order
    )
    
    admin_wallet.add_revenue(
        amount=order.shipping_fee,
        category='shipping_fee', 
        description=f'Shipping fee for order {order.order_number}',
        order=order
    )
    
    if order.tax_amount > 0:
        admin_wallet.add_revenue(
            amount=order.tax_amount,
            category='tax_amount',
            description=f'Tax amount for order {order.order_number}',
            order=order
        )
    
    # Create admin wallet history entries
    AdminWalletHistory.objects.create(
        admin_wallet=admin_wallet,
        transaction_type='platform_fee',
        amount=platform_fee,
        description=f'Platform fee for order {order.order_number}',
        order=order,
        reference_id=order.order_number,
        metadata={
            'order_total': str(order.total_amount),
            'subtotal': str(order.subtotal),
            'fee_percentage': '3.0'
        }
    )
    
    AdminWalletHistory.objects.create(
        admin_wallet=admin_wallet,
        transaction_type='shipping_fee',
        amount=order.shipping_fee,
        description=f'Shipping fee for order {order.order_number}',
        order=order,
        reference_id=order.order_number,
        metadata={
            'order_total': str(order.total_amount),
            'shipping_method': 'standard'
        }
    )
    
    if order.tax_amount > 0:
        AdminWalletHistory.objects.create(
            admin_wallet=admin_wallet,
            transaction_type='tax_amount',
            amount=order.tax_amount,
            description=f'Tax collected for order {order.order_number}',
            order=order,
            reference_id=order.order_number,
            metadata={
                'tax_rate': '18.0',
                'taxable_amount': str(order.subtotal)
            }
        )
    
    print(f"Added platform fees to admin wallet for order {order.order_number}")
    
    # Distribute only product amounts to sellers (subtotal is distributed among sellers)
    for item in order.items.all():
        seller_user = item.seller
        
        # Get or create seller wallet
        seller_wallet, created = Wallet.objects.get_or_create(user=seller_user)
        if created:
            print(f"Created seller wallet for user: {seller_user.username}")
        
        # Add only the product earnings to seller wallet (item.total_price is the product amount)
        product_earnings = item.total_price
        seller_wallet.balance += product_earnings
        seller_wallet.save()
        
        # Create detailed seller wallet transaction
        WalletTransaction.objects.create(
            wallet=seller_wallet,
            transaction_type='credit',
            category='product_sale',
            amount=product_earnings,
            description=f'Sale revenue for {item.product_name} (Qty: {item.quantity}) from order {order.order_number}',
            order=order,
            reference_id=order.order_number,
            metadata={
                'product_id': str(item.product.id),
                'product_name': item.product_name,
                'quantity': item.quantity,
                'unit_price': str(item.unit_price)
            }
        )
        
        # Create seller earnings record
        SellerEarnings.objects.create(
            seller=seller_user,
            order_item=item,
            gross_amount=product_earnings,
            platform_fee=0,  # No platform fee deducted from seller
            net_amount=product_earnings
        )
        
        print(f"Added ₹{product_earnings} to seller {seller_user.username}'s wallet for order {order.order_number}")

class PaymentViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Payment.objects.filter(user=self.request.user).order_by('-created_at')

class CreateRazorpayOrderView(generics.CreateAPIView):
    serializer_class = CreateRazorpayOrderSerializer
    permission_classes = [IsAuthenticated]
    
    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        amount = serializer.validated_data['amount']
        order_id = serializer.validated_data.get('order_id')
        purpose = serializer.validated_data['purpose']
        
        try:
            # Create real Razorpay order
            import time
            # Generate a short receipt (max 40 chars for Razorpay)
            timestamp = str(int(time.time()))[-8:]  # Last 8 digits of timestamp
            if purpose == 'order_payment' and order_id:
                order_id_str = str(order_id)  # Convert UUID to string first
                receipt = f'ord_{order_id_str[:8]}_{timestamp}'  # ord_12345678_87654321
            else:
                receipt = f'crd_{request.user.id.hex[:8]}_{timestamp}'  # crd_12345678_87654321
            
            razorpay_order = razorpay_client.order.create({
                'amount': int(amount * 100),  # Convert to paise
                'currency': 'INR',
                'receipt': receipt,
                'payment_capture': 1
            })
            razorpay_order_id = razorpay_order['id']
            print(f"Created Razorpay order: {razorpay_order_id}")
            
            # Create payment record
            order_instance = None
            if purpose == 'order_payment' and order_id:
                try:
                    order_instance = Order.objects.get(id=order_id, user=request.user)
                    print(f"Found order {order_instance.order_number} for payment")
                except Order.DoesNotExist:
                    print(f"Order {order_id} not found for user {request.user.username}")
                    return Response({
                        'error': 'Order not found'
                    }, status=status.HTTP_404_NOT_FOUND)
            
            payment = Payment.objects.create(
                user=request.user,
                order=order_instance,
                amount=amount,
                payment_method='razorpay',
                razorpay_order_id=razorpay_order_id
            )
            
            print(f"Created payment {payment.id} linked to order {order_instance.order_number if order_instance else 'None'}")
            
            return Response({
                'razorpay_order_id': razorpay_order_id,
                'amount': amount,
                'currency': 'INR',
                'key': settings.RAZORPAY_KEY_ID or 'test_key',
                'payment_id': str(payment.id)
            })
            
        except Exception as e:
            print(f"Payment order creation error: {e}")
            return Response({
                'error': f'Failed to create Razorpay order: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)

class VerifyPaymentView(generics.CreateAPIView):
    serializer_class = VerifyPaymentSerializer
    permission_classes = [IsAuthenticated]
    
    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        razorpay_order_id = serializer.validated_data['razorpay_order_id']
        razorpay_payment_id = serializer.validated_data['razorpay_payment_id']
        razorpay_signature = serializer.validated_data['razorpay_signature']
        
        try:
            # Verify signature for real payments
            body = razorpay_order_id + "|" + razorpay_payment_id
            expected_signature = hmac.new(
                key=settings.RAZORPAY_KEY_SECRET.encode(),
                msg=body.encode(),
                digestmod=hashlib.sha256
            ).hexdigest()
            
            if not hmac.compare_digest(expected_signature, razorpay_signature):
                return Response({
                    'error': 'Invalid payment signature'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Get payment record
            payment = Payment.objects.get(
                razorpay_order_id=razorpay_order_id,
                user=request.user
            )
            
            with transaction.atomic():
                # Update payment
                payment.razorpay_payment_id = razorpay_payment_id
                payment.razorpay_signature = razorpay_signature
                payment.status = 'completed'
                payment.completed_at = timezone.now()
                payment.save()
                
                # Handle based on payment purpose
                if payment.order:
                    # Order payment
                    order = payment.order
                    order.status = 'confirmed'
                    order.payment_status = 'completed'
                    order.confirmed_at = timezone.now()
                    order.save()
                    
                    # Create order tracking
                    from orders.models import OrderTracking
                    OrderTracking.objects.create(
                        order=order,
                        status='confirmed',
                        notes='Payment completed',
                        created_by=request.user
                    )
                    
                    # Send email notifications
                    from orders.emails import (
                        send_payment_success_email,
                        send_payment_receipt_email,
                        send_invoice_email,
                        send_order_confirmation_email,
                        send_order_notification_to_sellers
                    )
                    
                    try:
                        # Send order confirmation email to customer (now that payment is successful)
                        send_order_confirmation_email(order)
                        
                        # Send payment receipt email to customer (new comprehensive receipt)
                        send_payment_receipt_email(order, razorpay_payment_id, 'Razorpay')
                        
                        # Send payment success email to customer (existing)
                        send_payment_success_email(order, razorpay_payment_id)
                        
                        # Send invoice email to customer
                        send_invoice_email(order)
                        
                        # Send order notification to sellers (now that payment is confirmed)
                        send_order_notification_to_sellers(order)
                        
                        print(f"All email notifications sent for order {order.order_number}")
                    except Exception as e:
                        print(f"Error sending email notifications: {e}")
                    
                    # Distribute funds to wallets
                    _distribute_order_funds(order)
                    
                    # Clear cart after successful payment
                    from orders.models import Cart
                    try:
                        cart = Cart.objects.get(user=request.user)
                        cart.items.all().delete()
                        print(f"Cart cleared for user {request.user.username} after successful payment")
                    except Cart.DoesNotExist:
                        pass
                    
                    message = 'Payment successful! Order confirmed.'
                else:
                    # Credit purchase - add credits to user account and send email
                    try:
                        credit_purchase = CreditPurchase.objects.get(payment=payment)
                        credit_purchase.status = 'completed'
                        credit_purchase.save()
                        
                        # Add credits to user account
                        from accounts.models import SellerProfile
                        seller_profile, created = SellerProfile.objects.get_or_create(user=request.user)
                        seller_profile.credits += credit_purchase.credits_purchased
                        seller_profile.save()
                        
                        # Add credit purchase revenue to admin wallet
                        admin_wallet = AdminWallet.get_instance()
                        admin_wallet.add_revenue(
                            amount=credit_purchase.total_amount,
                            category='credit_purchase',
                            description=f'Credit purchase revenue - {credit_purchase.credits_purchased} credits sold to {request.user.username}',
                            credit_purchase=credit_purchase
                        )
                        
                        # Create admin wallet history entry
                        AdminWalletHistory.objects.create(
                            admin_wallet=admin_wallet,
                            transaction_type='credit_purchase',
                            amount=credit_purchase.total_amount,
                            description=f'Credit purchase: {credit_purchase.credits_purchased} credits sold to {request.user.username}',
                            credit_purchase=credit_purchase,
                            reference_id=str(credit_purchase.id),
                            metadata={
                                'credits_purchased': credit_purchase.credits_purchased,
                                'price_per_credit': str(credit_purchase.price_per_credit),
                                'buyer': request.user.username,
                                'payment_id': str(payment.id)
                            }
                        )
                        
                        # Send success email with invoice
                        from .emails import send_credit_purchase_success_email
                        try:
                            send_credit_purchase_success_email(credit_purchase, razorpay_payment_id)
                        except Exception as e:
                            print(f"Error sending credit purchase success email: {e}")
                        
                        print(f"Added {credit_purchase.credits_purchased} credits to user {request.user.username}")
                        print(f"Added ₹{credit_purchase.total_amount} credit revenue to admin wallet")
                        message = f'Payment successful! {credit_purchase.credits_purchased} credits added to your account.'
                        
                    except CreditPurchase.DoesNotExist:
                        print(f"CreditPurchase record not found for payment {payment.id}")
                        message = 'Payment successful!'
                
                return Response({
                    'message': message,
                    'payment_status': 'completed'
                })
                
        except Payment.DoesNotExist:
            # Payment record not found - this is a verification failure
            from orders.emails import send_payment_verification_failed_email
            try:
                # Try to find order by razorpay_order_id in any payment
                payment = Payment.objects.filter(razorpay_order_id=razorpay_order_id).first()
                if payment and payment.order:
                    send_payment_verification_failed_email(payment.order, razorpay_payment_id)
            except Exception as e:
                print(f"Error sending verification failed email: {e}")
                
            return Response({
                'error': 'Payment record not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            # General verification failure
            from orders.emails import send_payment_verification_failed_email
            try:
                # Try to find the order for notification
                payment = Payment.objects.filter(razorpay_order_id=razorpay_order_id).first()
                if payment and payment.order:
                    send_payment_verification_failed_email(payment.order, razorpay_payment_id)
            except Exception as email_error:
                print(f"Error sending verification failed email: {email_error}")
                
            print(f"Payment verification error: {e}")
            return Response({
                'error': 'Payment verification failed'
            }, status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name='dispatch')
class RazorpayWebhookView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        # Handle Razorpay webhook events
        try:
            payload = request.body
            signature = request.META.get('HTTP_X_RAZORPAY_SIGNATURE')
            
            # Verify webhook signature
            expected_signature = hmac.new(
                key=settings.RAZORPAY_KEY_SECRET.encode(),
                msg=payload,
                digestmod=hashlib.sha256
            ).hexdigest()
            
            if not hmac.compare_digest(expected_signature, signature):
                return Response({'error': 'Invalid signature'}, status=400)
            
            # Process webhook event
            import json
            event = json.loads(payload.decode('utf-8'))
            
            if event['event'] == 'payment.captured':
                # Handle successful payment
                payment_data = event['payload']['payment']['entity']
                order_id = payment_data['order_id']
                
                try:
                    payment = Payment.objects.get(razorpay_order_id=order_id)
                    if payment.status == 'pending':
                        payment.status = 'completed'
                        payment.completed_at = timezone.now()
                        payment.save()
                except Payment.DoesNotExist:
                    pass
            
            elif event['event'] == 'payment.failed':
                # Handle failed payment
                payment_data = event['payload']['payment']['entity']
                order_id = payment_data['order_id']
                
                try:
                    payment = Payment.objects.get(razorpay_order_id=order_id)
                    payment.status = 'failed'
                    payment.failure_reason = payment_data.get('error_description', 'Payment failed')
                    payment.save()
                except Payment.DoesNotExist:
                    pass
            
            return Response({'status': 'ok'})
            
        except Exception as e:
            return Response({'error': 'Webhook processing failed'}, status=400)

class CreditPurchaseViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CreditPurchaseSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.user_type != 'seller':
            return CreditPurchase.objects.none()
        return CreditPurchase.objects.filter(seller=self.request.user).order_by('-created_at')
    
    def list(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        # Transform CreditPurchase data to transaction format
        transactions = []
        for purchase in serializer.data:
            # Get payment info if available
            razorpay_payment_id = None
            try:
                credit_purchase_obj = CreditPurchase.objects.get(id=purchase['id'])
                if credit_purchase_obj.payment and credit_purchase_obj.payment.razorpay_payment_id:
                    razorpay_payment_id = credit_purchase_obj.payment.razorpay_payment_id
            except:
                pass
                
            transactions.append({
                'id': purchase['id'],
                'transaction_type': 'purchase',
                'credits': purchase['credits_purchased'],
                'amount': purchase['total_amount'],
                'status': purchase['status'],
                'description': f"Purchased {purchase['credits_purchased']} credits",
                'created_at': purchase['created_at'],
                'razorpay_payment_id': razorpay_payment_id
            })
        
        return Response({
            'transactions': transactions
        })

class PurchaseCreditsView(generics.CreateAPIView):
    serializer_class = PurchaseCreditsSerializer
    permission_classes = [IsAuthenticated]
    
    def create(self, request):
        if request.user.user_type != 'seller':
            return Response({'error': 'Only sellers can purchase credits'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        credits = serializer.validated_data['credits']
        # Use custom amount if provided, otherwise default pricing
        if 'amount' in serializer.validated_data and serializer.validated_data['amount']:
            total_amount = serializer.validated_data['amount']
        else:
            price_per_credit = 10  # ₹10 per credit
            total_amount = credits * price_per_credit
        
        try:
            # Create Razorpay order
            import time
            timestamp = str(int(time.time()))[-8:]  # Last 8 digits of timestamp
            receipt = f'crd_{request.user.id.hex[:8]}_{timestamp}'  # crd_12345678_87654321
            
            razorpay_order = razorpay_client.order.create({
                'amount': int(total_amount * 100),  # Convert to paise
                'currency': 'INR',
                'receipt': receipt,
                'payment_capture': 1
            })
            
            # Create payment record
            payment = Payment.objects.create(
                user=request.user,
                amount=total_amount,
                payment_method='razorpay',
                razorpay_order_id=razorpay_order['id']
            )
            
            # Create credit purchase record
            price_per_credit = total_amount / credits  # Calculate actual price per credit
            credit_purchase = CreditPurchase.objects.create(
                seller=request.user,
                payment=payment,
                credits_purchased=credits,
                price_per_credit=price_per_credit,
                total_amount=total_amount
            )
            
            return Response({
                'razorpay_order_id': razorpay_order['id'],
                'amount': total_amount,
                'currency': 'INR',
                'key': settings.RAZORPAY_KEY_ID,
                'credits': credits,
                'credit_purchase_id': str(credit_purchase.id)
            })
            
        except Exception as e:
            return Response({
                'error': 'Failed to create credit purchase order'
            }, status=status.HTTP_400_BAD_REQUEST)

class SellerEarningsView(generics.ListAPIView):
    serializer_class = SellerEarningsSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.user_type != 'seller':
            return SellerEarnings.objects.none()
        return SellerEarnings.objects.filter(seller=self.request.user).order_by('-created_at')
    
    def get(self, request):
        queryset = self.get_queryset()
        
        # Calculate totals
        total_earnings = sum(earning.net_amount for earning in queryset)
        withdrawn_earnings = sum(earning.net_amount for earning in queryset if earning.is_withdrawn)
        available_earnings = total_earnings - withdrawn_earnings
        
        serializer = self.get_serializer(queryset, many=True)
        
        return Response({
            'earnings': serializer.data,
            'total_earnings': total_earnings,
            'withdrawn_earnings': withdrawn_earnings,
            'available_earnings': available_earnings
        })

class WithdrawalRequestViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = WithdrawalRequestSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.user_type != 'seller':
            return WithdrawalRequest.objects.none()
        return WithdrawalRequest.objects.filter(seller=self.request.user).order_by('-requested_at')

class CreateWithdrawalRequestView(generics.CreateAPIView):
    serializer_class = CreateWithdrawalRequestSerializer
    permission_classes = [IsAuthenticated]
    
    def create(self, request):
        if request.user.user_type != 'seller':
            return Response({'error': 'Only sellers can request withdrawals'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        
        try:
            with transaction.atomic():
                amount = serializer.validated_data['amount']
                
                # Save or update bank details
                bank_details_data = {
                    'account_holder_name': serializer.validated_data['account_holder_name'],
                    'bank_name': serializer.validated_data['bank_name'],
                    'account_number': serializer.validated_data['bank_account_number'],
                    'ifsc_code': serializer.validated_data['bank_ifsc_code'],
                    'mobile_number': serializer.validated_data['mobile_number']
                }
                
                # Update or create seller bank details
                SellerBankDetails.objects.update_or_create(
                    seller=request.user,
                    defaults=bank_details_data
                )
                
                # Create withdrawal request with bank details
                withdrawal = WithdrawalRequest.objects.create(
                    seller=request.user,
                    amount=amount,
                    bank_details=bank_details_data
                )
                
                # Mark earnings as withdrawn (reserved)
                earnings_to_withdraw = SellerEarnings.objects.filter(
                    seller=request.user,
                    is_withdrawn=False
                ).order_by('created_at')
                
                remaining_amount = amount
                for earning in earnings_to_withdraw:
                    if remaining_amount <= 0:
                        break
                    
                    if earning.net_amount <= remaining_amount:
                        earning.is_withdrawn = True
                        earning.save()
                        remaining_amount -= earning.net_amount
                    else:
                        # Partial withdrawal (shouldn't happen with current logic)
                        break
                
                return Response({
                    'message': 'Withdrawal request created successfully',
                    'withdrawal_id': str(withdrawal.id),
                    'amount': amount,
                    'status': 'pending'
                }, status=status.HTTP_201_CREATED)
                
        except Exception as e:
            return Response({
                'error': f'Failed to create withdrawal request: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)

class WalletView(generics.RetrieveAPIView):
    serializer_class = WalletSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        wallet, created = Wallet.objects.get_or_create(user=self.request.user)
        return wallet

class WalletTransactionsView(generics.ListAPIView):
    serializer_class = WalletTransactionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        try:
            wallet = Wallet.objects.get(user=self.request.user)
            return WalletTransaction.objects.filter(wallet=wallet).order_by('-created_at')
        except Wallet.DoesNotExist:
            return WalletTransaction.objects.none()

@method_decorator(csrf_exempt, name='dispatch')
class PaymentFailedView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    
    def create(self, request):
        """Handle payment failure and send failure email"""
        razorpay_order_id = request.data.get('razorpay_order_id')
        razorpay_payment_id = request.data.get('razorpay_payment_id')
        error_reason = request.data.get('error_reason', 'Payment failed')
        
        try:
            # Find the payment record
            payment = Payment.objects.get(
                razorpay_order_id=razorpay_order_id,
                user=request.user
            )
            
            # Update payment status to failed
            payment.status = 'failed'
            payment.failure_reason = error_reason
            payment.save()
            
            if payment.order:
                # Order payment failed
                order = payment.order
                order.payment_status = 'failed'
                order.save()
                
                # Send order payment failure email (if exists)
                try:
                    from orders.emails import send_payment_failure_email
                    send_payment_failure_email(order, razorpay_payment_id, error_reason)
                except Exception as e:
                    print(f"Error sending order payment failure email: {e}")
            else:
                # Credit purchase failed
                try:
                    credit_purchase = CreditPurchase.objects.get(payment=payment)
                    credit_purchase.status = 'failed'
                    credit_purchase.save()
                    
                    # Send credit purchase failure email
                    from .emails import send_credit_purchase_failed_email
                    send_credit_purchase_failed_email(
                        user=request.user,
                        credits=credit_purchase.credits_purchased,
                        amount=credit_purchase.total_amount,
                        razorpay_payment_id=razorpay_payment_id
                    )
                    
                except CreditPurchase.DoesNotExist:
                    print(f"CreditPurchase record not found for failed payment {payment.id}")
            
            return Response({
                'message': 'Payment failure recorded',
                'payment_status': 'failed'
            })
            
        except Payment.DoesNotExist:
            return Response({
                'error': 'Payment record not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(f"Error handling payment failure: {e}")
            return Response({
                'error': 'Failed to process payment failure'
            }, status=status.HTTP_400_BAD_REQUEST)

class SellerBankDetailsView(generics.RetrieveUpdateAPIView):
    serializer_class = SellerBankDetailsSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        if self.request.user.user_type != 'seller':
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('Only sellers can access bank details')
        
        bank_details, created = SellerBankDetails.objects.get_or_create(
            seller=self.request.user
        )
        return bank_details

class UpdateBankDetailsView(generics.CreateAPIView):
    serializer_class = UpdateBankDetailsSerializer
    permission_classes = [IsAuthenticated]
    
    def create(self, request):
        if request.user.user_type != 'seller':
            return Response({'error': 'Only sellers can update bank details'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            bank_details_data = {
                'account_holder_name': serializer.validated_data['account_holder_name'],
                'bank_name': serializer.validated_data['bank_name'],
                'account_number': serializer.validated_data['bank_account_number'],
                'ifsc_code': serializer.validated_data['bank_ifsc_code'],
                'mobile_number': serializer.validated_data['mobile_number']
            }
            
            # Update or create seller bank details
            bank_details, created = SellerBankDetails.objects.update_or_create(
                seller=request.user,
                defaults=bank_details_data
            )
            
            return Response({
                'message': 'Bank details updated successfully',
                'bank_details': SellerBankDetailsSerializer(bank_details).data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'error': f'Failed to update bank details: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)

class SellerPaymentStatsView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        if request.user.user_type != 'seller':
            return Response({'error': 'Only sellers can access payment stats'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        try:
            from django.db.models import Sum
            from datetime import datetime, timedelta
            from django.utils import timezone
            
            # Calculate stats
            total_earnings = SellerEarnings.objects.filter(
                seller=request.user
            ).aggregate(total=Sum('net_amount'))['total'] or 0
            
            available_balance = SellerEarnings.objects.filter(
                seller=request.user,
                is_withdrawn=False
            ).aggregate(total=Sum('net_amount'))['total'] or 0
            
            pending_withdrawals = WithdrawalRequest.objects.filter(
                seller=request.user,
                status__in=['pending', 'processing']
            ).aggregate(total=Sum('amount'))['total'] or 0
            
            total_withdrawals = WithdrawalRequest.objects.filter(
                seller=request.user,
                status='completed'
            ).aggregate(total=Sum('amount'))['total'] or 0
            
            # This month earnings
            current_month_start = timezone.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            this_month_earnings = SellerEarnings.objects.filter(
                seller=request.user,
                created_at__gte=current_month_start
            ).aggregate(total=Sum('net_amount'))['total'] or 0
            
            stats = {
                'total_earnings': float(total_earnings),
                'available_balance': float(available_balance),
                'pending_withdrawals': float(pending_withdrawals),
                'total_withdrawals': float(total_withdrawals),
                'this_month_earnings': float(this_month_earnings)
            }
            
            return Response(stats)
            
        except Exception as e:
            return Response({
                'error': f'Failed to get payment stats: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)

from django.http import HttpResponse, Http404
from django.template.loader import render_to_string
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import csv
import io
import datetime

# Register Unicode font for rupee symbol support
try:
    # Try to use a system font that supports Unicode
    from reportlab.lib.fonts import addMapping
    addMapping('Helvetica', 0, 0, 'Helvetica')
    addMapping('Helvetica', 0, 1, 'Helvetica-Oblique')
    addMapping('Helvetica', 1, 0, 'Helvetica-Bold')
    addMapping('Helvetica', 1, 1, 'Helvetica-BoldOblique')
except Exception as e:
    print(f"Font mapping error: {e}")
    pass

class InvoiceViewView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, transaction_id):
        """View invoice in browser"""
        try:
            # Find the credit purchase by transaction ID
            print(f"Looking for credit purchase with ID: {transaction_id}")
            print(f"User: {request.user.username}")
            
            # First check if the credit purchase exists at all
            try:
                credit_purchase = CreditPurchase.objects.get(
                    id=transaction_id,
                    seller=request.user
                )
                print(f"Found credit purchase: {credit_purchase.id}, status: {credit_purchase.status}")
            except CreditPurchase.DoesNotExist:
                print("Credit purchase not found")
                raise Http404("Credit purchase not found")
            
            # Check if completed
            if credit_purchase.status != 'completed':
                return HttpResponse(f"<h3>Invoice not available</h3><p>This credit purchase is {credit_purchase.status}. Invoices are only available for completed purchases.</p>")
            
            # Generate HTML invoice
            context = {
                'credit_purchase': credit_purchase,
                'user': request.user,
                'company_name': 'WhatNew',
                'invoice_date': credit_purchase.created_at,
                'invoice_number': f'INV-{credit_purchase.id}',
            }
            
            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <title>Invoice - {context['invoice_number']}</title>
                <style>
                    body {{ font-family: Arial, sans-serif; margin: 40px; }}
                    .header {{ text-align: center; margin-bottom: 30px; }}
                    .company-name {{ font-size: 24px; font-weight: bold; color: #007bff; }}
                    .invoice-title {{ font-size: 20px; margin: 20px 0; }}
                    .invoice-details {{ margin: 20px 0; }}
                    .table {{ width: 100%; border-collapse: collapse; margin: 20px 0; }}
                    .table th, .table td {{ border: 1px solid #ddd; padding: 12px; text-align: left; }}
                    .table th {{ background-color: #f8f9fa; }}
                    .total-row {{ font-weight: bold; background-color: #e9ecef; }}
                    .footer {{ margin-top: 30px; text-align: center; color: #666; }}
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="company-name">WhatNew</div>
                    <div>Credit Purchase Invoice</div>
                </div>
                
                <div class="invoice-details">
                    <h2 class="invoice-title">Invoice #{context['invoice_number']}</h2>
                    <p><strong>Date:</strong> {context['invoice_date'].strftime('%B %d, %Y')}</p>
                    <p><strong>Customer:</strong> {request.user.get_full_name() or request.user.username}</p>
                    <p><strong>Email:</strong> {request.user.email}</p>
                    <p><strong>Payment ID:</strong> {credit_purchase.payment.razorpay_payment_id or 'N/A'}</p>
                </div>
                
                <table class="table">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Livestream Credits</td>
                            <td>{credit_purchase.credits_purchased}</td>
                            <td>&#8377;{credit_purchase.price_per_credit:.2f}</td>
                            <td>&#8377;{credit_purchase.total_amount}</td>
                        </tr>
                        <tr class="total-row">
                            <td colspan="3"><strong>Total Amount</strong></td>
                            <td><strong>&#8377;{credit_purchase.total_amount}</strong></td>
                        </tr>
                    </tbody>
                </table>
                
                <div class="footer">
                    <p>Thank you for your purchase!</p>
                    <p>WhatNew - Your Livestreaming Partner</p>
                </div>
            </body>
            </html>
            """
            
            return HttpResponse(html_content, content_type='text/html')
            
        except CreditPurchase.DoesNotExist:
            raise Http404("Invoice not found")
        except Exception as e:
            return Response({
                'error': f'Failed to view invoice: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)

class InvoiceDownloadView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, transaction_id):
        """Download invoice as PDF"""
        try:
            # Find the credit purchase by transaction ID
            print(f"Looking for credit purchase for download with ID: {transaction_id}")
            
            # First check if the credit purchase exists at all
            try:
                credit_purchase = CreditPurchase.objects.get(
                    id=transaction_id,
                    seller=request.user
                )
                print(f"Found credit purchase for download: {credit_purchase.id}, status: {credit_purchase.status}")
            except CreditPurchase.DoesNotExist:
                print("Credit purchase not found for download")
                raise Http404("Credit purchase not found")
            
            # Check if completed
            if credit_purchase.status != 'completed':
                return HttpResponse(f"Invoice not available. This credit purchase is {credit_purchase.status}.", content_type='text/plain')
            
            # Create PDF
            buffer = io.BytesIO()
            doc = SimpleDocTemplate(buffer, pagesize=letter)
            styles = getSampleStyleSheet()
            story = []
            
            # Header
            header_style = ParagraphStyle(
                'CustomHeader',
                parent=styles['Heading1'],
                fontSize=24,
                textColor=colors.blue,
                alignment=1  # Center alignment
            )
            story.append(Paragraph("WhatNew", header_style))
            story.append(Paragraph("Credit Purchase Invoice", styles['Heading2']))
            story.append(Spacer(1, 20))
            
            # Invoice details
            invoice_data = [
                ['Invoice Number:', f'INV-{credit_purchase.id}'],
                ['Date:', credit_purchase.created_at.strftime('%B %d, %Y')],
                ['Customer:', request.user.get_full_name() or request.user.username],
                ['Email:', request.user.email],
                ['Payment ID:', credit_purchase.payment.razorpay_payment_id or 'N/A'],
            ]
            
            details_table = Table(invoice_data, colWidths=[2*inch, 4*inch])
            details_table.setStyle(TableStyle([
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 10),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ]))
            story.append(details_table)
            story.append(Spacer(1, 20))
            
            # Items table
            items_data = [
                ['Description', 'Quantity', 'Unit Price', 'Total'],
                ['Livestream Credits', 
                 str(credit_purchase.credits_purchased), 
                 f'INR {credit_purchase.price_per_credit:.2f}', 
                 f'INR {credit_purchase.total_amount}'],
                ['', '', 'Total Amount:', f'INR {credit_purchase.total_amount}']
            ]
            
            items_table = Table(items_data, colWidths=[3*inch, 1*inch, 1.5*inch, 1.5*inch])
            items_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 10),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
                ('BACKGROUND', (0, 2), (-1, 2), colors.beige),
                ('FONTNAME', (2, 2), (-1, 2), 'Helvetica-Bold'),
                ('GRID', (0, 0), (-1, -1), 1, colors.black)
            ]))
            story.append(items_table)
            story.append(Spacer(1, 30))
            
            # Footer
            story.append(Paragraph("Thank you for your purchase!", styles['Normal']))
            story.append(Paragraph("WhatNew - Your Livestreaming Partner", styles['Normal']))
            
            doc.build(story)
            buffer.seek(0)
            
            response = HttpResponse(buffer.getvalue(), content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="invoice-{credit_purchase.id}.pdf"'
            
            return response
            
        except CreditPurchase.DoesNotExist:
            raise Http404("Invoice not found")
        except Exception as e:
            return Response({
                'error': f'Failed to download invoice: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)

class DownloadReportView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        """Download comprehensive credit report as PDF"""
        try:
            # Get filter parameters
            start_date = request.data.get('start_date')
            end_date = request.data.get('end_date')
            status_filter = request.data.get('status', 'all')
            type_filter = request.data.get('type', 'all')
            
            # Query credit purchases
            queryset = CreditPurchase.objects.filter(seller=request.user)
            
            # Apply filters
            if start_date:
                queryset = queryset.filter(created_at__gte=start_date)
            if end_date:
                queryset = queryset.filter(created_at__lte=end_date + ' 23:59:59')
            if status_filter and status_filter != 'all':
                queryset = queryset.filter(status=status_filter)
            
            transactions = queryset.order_by('-created_at')
            
            # Create PDF
            buffer = io.BytesIO()
            doc = SimpleDocTemplate(buffer, pagesize=letter)
            styles = getSampleStyleSheet()
            story = []
            
            # Header
            header_style = ParagraphStyle(
                'CustomHeader',
                parent=styles['Heading1'],
                fontSize=20,
                textColor=colors.blue,
                alignment=1
            )
            story.append(Paragraph("WhatNew - Credit Transaction Report", header_style))
            story.append(Spacer(1, 20))
            
            # Report details
            report_data = [
                ['Report Generated:', timezone.now().strftime('%B %d, %Y at %I:%M %p')],
                ['User:', request.user.get_full_name() or request.user.username],
                ['Period:', f"{start_date or 'All time'} to {end_date or 'Present'}"],
                ['Total Transactions:', str(transactions.count())],
            ]
            
            details_table = Table(report_data, colWidths=[2*inch, 4*inch])
            details_table.setStyle(TableStyle([
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 10),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ]))
            story.append(details_table)
            story.append(Spacer(1, 20))
            
            # Transactions table
            if transactions.exists():
                table_data = [['Date', 'Credits', 'Amount', 'Status']]
                
                for transaction in transactions:
                    table_data.append([
                        transaction.created_at.strftime('%m/%d/%Y'),
                        str(transaction.credits_purchased),
                        f'INR {transaction.total_amount}',
                        transaction.status.title()
                    ])
                
                # Summary row
                total_credits = sum(t.credits_purchased for t in transactions if t.status == 'completed')
                total_amount = sum(t.total_amount for t in transactions if t.status == 'completed')
                table_data.append(['Total:', str(total_credits), f'INR {total_amount}', ''])
                
                trans_table = Table(table_data, colWidths=[1.5*inch, 1*inch, 1.5*inch, 1*inch])
                trans_table.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
                    ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                    ('FONTSIZE', (0, 0), (-1, -1), 9),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
                    ('BACKGROUND', (0, -1), (-1, -1), colors.beige),
                    ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
                    ('GRID', (0, 0), (-1, -1), 1, colors.black)
                ]))
                story.append(trans_table)
            else:
                story.append(Paragraph("No transactions found for the selected criteria.", styles['Normal']))
            
            doc.build(story)
            buffer.seek(0)
            
            response = HttpResponse(buffer.getvalue(), content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="credit-report-{timezone.now().strftime("%Y%m%d")}.pdf"'
            
            return response
            
        except Exception as e:
            return Response({
                'error': f'Failed to generate report: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)

class UsageHistoryView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get credit usage history and analytics"""
        try:
            # This would typically come from livestream usage tracking
            # For now, return sample data structure
            usage_history = {
                'daily_usage': [],
                'monthly_usage': [],
                'total_usage': 0,
                'remaining_credits': 0
            }
            
            return Response(usage_history)
            
        except Exception as e:
            return Response({
                'error': f'Failed to get usage history: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)

# Admin Wallet Management Views
class AdminWalletView(generics.RetrieveAPIView):
    """Admin wallet overview"""
    serializer_class = AdminWalletSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        # Only allow superusers to access admin wallet
        if not self.request.user.is_superuser:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Only administrators can access admin wallet")
        
        return AdminWallet.get_instance()

class AdminWalletHistoryView(generics.ListAPIView):
    """Admin wallet transaction history"""
    serializer_class = AdminWalletHistorySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Only allow superusers to access admin wallet history
        if not self.request.user.is_superuser:
            return AdminWalletHistory.objects.none()
        
        admin_wallet = AdminWallet.get_instance()
        queryset = AdminWalletHistory.objects.filter(admin_wallet=admin_wallet)
        
        # Apply filters
        transaction_type = self.request.query_params.get('transaction_type')
        if transaction_type:
            queryset = queryset.filter(transaction_type=transaction_type)
        
        date_from = self.request.query_params.get('date_from')
        if date_from:
            try:
                from datetime import datetime
                date_from = datetime.strptime(date_from, '%Y-%m-%d').date()
                queryset = queryset.filter(created_at__date__gte=date_from)
            except ValueError:
                pass
        
        date_to = self.request.query_params.get('date_to')
        if date_to:
            try:
                from datetime import datetime
                date_to = datetime.strptime(date_to, '%Y-%m-%d').date()
                queryset = queryset.filter(created_at__date__lte=date_to)
            except ValueError:
                pass
        
        return queryset.order_by('-created_at')

class AdminDashboardStatsView(generics.GenericAPIView):
    """Admin dashboard statistics"""
    serializer_class = AdminDashboardStatsSerializer
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # Only allow superusers to access admin stats
        if not request.user.is_superuser:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Only administrators can access admin statistics")
        
        try:
            from django.utils import timezone
            from datetime import datetime, timedelta
            from django.db.models import Sum, Count
            
            admin_wallet = AdminWallet.get_instance()
            now = timezone.now()
            today = now.date()
            month_start = today.replace(day=1)
            
            # Get all time stats from admin wallet
            stats = {
                'total_revenue': admin_wallet.total_platform_fees + admin_wallet.total_shipping_fees + admin_wallet.total_tax_amount + admin_wallet.total_credit_revenue,
                'platform_fees': admin_wallet.total_platform_fees,
                'shipping_fees': admin_wallet.total_shipping_fees,
                'tax_amount': admin_wallet.total_tax_amount,
                'credit_revenue': admin_wallet.total_credit_revenue,
                'total_orders': admin_wallet.total_orders_processed,
                'total_credits_sold': admin_wallet.total_credits_sold,
            }
            
            # Monthly stats
            month_history = AdminWalletHistory.objects.filter(
                admin_wallet=admin_wallet,
                created_at__date__gte=month_start
            )
            
            month_revenue = month_history.aggregate(Sum('amount'))['amount__sum'] or 0
            month_orders = month_history.filter(transaction_type__in=['platform_fee', 'shipping_fee']).values('order').distinct().count()
            month_credits = month_history.filter(transaction_type='credit_purchase').aggregate(
                total=Sum('metadata__credits_purchased')
            )['total'] or 0
            
            stats.update({
                'this_month_revenue': month_revenue,
                'this_month_orders': month_orders,
                'this_month_credits': month_credits,
            })
            
            # Daily stats
            today_history = AdminWalletHistory.objects.filter(
                admin_wallet=admin_wallet,
                created_at__date=today
            )
            
            today_revenue = today_history.aggregate(Sum('amount'))['amount__sum'] or 0
            today_orders = today_history.filter(transaction_type__in=['platform_fee', 'shipping_fee']).values('order').distinct().count()
            today_credits = today_history.filter(transaction_type='credit_purchase').aggregate(
                total=Sum('metadata__credits_purchased')
            )['total'] or 0
            
            stats.update({
                'today_revenue': today_revenue,
                'today_orders': today_orders,
                'today_credits': today_credits,
            })
            
            serializer = self.get_serializer(data=stats)
            serializer.is_valid(raise_exception=True)
            
            return Response(serializer.validated_data)
            
        except Exception as e:
            return Response({
                'error': f'Failed to get admin statistics: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)

class AdminRevenueReportView(generics.GenericAPIView):
    """Generate detailed admin revenue reports"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        # Only allow superusers to generate reports
        if not request.user.is_superuser:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Only administrators can generate revenue reports")
        
        try:
            from django.http import HttpResponse
            from reportlab.pdfgen import canvas
            from reportlab.lib.pagesizes import A4
            from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
            from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
            from reportlab.lib.units import inch
            from reportlab.lib import colors
            from datetime import datetime, timedelta
            import io
            
            # Get filters
            date_from = request.data.get('date_from')
            date_to = request.data.get('date_to') 
            report_type = request.data.get('report_type', 'detailed')  # 'summary' or 'detailed'
            
            # Default to last 30 days if no dates provided
            if not date_from:
                date_from = (timezone.now() - timedelta(days=30)).date()
            else:
                date_from = datetime.strptime(date_from, '%Y-%m-%d').date()
                
            if not date_to:
                date_to = timezone.now().date()
            else:
                date_to = datetime.strptime(date_to, '%Y-%m-%d').date()
            
            # Create PDF
            buffer = io.BytesIO()
            doc = SimpleDocTemplate(buffer, pagesize=A4)
            story = []
            styles = getSampleStyleSheet()
            
            # Title
            title_style = ParagraphStyle(
                'CustomTitle',
                parent=styles['Heading1'],
                fontSize=18,
                spaceAfter=30,
                alignment=1  # Center alignment
            )
            story.append(Paragraph(f"Admin Revenue Report ({date_from} to {date_to})", title_style))
            story.append(Spacer(1, 20))
            
            admin_wallet = AdminWallet.get_instance()
            
            # Get filtered history
            history = AdminWalletHistory.objects.filter(
                admin_wallet=admin_wallet,
                created_at__date__gte=date_from,
                created_at__date__lte=date_to
            ).order_by('-created_at')
            
            if report_type == 'summary':
                # Summary Report
                from django.db.models import Sum
                
                summary_data = history.values('transaction_type').annotate(
                    total_amount=Sum('amount'),
                    transaction_count=Count('id')
                ).order_by('transaction_type')
                
                summary_table_data = [['Revenue Type', 'Total Amount (₹)', 'Transaction Count']]
                grand_total = 0
                
                for item in summary_data:
                    amount = item['total_amount'] or 0
                    grand_total += amount
                    summary_table_data.append([
                        item['transaction_type'].replace('_', ' ').title(),
                        f"₹{amount:,.2f}",
                        str(item['transaction_count'])
                    ])
                
                summary_table_data.append(['Total', f"₹{grand_total:,.2f}", str(len(history))])
                
                summary_table = Table(summary_table_data, colWidths=[2.5*inch, 2*inch, 1.5*inch])
                summary_table.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
                    ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                    ('FONTSIZE', (0, 0), (-1, -1), 10),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
                    ('BACKGROUND', (0, -1), (-1, -1), colors.beige),
                    ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
                    ('GRID', (0, 0), (-1, -1), 1, colors.black)
                ]))
                story.append(summary_table)
                
            else:
                # Detailed Report
                if history.exists():
                    table_data = [['Date', 'Type', 'Amount (₹)', 'Description', 'Reference']]
                    
                    for transaction in history[:100]:  # Limit to prevent huge PDFs
                        table_data.append([
                            transaction.created_at.strftime('%Y-%m-%d'),
                            transaction.transaction_type.replace('_', ' ').title(),
                            f"₹{transaction.amount:,.2f}",
                            transaction.description[:40] + ('...' if len(transaction.description) > 40 else ''),
                            transaction.reference_id[:20] if transaction.reference_id else ''
                        ])
                    
                    detail_table = Table(table_data, colWidths=[1*inch, 1.2*inch, 1*inch, 2.3*inch, 1*inch])
                    detail_table.setStyle(TableStyle([
                        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
                        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                        ('ALIGN', (2, 0), (2, -1), 'RIGHT'),  # Amount column right-aligned
                        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                        ('FONTSIZE', (0, 0), (-1, -1), 8),
                        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
                        ('GRID', (0, 0), (-1, -1), 1, colors.black)
                    ]))
                    story.append(detail_table)
                    
                    if len(history) > 100:
                        story.append(Spacer(1, 20))
                        story.append(Paragraph(f"Note: Only showing first 100 transactions. Total {len(history)} transactions found.", styles['Normal']))
                        
                else:
                    story.append(Paragraph("No transactions found for the selected period.", styles['Normal']))
            
            doc.build(story)
            buffer.seek(0)
            
            response = HttpResponse(buffer.getvalue(), content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="admin-revenue-report-{date_from}-to-{date_to}.pdf"'
            
            return response
            
        except Exception as e:
            return Response({
                'error': f'Failed to generate revenue report: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)

class TestInvoiceView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]  # For testing
    
    def get(self, request, transaction_id):
        """Test endpoint to check if invoice view is reachable"""
        return HttpResponse(f"<h1>Invoice Test</h1><p>Transaction ID: {transaction_id}</p><p>This endpoint is working!</p>")
