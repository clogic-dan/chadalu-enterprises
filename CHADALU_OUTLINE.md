# CHADALU ENTERPRISES — Master Project Outline
> Building Equipment Hire Platform · Ruiru, Kiambu County, Kenya
> Last updated: May 2026
> Status: ✅ OUTLINE COMPLETE — READY TO BUILD

---

## 🏗️ PROJECT OVERVIEW

A full-featured web application for CHADALU Enterprises — a Nairobi-based building equipment hire business. Customers browse equipment, pick hire dates/times (24/7), select their delivery location on an interactive map, sign up/log in, and pay via M-Pesa STK push after job completion. The platform handles real-time availability, prevents double bookings automatically, and features rich dashboards for both clients and admin.

---

## 🎨 DESIGN & BRANDING

- **Company Name:** CHADALU Enterprises
- **Base:** Kimbo Shopping Centre, Ruiru, Kiambu County, Kenya
- **Design Approach:** [NEW DESIGN - Responsive, accessible, optimized for all devices]
- **Language:** English only
- **Logo:** To be designed - SVG + PNG formats
- **Phone / WhatsApp:** +254 722 995 675
- **Social:** TikTok, Instagram, Gmail — placeholders

### Design Requirements
- Fully responsive: Mobile, Tablet, Laptop, Desktop
- Accessible: WCAG compliant
- Fast loading: Optimized for Kenya's internet speeds
- Professional, trustworthy appearance
- User-friendly navigation and booking flow

---

## 🚜 EQUIPMENT FLEET

