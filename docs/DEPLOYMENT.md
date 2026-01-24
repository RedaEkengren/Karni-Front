# Deployment

## Production

**URL:** https://smartkarni.com

**Hosting:** GitHub Pages (auto-deploy via GitHub Actions)

## How It Works

1. Push to `main` branch
2. GitHub Actions workflow triggers
3. Builds the React app
4. Deploys to GitHub Pages
5. Custom domain `smartkarni.com` serves the site

## GitHub Actions Workflow

Location: `.github/workflows/deploy.yml`

```yaml
on:
  push:
    branches: [main]
```

## Environment Variables

Set these as GitHub repository secrets:

| Secret | Description |
|--------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon key |
| `VITE_SUPABASE_PROJECT_ID` | Supabase project ID |

## Custom Domain Setup

### DNS Records (at domain registrar)

```
A     @    185.199.108.153
A     @    185.199.109.153
A     @    185.199.110.153
A     @    185.199.111.153
CNAME www  redaekengren.github.io
```

### GitHub Settings

1. Go to repo Settings -> Pages
2. Add custom domain: `smartkarni.com`
3. Enable "Enforce HTTPS"

## SSL

Automatic via GitHub Pages (Let's Encrypt).

## Manual Deploy (if needed)

```bash
cd /opt/karni/frontend
npm run build
# Then push to main - GitHub Actions handles the rest
```
