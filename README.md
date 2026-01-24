# Smart Karni

> Simple credit management for Moroccan merchants.

**Live:** https://smartkarni.com

[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-red.svg)](LICENSE)

---

## Why We're Building This

In Morocco, small merchants (hanout owners, wholesalers) manage customer credit the old-fashioned way: handwritten notebooks, memory, and trust. This leads to:

- **Lost revenue** - forgotten debts, unclear balances
- **Disputes** - "I paid last week!" vs "No you didn't"
- **Stress** - tracking dozens of customers manually

**Smart Karni** digitizes this process. Simple, offline-first, bilingual (Arabic/French). No accounting degree required.

---

## Features

| Feature | Status |
|---------|--------|
| Customer management | Done |
| Credit/debt tracking | Done |
| Transaction history | Done |
| Offline support (PWA) | Done |
| Arabic/French bilingual | Done |
| Dashboard overview | Done |
| SMS reminders | Planned |
| WhatsApp integration | Planned |
| Multi-store support | Planned |
| Export to Excel/PDF | Planned |

---

## Roadmap

### Now
- Core credit management
- PWA with offline sync
- Basic dashboard

### Next
- SMS payment reminders
- WhatsApp notifications
- Customer payment links

### Later
- Multi-store/employee accounts
- Analytics & reports
- Inventory integration

---

## Tech Decisions

| Choice | Why |
|--------|-----|
| **React + Vite** | Fast DX, great ecosystem, easy to hire for |
| **Supabase** | Postgres + Auth + Realtime without managing servers |
| **Dexie (IndexedDB)** | Offline-first is critical - merchants need it to work anywhere |
| **TailwindCSS** | Rapid UI development, consistent design |
| **GitHub Pages** | Free, reliable, auto-deploy via Actions |
| **PWA** | Install on phone without app stores, works offline |

### Why not a native app?
- App store approval is slow and complicated
- PWA covers 90% of use cases
- One codebase for web + mobile
- Instant updates without app store review

### Why Supabase over Firebase?
- Postgres > Firestore for relational data
- Better pricing model
- Open source, can self-host later
- SQL is more flexible than NoSQL for this use case

---

## Team

Built by developers who understand the Moroccan market.

- [Reda Ekengren](https://github.com/RedaEkengren)
- [Zakaria](https://github.com/ZakJ0)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Vite |
| Styling | TailwindCSS, Shadcn/ui |
| State | Zustand, React Query |
| Backend | Supabase (BaaS) |
| PWA | VitePWA, Workbox |
| Hosting | GitHub Pages |

---

## Getting Started

```bash
# Clone
git clone https://github.com/RedaEkengren/Karni-Front.git
cd Karni-Front/frontend

# Install
npm install

# Create .env (see .env.example)
cp .env.example .env

# Development
npm run dev         # http://localhost:8080

# Build
npm run build
```

---

## License

Proprietary - All Rights Reserved. See [LICENSE](LICENSE).

---

**Questions?** Open an issue or reach out.