| # | Machine | Units | Simultaneous Bookings |
|---|---|---|---|
| 1 | Road Roller (2-Ton Double Drum) | 1 | Max 1 |
| 2 | Concrete Vibrator / Poker | 1 | Max 1 |
| 3 | Concrete Mixer (350L) | 2 | Max 2 |
| 4 | Skip Hoist (Builder's Hoist / Material Elevator) | 1 | Max 1 |
| 5 | Water Pump (3", Petrol) | 1 | Max 1 |
| 6 | Shovel | 10 | Max 10 (per item) |
| 7 | Bucket | 10 | Max 10 (per item) |

### Machine Status System
| Status | Meaning |
|---|---|
| 🟢 Available | No active/upcoming bookings — bookable |
| 🟡 In Use | Currently within an active session |
| 🔴 Booked | Future booking exists that overlaps requested time |
| ⚫ Down for Maintenance | Admin has taken machine offline |

### Machine Failure / Maintenance Flow
1. Machine fails during a session → client triggers "Report Issue" (only on active bookings)
2. System auto-sets machine status to **Down for Maintenance**
3. Machine disappears from bookable listings automatically
4. Admin receives instant alert
5. Admin sets an estimated "ready by" time (visible to users browsing)
6. **Only admin** can bring the machine back online
7. Once admin marks as restored → machine reappears in listings and becomes bookable again

---

## ⏰ BOOKING SYSTEM

### Hours & Duration
- **24/7** — any time including nights and overnight sessions
- **No minimum duration** — 10 or 30 minutes is valid (e.g. quick pump job)
- Client enters: start datetime + expected duration (hours & minutes)
- System auto-calculates: end time + **1-hour buffer** (overlap/overrun protection)
- Buffer displayed clearly before client confirms

### Multi-Machine Booking
- Client can add **multiple machines in a single order**
- Each machine checked for availability independently
- If any machine in the order is unavailable, system highlights which one and why
- Client can remove conflicting items or pick different times and still complete the order

### Availability & Double Booking Prevention
- Database-level constraint: no two bookings can overlap for the same machine (accounting for buffer)
- Application-level check before any booking is written
- If machine just became unavailable (race condition): second user sees:
  > **"This machine is currently unavailable."**
  > **"Next available from: [date & time]"**
- Real-time updates — availability refreshes without page reload

### Booking Flow (Step by Step)
1. Browse equipment — **no login needed**
2. Click "Hire Now" → **Login / Sign Up prompt** if not authenticated
3. Select machine(s) and quantities
4. Pick **start date + time** (full datetime picker, 24/7)
5. Enter **expected duration**
6. System shows: calculated end time + 1hr buffer + confirms availability
7. **Map location picker** — type address (autocomplete) or drop a pin
8. Distance from Ruiru base displayed; Kenya only; no hard cap
9. Review full order summary
10. Confirm → booking created, admin notified, confirmation shown to client

### Cancellation Policy
- Client can cancel **any time before work begins** (status: pending or confirmed)
- Cannot cancel once status = **Active** (work started)
- Exception: machine failure during session → client can trigger Report Issue → enables interruption/cancellation
- Admin can cancel any booking at any time with a reason

---

## 🗺️ LOCATION PICKER

- **Leaflet.js** with OpenStreetMap tiles (free, no API key required)
- Upgrade path to Google Maps API if needed later
- Client can:
  - Type an address → autocomplete suggestions (Nominatim geocoding)
  - Drop a pin anywhere on the map — address auto-fills
- Captures: lat/lng + human-readable address
- **Map default centre:** Kimbo Shopping Centre, Ruiru (-1.1432, 37.0089)
- Distance from base calculated and shown to client
- Service area: Kenya only; no cap; admin contacts client if distance is an issue
- No delivery fee currently

---

## 👤 AUTH SYSTEM

### Sign Up
- Full name
- Kenyan phone number (validates format, used for M-Pesa)
- Email address
- Password + confirm password
- (Future: SMS OTP verification)

### Log In
- Phone number OR email + password
- "Remember me"
- Forgot password via email reset (Phase 2)

### Roles
| Role | What They Can Do |
|---|---|
| Guest | Browse, view gallery, read reviews |
| Client | Book, cancel, pay, review, report issues, view own dashboard |
| Admin | Everything + manage all bookings, machines, payments, users, reviews, block dates, control all machine statuses |

---

## 👤 CLIENT DASHBOARD

A rich personal space — not a boring list of bookings.

### Sections
- **Profile card** — avatar (uploadable photo), name, rank badge, member since
- **Edit profile** — update photo, name, email, phone, password
- **My Rank** — current tier, progress to next tier, perks
- **Stats overview:**
  - Total bookings made
  - Total hours of equipment hired
  - Total money spent (KES)
  - Favourite machine (most booked)
  - Bookings this month vs last month
- **Active bookings** — with live countdown to session start/end, cancel button
- **Booking history** — full list, filter by status
- **Payments** — outstanding + paid, M-Pesa receipt codes
- **My Reviews** — reviews left, option to edit before admin approves
- **Notifications** — booking confirmations, payment reminders, rank-ups

### 🏅 Client Rank System (6 Tiers)
Based on total completed bookings and/or total KES spent.

| Rank | Name | Badge Colour | Threshold (approx) |
|---|---|---|---|
| 1 | Rookie | ⚪ Grey | 0–1 bookings |
| 2 | Labourer | 🟤 Bronze | 2–5 bookings |
| 3 | Builder | 🥈 Silver | 6–14 bookings |
| 4 | Foreman | 🥇 Gold | 15–29 bookings |
| 5 | Contractor | 💎 Platinum | 30–59 bookings |
| 6 | Site Boss | 🔴 Diamond Red | 60+ bookings |

- Rank badge shown on profile, on reviews, and in admin user list
- Rank-up triggers a congratulations animation/notification
- Future: rank-based discounts or perks

---

## 🛠️ ADMIN DASHBOARD

Full control centre. Rich, data-driven, well-designed.

### Sections

#### 📊 Overview (Home)
- Total bookings today / this week / this month
- Revenue today / this week / this month / all time (KES)
- Active sessions right now (live)
- Machines currently in use vs available vs down
- Recent booking feed (live)
- Quick action buttons: Block a date, Mark session started, Trigger payment

#### 📈 Analytics & Charts
- Daily revenue bar chart (last 30 days)
- Monthly revenue line chart (last 12 months)
- Bookings per machine (pie/donut chart)
- Busiest hours of day heatmap
- Top clients by spend and by bookings
- Cancellation rate
- Payment completion rate

#### 📅 Booking Manager
- All bookings: filter by status, date, machine, client
- Mark as: Confirmed → Started → Completed → Interrupted → Cancelled
- View full booking details: client, machine, time, location, notes
- Admin cancel with reason

#### 🚜 Machine Manager
- List all machines with current status
- Take a machine **offline** (maintenance mode) with estimated return date
- Bring machine back **online** (admin only)
- Edit machine details: name, description, specs, photos, price, category
- View booking history per machine

#### 📆 Availability Manager
- Block any machine on any date/time range
- Admin-set blocks show as unavailable to clients
- View full calendar per machine

#### 💳 Payment Manager
- All payments: pending, paid, failed
- Trigger M-Pesa STK Push for completed bookings
- View M-Pesa receipt codes
- Total revenue summary
- Export payments list (CSV — future)

#### ⭐ Review Manager
- All reviews with star ratings and comments
- Flag or hide inappropriate reviews
- View reviews per machine or per client

#### 👥 User Manager
- All registered clients
- View profile, rank, booking history, spend total
- Suspend/unsuspend accounts (future)

---

## 💳 PAYMENT — M-PESA STK PUSH

### Current Setup
- Payments to: **+254 722 995 675** (temporary until Paybill/Till registered)
- API: **Safaricom Daraja** (Lipa Na M-Pesa Online / STK Push)

### Flow
1. Admin marks booking as **Completed**
2. Client notified: "Your hire is done — tap to pay"
3. Client visits payment page (amount pre-filled, M-Pesa number pre-filled from profile)
4. Client taps **"Pay via M-Pesa"**
5. Daraja STK Push sent to client's phone
6. Client enters PIN → payment confirmed
7. Booking marked **PAID**, receipt shown
8. Admin sees payment in Payment Manager

### Payment Rules
- No upfront payment — only post-completion
- Admin triggers payment prompt, client completes it
- Pricing TBD before deployment (time + machine-based)

---

## ⭐ REVIEW SYSTEM

- 0–5 stars (whole stars; half-star option if desired)
- Written comment (optional)
- Only clients with a **Completed** booking can leave a review for that booking
- One review per completed booking
- Reviews shown on homepage + equipment detail pages
- Admin can flag/hide reviews
- Client rank badge shown next to review name
- Stars animate in (fill one by one) on scroll

---

## 📧 NOTIFICATIONS

| Event | Client | Admin |
|---|---|---|
| Booking confirmed | ✅ Email | ✅ WhatsApp/Email |
| Booking cancelled | ✅ Email | ✅ Email |
| Session started | ✅ Email | — |
| Session completed + payment due | ✅ Email | — |
| Payment received | ✅ Email | ✅ Email |
| Machine issue reported | — | ✅ Instant alert |
| Rank upgrade | ✅ Email + on-site animation | — |
| Machine back online | ✅ Email (if they had a cancelled booking for that machine) | — |

**SMS:** Use only if free/cheap (Africa's Talking). Otherwise email for all.
**Admin alerts:** WhatsApp link (wa.me) fallback if full WhatsApp Business API not set up.

---

## 🖥️ ALL PAGES

| Page | Access |
|---|---|
| Home (Hero + Equipment + Gallery + Reviews + Pricing + Contact) | Public |
| Equipment Detail / Modal | Public |
| Login | Public |
| Sign Up | Public |
| Booking Flow (multi-step) | Clients only |
| Client Dashboard | Clients only |
| Payment Page | Clients only |
| Admin Dashboard | Admin only |
| Admin: Bookings | Admin only |
| Admin: Machines | Admin only |
| Admin: Availability | Admin only |
| Admin: Payments | Admin only |
| Admin: Reviews | Admin only |
| Admin: Users | Admin only |
| Admin: Analytics | Admin only |
| 404 / Error pages | Public |

---

## 🗄️ DATABASE SCHEMA (Phase 2)

```sql
users
  id, name, phone, email, password_hash, role (client|admin),
  avatar_url, rank, total_bookings, total_spent_kes, created_at

equipment
  id, name, slug, category, description, specs_json,
  units_total, price_config_json, image_urls_json,
  status (active|maintenance), maintenance_note,
  estimated_ready_at, created_at

bookings
  id, user_id, items_json (array of {equipment_id, units}),
  start_at, expected_duration_mins, expected_end_at, buffered_end_at,
  location_address, lat, lng, notes,
  status (pending|confirmed|active|completed|cancelled|interrupted),
  cancel_reason, created_at, updated_at

sessions
  id, booking_id, actual_start, actual_end, marked_by_admin_id

payments
  id, booking_id, amount_kes, mpesa_phone,
  mpesa_receipt_code, status (pending|paid|failed),
  triggered_at, paid_at

reviews
  id, booking_id, user_id, equipment_id,
  stars, comment, flagged, created_at

blocked_times
  id, equipment_id, start_at, end_at, reason, created_by_admin_id

notifications
  id, user_id, type, message, read, created_at
```

---

## 🚦 BUILD PHASES

### ✅ Phase 0 — Done
- [x] Prototype (BuildRent Pro)
- [x] Rebrand to CHADALU Enterprises
- [x] Core layout, ticker, equipment grid, booking form, calendar

### 🔨 Phase 1 — Full Frontend (Starting Now)
- [ ] Logo design — SVG + PNG saved separately
- [ ] Real equipment images for all 7 machines
- [ ] Themed animated buttons (roller crushes rocks, vibrator shakes, etc.)
- [ ] 24/7 datetime picker + duration input
- [ ] 1-hour buffer UI display
- [ ] Multi-machine cart/order system
- [ ] Leaflet.js map — pin drop + address autocomplete
- [ ] Machine maintenance state UI (grey out, show estimated return)
- [ ] Login / Signup pages (UI only)
- [ ] Client Dashboard UI (stats, rank, profile edit, booking history)
- [ ] Admin Dashboard UI (overview, analytics charts, managers)
- [ ] Review section with animated stars + rank badges
- [ ] Social icons (TikTok, IG, Gmail — placeholders)
- [ ] Full mobile responsiveness
- [ ] 404 page

### 🔌 Phase 2 — Backend + Auth
- [ ] Supabase setup (recommended)
- [ ] Auth: sign up, log in, roles
- [ ] Real-time availability with buffer logic
- [ ] Multi-machine order processing
- [ ] Admin: block dates, manage machines, start/complete sessions
- [ ] Machine failure → auto-offline flow
- [ ] Notification emails

### 💸 Phase 3 — Payments
- [ ] Daraja API sandbox
- [ ] STK Push from site
- [ ] Payment tracking + receipts
- [ ] Migrate to Till/Paybill when ready

### 🏆 Phase 4 — Polish & Launch
- [ ] Full analytics (charts, heatmaps, export)
- [ ] Rank system logic + rank-up animations
- [ ] WhatsApp/SMS notifications
- [ ] SEO, performance, security
- [ ] Go live 🚀

---

## 📋 QUICK REFERENCE

| Item | Detail |
|---|---|
| Phone / WhatsApp | +254 722 995 675 |
| Base Location | Kimbo Shopping Centre, Ruiru, Kiambu |
| Map Coords | -1.1432, 37.0089 |
| Booking Hours | 24/7 — no restrictions |
| Min. Booking | No minimum (even 10 mins) |
| Buffer After Booking | 1 hour |
| Delivery Fee | None (for now) |
| Payment Method | M-Pesa STK Push (post-completion) |
| Payment Timing | After job completed, admin triggers |
| Languages | English only |
| Ranks | Rookie → Labourer → Builder → Foreman → Contractor → Site Boss |
| Prices | TBD before deployment |
| Database | Supabase (recommended) |
| Maps | Leaflet.js + OpenStreetMap |
