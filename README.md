# Rassidi - رصيدي

Moroccan debt tracking app for small merchants.

---

## Live Site

**URL:** https://benbodev.se

| Path | Beskrivning |
|------|-------------|
| `/` | Landing page (Rassidi) |
| `/app/` | Credit Manager Pro (väns app) |

---

## Project Structure

**ETT projekt, TVÅ repos:**

```
/opt/karni/
├── frontend/     # Landing page → benbodev.se/
├── backend/      # Credit Manager (ZakJ0/credit-manager-pro) → benbodev.se/app/
└── scripts/      # Deploy scripts
```

**VIKTIGT:** Frontend har INGA /app routes - nginx servar backend separat.

---

## Frontend (Landing Page)

**Tech:** React, Vite, Tailwind, shadcn/ui, PWA

```bash
cd frontend
npm install
npm run dev      # http://localhost:8080
npm run build    # Creates dist/
```

**Deploy:**
```bash
npm run build
sudo cp -r dist/* /var/www/benbodev.se/html/
```

---

## Backend (Credit Manager Pro)

**Repo:** `github.com/ZakJ0/credit-manager-pro`
**Tech:** React, Vite, Tailwind, shadcn/ui, Supabase

```bash
cd backend
npm install
npm run dev      # http://localhost:5173
npm run build    # Creates dist/
```

**VIKTIGT för /app path:**
- `vite.config.ts` måste ha: `base: '/app/'`
- `src/App.tsx` måste ha: `<BrowserRouter basename="/app">`

**Deploy:**
```bash
npm run build
sudo cp -r dist/* /var/www/benbodev.se/app/
```

**Supabase Config:**
- Project: `otmzmxljeswxblzemamx`
- Config in: `backend/.env`

---

## Quick Commands

```bash
# Build & deploy frontend (landing page)
cd /opt/karni/frontend && npm run build && sudo cp -r dist/* /var/www/benbodev.se/html/

# Build & deploy backend (Credit Manager app)
cd /opt/karni/backend && npm run build && sudo cp -r dist/* /var/www/benbodev.se/app/

# Reload nginx
sudo systemctl reload nginx
```

---

## Server Info

- **Server:** ghostleads (Ubuntu)
- **Domain:** benbodev.se
- **SSL:** Let's Encrypt (auto-renew)
- **Web server:** Nginx

---

## Files

| File | Purpose |
|------|---------|
| `goldenrules.md` | Development rules (READ FIRST) |
| `mvp.md` | MVP specification |
| `domains.md` | Domain research |

---

## Contact

Questions? Contact the team.
