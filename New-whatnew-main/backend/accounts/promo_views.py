from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.db.models import Q
from .promo_models import PromoCode, ReferralLevelProgress, PromoCodeUsage
from .promo_serializers import PromoCodeSerializer, ReferralLevelProgressSerializer, ApplyPromoCodeSerializer

class UserPromoCodesView(generics.ListAPIView):
    """
    Get all promo codes for the authenticated user
    """
    serializer_class = PromoCodeSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return PromoCode.objects.filter(user=self.request.user)

class AvailablePromoCodesView(generics.ListAPIView):
    """
    Get only available (unused) promo codes for the authenticated user
    """
    serializer_class = PromoCodeSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return PromoCode.objects.filter(
            user=self.request.user,
            is_used=False,
            is_active=True
        )

class ReferralLevelProgressView(generics.RetrieveAPIView):
    """
    Get referral level progress for the authenticated user
    """
    serializer_class = ReferralLevelProgressSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        progress, created = ReferralLevelProgress.objects.get_or_create(
            user=self.request.user
        )
        
        # Update progress based on current referral stats
        from .referral_models import ReferralStats
        try:
            stats = ReferralStats.objects.get(user=self.request.user)
            progress.update_progress(stats.total_referrals)
        except ReferralStats.DoesNotExist:
            progress.update_progress(0)
        
        return progress

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def validate_promo_code_view(request):
    """
    Validate a promo code and calculate discount for given order amount
    """
    serializer = ApplyPromoCodeSerializer(data=request.data, context={'request': request})
    
    if serializer.is_valid():
        promo_code_str = serializer.validated_data['promo_code']
        order_amount = serializer.validated_data['order_amount']
        
        try:
            promo_code = PromoCode.objects.get(code=promo_code_str, is_active=True)
            discount_amount = promo_code.get_discount_amount(order_amount)
            
            return Response({
                'valid': True,
                'promo_code': PromoCodeSerializer(promo_code).data,
                'order_amount': order_amount,
                'discount_amount': discount_amount,
                'final_amount': order_amount - discount_amount,
                'message': f'Promo code applied! You save ₹{discount_amount}'
            })
        except PromoCode.DoesNotExist:
            return Response({
                'valid': False,
                'error': 'Invalid promo code'
            }, status=status.HTTP_400_BAD_REQUEST)
    
    return Response({
        'valid': False,
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def apply_promo_code_view(request):
    """
    Apply a promo code to an order (mark as used)
    """
    serializer = ApplyPromoCodeSerializer(data=request.data, context={'request': request})
    
    if serializer.is_valid():
        promo_code_str = serializer.validated_data['promo_code']
        order_amount = serializer.validated_data['order_amount']
        order_id = request.data.get('order_id')
        
        try:
            promo_code = PromoCode.objects.get(code=promo_code_str, is_active=True)
            discount_amount = promo_code.get_discount_amount(order_amount)
            
            # Mark promo code as used
            promo_code.mark_as_used(order_id)
            
            # Create usage record
            PromoCodeUsage.objects.create(
                promo_code=promo_code,
                user=request.user,
                order_id=order_id or 'unknown',
                order_amount=order_amount,
                discount_amount=discount_amount
            )
            
            return Response({
                'applied': True,
                'promo_code': PromoCodeSerializer(promo_code).data,
                'order_amount': order_amount,
                'discount_amount': discount_amount,
                'final_amount': order_amount - discount_amount,
                'message': f'Promo code applied successfully! You saved ₹{discount_amount}'
            })
        except PromoCode.DoesNotExist:
            return Response({
                'applied': False,
                'error': 'Invalid promo code'
            }, status=status.HTTP_400_BAD_REQUEST)
    
    return Response({
        'applied': False,
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)
