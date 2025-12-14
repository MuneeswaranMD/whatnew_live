#!/usr/bin/env bash
set -euo pipefail

# Usage: sudo ./ec2-deploy.sh /var/www/whatnew <git-repo-url>
APP_DIR=${1:-/var/www/whatnew}
REPO=${2:-}

if [ -z "$REPO" ]; then
  echo "Usage: $0 <app-dir> <git-repo-url>"
  exit 1
fi

# Install Node.js (LTS), nginx, git
curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
apt-get update
apt-get install -y nodejs nginx git build-essential

# Clone or update repo
if [ -d "$APP_DIR" ]; then
  cd "$APP_DIR"
  git pull
else
  git clone "$REPO" "$APP_DIR"
  cd "$APP_DIR"
fi

# Install deps and build
npm ci --production=false
npm run build

# Create a simple systemd service to run the Node server (server.js)
cat >/etc/systemd/system/whatnew.service <<'EOF'
[Unit]
Description=WhatNew Static Server
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=%APP_DIR%
Environment=NODE_ENV=production
ExecStart=/usr/bin/node %APP_DIR%/server.js
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

# Replace placeholder with actual app dir
sed -i "s|%APP_DIR%|$APP_DIR|g" /etc/systemd/system/whatnew.service

# Reload, enable, start
systemctl daemon-reload
systemctl enable whatnew.service
systemctl restart whatnew.service

# Configure nginx as reverse proxy
cat >/etc/nginx/sites-available/whatnew <<'EOF'
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

ln -sf /etc/nginx/sites-available/whatnew /etc/nginx/sites-enabled/whatnew
nginx -t && systemctl restart nginx

echo "Deployment finished. Check server status: sudo systemctl status whatnew"