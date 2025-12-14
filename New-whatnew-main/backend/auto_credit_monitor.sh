#!/bin/bash

# Auto Credit Monitor Bash Script
# This script runs the Django credit monitoring command automatically
# It restarts the monitoring if it crashes and logs all activity

# Default configuration
CHECK_INTERVAL=300  # 5 minutes
LOG_FILE="credit_monitor.log"
RUN_ONCE=false
VERBOSE=false
MAX_RESTARTS=10

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_PATH="$SCRIPT_DIR"
LOG_PATH="$BACKEND_PATH/$LOG_FILE"

# Function to print usage
usage() {
    echo "Usage: $0 [OPTIONS]"
    echo "Options:"
    echo "  -i, --interval SECONDS    Check interval in seconds (default: 300)"
    echo "  -l, --log FILE           Log file name (default: credit_monitor.log)"
    echo "  -o, --once               Run once and exit"
    echo "  -v, --verbose            Enable verbose output"
    echo "  -h, --help               Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                       # Run continuous monitoring"
    echo "  $0 --once               # Run once and exit"
    echo "  $0 --interval 180       # Check every 3 minutes"
    echo "  $0 --verbose            # Enable verbose output"
}

# Function to write timestamped log
write_log() {
    local message="$1"
    local level="${2:-INFO}"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    local log_entry="[$timestamp] [$level] $message"
    echo "$log_entry"
    echo "$log_entry" >> "$LOG_PATH"
}

# Function to check if Django server is running
check_django_server() {
    if command -v curl >/dev/null 2>&1; then
        curl -s -o /dev/null -w "%{http_code}" "http://192.168.31.247:8000/api/health/" | grep -q "200"
    elif command -v wget >/dev/null 2>&1; then
        wget -q --spider "http://192.168.31.247:8000/api/health/" 2>/dev/null
    else
        write_log "Neither curl nor wget available for health check" "WARN"
        return 0  # Assume it's running
    fi
}

# Function to run credit monitoring
start_credit_monitoring() {
    local run_once="$1"
    local verbose="$2"
    
    write_log "Starting credit monitoring process..."
    
    # Change to backend directory
    cd "$BACKEND_PATH" || {
        write_log "Failed to change to backend directory: $BACKEND_PATH" "ERROR"
        return 1
    }
    
    # Build command arguments
    local cmd_args=("manage.py" "monitor_credits" "--check-interval" "$CHECK_INTERVAL")
    
    if [ "$run_once" = true ]; then
        cmd_args+=("--run-once")
    fi
    
    if [ "$verbose" = true ]; then
        cmd_args+=("--verbose")
    fi
    
    # Run the Django management command
    if [ "$run_once" = true ]; then
        write_log "Running credit monitor once..."
        python "${cmd_args[@]}"
        write_log "Credit monitor run completed."
    else
        write_log "Starting continuous credit monitoring (interval: ${CHECK_INTERVAL}s)..."
        write_log "Use Ctrl+C to stop the monitoring service."
        python "${cmd_args[@]}"
    fi
}

# Function to handle cleanup on exit
cleanup() {
    write_log "Received interrupt signal. Stopping credit monitor service..."
    exit 0
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -i|--interval)
            CHECK_INTERVAL="$2"
            shift 2
            ;;
        -l|--log)
            LOG_FILE="$2"
            LOG_PATH="$BACKEND_PATH/$LOG_FILE"
            shift 2
            ;;
        -o|--once)
            RUN_ONCE=true
            shift
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        -h|--help)
            usage
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            usage
            exit 1
            ;;
    esac
done

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Main execution
main() {
    write_log "Auto Credit Monitor Service Starting..."
    write_log "Backend Path: $BACKEND_PATH"
    write_log "Log File: $LOG_PATH"
    write_log "Check Interval: ${CHECK_INTERVAL}s"
    write_log "Run Once: $RUN_ONCE"
    write_log "Verbose: $VERBOSE"
    
    # Check if Django server is accessible
    write_log "Checking Django server availability..."
    if ! check_django_server; then
        write_log "Warning: Django server not accessible at http://192.168.31.247:8000/" "WARN"
        write_log "Make sure the Django server is running before starting credit monitoring." "WARN"
    else
        write_log "Django server is accessible."
    fi
    
    # Check if Python is available
    if ! command -v python >/dev/null 2>&1; then
        write_log "Error: Python is not available in PATH" "ERROR"
        exit 1
    fi
    
    if [ "$RUN_ONCE" = true ]; then
        # Run once and exit
        start_credit_monitoring true "$VERBOSE"
    else
        # Continuous monitoring with restart capability
        local restart_count=0
        
        while [ $restart_count -lt $MAX_RESTARTS ]; do
            if start_credit_monitoring false "$VERBOSE"; then
                break  # Normal exit
            else
                restart_count=$((restart_count + 1))
                write_log "Credit monitoring crashed (attempt $restart_count/$MAX_RESTARTS)" "ERROR"
                
                if [ $restart_count -lt $MAX_RESTARTS ]; then
                    write_log "Restarting credit monitoring in 30 seconds..." "WARN"
                    sleep 30
                else
                    write_log "Maximum restart attempts reached. Stopping service." "ERROR"
                    break
                fi
            fi
        done
    fi
    
    write_log "Auto Credit Monitor Service Stopped."
}

# Run main function
main "$@"
