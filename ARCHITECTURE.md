# CHADALU Technical Architecture

## System Design Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT BROWSER                        │
│  ┌──────────────┬──────────────┬──────────────┐              │
│  │   index.     │   dashboard- │  dashboard-  │              │
│  │   html       │   client.    │  admin.      │              │
│  │              │   html       │  html        │              │
│  └──────────────┴──────────────┴──────────────┘              │
│         ↓              ↓              ↓                       │
│  ┌────────────────────────────────────────────┐              │
│  │    JavaScript (Vanilla - No Frameworks)    │              │
│  │  ┌──────────────────────────────────────┐  │              │
│  │  │  Auth Manager  │  Booking Manager   │  │              │
│  │  │  Payment UI    │  Review Handler    │  │              │
│  │  │  Rank System   │  Notification      │  │              │
│  │  └──────────────────────────────────────┘  │              │
│  └────────────────────────────────────────────┘              │
│         ↓                                                     │
└─────────────────────────────────────────────────────────────┘
         │ HTTPS / REST API
         ↓
┌─────────────────────────────────────────────────────────────┐
│                      BACKEND LAYER                           │
│  ┌──────────────────────────────────────────┐               │
│  │        SUPABASE (Cloud Backend)          │               │
│  │  ┌──────────────────────────────────────┐│               │
│  │  │  PostgreSQL Database                 ││               │
│  │  │  • users, equipment, bookings        ││               │
│  │  │  • payments, reviews, sessions       ││               │
│  │  │  • blocked_times, notifications      ││               │
│  │  └──────────────────────────────────────┘│               │
│  │  ┌──────────────────────────────────────┐│               │
│  │  │  Supabase Auth                       ││               │
│  │  │  (Phone + Email authentication)      ││               │
│  │  └──────────────────────────────────────┘│               │
│  │  ┌──────────────────────────────────────┐│               │
│  │  │  REST API (Auto-generated)           ││               │
│  │  │  • GET/POST/PATCH endpoints          ││               │
│  │  │  • Row-Level Security (RLS)          ││               │
│  │  └──────────────────────────────────────┘│               │
│  │  ┌──────────────────────────────────────┐│               │
│  │  │  Functions (Edge Functions - Optional)││               │
│  │  │  • Payment webhook handlers          ││               │
│  │  │  • Email notifications               ││               │
│  │  │  • Business logic                    ││               │
│  │  └──────────────────────────────────────┘│               │
│  └──────────────────────────────────────────┘               │
│         ↓                    ↓                               │
│  ┌──────────────┐    ┌──────────────┐                       │
│  │ Daraja API   │    │ SendGrid     │                       │
│  │ (M-Pesa STK) │    │ (Email)      │                       │
│  └──────────────┘    └──────────────┘                       │
└─────────────────────────────────────────────────────────────┘
         ↓                    ↓
   ┌─────────────┐    ┌─────────────┐
   │ M-Pesa      │    │ User Email  │
   │ Payment     │    │ Inbox       │
   │ Network     │    └─────────────┘
   └─────────────┘
