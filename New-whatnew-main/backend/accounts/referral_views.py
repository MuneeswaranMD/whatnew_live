from rest_framework import generics, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from django.utils import timezone
from django.db.models import Sum, Count
from .referral_models import ReferralCode, Referral, ReferralReward, ReferralStats, ReferralCampaign
from .promo_models import ReferralLevelProgress, PromoCode
from .referral_serializers import (
    ReferralCodeSerializer, ReferralSerializer, ReferralRewardSerializer,
    ReferralStatsSerializer, ReferralCampaignSerializer, ApplyReferralCodeSerializer,
    ShareReferralSerializer, ReferralHistorySerializer
)

class ReferralCodeView(generics.RetrieveAPIView):
    """Get user's referral code"""
    serializer_class = ReferralCodeSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        # Create referral code if it doesn't exist
        referral_code, created = ReferralCode.objects.get_or_create(
            user=self.request.user
        )
        return referral_code

class ApplyReferralCodeView(generics.CreateAPIView):
    """Apply a referral code"""
    serializer_class = ApplyReferralCodeSerializer
    permission_classes = [IsAuthenticated]
    
    def create(self, request):
        # Return error immediately - referral codes can only be applied during registration
        from .error_codes import REFERRAL_ERROR_CODES
        
        error_info = REFERRAL_ERROR_CODES['REFERRAL_ONLY_DURING_REGISTRATION']
        return Response({
            'error_code': 'REFERRAL_ONLY_DURING_REGISTRATION',
            'message': error_info['message'],
            'success': False
        }, status=status.HTTP_400_BAD_REQUEST)
    
    def _create_referral_rewards(self, referral):
        """Create rewards for both referrer and referred user"""
        # Get active campaign or use default rewards
        active_campaign = ReferralCampaign.objects.filter(
            status='active',
            start_date__lte=timezone.now(),
            end_date__gte=timezone.now()
        ).first()
        
        if active_campaign:
            referrer_amount = active_campaign.referrer_reward_amount
            referred_amount = active_campaign.referred_user_reward_amount
            reward_type = active_campaign.reward_type
        else:
            # Default rewards
            referrer_amount = 50  # ₹50 or 50 credits
            referred_amount = 25  # ₹25 or 25 credits
            reward_type = 'credits'
        
        # Create reward for referrer
        ReferralReward.objects.create(
            referral=referral,
            recipient=referral.referrer,
            reward_type=reward_type,
            amount=referrer_amount,
            description=f'Referral reward for inviting {referral.referred_user.username}'
        )
        
        # Create reward for referred user
        ReferralReward.objects.create(
            referral=referral,
            recipient=referral.referred_user,
            reward_type=reward_type,
            amount=referred_amount,
            description=f'Welcome reward for joining via referral from {referral.referrer.username}'
        )

