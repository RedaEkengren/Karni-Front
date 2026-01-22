# Rassidi MVP Spec

> "الأبليكاسيون لي ما كيضيعش الداطا" — Appen som aldrig förlorar din data

---

## Positionering

| Karny | Rassidi |
|-------|---------|
| Dataförlust, krascher | Offline-first, aldrig förlorar |
| SMS auth (fungerar inte) | WhatsApp OTP |
| Ingen support | 24/7 AI-chatbot (darija/franska) |
| Fintech-fokus | Community-fokus (Sadaqa) |
| Ingen biometri | Fingeravtryck/PIN |

---

## Core Features (MVP)

### 1. Skuldhantering
- [x] Lägg till kund (namn + telefon, endast namn krävs)
- [x] Registrera skuld (belopp + datum + valfri anteckning)
- [x] Visa total skuld per kund
- [x] Markera som betald (helt eller delvis)
- [x] Sök kund

### 2. Offline-First
- [x] Fungerar 100% utan internet (IndexedDB/Dexie)
- [x] Automatisk sync när online
- [x] Konflikthantering (senaste ändring vinner)
- [x] Visuell indikator: online/offline/syncing

### 3. Auth & Säkerhet
- [x] WhatsApp OTP (primär) - UI klar, backend behövs
- [ ] TOTP/Authy (valfritt för avancerade)
- [ ] Biometriskt lås (fingeravtryck/Face ID) - Premium
- [ ] PIN-kod backup
- [ ] Telefonnummer-recovery

### 4. Sadaqa-funktion ❤️
- [x] "Sadaqa"-flik i appen
- [x] Se antal personer som behöver hjälp (UI placeholder)
- [x] Välj belopp att ge
- [ ] FIFO: äldsta skulden betalas först (backend behövs)
- [x] Givare kan vara anonym eller visa namn
- [ ] Mottagare får notis: "Någon betalade X MAD som sadaqa 🤲"

### 5. AI Support (DeepSeek)
- [x] In-app chatbot (UI klar)
- [x] Darija + franska (system prompt klar)
- [ ] Svarar på FAQ (backend-integration behövs)
- [ ] Hjälper med felsökning
- [ ] Proaktiva tips baserat på användardata
- [ ] Eskalering till mänsklig support vid behov

### 6. WhatsApp-påminnelser (Premium)
- [ ] Skicka påminnelse till kund
- [ ] Fördefinierade mallar (artiga)
- [ ] Spåra om meddelande skickats

### 7. Språk
- [x] Arabiska (Darija) - RTL
- [x] Franska - LTR
- [x] Växla språk i appen

---

## Prissättning

| Tier | Pris | Funktioner |
|------|------|------------|
| **Gratis** | 0 MAD | 20 kunder, grundläggande skuld, offline, backup |
| **Premium** | 40 MAD/år | Obegränsat, WhatsApp-påminnelser, PDF, biometri, prioriterad support |

---

## Teknisk Arkitektur

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                             │
│                     (PWA - React)                           │
├─────────────────────────────────────────────────────────────┤
│  IndexedDB (Dexie.js)  │  Service Worker  │  UI Components  │
│  - Lokal databas       │  - Offline cache │  - React        │
│  - Sync queue          │  - Background    │  - Tailwind     │
│                        │    sync          │  - shadcn/ui    │
└────────────┬────────────────────┬────────────────────────────┘
             │                    │
             │   Sync när online  │
             ▼                    ▼
┌─────────────────────────────────────────────────────────────┐
│                        BACKEND                              │
│                   (Node.js / Hono)                          │
├─────────────────────────────────────────────────────────────┤
│  API Routes          │  Services           │  Integrations  │
│  - /auth             │  - SyncService      │  - DeepSeek    │
│  - /customers        │  - SadaqaService    │  - WhatsApp    │
│  - /debts            │  - NotifyService    │  - Twilio      │
│  - /sadaqa           │  - AIService        │                │
│  - /chat             │                     │                │
└────────────┬────────────────────┬────────────────────────────┘
             │                    │
             ▼                    ▼
