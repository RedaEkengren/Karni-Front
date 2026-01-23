# Deployment

## Production

**URL:** https://benbodev.se

**Server:** Ubuntu (nginx)

### Deploy Steps

```bash
# 1. Build
cd /opt/karni/frontend
npm run build

# 2. Deploy (automated)
./scripts/deploy-frontend.sh

# Or manually:
sudo rm -rf /var/www/benbodev.se/html/*
sudo cp -r dist/* /var/www/benbodev.se/html/
sudo chown -R www-data:www-data /var/www/benbodev.se/html/
```

### Nginx Config

Location: `/etc/nginx/sites-available/benbodev.se`

```nginx
server {
    listen 443 ssl;
    server_name benbodev.se www.benbodev.se;

    root /var/www/benbodev.se/html;
    index index.html;

    # PWA manifest
    location = /manifest.webmanifest {
        types { }
        default_type application/manifest+json;
    }

    # Service Worker
    location = /sw.js {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### SSL

Managed by Let's Encrypt (Certbot).

## CI/CD

GitHub Actions runs on push to `main`:
- Lint
- Build
- Test
