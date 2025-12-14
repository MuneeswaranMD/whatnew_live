from django.utils import timezone
from django.db import transaction
from datetime import timedelta
import logging
from .models import LiveStream

logger = logging.getLogger(__name__)

class CreditMonitorService:
    """
    Service to monitor and deduct credits for live streams every 30 minutes
    Also handles automatic stream ending for inactive streams
    """
    
    # Configuration constants
    CREDIT_DEDUCTION_INTERVAL = 30  # minutes
    INACTIVITY_WARNING_TIME = 10    # minutes without heartbeat before warning
    INACTIVITY_AUTO_END_TIME = 15   # minutes without heartbeat before auto-ending
    
    @staticmethod
    def process_credit_deduction_for_livestream(livestream_id):
        """
        Process credit deduction for a specific livestream if it's been 30+ minutes
        since the last deduction. Also check for inactivity.
        """
        try:
            with transaction.atomic():
                livestream = LiveStream.objects.select_for_update().get(
                    id=livestream_id, 
                    status='live'
                )
                
                # Check for inactivity first
                inactivity_result = CreditMonitorService._check_stream_inactivity(livestream)
                if inactivity_result == 'ended':
                    return False  # Stream was auto-ended due to inactivity
                
                # Get seller profile
                seller_profile = livestream.seller.seller_profile
                
                # Calculate when the next credit should be deducted
                if livestream.last_credit_deduction:
                    time_since_last_deduction = timezone.now() - livestream.last_credit_deduction
                else:
                    # If no previous deduction, use the actual start time
                    time_since_last_deduction = timezone.now() - livestream.actual_start_time
                
                # Check if 30 minutes have passed
                if time_since_last_deduction >= timedelta(minutes=CreditMonitorService.CREDIT_DEDUCTION_INTERVAL):
                    # Calculate how many 30-minute intervals have passed
                    intervals_passed = int(time_since_last_deduction.total_seconds() // (CreditMonitorService.CREDIT_DEDUCTION_INTERVAL * 60))
                    
                    # Don't deduct more credits than the seller has
                    credits_to_deduct = min(intervals_passed, seller_profile.credits)
                    
                    if credits_to_deduct > 0:
                        # Deduct credits
                        seller_profile.credits -= credits_to_deduct
                        seller_profile.save()
                        
                        # Update livestream
                        livestream.credits_consumed += credits_to_deduct
                        livestream.last_credit_deduction = timezone.now()
                        livestream.save()
                        
                        logger.info(f"Deducted {credits_to_deduct} credits from {livestream.seller.username} for livestream {livestream.id}")
                        
                        # If seller has no credits left, end the livestream
                        if seller_profile.credits <= 0:
                            CreditMonitorService._end_livestream_with_reason(
                                livestream, 
                                'insufficient_credits',
                                'Automatically ended - seller has no credits left'
                            )
                            return False  # Livestream ended due to no credits
                    
                    return True  # Credits deducted successfully
                
                return True  # No deduction needed yet
                
        except LiveStream.DoesNotExist:
            logger.warning(f"Livestream {livestream_id} not found or not live")
            return False
        except Exception as e:
            logger.error(f"Error processing credit deduction for livestream {livestream_id}: {e}")
            return False
    
    @staticmethod
    def _check_stream_inactivity(livestream):
        """
        Check if stream has been inactive and handle accordingly
        Returns: 'active', 'warned', 'ended'
        """
        if not livestream.last_activity:
            # If no activity recorded yet, use start time and give grace period
            livestream.last_activity = livestream.actual_start_time
            livestream.save()
            return 'active'
        
        time_since_activity = timezone.now() - livestream.last_activity
        
        # Check if stream should be auto-ended due to inactivity
        if time_since_activity >= timedelta(minutes=CreditMonitorService.INACTIVITY_AUTO_END_TIME):
            CreditMonitorService._end_livestream_with_reason(
                livestream,
                'inactivity',
                f'Automatically ended due to {CreditMonitorService.INACTIVITY_AUTO_END_TIME} minutes of inactivity'
            )
            return 'ended'
        
        # Check if stream should be warned about inactivity
        elif time_since_activity >= timedelta(minutes=CreditMonitorService.INACTIVITY_WARNING_TIME) and not livestream.auto_end_warned:
            livestream.auto_end_warned = True
            livestream.save()
            
            logger.warning(f"Livestream {livestream.id} inactive for {CreditMonitorService.INACTIVITY_WARNING_TIME} minutes - warning sent")
            
            # Here you could send a notification to the seller via WebSocket, email, etc.
            CreditMonitorService._send_inactivity_warning(livestream)
            return 'warned'
        
        return 'active'
    
    @staticmethod
    def _end_livestream_with_reason(livestream, reason, message):
        """
        End a livestream with a specific reason and message
        """
        livestream.status = 'ended'
        livestream.end_time = timezone.now()
        livestream.save()
        
        # Mark all viewers as inactive
        from .models import LiveStreamViewer, ProductBidding
        LiveStreamViewer.objects.filter(
            livestream=livestream, 
            is_active=True
        ).update(is_active=False, left_at=timezone.now())
        
        # End all active biddings
        ProductBidding.objects.filter(
            livestream=livestream, 
            status='active'
        ).update(status='ended', ended_at=timezone.now())
        
        logger.warning(f"Livestream {livestream.id} ended automatically: {message}")
        
        # Here you could notify the seller via WebSocket, email, etc.
        CreditMonitorService._send_stream_ended_notification(livestream, reason, message)
    
    @staticmethod
    def _send_inactivity_warning(livestream):
        """
        Send inactivity warning to the seller
        """
        # Implement notification logic here (WebSocket, email, etc.)
        # For now, just log it
        logger.info(f"Inactivity warning sent to seller {livestream.seller.username} for livestream {livestream.id}")
        pass
    
    @staticmethod
    def _send_stream_ended_notification(livestream, reason, message):
        """
        Send stream ended notification to the seller
        """
        # Implement notification logic here (WebSocket, email, etc.)
        # For now, just log it
        logger.info(f"Stream ended notification sent to seller {livestream.seller.username}: {message}")
        pass
    
    @staticmethod
    def process_all_live_streams():
        """
        Process credit deductions for all live streams
        """
        live_streams = LiveStream.objects.filter(status='live')
        
        for livestream in live_streams:
            CreditMonitorService.process_credit_deduction_for_livestream(livestream.id)
    
    @staticmethod
    def get_time_until_next_deduction(livestream):
        """
        Get the time remaining until the next credit deduction
        """
        if livestream.status != 'live':
            return None
            
        if livestream.last_credit_deduction:
            time_since_last = timezone.now() - livestream.last_credit_deduction
        else:
            time_since_last = timezone.now() - livestream.actual_start_time
            
        thirty_minutes = timedelta(minutes=30)
        
        if time_since_last >= thirty_minutes:
            return timedelta(0)  # Overdue for deduction
        else:
            return thirty_minutes - time_since_last
