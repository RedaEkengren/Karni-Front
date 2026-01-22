# Rassidi - رصيدي

Moroccan debt tracking app for small merchants.

---

## Live Sites

| Site | URL | Description |
|------|-----|-------------|
| Landing Page | https://benbodev.se | Marketing site |
| App | https://app.benbodev.se | Credit Manager Pro |

---

## Project Structure

```
/opt/karni/
├── frontend/     # Landing page → benbodev.se
├── backend/      # Credit Manager app → app.benbodev.se
└── scripts/      # Deploy scripts
```

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

**Tech:** React, Vite, Tailwind, shadcn/ui, Supabase

```bash
cd backend
npm install
npm run dev      # http://localhost:5173
npm run build    # Creates dist/
```

**Deploy:**
```bash
npm run build
sudo cp -r dist/* /var/www/app.benbodev.se/html/
```

**Supabase Config:**
- Project: `otmzmxljeswxblzemamx`
- Config in: `backend/.env`

---

## Quick Commands

```bash
# Build & deploy frontend
cd /opt/karni/frontend && npm run build && sudo cp -r dist/* /var/www/benbodev.se/html/

# Build & deploy backend
cd /opt/karni/backend && npm run build && sudo cp -r dist/* /var/www/app.benbodev.se/html/
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
