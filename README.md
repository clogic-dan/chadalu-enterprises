# CHADALU Enterprises — Building Equipment Hire Platform

🏗️ **A modern, premium building equipment hire web platform serving Kenya**

## 📋 Overview

CHADALU is a comprehensive equipment hire management system designed specifically for Kenya's construction industry. Clients can browse, book, and hire equipment 24/7, while admins get full control over operations, analytics, and payments.

**Status:** 🟢 Phase 1 Frontend — 100% Complete | 🟡 Phase 2 Backend — Ready to Start

---

## ✨ Key Features

### Client Features
- **24/7 Equipment Booking** — Any time, any duration (even 10 minutes)
- **Dynamic Pricing** — Daily, weekly, monthly rates with auto-calculated discounts
- **Rank System** — 6-tier progression with badges and unlock rewards
- **Live Booking Tracking** — Real-time countdown, status updates
- **Secure Payments** — M-Pesa STK push, no upfront fees
- **Reviews & Ratings** — Community feedback system with moderation
- **Personal Dashboard** — Profile, booking history, payments, rank progression

### Admin Features
- **Live Overview** — Real-time machine status, revenue, active sessions
- **Advanced Analytics** — Revenue trends, busiest hours, top clients, machine utilization
- **Booking Manager** — Create, confirm, start, complete, cancel bookings
- **Machine Manager** — Control online/offline status, set maintenance times
- **Availability Blocker** — Calendar-based time slot blocking
- **Payment Manager** — Trigger M-Pesa requests, view receipts, revenue tracking
- **User Management** — Client list with ranks, spending, booking history
- **Review Moderation** — Flag or hide inappropriate reviews

### Equipment Fleet
| Machine | Units | Rate | Category |
|---------|-------|------|----------|
| Road Roller | 1 | KES 8,500/day | Compaction |
| Concrete Vibrator | 1 | KES 1,800/day | Concrete |
| Concrete Mixer | 2 | KES 4,500/day | Concrete |
| Skip Hoist | 1 | KES 6,000/day | Lifting |
| Water Pump | 1 | KES 2,200/day | Pumping |
| Shovels | 10 | KES 200/item/day | Tools |
| Buckets | 10 | KES 100/item/day | Tools |

---

## 🚀 Quick Start

### For End Users
1. Visit **`index.html`** in your browser
2. Click **"Book Now"** or browse equipment in the fleet
3. Create an account (phone + M-Pesa number required)
4. Select equipment, pick dates/times, drop a pin on the map
5. Confirm booking — no payment needed yet!
6. After job completion, admin sends M-Pesa request

### For Admins
1. Visit **`index.html`**
2. Click **"Log In"** → Choose **"Admin Portal"**
3. Demo credentials: `username: admin` | `password: admin123`
4. Access full dashboard at **`dashboard-admin.html`**

### For Clients (After Login)
- Access personal dashboard at **`dashboard-client.html`**
- View active bookings, payment history, rank progression
- Edit profile, write reviews

---

## 📁 Project Structure

```
CHADALU/
├── README.md                    # This file
├── ROADMAP.md                   # Full project timeline & phases
├── ARCHITECTURE.md              # Technical architecture & decisions
├── CONTRIBUTING.md              # Development guidelines
├── LICENSE                      # MIT License
├── .gitignore                   # Git exclusions
│
├── docs/                        # Detailed documentation
│   ├── SETUP.md                 # Local development setup
│   ├── DATABASE.md              # Supabase schema (Phase 2)
│   ├── AUTH.md                  # Authentication system (Phase 2)
│   ├── PAYMENTS.md              # M-Pesa integration (Phase 3)
│   ├── FRONTEND.md              # Frontend architecture
│   ├── ADMIN_GUIDE.md           # How to use admin dashboard
│   └── API.md                   # REST API endpoints (Phase 2)
│
├── assets/                      # Branding & media
│   ├── chadalu-logo.svg         # Full horizontal logo
│   ├── chadalu-icon.svg         # Hex badge icon
│   ├── brand-guidelines.md      # Brand standards
│   └── screenshots/             # (Phase 2) UI screenshots
│
├── index.html                   # Main website / booking platform
├── dashboard-admin.html         # Admin control centre
├── dashboard-client.html        # User personal dashboard
│
├── CHADALU_OUTLINE.md           # Original project outline (v1.0)
├── chadalu-logo-preview.html    # Logo reference guide
│
└── src/                         # (Phase 2+) Backend source code
    ├── backend/                 # Supabase functions, migrations
    ├── frontend/                # React/Vue components (optional)
    └── mobile/                  # React Native app (Phase 4)
```

---

## 🔄 Development Phases

### ✅ Phase 1: Frontend (COMPLETE)
- Landing page with hero, equipment grid, booking form
- Client dashboard with profile, ranks, booking history
- Admin dashboard with analytics and full control
- Authentication UI (User vs Admin login split)
- Mock data throughout

**Files:** `index.html`, `dashboard-client.html`, `dashboard-admin.html`

### 🟡 Phase 2: Backend & Authentication (NEXT)
- Supabase database setup
- User authentication (phone + M-Pesa number)
- Real booking system with availability checking
- Payment status tracking
- Email notifications

### 🟡 Phase 3: M-Pesa Integration
- Safaricom Daraja API setup
- STK push for payments
- Receipt verification
- Webhook handling

### 🟡 Phase 4: Polish & Deployment
- Performance optimization
- Mobile responsive fixes
- Error handling & logging
- Cloud hosting setup (Vercel/Netlify)
- Domain registration

### 🟡 Phase 5: Advanced Features
- SMS notifications
- WhatsApp integration
- Operator management
- Analytics reports export
- React Native mobile app

---

## 🛠️ Technology Stack

### Frontend (Phase 1)
- **HTML5** — Semantic structure
- **CSS3** — Custom design system (no framework)
- **Vanilla JavaScript** — No jQuery/frameworks
- **Leaflet.js** — Interactive maps (ready for Phase 2)
- **Chart.js** — Analytics dashboards

### Backend (Phase 2)
- **Supabase** — PostgreSQL database + Auth
- **Node.js/Express** — REST API (optional)
- **Daraja API** — M-Pesa payments

### Hosting (Phase 4)
- **Vercel/Netlify** — Frontend deployment
- **Supabase Cloud** — Backend hosting
- **Custom domain** — chadalu.co.ke (planned)

---

## 🎨 Design System

### Design Approach
[New responsive design to be developed - optimized for all devices]
- Fully responsive layout
- Mobile-first approach
- Clean, professional appearance
- Accessible for all users

---

## 📞 Contact & Support

**Company:** CHADALU Enterprises  
**Location:** Kimbo Shopping Centre, Ruiru, Kiambu County, Kenya  
**Phone:** +254 722 995 675  
**WhatsApp:** +254 722 995 675  
**Email:** info@chadaluenterprises.co.ke (placeholder)  
**Hours:** 24/7 — We never close

---

## 📜 License

MIT License — See `LICENSE` file for details

---

## 🚦 Next Steps

1. **Phase 2 Preparation**
   - Review `docs/SETUP.md` for development environment
   - Set up Supabase project
   - Review `docs/DATABASE.md` for schema design

2. **Contributing**
   - Read `CONTRIBUTING.md` for dev guidelines
   - Follow commit message conventions
   - Test locally before pushing

3. **Deployment**
   - See `docs/SETUP.md` for local testing
   - See `ARCHITECTURE.md` for deployment strategy

---

**Version:** 1.0.0 (Phase 1 Complete)  
**Last Updated:** May 2026  
**Maintained By:** CHADALU Development Team
