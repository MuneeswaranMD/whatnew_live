# Deploying WhatNew to an AWS EC2 instance (Ubuntu)

Quick steps:

1. Provision an Ubuntu EC2 instance and allow inbound ports 22 and 80 (HTTP) in the security group. If you prefer HTTPS, add 443 and configure certs (Let's Encrypt).

2. Copy repository to the server (via `git clone` or `rsync`).

3. Run the included helper script as root (fill repo URL and destination):

```bash
sudo ./deploy/ec2-deploy.sh /var/www/whatnew git@github.com:your/repo.git
```

What the script does:

- Installs Node LTS, nginx, git
- Clones/updates repo
- Runs `npm ci` and `npm run build`
- Sets up a systemd service (`whatnew.service`) to run `server.js` on port 3000
- Adds an nginx site that reverse-proxies to the Node server

Notes and production tips:

- The app build uses a relative `base: './'` so it can be hosted from a subdirectory or directly under a domain.
- For higher performance, you can bypass Node and let nginx serve static files directly (copy `dist` to `/var/www/whatnew` and point nginx `root` to it).
- Consider adding TLS (Certbot) and setting up a firewall.
- Use `systemctl status whatnew` and `journalctl -u whatnew -f` to debug.

Manual commands to test locally before upload:

```bash
npm ci
npm run build
npm run serve:prod
# open http://localhost:3000
```
