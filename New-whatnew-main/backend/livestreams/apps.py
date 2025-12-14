from django.apps import AppConfig
import logging

logger = logging.getLogger(__name__)

class LivestreamsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'livestreams'
    
    def ready(self):
        """
        Called when Django is ready. Start the background credit monitor here.
        """
        # Only start in the main process (not in migrations, shell, etc.)
        import sys
        import os
        
        # Check if this is the main Django process
        if 'runserver' in sys.argv or 'gunicorn' in sys.argv[0] or os.environ.get('RUN_MAIN'):
            try:
                from .background_monitor import start_background_monitor
                
                # Small delay to ensure Django is fully ready
                import threading
                def delayed_start():
                    import time
                    time.sleep(5)  # Wait 5 seconds
                    start_background_monitor()
                
                # Start in a separate thread to avoid blocking Django startup
                thread = threading.Thread(target=delayed_start, daemon=True)
                thread.start()
                
                logger.info("🚀 Livestream credit monitor will start in 5 seconds...")
                
            except Exception as e:
                logger.error(f"Failed to start background credit monitor: {e}")
        else:
            logger.debug("Skipping credit monitor startup (not main process)")