```

---

## Frontend Architecture (Phase 1 Complete)

### Files
- **`index.html`** (96 KB)
  - Landing page / main booking interface
  - Equipment catalog
  - Booking form
  - Reviews section
  - Login modal (splits into User/Admin)

- **`dashboard-admin.html`** (64 KB)
  - Sidebar navigation
  - 8 main sections (Overview, Analytics, Bookings, Machines, Availability, Payments, Reviews, Users)
  - Real-time charts (Chart.js)
  - Admin control panel

- **`dashboard-client.html`** (31 KB)
  - Profile card with avatar
  - Rank progression visualizer
  - Active bookings with countdown
  - Booking history
  - Payment history
  - Reviews section

### Technology Stack
```
HTML5 + CSS3 + Vanilla JavaScript
├── No frameworks (Vue, React, Angular)
├── No jQuery
├── No build tools (direct browser loading)
├── Chart.js for analytics
├── Leaflet.js for maps (ready for Phase 2)
└── Google Fonts (Playfair Display, Barlow, Barlow Condensed)
```

### Key Design Patterns

**1. Observer Pattern (Page Navigation)**
```javascript
showPage(id) {
  // Hide all pages, show selected
  // Used in admin dashboard for section switching
}
```

**2. Data-Driven Rendering**
```javascript
BOOKINGS = [...] // Mock data
renderBookings() {
  // Loop through data, generate HTML
  // Each render reads from single source of truth
}
```

**3. Event Delegation**
```javascript
// Click handler on parent, checks event.target
// Used for table rows, card actions
document.addEventListener('click', (e) => {
  if (e.target.matches('.btn-action')) { ... }
})
```

**4. Modal Pattern**
```javascript
openModal(id) {
  document.getElementById(id).classList.add('open');
}
// Simple CSS toggle: .modal.open { opacity: 1; }
```

### CSS Architecture
```css
:root {
  --g1: #F5CC7A;        /* Gold light */
  --g2: #C8922A;        /* Gold primary */
  --g3: #8B6510;        /* Gold dark */
  --dark: #080808;      /* Black */
  --cream: #F2EBD9;     /* Text */
  /* ... more colors */
}

/* No utility classes, semantic class names */
.booking-card { ... }
.stat-card { ... }
.btn-primary { ... }
/* Each class is specific and descriptive */
```

### Performance Optimizations
- Minimal CSS/JS (no framework overhead)
- Images lazy-loaded (`loading="lazy"`)
- Smooth animations (transform + opacity only, GPU accelerated)
- No external dependencies (except Chart.js + Leaflet)
- Direct DOM manipulation (no virtual DOM)

---

## Backend Architecture (Phase 2 Design)

### Technology Choice: Supabase

**Why Supabase?**
- ✅ Real-time database (PostgreSQL)
- ✅ Built-in authentication
- ✅ Auto-generated REST API
- ✅ Row-Level Security (RLS) for data privacy
- ✅ Free tier covers MVP phase
- ✅ Scales to millions of users
- ✅ No vendor lock-in (open source)

### Database Schema

```sql
-- Core Tables
table users {
  id: UUID (PRIMARY KEY)
  phone: VARCHAR (UNIQUE, indexed)
  email: VARCHAR (UNIQUE)
  password_hash: VARCHAR
  name: VARCHAR
  avatar_url: VARCHAR
  rank: INTEGER (1-6)
  total_bookings: INTEGER
  total_spent_kes: DECIMAL
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}

table equipment {
  id: UUID (PRIMARY KEY)
  name: VARCHAR (Road Roller, etc.)
  slug: VARCHAR (unique-id)
  category: VARCHAR (compaction, concrete, etc.)
  description: TEXT
  specs: JSONB (power, weight, dimensions)
  units_total: INTEGER
  units_available: INTEGER
  price_config: JSONB (daily, weekly, monthly rates)
  image_urls: JSONB (array of image URLs)
  status: ENUM (available, maintenance, inactive)
  maintenance_note: TEXT
  estimated_ready_at: TIMESTAMP
  created_at: TIMESTAMP
}

table bookings {
  id: UUID (PRIMARY KEY)
  user_id: UUID (FOREIGN KEY → users)
  equipment_id: UUID (FOREIGN KEY → equipment)
  start_at: TIMESTAMP
  expected_duration_mins: INTEGER
  expected_end_at: TIMESTAMP
  buffered_end_at: TIMESTAMP (end + 1 hour)
  location_address: VARCHAR
  lat: DECIMAL
  lng: DECIMAL
  notes: TEXT
  status: ENUM (pending, confirmed, active, completed, cancelled, interrupted)
  cancel_reason: TEXT
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}

