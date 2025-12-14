import time
import logging
from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from livestreams.credit_monitor import CreditMonitorService
from livestreams.models import LiveStream

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Monitor and automatically deduct credits from live streams every 30 minutes and handle inactive streams'

    def add_arguments(self, parser):
        parser.add_argument(
            '--check-interval',
            type=int,
            default=300,  # 5 minutes
            help='Interval in seconds to check for credit deductions (default: 300)'
        )
        parser.add_argument(
            '--run-once',
            action='store_true',
            help='Run credit check once and exit'
        )
        parser.add_argument(
            '--verbose',
            action='store_true',
            help='Enable verbose output'
        )

    def handle(self, *args, **options):
        check_interval = options['check_interval']
        run_once = options['run_once']
        verbose = options['verbose']
        
        self.stdout.write(
            self.style.SUCCESS(f'Starting enhanced credit monitor service...')
        )
        self.stdout.write(f'Check interval: {check_interval}s')
        self.stdout.write(f'Credit deduction interval: {CreditMonitorService.CREDIT_DEDUCTION_INTERVAL} minutes')
        self.stdout.write(f'Inactivity warning time: {CreditMonitorService.INACTIVITY_WARNING_TIME} minutes')
        self.stdout.write(f'Auto-end time: {CreditMonitorService.INACTIVITY_AUTO_END_TIME} minutes')
        self.stdout.write('')
        
        if run_once:
            self.process_credits(verbose)
        else:
            self.run_continuous_monitoring(check_interval, verbose)

    def process_credits(self, verbose=False):
        """Process credit deductions and inactivity checks for all live streams"""
        try:
            live_streams = LiveStream.objects.filter(status='live').select_related('seller__seller_profile')
            
            if not live_streams.exists():
                self.stdout.write('No active livestreams found.')
                return
            
            self.stdout.write(f'Processing {live_streams.count()} active livestream(s)...')
            
            for livestream in live_streams:
                try:
                    self.process_single_livestream(livestream, verbose)
                        
                except Exception as e:
                    self.stdout.write(
                        self.style.ERROR(f'Error processing livestream {livestream.id}: {e}')
                    )
                    logger.error(f'Error processing livestream {livestream.id}: {e}')
                    
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error in credit monitoring: {e}'))
            logger.error(f'Error in credit monitoring: {e}')

    def process_single_livestream(self, livestream, verbose=False):
        """Process a single livestream for credits and inactivity"""
        # Check inactivity first
        inactivity_status = self.check_inactivity_status(livestream, verbose)
        
        if inactivity_status == 'ended':
            return  # Stream was ended due to inactivity
        
        # Check credit deduction
        if livestream.last_credit_deduction:
            time_since_last = timezone.now() - livestream.last_credit_deduction
        else:
            time_since_last = timezone.now() - livestream.actual_start_time
        
        # Check if 30 minutes have passed for credit deduction
        if time_since_last >= timedelta(minutes=CreditMonitorService.CREDIT_DEDUCTION_INTERVAL):
            result = CreditMonitorService.process_credit_deduction_for_livestream(livestream.id)
            
            if result:
                # Refresh livestream data
                livestream.refresh_from_db()
                seller_credits = livestream.seller.seller_profile.credits
                
                self.stdout.write(
                    self.style.SUCCESS(
                        f'✓ Credits deducted for livestream {livestream.id} (seller: {livestream.seller.username})'
                        f' - Total consumed: {livestream.credits_consumed}, Remaining: {seller_credits}'
                    )
                )
            else:
                self.stdout.write(
                    self.style.WARNING(
                        f'⚠ Livestream {livestream.id} ended due to insufficient credits'
                    )
                )
        else:
            time_remaining = timedelta(minutes=CreditMonitorService.CREDIT_DEDUCTION_INTERVAL) - time_since_last
            minutes_remaining = int(time_remaining.total_seconds() // 60)
            
            if verbose:
                self.stdout.write(
                    f'Livestream {livestream.id} - Next credit deduction in {minutes_remaining} minutes'
                )

    def check_inactivity_status(self, livestream, verbose=False):
        """Check and report inactivity status"""
        if not livestream.last_activity:
            if verbose:
                self.stdout.write(f'Livestream {livestream.id} - No activity recorded yet')
            return 'active'
        
        time_since_activity = timezone.now() - livestream.last_activity
        
        if time_since_activity >= timedelta(minutes=CreditMonitorService.INACTIVITY_AUTO_END_TIME):
            self.stdout.write(
                self.style.WARNING(
                    f'🔴 Livestream {livestream.id} ended due to {CreditMonitorService.INACTIVITY_AUTO_END_TIME} minutes of inactivity'
                )
            )
            return 'ended'
        elif time_since_activity >= timedelta(minutes=CreditMonitorService.INACTIVITY_WARNING_TIME):
            if not livestream.auto_end_warned:
                self.stdout.write(
                    self.style.WARNING(
                        f'⚠️ Livestream {livestream.id} inactive for {CreditMonitorService.INACTIVITY_WARNING_TIME} minutes - warning sent'
                    )
                )
            return 'warned'
        else:
            if verbose:
                minutes_inactive = int(time_since_activity.total_seconds() // 60)
                self.stdout.write(f'Livestream {livestream.id} - Active ({minutes_inactive}min since last activity)')
            return 'active'

    def run_continuous_monitoring(self, check_interval, verbose):
        """Run continuous monitoring loop"""
        try:
            while True:
                self.stdout.write(f'\n--- Credit & Inactivity check at {timezone.now().strftime("%Y-%m-%d %H:%M:%S")} ---')
                self.process_credits(verbose)
                
                self.stdout.write(f'Sleeping for {check_interval} seconds...\n')
                time.sleep(check_interval)
                
        except KeyboardInterrupt:
            self.stdout.write(self.style.SUCCESS('\nCredit monitoring stopped by user.'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Fatal error in monitoring loop: {e}'))
            logger.error(f'Fatal error in monitoring loop: {e}')
