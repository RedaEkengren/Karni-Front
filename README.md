# Smart Karni

> PWA for Moroccan merchants to manage customer credits.

**Live:** https://smartkarni.com

[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-red.svg)](LICENSE)

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Vite |
| Styling | TailwindCSS, Shadcn/ui |
| State | Zustand, React Query |
| Backend | Supabase (BaaS) |
| PWA | VitePWA, Workbox |
| Hosting | GitHub Pages |

## Project Structure

```
├── frontend/           # React SPA
├── .github/workflows/  # GitHub Actions (auto-deploy)
├── backend/            # Future API (placeholder)
├── scripts/            # Deploy scripts
└── docs/               # Documentation
```

## Getting Started

```bash
# Requirements
node -v  # 20+ (see .nvmrc)

# Install
cd frontend
npm install

# Create .env (see .env.example)
cp .env.example .env

# Development
npm run dev         # http://localhost:8080

# Build
npm run build       # -> dist/

# Test
npm run test
```

## Deployment

Auto-deployed via GitHub Actions on push to `main`.

- **Domain:** smartkarni.com
- **Hosting:** GitHub Pages
- **SSL:** Automatic via GitHub

## Routes

| Path | Description |
|------|-------------|
| `/` | Landing page |
| `/features` | Features |
| `/pricing` | Pricing |
| `/auth` | Login |
| `/dashboard` | Dashboard |
| `/clients` | Clients |

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Deployment](docs/DEPLOYMENT.md)
- [Contributing](docs/CONTRIBUTING.md)

## License

Proprietary - All Rights Reserved. See [LICENSE](LICENSE).
