#!/bin/bash

# WNOT Application Stop Script
# Stops all services: Backend, Frontend, and associated services

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PROJECT_DIR="/opt/wnot"

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

echo -e "${RED}🛑 Stopping WNOT Application Services${NC}"
echo "============================================="

# Stop PM2 processes
print_status "Stopping PM2 processes..."
if command -v pm2 > /dev/null; then
    pm2 stop all 2>/dev/null || print_warning "No PM2 processes to stop"
    pm2 delete all 2>/dev/null || print_warning "No PM2 processes to delete"
    print_success "PM2 processes stopped"
else
    print_warning "PM2 not found"
fi

# Stop processes by port
stop_process_by_port() {
    local port=$1
    local process_name=$2
    
    local pid=$(lsof -ti:$port 2>/dev/null)
    if [ ! -z "$pid" ]; then
        print_status "Stopping $process_name on port $port (PID: $pid)"
        kill -TERM $pid 2>/dev/null || kill -KILL $pid 2>/dev/null
        sleep 2
        if kill -0 $pid 2>/dev/null; then
            kill -KILL $pid 2>/dev/null
        fi
        print_success "$process_name stopped"
    else
        print_status "No process found on port $port"
    fi
}

# Stop application processes
print_status "Stopping application processes..."
stop_process_by_port 8000 "Django Backend"
stop_process_by_port 3000 "React Dev Server"
stop_process_by_port 8080 "Alternative Server"

# Stop any remaining Python/Node processes related to our project
print_status "Stopping project-related processes..."

# Kill Django processes
pkill -f "manage.py" 2>/dev/null && print_success "Django processes stopped" || print_status "No Django processes found"

# Kill Gunicorn processes
pkill -f "gunicorn" 2>/dev/null && print_success "Gunicorn processes stopped" || print_status "No Gunicorn processes found"

# Kill Node.js processes (be careful not to kill system Node processes)
pkill -f "react-scripts" 2>/dev/null && print_success "React scripts stopped" || print_status "No React scripts found"
pkill -f "npm start" 2>/dev/null && print_success "NPM processes stopped" || print_status "No NPM processes found"

# Stop Nginx (optional - comment out if you want to keep it running)
# print_status "Stopping Nginx..."
# sudo systemctl stop nginx
# print_success "Nginx stopped"

# Optional: Stop Redis and PostgreSQL (uncomment if you want to stop them)
# print_status "Stopping Redis..."
# sudo systemctl stop redis-server
# print_success "Redis stopped"

# print_status "Stopping PostgreSQL..."
# sudo systemctl stop postgresql
# print_success "PostgreSQL stopped"

# Clean up any remaining processes
print_status "Cleaning up remaining processes..."

# Kill any remaining processes that might be using our project directory
if [ -d "$PROJECT_DIR" ]; then
    fuser -k $PROJECT_DIR 2>/dev/null || print_status "No processes using project directory"
fi

# Display final status
echo ""
print_status "Final Status Check:"
echo "==================="

# Check if ports are free
for port in 8000 3000 8080; do
    if lsof -ti:$port > /dev/null 2>&1; then
        print_warning "Port $port is still in use"
    else
        print_success "Port $port is free"
    fi
done

# Check system services
echo ""
print_status "System Services Status:"
echo "Nginx:      $(systemctl is-active nginx 2>/dev/null || echo 'not running')"
echo "Redis:      $(systemctl is-active redis-server 2>/dev/null || echo 'not running')"
echo "PostgreSQL: $(systemctl is-active postgresql 2>/dev/null || echo 'not running')"

echo ""
print_success "WNOT Application stopped successfully!"
print_status "To start again, run: ./start.sh"

# Optional: Show remaining processes
if command -v pm2 > /dev/null; then
    echo ""
    print_status "PM2 Status:"
    pm2 status 2>/dev/null || echo "No PM2 processes running"
fi
