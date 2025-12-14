"""
Background Credit Monitor Service
This module starts automatically with Django and runs credit monitoring in the background
"""

import threading
import time
import logging
from django.utils import timezone
from django.conf import settings
from .credit_monitor import CreditMonitorService
from .models import LiveStream

logger = logging.getLogger(__name__)

class BackgroundCreditMonitor:
    """
    Background service that automatically monitors credits when Django starts
    """
    
    def __init__(self):
        self.monitor_thread = None
        self.stop_event = threading.Event()
        self.check_interval = 300  # 5 minutes default
        self.is_running = False
    
    def start_monitoring(self):
        """Start the background monitoring thread"""
        if self.is_running:
            logger.info("Credit monitor is already running")
            return
        
        self.stop_event.clear()
        self.monitor_thread = threading.Thread(target=self._monitor_loop, daemon=True)
        self.monitor_thread.start()
        self.is_running = True
        
        logger.info("🚀 Background credit monitor started successfully")
        logger.info(f"✓ Check interval: {self.check_interval} seconds")
        logger.info(f"✓ Credit deduction: every {CreditMonitorService.CREDIT_DEDUCTION_INTERVAL} minutes")
        logger.info(f"✓ Inactivity warning: after {CreditMonitorService.INACTIVITY_WARNING_TIME} minutes")
        logger.info(f"✓ Auto-end: after {CreditMonitorService.INACTIVITY_AUTO_END_TIME} minutes")
    
    def stop_monitoring(self):
        """Stop the background monitoring thread"""
        if not self.is_running:
            return
        
        self.stop_event.set()
        if self.monitor_thread and self.monitor_thread.is_alive():
            self.monitor_thread.join(timeout=10)
        
        self.is_running = False
        logger.info("Background credit monitor stopped")
    
    def _monitor_loop(self):
        """Main monitoring loop that runs in background thread"""
        logger.info("Credit monitoring loop started")
        
        while not self.stop_event.is_set():
            try:
                self._process_all_livestreams()
                
                # Wait for next check (with early exit if stop requested)
                self.stop_event.wait(timeout=self.check_interval)
                
            except Exception as e:
                logger.error(f"Error in credit monitoring loop: {e}")
                # Continue running even if there's an error
                time.sleep(30)  # Wait 30 seconds before retrying
    
    def _process_all_livestreams(self):
        """Process all live streams for credit deduction and inactivity"""
        try:
            live_streams = LiveStream.objects.filter(status='live').select_related('seller__seller_profile')
            
            if not live_streams.exists():
                logger.debug("No active livestreams found")
                return
            
            logger.info(f"🔍 Processing {live_streams.count()} active livestream(s)")
            
            for livestream in live_streams:
                try:
                    # Process credit deduction and inactivity for each stream
                    result = CreditMonitorService.process_credit_deduction_for_livestream(livestream.id)
                    
                    if not result:
                        # Stream was ended (either no credits or inactivity)
                        livestream.refresh_from_db()
                        if livestream.status == 'ended':
                            logger.warning(f"🔴 Livestream {livestream.id} auto-ended (seller: {livestream.seller.username})")
                    else:
                        # Check if credits were deducted
                        livestream.refresh_from_db()
                        seller_credits = livestream.seller.seller_profile.credits
                        logger.debug(f"✓ Livestream {livestream.id} processed - Credits remaining: {seller_credits}")
                        
                except Exception as e:
                    logger.error(f"Error processing livestream {livestream.id}: {e}")
                    
        except Exception as e:
            logger.error(f"Error in processing livestreams: {e}")
    
    def get_status(self):
        """Get current status of the monitor"""
        return {
            'is_running': self.is_running,
            'check_interval': self.check_interval,
            'thread_alive': self.monitor_thread.is_alive() if self.monitor_thread else False,
            'active_streams': LiveStream.objects.filter(status='live').count()
        }

# Global instance
_background_monitor = None

def get_monitor():
    """Get the global background monitor instance"""
    global _background_monitor
    if _background_monitor is None:
        _background_monitor = BackgroundCreditMonitor()
    return _background_monitor

def start_background_monitor():
    """Start the background credit monitor"""
    monitor = get_monitor()
    monitor.start_monitoring()

def stop_background_monitor():
    """Stop the background credit monitor"""
    monitor = get_monitor()
    monitor.stop_monitoring()

def is_monitor_running():
    """Check if monitor is running"""
    monitor = get_monitor()
    return monitor.is_running
