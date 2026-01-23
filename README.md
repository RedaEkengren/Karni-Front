# Rassidi + Credit Manager Pro

> PWA för marockanska handlare att hantera kundkrediter.

**Live:** https://benbodev.se

[![CI](https://github.com/RedaEkengren/Karni-Front/actions/workflows/ci.yml/badge.svg)](https://github.com/RedaEkengren/Karni-Front/actions)
[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-red.svg)](LICENSE)

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Vite |
| Styling | TailwindCSS, Shadcn/ui |
| State | Zustand, React Query |
| Backend | Supabase (BaaS) |
| PWA | VitePWA, Workbox |

## Projektstruktur

```
├── frontend/       # React SPA
├── backend/        # Framtida API (placeholder)
├── scripts/        # Deploy-scripts
└── docs/           # Dokumentation
```

## Kom igång

```bash
# Krav
node -v  # 20+ (se .nvmrc)

# Installera
cd frontend
npm install

# Utveckling
npm run dev         # http://localhost:8080

# Bygg
npm run build       # → dist/

# Test
npm run test
```

## Deploy

Deployas till egen server (benbodev.se), inte GitHub Pages.

```bash
./scripts/deploy-frontend.sh
```

Eller manuellt:
```bash
cd frontend
npm run build
sudo cp -r dist/* /var/www/benbodev.se/html/
sudo chown -R www-data:www-data /var/www/benbodev.se/html/
```

## Routes

| Path | Beskrivning |
|------|-------------|
| `/` | Landing page |
| `/features` | Features |
| `/pricing` | Priser |
| `/auth` | Inloggning |
| `/dashboard` | Dashboard |
| `/clients` | Kunder |

## Dokumentation

- [Arkitektur](docs/ARCHITECTURE.md)
- [Deployment](docs/DEPLOYMENT.md)
- [Contributing](docs/CONTRIBUTING.md)

## Licens

Proprietary - All Rights Reserved. Se [LICENSE](LICENSE).
