#!/bin/bash

# WNOT Application Start Script
# Starts all services: Backend, Frontend, and Nginx

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

echo -e "${GREEN}🚀 Starting WNOT Application Services${NC}"
echo "============================================="

# Check if project directory exists
if [ ! -d "$PROJECT_DIR" ]; then
    print_error "Project directory $PROJECT_DIR not found. Please run deploy.sh first."
    exit 1
fi

# Start system services
print_status "Starting system services..."

# Start PostgreSQL
sudo systemctl start postgresql
if systemctl is-active --quiet postgresql; then
    print_success "PostgreSQL started"
else
    print_error "Failed to start PostgreSQL"
    exit 1
fi

# Start Redis
sudo systemctl start redis-server
if systemctl is-active --quiet redis-server; then
    print_success "Redis started"
else
    print_error "Failed to start Redis"
    exit 1
fi

# Start Nginx
sudo systemctl start nginx
if systemctl is-active --quiet nginx; then
    print_success "Nginx started"
else
    print_error "Failed to start Nginx"
    exit 1
fi

# Navigate to project directory
cd $PROJECT_DIR

# Start application services using PM2
print_status "Starting application services..."

# Check if PM2 ecosystem file exists
if [ ! -f "ecosystem.config.js" ]; then
    print_error "PM2 ecosystem file not found. Please run deploy.sh first."
    exit 1
fi

# Start PM2 processes
pm2 start ecosystem.config.js

# Save PM2 process list and setup startup script
pm2 save
pm2 startup systemd -u $USER --hp /home/$USER

# Check application status
print_status "Checking service status..."

# Wait a moment for services to start
sleep 10

# Check backend
if curl -s http://localhost:8000/api/health/ > /dev/null 2>&1; then
    print_success "Backend API is running on port 8000"
else
    print_error "Backend API is not responding - checking alternative endpoint"
    if curl -s http://localhost:8000/ > /dev/null 2>&1; then
        print_success "Backend is running but health endpoint may not be configured"
    else
        print_error "Backend is not responding at all"
    fi
fi

# Check if Nginx is serving sites
if curl -s -o /dev/null -w "%{http_code}" http://localhost | grep -q "200\|301\|302"; then
    print_success "Nginx is serving content"
else
    print_error "Nginx is not serving content properly"
fi

# Display service status
echo ""
print_status "Service Status:"
echo "==============="

# PM2 status
pm2 status

echo ""
print_status "System Services:"
echo "PostgreSQL: $(systemctl is-active postgresql)"
echo "Redis:      $(systemctl is-active redis-server)"
echo "Nginx:      $(systemctl is-active nginx)"

echo ""
print_success "WNOT Application started successfully!"
print_status "Access points:"
echo "- API Server: http://localhost:8000"
echo "- Admin Panel: http://localhost:8000/admin"
echo "- Seller Web: Configure nginx for your domain"
echo "- Share Page: Configure nginx for your domain"

echo ""
print_status "Useful commands:"
echo "- View logs: pm2 logs"
echo "- Restart services: pm2 restart all"
echo "- Stop services: ./stop.sh"
echo "- Monitor services: pm2 monit"

# Optional: Open monitoring dashboard
if command -v pm2 > /dev/null; then
    echo ""
    print_status "To monitor services in real-time, run: pm2 monit"
fi