┌─────────────────────────────────────────────────────────────┐
│                       DATABASE                              │
│              (PostgreSQL + Redis)                           │
├─────────────────────────────────────────────────────────────┤
│  PostgreSQL           │  Redis                              │
│  - users              │  - Sessions                         │
│  - customers          │  - OTP codes                        │
│  - debts              │  - Rate limiting                    │
│  - sadaqa_queue       │  - Cache                            │
│  - sync_log           │                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## Datamodell

```sql
-- Användare
users (
  id UUID PRIMARY KEY,
  phone VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100),
  language ENUM('ar', 'fr') DEFAULT 'ar',
  is_premium BOOLEAN DEFAULT FALSE,
  premium_until TIMESTAMP,
  biometric_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
)

-- Kunder (hanout-ägarens kunder)
customers (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP -- soft delete
)

-- Skulder
debts (
  id UUID PRIMARY KEY,
  customer_id UUID REFERENCES customers(id),
  amount DECIMAL(10,2) NOT NULL,
  note TEXT,
  is_paid BOOLEAN DEFAULT FALSE,
  paid_at TIMESTAMP,
  paid_via ENUM('customer', 'sadaqa'),
  sadaqa_donor_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
)

-- Sadaqa-kö (FIFO)
sadaqa_queue (
  id UUID PRIMARY KEY,
  debt_id UUID REFERENCES debts(id),
  amount_remaining DECIMAL(10,2) NOT NULL,
  is_eligible BOOLEAN DEFAULT TRUE, -- opt-in
  created_at TIMESTAMP DEFAULT NOW()
)

-- Sync-logg
sync_log (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  action ENUM('create', 'update', 'delete'),
  table_name VARCHAR(50),
  record_id UUID,
  data JSONB,
  synced_at TIMESTAMP DEFAULT NOW()
)
```

---

## API Endpoints

### Auth
```
POST /auth/request-otp     { phone } → skickar WhatsApp OTP
POST /auth/verify-otp      { phone, code } → { token, user }
POST /auth/setup-totp      { } → { secret, qr_code }
POST /auth/verify-totp     { code } → { success }
```

### Customers
```
GET    /customers          → lista kunder
POST   /customers          { name, phone? } → ny kund
GET    /customers/:id      → kund med skulder
PUT    /customers/:id      { name, phone } → uppdatera
DELETE /customers/:id      → soft delete
```

### Debts
```
GET    /debts              → alla skulder
POST   /debts              { customer_id, amount, note? } → ny skuld
PUT    /debts/:id          { amount?, note?, is_paid? }
DELETE /debts/:id          → ta bort
POST   /debts/:id/pay      { amount } → delbetalning
```

### Sadaqa
```
GET    /sadaqa/queue       → antal som behöver hjälp (anonymt)
POST   /sadaqa/donate      { amount, anonymous? } → ge sadaqa
GET    /sadaqa/history     → dina sadaqa-gåvor
```

### Chat (AI)
```
POST   /chat               { message } → { response }
GET    /chat/history       → konversationshistorik
```

### Sync
```
POST   /sync/push          { changes[] } → synka lokala ändringar
GET    /sync/pull          { since } → hämta nya ändringar
```

---

## Offline-First Sync Strategi

```javascript
// 1. Alla ändringar sparas lokalt först
await localDB.debts.add({ id: uuid(), amount: 100, ... });

// 2. Lägg till i sync-kö
await localDB.syncQueue.add({
  action: 'create',
  table: 'debts',
  data: {...}
});

// 3. När online, synka
if (navigator.onLine) {
  const pending = await localDB.syncQueue.toArray();
  await api.post('/sync/push', { changes: pending });
  await localDB.syncQueue.clear();
}

// 4. Konflikthantering: Last-Write-Wins med timestamp
// Server jämför updated_at, senaste vinner
```

---

## DeepSeek Integration

### System Prompt
```
أنت مساعد رصيدي، التطبيق المغربي لتسجيل الديون.
Tu es l'assistant Rassidi, l'app marocaine de suivi des dettes.

REGLER:
- Svara på SAMMA språk som användaren (darija eller franska)
- Var vänlig, tålmodig, använd enkla ord
- Hjälp med: lägga till kunder, registrera skulder, sadaqa, sync
- Vid tekniska problem: "Je vais transférer au support / غادي نوصل السؤال للفريق"
- ALDRIG ge finansiell rådgivning

ANVÄNDARKONTEXT:
- Namn: {user.name}
- Antal kunder: {customers.count}
- Total skuld: {debts.total} MAD
- Premium: {user.is_premium}
```