table sessions {
  id: UUID (PRIMARY KEY)
  booking_id: UUID (FOREIGN KEY → bookings)
  actual_start: TIMESTAMP
  actual_end: TIMESTAMP
  marked_by_admin_id: UUID (FOREIGN KEY → users)
  created_at: TIMESTAMP
}

table payments {
  id: UUID (PRIMARY KEY)
  booking_id: UUID (FOREIGN KEY → bookings, UNIQUE)
  amount_kes: DECIMAL
  mpesa_phone: VARCHAR
  mpesa_receipt_code: VARCHAR
  status: ENUM (pending, initiated, completed, failed)
  triggered_at: TIMESTAMP
  paid_at: TIMESTAMP
  created_at: TIMESTAMP
}

table reviews {
  id: UUID (PRIMARY KEY)
  booking_id: UUID (FOREIGN KEY → bookings)
  user_id: UUID (FOREIGN KEY → users)
  equipment_id: UUID (FOREIGN KEY → equipment)
  stars: INTEGER (1-5)
  comment: TEXT
  flagged: BOOLEAN
  created_at: TIMESTAMP
}

table blocked_times {
  id: UUID (PRIMARY KEY)
  equipment_id: UUID (FOREIGN KEY → equipment)
  start_at: TIMESTAMP
  end_at: TIMESTAMP
  reason: VARCHAR
  created_by_admin_id: UUID (FOREIGN KEY → users)
  created_at: TIMESTAMP
}

table notifications {
  id: UUID (PRIMARY KEY)
  user_id: UUID (FOREIGN KEY → users)
  type: ENUM (booking_confirmed, payment_due, ranking_up, etc.)
  message: TEXT
  read: BOOLEAN
  created_at: TIMESTAMP
}
```

### REST API Endpoints

```
Authentication
GET    /auth/signup                      (Supabase Auth)
GET    /auth/login
POST   /auth/logout

Equipment
GET    /api/equipment                    (List all)
GET    /api/equipment/:id                (Single details)
GET    /api/equipment/:id/availability   (Free slots)

Bookings
GET    /api/bookings                     (User's bookings)
GET    /api/bookings/:id                 (Single booking)
POST   /api/bookings                     (Create new)
PATCH  /api/bookings/:id                 (Update status)
DELETE /api/bookings/:id                 (Cancel)

Payments
GET    /api/payments                     (Payment history)
POST   /api/payments/:booking_id/trigger (Send M-Pesa request)
POST   /api/payments/webhook             (M-Pesa callback)

Reviews
GET    /api/reviews                      (All reviews)
POST   /api/reviews                      (Create review)
PATCH  /api/reviews/:id                  (Update review)
DELETE /api/reviews/:id                  (Delete review)

Users
GET    /api/users/:id                    (Profile)
PATCH  /api/users/:id                    (Update profile)
GET    /api/users/:id/rank               (Rank info)
```

### Security

**Row-Level Security (RLS) Policies**
```sql
-- Users can only see their own data
CREATE POLICY "Users can view own profile"
ON users FOR SELECT
USING (auth.uid() = id);

-- Bookings are private to user
CREATE POLICY "Users can view own bookings"
ON bookings FOR SELECT
USING (user_id = auth.uid() OR (SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- Admins can view everything
CREATE POLICY "Admins can view all data"
ON bookings FOR SELECT
USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');
```

**Authentication Flow**
```
User enters phone → Phone verification (OTP) → Session token → API calls with token
```

---

## Payment Architecture (Phase 3 Design)

### Daraja API Integration

```
User clicks "Pay"
  ↓
Admin triggers STK push
  ↓
Daraja API sends request to M-Pesa
  ↓
Phone receives STK prompt
  ↓
User enters PIN
  ↓
M-Pesa processes payment
  ↓
Daraja webhook callback
  ↓
Update payment status in DB
  ↓
Send receipt to user
```

### Implementation

```javascript
// Backend (Supabase Function)
async function triggerMpesaPayment(bookingId, phone, amount) {
  const auth = getAccessToken(); // Daraja OAuth
  
  const response = await fetch('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${auth}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      BusinessShortCode: process.env.BUSINESS_CODE,
      Password: generatePassword(),
      Timestamp: getTimestamp(),
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: parsePhone(phone),
      PartyB: process.env.BUSINESS_CODE,
      PhoneNumber: parsePhone(phone),
      CallBackURL: `${BASE_URL}/api/payments/webhook`,
      AccountReference: bookingId,
      TransactionDesc: `CHADALU Equipment Hire - ${bookingId}`
    })
  });
  
  return response.json();
}
```

---

## Hosting & Deployment (Phase 4 Design)

```
GitHub Repository
  ↓
  ├→ Vercel/Netlify (Frontend auto-deploy)
  │  └→ HTML/CSS/JS files → CDN → Users
  │
  └→ Supabase (Backend auto-deploy)
     └→ Database + Auth + Functions
