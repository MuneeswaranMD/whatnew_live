# Credit Monitor Service for Windows
# This script can be used to run the credit monitor as a background service

import subprocess
import time
import logging
import os
import sys
from pathlib import Path

# Configuration
DJANGO_PROJECT_PATH = Path(__file__).parent  # backend directory
PYTHON_EXECUTABLE = sys.executable
CHECK_INTERVAL = 300  # 5 minutes
LOG_FILE = DJANGO_PROJECT_PATH / 'logs' / 'credit_monitor.log'

# Ensure logs directory exists
LOG_FILE.parent.mkdir(exist_ok=True)

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(LOG_FILE),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

def run_credit_monitor():
    """Run the Django credit monitor command"""
    try:
        # Change to Django project directory
        os.chdir(DJANGO_PROJECT_PATH)
        
        # Run the management command
        cmd = [
            PYTHON_EXECUTABLE, 
            'manage.py', 
            'monitor_credits', 
            '--run-once'
        ]
        
        logger.info(f"Running command: {' '.join(cmd)}")
        
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=300  # 5 minute timeout
        )
        
        if result.returncode == 0:
            logger.info("Credit monitor completed successfully")
            if result.stdout:
                logger.info(f"Output: {result.stdout}")
        else:
            logger.error(f"Credit monitor failed with return code {result.returncode}")
            if result.stderr:
                logger.error(f"Error: {result.stderr}")
                
    except subprocess.TimeoutExpired:
        logger.error("Credit monitor command timed out")
    except Exception as e:
        logger.error(f"Error running credit monitor: {e}")

def main():
    """Main service loop"""
    logger.info("Starting Credit Monitor Service")
    logger.info(f"Check interval: {CHECK_INTERVAL} seconds")
    logger.info(f"Django project path: {DJANGO_PROJECT_PATH}")
    logger.info(f"Python executable: {PYTHON_EXECUTABLE}")
    
    try:
        while True:
            logger.info("=== Starting credit check cycle ===")
            run_credit_monitor()
            logger.info(f"=== Sleeping for {CHECK_INTERVAL} seconds ===")
            time.sleep(CHECK_INTERVAL)
            
    except KeyboardInterrupt:
        logger.info("Service stopped by user")
    except Exception as e:
        logger.error(f"Fatal error in service: {e}")

if __name__ == "__main__":
    main()
