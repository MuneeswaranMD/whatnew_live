#!/bin/bash

# WNOT Application Management Script
# Single command to start, stop, restart, or check status of all services

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

PROJECT_DIR="/opt/wnot"
USER="ubuntu"

# Function to print status
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${PURPLE}$1${NC}"
}

# Function to show usage
show_usage() {
    echo -e "${CYAN}WNOT Application Manager${NC}"
    echo "=============================="
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start     Start all services (backend, frontend, nginx)"
    echo "  stop      Stop all services"
    echo "  restart   Restart all services"
    echo "  status    Show status of all services"
    echo "  logs      Show application logs"
    echo "  deploy    Run full deployment"
    echo "  help      Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start     # Start all services"
    echo "  $0 stop      # Stop all services"
    echo "  $0 status    # Check service status"
    echo ""
}

# Function to check service status
check_service_status() {
    print_header "🔍 Service Status Check"
    echo "========================="
    
    # System services
    echo ""
    print_status "System Services:"
    echo "PostgreSQL: $(systemctl is-active postgresql 2>/dev/null || echo 'inactive')"
    echo "Redis:      $(systemctl is-active redis-server 2>/dev/null || echo 'inactive')"
    echo "Nginx:      $(systemctl is-active nginx 2>/dev/null || echo 'inactive')"
    
    # PM2 processes
    echo ""
    print_status "Application Processes:"
    if command -v pm2 > /dev/null; then
        pm2 status 2>/dev/null || echo "No PM2 processes running"
    else
        echo "PM2 not installed"
    fi
    
    # Port status
    echo ""
    print_status "Port Status:"
    for port in 8000 3000 5432 6379 80 443; do
        if lsof -ti:$port > /dev/null 2>&1; then
            echo "Port $port: $(print_success "IN USE")"
        else
            echo "Port $port: Available"
        fi
    done
    
    # Quick health checks
    echo ""
    print_status "Health Checks:"
    if curl -s -f http://localhost:8000/ > /dev/null 2>&1; then
        echo "Backend API: $(print_success "HEALTHY")"
    else
        echo "Backend API: $(print_error "UNHEALTHY")"
    fi
    
    if [ -d "$PROJECT_DIR/seller-web/build" ]; then
        echo "Frontend Build: $(print_success "EXISTS")"
    else
        echo "Frontend Build: $(print_warning "NOT FOUND")"
    fi
}

# Function to start services
start_services() {
    print_header "🚀 Starting WNOT Services"
    echo "=========================="
    
    # Check if project directory exists
    if [ ! -d "$PROJECT_DIR" ]; then
        print_error "Project directory $PROJECT_DIR not found. Please run deployment first."
        exit 1
    fi
    
    # Start system services
    print_status "Starting system services..."
    sudo systemctl start postgresql
    sudo systemctl start redis-server
    sudo systemctl start nginx
    
    # Navigate to project directory
    cd $PROJECT_DIR
    
    # Start application services
    print_status "Starting application services..."
    if [ -f "ecosystem.config.js" ]; then
        pm2 start ecosystem.config.js
        pm2 save
    else
        print_error "PM2 ecosystem file not found"
        exit 1
    fi
    
    # Wait and check status
    sleep 10
    check_service_status
    
    print_success "All services started successfully!"
    echo ""
    print_status "Access Points:"
    echo "- Backend API: http://localhost:8000"
    echo "- Admin Panel: http://localhost:8000/admin"
    echo "- Monitor: pm2 monit"
}

# Function to stop services
stop_services() {
    print_header "🛑 Stopping WNOT Services"
    echo "=========================="
    
    # Stop PM2 processes
    print_status "Stopping application processes..."
    if command -v pm2 > /dev/null; then
        pm2 stop all 2>/dev/null || print_warning "No PM2 processes to stop"
        pm2 delete all 2>/dev/null || print_warning "No PM2 processes to delete"
    fi
    
    # Stop processes by port
    stop_process_by_port() {
        local port=$1
        local name=$2
        local pid=$(lsof -ti:$port 2>/dev/null)
        if [ ! -z "$pid" ]; then
            print_status "Stopping $name on port $port"
            kill -TERM $pid 2>/dev/null || kill -KILL $pid 2>/dev/null
            sleep 2
        fi
    }
    
    stop_process_by_port 8000 "Backend"
    stop_process_by_port 3000 "Frontend"
    
    # Kill remaining processes
    pkill -f "manage.py" 2>/dev/null || true
    pkill -f "gunicorn" 2>/dev/null || true
    pkill -f "celery" 2>/dev/null || true
    
    print_success "All application services stopped!"
    
    # Optional: Stop system services (commented out by default)
    # print_status "Stopping system services..."
    # sudo systemctl stop nginx
    # sudo systemctl stop redis-server
    # sudo systemctl stop postgresql
}

# Function to restart services
restart_services() {
    print_header "🔄 Restarting WNOT Services"
    echo "============================"
    
    stop_services
    sleep 5
    start_services
}

# Function to show logs
show_logs() {
    print_header "📋 Application Logs"
    echo "==================="
    
    if command -v pm2 > /dev/null; then
        print_status "PM2 Logs (Ctrl+C to exit):"
        pm2 logs
    else
        print_status "PM2 not available. Checking log files..."
        if [ -f "/var/log/wnot/backend.log" ]; then
            tail -f /var/log/wnot/backend.log
        else
            print_warning "No log files found"
        fi
    fi
}

# Function to run deployment
run_deployment() {
    print_header "🏗️  Running Full Deployment"
    echo "============================"
    
    if [ -f "./deploy.sh" ]; then
        chmod +x ./deploy.sh
        ./deploy.sh
    else
        print_error "deploy.sh not found in current directory"
        exit 1
    fi
}

# Main script logic
case "${1:-help}" in
    start)
        start_services
        ;;
    stop)
        stop_services
        ;;
    restart)
        restart_services
        ;;
    status)
        check_service_status
        ;;
    logs)
        show_logs
        ;;
    deploy)
        run_deployment
        ;;
    help|--help|-h)
        show_usage
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        show_usage
        exit 1
        ;;
esac
