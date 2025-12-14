#!/bin/bash

# WNOT Setup Script - Makes all scripts executable and sets up permissions

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Setting up WNOT application scripts...${NC}"

# Make scripts executable
chmod +x deploy.sh
chmod +x start.sh
chmod +x stop.sh
chmod +x manage.sh

# Create symlinks for easier access (optional)
if [ ! -L "/usr/local/bin/wnot" ]; then
    sudo ln -sf "$(pwd)/manage.sh" /usr/local/bin/wnot
    echo -e "${GREEN}✓ Created 'wnot' command in /usr/local/bin${NC}"
fi

echo -e "${GREEN}✓ All scripts are now executable${NC}"
echo ""
echo "Available commands:"
echo "  ./deploy.sh     - Full deployment"
echo "  ./start.sh      - Start all services"
echo "  ./stop.sh       - Stop all services"
echo "  ./manage.sh     - Unified management (start/stop/status/logs)"
echo "  wnot           - Global command (same as manage.sh)"
echo ""
echo "Examples:"
echo "  wnot start      # Start all services"
echo "  wnot stop       # Stop all services"
echo "  wnot status     # Check status"
echo "  wnot logs       # View logs"