class ShareReferralView(generics.CreateAPIView):
    """Generate share content for referral"""
    serializer_class = ShareReferralSerializer
    permission_classes = [IsAuthenticated]
    
    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        platform = serializer.validated_data['platform']
        
        # Get user's referral code
        referral_code, created = ReferralCode.objects.get_or_create(
            user=request.user
        )
        
        # Generate share content based on platform
        share_content = self._generate_share_content(referral_code.code, platform, request.user)
        
        return Response(share_content)
    
    def _generate_share_content(self, code, platform, user):
        """Generate platform-specific share content"""
        base_url = "https://app.whatnew.in/share"
        referral_url = f"{base_url}?ref={code}"
        
        user_name = user.first_name or user.username
        
        if platform == 'whatsapp':
            text = f"""🎉 Join me on whatnew - The Ultimate Live Shopping Experience!

🛍️ Shop LIVE with amazing deals and interactive experiences
💰 Use my referral code: *{code}*
🎁 Get special welcome rewards when you join!

Download now: {referral_url}

#whatnew #LiveShopping #ReferralCode"""
            
            whatsapp_url = f"https://api.whatsapp.com/send?text={text.replace(' ', '%20').replace('\n', '%0A')}"
            
            return {
                'platform': platform,
                'text': text,
                'url': whatsapp_url,
                'referral_code': code,
                'referral_url': referral_url
            }
        
        elif platform == 'telegram':
            text = f"""🎉 Join me on whatnew!

Hey! I'm using whatnew for live shopping and it's amazing! 🛍️

Use my referral code: {code}
Join here: {referral_url}

#whatnew #LiveShopping"""
            
            telegram_url = f"https://t.me/share/url?url={referral_url}&text={text.replace(' ', '%20').replace('\n', '%0A')}"
            
            return {
                'platform': platform,
                'text': text,
                'url': telegram_url,
                'referral_code': code,
                'referral_url': referral_url
            }
        
        elif platform == 'sms':
            text = f"Join me on whatnew for live shopping! Use my code {code}: {referral_url}"
            
            return {
                'platform': platform,
                'text': text,
                'sms_url': f"sms:?body={text.replace(' ', '%20')}",
                'referral_code': code,
                'referral_url': referral_url
            }
        
        elif platform == 'email':
            subject = f"{user_name} invited you to join whatnew"
            body = f"""Hi!

{user_name} has invited you to join whatnew - the ultimate live shopping platform!

🛍️ Shop live with real-time interactions
💰 Get amazing deals and discounts
🎁 Special welcome rewards for new users

Use referral code: {code}
Join here: {referral_url}

See you on whatnew!
Best regards,
{user_name}"""
            
            email_url = f"mailto:?subject={subject.replace(' ', '%20')}&body={body.replace(' ', '%20').replace('\n', '%0A')}"
            
            return {
                'platform': platform,
                'subject': subject,
                'body': body,
                'email_url': email_url,
                'referral_code': code,
                'referral_url': referral_url
            }
        
        else:  # general or copy
            text = f"""🎉 Join me on whatnew - Live Shopping Experience!

Use my referral code: {code}
Download: {referral_url}

#whatnew #LiveShopping #Referral"""
            
            return {
                'platform': platform,
                'text': text,
                'referral_code': code,
                'referral_url': referral_url,
                'share_title': 'Join whatnew',
                'share_description': f'Use referral code {code} to get special rewards!'
            }

class ReferralHistoryView(generics.ListAPIView):
    """Get user's referral history"""
    serializer_class = ReferralHistorySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Referral.objects.filter(
            referrer=self.request.user
        ).select_related(
            'referred_user', 'referral_code'
        ).prefetch_related(
            'rewards'
        ).order_by('-created_at')

