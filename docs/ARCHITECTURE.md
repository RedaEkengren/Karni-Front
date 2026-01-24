# Architecture

## Overview

Smart Karni is a PWA for Moroccan merchants to manage customer credits.

```
┌─────────────────────────────────────────────────────────┐
│                      Frontend                           │
│  React SPA (Vite + TailwindCSS + Shadcn)               │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │  Landing    │  │   Credit    │  │    PWA      │     │
│  │   Pages     │  │   Manager   │  │  Features   │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                     Supabase                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │    Auth     │  │  Database   │  │   Storage   │     │
│  │  (OAuth)    │  │ (PostgreSQL)│  │   (Files)   │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                   GitHub Pages                          │
│  Static hosting with custom domain (smartkarni.com)    │
└─────────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Vite |
| Styling | TailwindCSS, Shadcn/ui |
| State | Zustand, React Query |
| Backend | Supabase (BaaS) |
| Database | PostgreSQL (via Supabase) |
| Auth | Supabase Auth |
| Offline | Dexie (IndexedDB) |
| PWA | VitePWA, Workbox |
| Hosting | GitHub Pages |
| CI/CD | GitHub Actions |

## Data Flow

1. User interacts with React UI
2. State managed by Zustand (local) + React Query (server)
3. Data synced to Supabase PostgreSQL
4. Offline changes stored in Dexie, synced when online