```

### Infrastructure Stack
- **Frontend:** Vercel (custom domain)
- **Backend:** Supabase Cloud
- **Database:** PostgreSQL (Supabase managed)
- **Email:** SendGrid
- **Payments:** Safaricom Daraja
- **Monitoring:** Sentry

---

## Scalability

### Current (Phase 1)
- Static files only
- Works for unlimited users (no server load)

### Phase 2-3
- Supabase free tier: ~50,000 API calls/day
- PostgreSQL: Auto-scaling available
- Estimate: **5,000-10,000 concurrent users**

### Phase 4+
- Add caching layer (Redis)
- Database read replicas
- Image CDN (Cloudinary)
- Estimate: **100,000+ concurrent users**

---

## Monitoring & Logging

```
Frontend
  ↓ (Sentry.io)
  ↓
Error Tracking → Slack Alert → Engineer

Backend
  ↓ (Supabase logging)
  ↓
Database Logs → Admin Dashboard
API Logs → CloudWatch (if needed)
```

---

## Data Flow Diagram

```
USER ACTION (Click "Book Now")
  ↓
JavaScript validates input (client-side)
  ↓
POST /api/bookings
  ↓
Supabase checks:
  - User authenticated?
  - Equipment available?
  - No conflicts with blocked times?
  ↓
Booking created in DB
  ↓
Send confirmation email (SendGrid)
  ↓
Update user's booking list (real-time via Supabase subscription)
  ↓
Admin receives notification
  ↓
Admin approves → User receives confirmation SMS
```

---

## Technology Comparison

| Layer | Choice | Why |
|-------|--------|-----|
| Frontend | Vanilla JS | No build complexity, fast load |
| Backend | Supabase | PostgreSQL + Auth + API included |
| Database | PostgreSQL | Powerful, scalable, open-source |
| Auth | Supabase Auth | Phone + Email support, no custom code |
| Payments | Daraja API | Only M-Pesa option in Kenya, official API |
| Email | SendGrid | Reliable, 100 free/month, affordable |
| Hosting | Vercel + Supabase | Both have free tiers, quick deployment |

---

## Future Improvements

### Phase 5+
- Caching layer (Redis)
- Search optimization (Elasticsearch)
- Real-time messaging (WebSocket)
- Mobile app (React Native)
- Microservices (if needed)

---

## Decisions Log

| Decision | Rationale | Alternative |
|----------|-----------|-------------|
| No framework | Fast, simple, MVP-friendly | React/Vue = more complex |
| Supabase | All-in-one backend | Firebase (no phone auth), custom API |
| PostgreSQL | Powerful, ACID compliant | MongoDB (less structured) |
| Daraja API | Only Kenya option | Stripe (doesn't support M-Pesa directly) |
| Vercel | Zero-config deployment | AWS (steep learning curve) |

---

**Version:** 1.0.0  
**Last Updated:** May 2026  
**Next Review:** Phase 2 completion