class ReferralStatsView(generics.RetrieveAPIView):
    """Get user's referral statistics"""
    serializer_class = ReferralStatsSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        stats, created = ReferralStats.objects.get_or_create(
            user=self.request.user
        )
        
        # Update stats with current data
        if not created:
            self._update_stats(stats)
        
        return stats
    
    def _update_stats(self, stats):
        """Update referral stats with latest data"""
        user_referrals = Referral.objects.filter(referrer=self.request.user)
        
        stats.total_referrals = user_referrals.count()
        stats.successful_referrals = user_referrals.filter(status='completed').count()
        
        # Calculate total earnings from referral rewards
        total_earnings = ReferralReward.objects.filter(
            recipient=self.request.user,
            status='credited'
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        total_credits = ReferralReward.objects.filter(
            recipient=self.request.user,
            reward_type='credits',
            status='credited'
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        stats.total_earnings = total_earnings
        stats.total_credits_earned = int(total_credits)
        
        # Update last referral date
        latest_referral = user_referrals.order_by('-created_at').first()
        if latest_referral:
            stats.last_referral_date = latest_referral.created_at
        
        stats.save()

class ReferralRewardsView(generics.ListAPIView):
    """Get user's referral rewards"""
    serializer_class = ReferralRewardSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return ReferralReward.objects.filter(
            recipient=self.request.user
        ).select_related(
            'referral__referrer', 'referral__referred_user', 'referral__referral_code'
        ).order_by('-created_at')

class CompleteReferralView(generics.UpdateAPIView):
    """Mark a referral as completed (internal use)"""
    permission_classes = [IsAuthenticated]
    
    def patch(self, request, referral_id):
        try:
            with transaction.atomic():
                referral = Referral.objects.get(id=referral_id)
                
                if referral.status == 'completed':
                    return Response({
                        'message': 'Referral already completed'
                    })
                
                # Mark referral as completed
                referral.status = 'completed'
                referral.completed_at = timezone.now()
                referral.save()
                
                # Update referrer stats
                referrer_stats, created = ReferralStats.objects.get_or_create(
                    user=referral.referrer
                )
                referrer_stats.successful_referrals += 1
                referrer_stats.current_streak += 1
                if referrer_stats.current_streak > referrer_stats.best_streak:
                    referrer_stats.best_streak = referrer_stats.current_streak
                referrer_stats.save()
                
                # Credit rewards
                rewards = ReferralReward.objects.filter(referral=referral, status='pending')
                for reward in rewards:
                    self._credit_reward(reward)
                
                return Response({
                    'message': 'Referral completed successfully',
                    'referral_id': str(referral.id)
                })
                
        except Referral.DoesNotExist:
            return Response({
                'error': 'Referral not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'error': f'Failed to complete referral: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)
    
    def _credit_reward(self, reward):
        """Credit the reward to user account"""
        if reward.reward_type == 'credits':
            # Add credits to user's seller profile or create wallet transaction
            from accounts.models import SellerProfile
            from payments.models import Wallet, WalletTransaction
            
            if hasattr(reward.recipient, 'seller_profile'):
                seller_profile = reward.recipient.seller_profile
                seller_profile.credits += int(reward.amount)
                seller_profile.save()
            else:
                # Create wallet transaction for buyers
                wallet, created = Wallet.objects.get_or_create(user=reward.recipient)
                wallet.balance += reward.amount
                wallet.save()
                
                WalletTransaction.objects.create(
                    wallet=wallet,
                    transaction_type='credit',
                    amount=reward.amount,
                    description=reward.description
                )
        
        elif reward.reward_type == 'cash':
            # Add to wallet balance
            from payments.models import Wallet, WalletTransaction
            
            wallet, created = Wallet.objects.get_or_create(user=reward.recipient)
            wallet.balance += reward.amount
            wallet.save()
            
            WalletTransaction.objects.create(
                wallet=wallet,
                transaction_type='credit',
                amount=reward.amount,
                description=reward.description
            )
        
        # Mark reward as credited
        reward.status = 'credited'
        reward.credited_at = timezone.now()
        reward.save()

class ActiveCampaignsView(generics.ListAPIView):
    """Get active referral campaigns"""
    serializer_class = ReferralCampaignSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return ReferralCampaign.objects.filter(
            status='active',
            start_date__lte=timezone.now(),
            end_date__gte=timezone.now()
        ).order_by('-created_at')

class UserDiscountLevelsView(generics.ListAPIView):
    """Get all discount levels and user's current level"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        from .referral_models import ReferralDiscountLevel, UserDiscountLevel, UserDiscountUsage
        
        # Get all available discount levels
        all_levels = ReferralDiscountLevel.objects.filter(is_active=True).order_by('level')
        
        # Get user's current level
        user_level = None
        try:
            user_discount_level = UserDiscountLevel.objects.get(user=request.user)
            user_level = user_discount_level.current_level
        except UserDiscountLevel.DoesNotExist:
            pass
        
        # Get user's discount usage history
        used_discounts = UserDiscountUsage.objects.filter(user=request.user).values_list('discount_level_id', flat=True)
        
        # Get user's total successful referrals
        total_referrals = request.user.referrals_made.filter(status='completed').count()
        
        # Build response data
        levels_data = []
        for level in all_levels:
            is_unlocked = total_referrals >= level.required_referrals
            is_used = level.id in used_discounts
            is_current = user_level and user_level.id == level.id
            
            levels_data.append({
                'id': level.id,
                'level': level.level,
                'name': level.name,
                'description': level.description,
                'discount_percentage': level.discount_percentage,
                'max_discount_amount': level.max_discount_amount,
                'required_referrals': level.required_referrals,
                'is_unlocked': is_unlocked,
                'is_used': is_used,
                'is_current': is_current,
            })
        
        response_data = {
            'levels': levels_data,
            'current_level': {
                'id': user_level.id if user_level else None,
                'level': user_level.level if user_level else 0,
                'name': user_level.name if user_level else 'No Level',
                'discount_percentage': user_level.discount_percentage if user_level else 0,
                'max_discount_amount': user_level.max_discount_amount if user_level else 0,
            } if user_level else None,
            'total_successful_referrals': total_referrals,
            'available_discounts': len([l for l in levels_data if l['is_unlocked'] and not l['is_used']]),
        }
        
        return Response(response_data)

class CalculateDiscountView(generics.GenericAPIView):
    """Calculate available discount for a given order amount"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        from .referral_models import UserDiscountLevel, UserDiscountUsage
        
        order_amount = request.data.get('order_amount')
        discount_level_id = request.data.get('discount_level_id')
        
        if not order_amount or not discount_level_id:
            return Response({
                'error': 'order_amount and discount_level_id are required'
            }, status=400)
        
        try:
            order_amount = float(order_amount)
        except ValueError:
            return Response({
                'error': 'Invalid order_amount'
            }, status=400)
        
        try:
            # Get user's current level
            user_discount_level = UserDiscountLevel.objects.get(user=request.user)
            
            # Check if the requested discount level is available to the user
            requested_level = user_discount_level.current_level
            if str(requested_level.id) != str(discount_level_id):
                return Response({
                    'error': 'Requested discount level is not available to you'
                }, status=400)
            
            # Check if user has already used this discount level
            if UserDiscountUsage.objects.filter(user=request.user, discount_level=requested_level).exists():
                return Response({
                    'error': 'You have already used this discount level'
                }, status=400)
            
            # Calculate discount
            discount_percentage = requested_level.discount_percentage
            max_discount = requested_level.max_discount_amount
            
            calculated_discount = (order_amount * discount_percentage) / 100
            final_discount = min(calculated_discount, max_discount)
            final_amount = max(0, order_amount - final_discount)
            
            return Response({
                'order_amount': order_amount,
                'discount_percentage': discount_percentage,
                'calculated_discount': calculated_discount,
                'max_discount_allowed': max_discount,
                'final_discount': final_discount,
                'final_amount': final_amount,
                'savings': final_discount,
                'level_name': requested_level.name,
            })
            
        except UserDiscountLevel.DoesNotExist:
            return Response({
                'error': 'You do not have any discount level. Refer friends to unlock discounts!'
            }, status=400)

class ApplyDiscountView(generics.GenericAPIView):
    """Apply discount to an order"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        from .referral_models import UserDiscountLevel, UserDiscountUsage
        
        order_amount = request.data.get('order_amount')
        discount_level_id = request.data.get('discount_level_id')
        order_id = request.data.get('order_id')  # Optional, for tracking
        
        if not order_amount or not discount_level_id:
            return Response({
                'error': 'order_amount and discount_level_id are required'
            }, status=400)
        
        try:
            order_amount = float(order_amount)
        except ValueError:
            return Response({
                'error': 'Invalid order_amount'
            }, status=400)
        
        try:
            with transaction.atomic():
                # Get user's current level
                user_discount_level = UserDiscountLevel.objects.get(user=request.user)
                
                # Check if the requested discount level is available to the user
                requested_level = user_discount_level.current_level
                if str(requested_level.id) != str(discount_level_id):
                    return Response({
                        'error': 'Requested discount level is not available to you'
                    }, status=400)
                
                # Check if user has already used this discount level
                if UserDiscountUsage.objects.filter(user=request.user, discount_level=requested_level).exists():
                    return Response({
                        'error': 'You have already used this discount level'
                    }, status=400)
                
                # Calculate discount
                discount_percentage = requested_level.discount_percentage
                max_discount = requested_level.max_discount_amount
                
                calculated_discount = (order_amount * discount_percentage) / 100
                final_discount = min(calculated_discount, max_discount)
                final_amount = max(0, order_amount - final_discount)
                
                # Record discount usage
                UserDiscountUsage.objects.create(
                    user=request.user,
                    discount_level=requested_level,
                    order_id=order_id,
                    discount_amount=final_discount
                )
                
                return Response({
                    'success': True,
                    'message': f'Discount applied successfully!',
                    'order_amount': order_amount,
                    'discount_applied': final_discount,
                    'final_amount': final_amount,
                    'level_name': requested_level.name,
                    'discount_percentage': discount_percentage,
                })
                
        except UserDiscountLevel.DoesNotExist:
            return Response({
                'error': 'You do not have any discount level. Refer friends to unlock discounts!'
            }, status=400)

class UserDiscountHistoryView(generics.ListAPIView):
    """Get user's discount usage history"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        from .referral_models import UserDiscountUsage
        
        usage_history = UserDiscountUsage.objects.filter(user=request.user).order_by('-used_at')
        
        history_data = []
        for usage in usage_history:
            history_data.append({
                'id': usage.id,
                'level_name': usage.discount_level.name,
                'level_number': usage.discount_level.level,
                'discount_amount': usage.discount_amount,
                'order_id': usage.order_id,
                'used_at': usage.used_at,
                'discount_percentage': usage.discount_level.discount_percentage,
            })
        
        return Response({
            'discount_history': history_data,
            'total_discounts_used': len(history_data),
            'total_savings': sum(float(h['discount_amount']) for h in history_data),
        })

class ReferralProgressView(generics.RetrieveAPIView):
    """Get user's referral progress and milestone information"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        # Get or create referral level progress
        progress, created = ReferralLevelProgress.objects.get_or_create(user=user)
        
        # Define milestones
        milestones = [
            {
                'level': 1,
                'threshold': 5,
                'reward': '5% discount code',
                'description': 'Refer 5 friends to unlock 5% discount',
                'completed': progress.level_1_promo_generated,
            },
            {
                'level': 2,
                'threshold': 15,
                'reward': '13% discount code',
                'description': 'Refer 15 friends to unlock 13% discount',
                'completed': progress.level_2_promo_generated,
            },
            {
                'level': 3,
                'threshold': 25,
                'reward': '20% discount code',
                'description': 'Refer 25 friends to unlock 20% discount',
                'completed': progress.level_3_promo_generated,
            },
            {
                'level': 4,
                'threshold': 35,
                'reward': '22% discount code',
                'description': 'Refer 35 friends to unlock 22% discount',
                'completed': progress.level_4_promo_generated,
            },
            {
                'level': 5,
                'threshold': 60,
                'reward': '25% discount code',
                'description': 'Refer 60 friends to unlock 25% discount',
                'completed': progress.level_5_promo_generated,
            },
        ]
        
        # Calculate progress for each milestone
        for milestone in milestones:
            milestone['progress_percentage'] = min(
                (progress.current_referrals / milestone['threshold']) * 100, 100
            )
            milestone['referrals_needed'] = max(0, milestone['threshold'] - progress.current_referrals)
        
        # Get next milestone
        next_milestone = None
        for milestone in milestones:
            if not milestone['completed']:
                next_milestone = milestone
                break
        
        # Get earned promo codes
        earned_codes = PromoCode.objects.filter(
            user=user,
            is_active=True
        ).order_by('-created_at')
        
        earned_codes_data = []
        for code in earned_codes:
            earned_codes_data.append({
                'code': code.code,
                'level': code.level,
                'discount_value': code.discount_value,
                'discount_type': code.discount_type,
                'is_used': code.is_used,
                'created_at': code.created_at,
                'valid_until': code.valid_until,
            })
        
        return Response({
            'current_referrals': progress.current_referrals,
            'current_level': progress.current_level,
            'milestones': milestones,
            'next_milestone': next_milestone,
            'earned_promo_codes': earned_codes_data,
            'total_promo_codes': len(earned_codes_data),
            'unused_promo_codes': len([c for c in earned_codes_data if not c['is_used']]),
        })