### API Call
```javascript
const response = await fetch('https://api.deepseek.com/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'deepseek-chat',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ],
    max_tokens: 500,
    temperature: 0.7
  })
});
```

---

## WhatsApp OTP Flow

```
1. Användare anger telefonnummer
2. Backend genererar 6-siffrig kod, sparar i Redis (5 min TTL)
3. Skickar via WhatsApp Business API (eller Twilio)
4. Användare anger kod
5. Backend verifierar, returnerar JWT token
```

---

## Milestones

### Fas 1: Foundation (v0.1) ✅ KLAR
- [x] Backend setup (Hono + PostgreSQL) - schema + routes klara
- [x] Auth (WhatsApp OTP) - UI klar, behöver Twilio
- [x] CRUD: customers, debts - frontend klar
- [x] Basic frontend med offline-stöd - PWA med Dexie

### Fas 2: Core (v0.2) 🚧 PÅGÅR
- [x] Sync-system (offline-first) - implementerat
- [ ] Biometriskt lås
- [x] Förbättrad UI/UX - app layout klar

### Fas 3: Differentiering (v0.3)
- [x] Sadaqa-funktion - UI klar
- [x] DeepSeek AI-chatbot - UI + backend service klar
- [ ] WhatsApp-påminnelser (premium)

### Fas 4: Launch (v1.0)
- [ ] CNDP-registrering (juridiskt)
- [ ] Beta med 10-20 hanouts
- [ ] Iterate baserat på feedback
- [ ] Public launch

---

## Implementation Status (2025-01-22)

### Frontend (PWA)
| Komponent | Status |
|-----------|--------|
| Landing page | ✅ Klar |
| Login/OTP | ✅ Klar |
| Dashboard | ✅ Klar |
| Kundlista | ✅ Klar |
| Kunddetalj + skulder | ✅ Klar |
| Sadaqa-sida | ✅ Klar |
| AI Chat | ✅ Klar |
| Inställningar | ✅ Klar |
| PWA/Service Worker | ✅ Klar |
| Offline-first (Dexie) | ✅ Klar |

### Backend
| Komponent | Status |
|-----------|--------|
| Hono server | ✅ Klar |
| Auth routes | ✅ Klar |
| Customer routes | ✅ Klar |
| Debt routes | ✅ Klar |
| Sync routes | ✅ Klar |
| Sadaqa routes | ✅ Klar |
| Chat routes | ✅ Klar |
| DeepSeek service | ✅ Klar |
| WhatsApp service | ✅ Klar |
| PostgreSQL schema | ✅ Klar |

### Infrastruktur
| Komponent | Status |
|-----------|--------|
| Nginx config | ✅ Klar |
| SSL (Let's Encrypt) | ✅ Klar |
| API proxy (/api) | ✅ Klar |
| PostgreSQL | ⏳ Behöver setup |
| Redis | ⏳ Behöver setup |
| Twilio/WhatsApp | ⏳ Behöver API-nycklar |
| DeepSeek | ⏳ Behöver API-nyckel |

---

## Success Metrics

| Metrik | Mål (6 mån) |
|--------|-------------|
| Registrerade användare | 500 |
| Aktiva användare (MAU) | 200 |
| Premium-konvertering | 3-5% |
| Sadaqa-transaktioner | 50/mån |
| AI-chatbot nöjdhet | >80% lösta ärenden |
| Data-förlust incidenter | **0** |

---

## Stop-Kriterier

**Fortsätt om:**
- Användare ringer arga när appen är nere (= de bryr sig)
- Word-of-mouth utan marknadsföring
- >3% premium-konvertering

**Pausa/pivotera om:**
- <100 användare efter 3 månader trots marknadsföring
- Ingen betalningsvilja alls
- Tekniska problem som inte kan lösas

---

## Budget (Bootstrapped)

| Post | Kostnad/mån |
|------|-------------|
| Hosting (Railway/Render) | ~$10 |
| PostgreSQL (managed) | ~$15 |
| DeepSeek API | ~$5 |
| WhatsApp Business API | ~$10 |
| Domän (rassidi.ma) | ~$20/år |
| **Total** | **~$40/mån** |

---

*Rassidi: رصيدك ما يضيعش*
