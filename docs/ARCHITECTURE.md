# Architecture

## Overview

Rassidi + Credit Manager Pro is a merged PWA for Moroccan merchants.

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

## Data Flow

1. User interacts with React UI
2. State managed by Zustand (local) + React Query (server)
3. Data synced to Supabase PostgreSQL
4. Offline changes stored in Dexie, synced when online
