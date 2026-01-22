# Rassidi - رصيدي

> التطبيق المغربي لتتبع الديون - L'app marocaine de suivi des dettes

**رصيدك ما يضيعش** - Vos données ne se perdent jamais

---

## About

Rassidi is a Moroccan debt tracking app designed for small merchants (hanouts, épiceries). Built with offline-first architecture to ensure data never gets lost.

### Key Differentiators

| Feature | Rassidi | Others |
|---------|---------|--------|
| Data loss | Never (offline-first) | Common issue |
| Auth | WhatsApp OTP | SMS (unreliable) |
| Support | 24/7 AI chatbot (Darija/French) | None |
| Community | Sadaqa feature | N/A |
| Security | Biometric lock | None |

---

## Tech Stack

### Frontend (PWA)
- React 18 + TypeScript
- Vite + vite-plugin-pwa
- Tailwind CSS + shadcn/ui
- Dexie.js (IndexedDB)
- Zustand (state management)
- React Router v6

### Backend
- Node.js + Hono
- PostgreSQL
- Redis
- JWT authentication

### Integrations
- DeepSeek AI (chatbot)
- Twilio WhatsApp API (OTP + reminders)

---

## Project Structure

```
/opt/karni/
├── frontend/           # React PWA
│   ├── src/
│   │   ├── components/ # UI components
│   │   ├── pages/      # Route pages
│   │   ├── db/         # Dexie (IndexedDB)
│   │   ├── stores/     # Zustand stores
│   │   ├── services/   # API + sync
│   │   └── contexts/   # React contexts
│   └── dist/           # Built files
├── backend/            # Hono API
│   └── src/
│       ├── routes/     # API endpoints
│       ├── services/   # Business logic
│       ├── middleware/ # Auth, etc.
│       └── db/         # PostgreSQL
├── scripts/            # Deploy scripts
├── mvp.md              # MVP specification
├── goldenrules.md      # Development rules
└── domains.md          # Domain research
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Redis 7+

### Frontend Development

```bash
cd frontend
npm install
npm run dev
# Open http://localhost:8080
```

### Backend Development

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
# API runs on http://localhost:3000
```

### Environment Variables

```env
# Backend (.env)
DATABASE_URL=postgresql://user:pass@localhost:5432/rassidi
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
DEEPSEEK_API_KEY=your-deepseek-key
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

---

## Features

### Implemented ✅
- [x] Customer management (CRUD)
- [x] Debt tracking (add, pay, mark paid)
- [x] Offline-first with auto-sync
- [x] PWA (installable, works offline)
- [x] Bilingual (Arabic RTL + French LTR)
- [x] WhatsApp OTP login (UI)
- [x] AI chatbot (UI + backend service)
- [x] Sadaqa donation feature (UI)
- [x] Dashboard with stats
- [x] Customer search

### In Progress 🚧
- [ ] PostgreSQL + Redis setup
- [ ] Twilio integration
- [ ] DeepSeek API integration
- [ ] Biometric lock

### Planned 📋
- [ ] WhatsApp reminders (Premium)
- [ ] PDF export (Premium)
- [ ] CNDP compliance

---

## Deployment

### Production (benbodev.se)

```bash
# Build frontend
cd frontend
npm run build

# Deploy to nginx
sudo cp -r dist/* /var/www/benbodev.se/html/

# Reload nginx
sudo systemctl reload nginx
```

### Nginx Configuration

```nginx
server {
    listen 443 ssl;
    server_name benbodev.se;

    root /var/www/benbodev.se/html;

    # API proxy
    location /api/ {
        proxy_pass http://localhost:3000/;
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/request-otp | Send WhatsApp OTP |
| POST | /auth/verify-otp | Verify OTP, get token |
| GET | /customers | List customers |
| POST | /customers | Create customer |
| GET | /customers/:id | Get customer + debts |
| POST | /debts | Create debt |
| POST | /debts/:id/pay | Pay debt |
| POST | /sync/push | Push offline changes |
| GET | /sync/pull | Pull server changes |
| POST | /chat | AI chatbot |
| POST | /sadaqa/donate | Give sadaqa |

---

## License

Private - All rights reserved

---

## Contact

- Email: salam@rassidi.ma
- WhatsApp: +212 XXX XXX XXX

---

*Built with ❤️ in Morocco 🇲🇦*
