# CHADALU — Phase 2 Implementation Todo

## Priority 1: Database Setup

### Step 1: Create Supabase SQL (run in Supabase SQL Editor)
- [ ] Run full schema from DATABASE_SCHEMA.md
- [ ] Verify all 17 tables created
- [ ] Verify indexes created
- [ ] Verify RLS policies applied
- [ ] Verify seed data inserted

---

## Priority 2: Supabase Auth Setup

### Step 2: Auth Configuration
- [ ] Enable Email + Phone auth in Supabase Dashboard
- [ ] Configure SMTP for password reset emails
- [ ] Set up redirect URLs (localhost + production domain)
- [ ] Create auth helper functions in src/lib/auth.ts

---

## Priority 3: API Layer (Next.js API Routes)

### Step 3: Auth API Routes
- [ ] POST /api/auth/signup
- [ ] POST /api/auth/login
- [ ] POST /api/auth/logout
- [ ] POST /api/auth/forgot-password
- [ ] GET /api/auth/me

### Step 4: Equipment API Routes
- [ ] GET /api/equipment (list all)
- [ ] GET /api/equipment/:id (single)
- [ ] GET /api/equipment/:id/availability (check free slots)
- [ ] Admin: POST /api/equipment (create)
- [ ] Admin: PATCH /api/equipment/:id (update)
- [ ] Admin: PATCH /api/equipment/:id/status (maintenance, etc.)

### Step 5: Bookings API Routes
- [ ] GET /api/bookings (user's bookings)
- [ ] GET /api/bookings/all (admin: all bookings)
- [ ] GET /api/bookings/:id (single details)
- [ ] POST /api/bookings (create multi-machine booking)
- [ ] PATCH /api/bookings/:id (update status)
- [ ] PATCH /api/bookings/:id/cancel (cancel with reason)
- [ ] POST /api/bookings/:id/report-issue (client reports machine problem)

### Step 6: Booking Items API
- [ ] GET /api/bookings/:id/items
- [ ] PATCH /api/bookings/:id/items/:itemId/start (admin marks session started)
- [ ] PATCH /api/bookings/:id/items/:itemId/complete (admin marks session ended)

### Step 7: Payments API Routes
- [ ] GET /api/payments (user's payments)
- [ ] GET /api/payments/all (admin: all payments)
- [ ] POST /api/payments/:bookingId/trigger (admin triggers M-Pesa STK push)
- [ ] POST /api/payments/webhook (Daraja callback URL)
- [ ] GET /api/payments/analytics (revenue stats for admin)

### Step 8: Expenses API Routes
- [ ] GET /api/expenses (admin list)
- [ ] POST /api/expenses (admin create)
- [ ] PATCH /api/expenses/:id (admin update)
- [ ] DELETE /api/expenses/:id (admin delete)
- [ ] GET /api/expenses/analytics (profit/loss daily/weekly/monthly)

### Step 9: Discounts API Routes
- [ ] GET /api/discounts (list active)
- [ ] GET /api/discounts/all (admin: all)
- [ ] POST /api/discounts (admin create)
- [ ] PATCH /api/discounts/:id (admin update)
- [ ] DELETE /api/discounts/:id (admin delete)

### Step 10: Users & Permissions API
- [ ] GET /api/users/profile (current user)
- [ ] PATCH /api/users/profile (update own profile)
- [ ] GET /api/users/all (admin: list all users)
- [ ] PATCH /api/users/:id/role (admin update role)
- [ ] GET /api/users/:id/permissions (admin get user permissions)
- [ ] PATCH /api/users/:id/permissions (admin update permissions)

### Step 11: Client Locations API
- [ ] GET /api/locations (user's saved locations)
- [ ] POST /api/locations (save new location)
- [ ] PATCH /api/locations/:id (update location)
- [ ] DELETE /api/locations/:id (delete location)
- [ ] PATCH /api/locations/:id/default (set as default)

### Step 12: Messages API
- [ ] GET /api/messages (conversations)
- [ ] GET /api/messages/:bookingId (booking conversation)
- [ ] POST /api/messages (send message)
- [ ] PATCH /api/messages/:id/read (mark as read)

### Step 13: Notifications API
- [ ] GET /api/notifications (user's notifications)
- [ ] PATCH /api/notifications/:id/read (mark as read)
- [ ] PATCH /api/notifications/read-all (mark all read)

### Step 14: Reviews API
- [ ] GET /api/reviews (public reviews)
- [ ] GET /api/reviews/equipment/:id (reviews for equipment)
- [ ] POST /api/reviews (create review for completed booking)
- [ ] Admin: PATCH /api/reviews/:id/approve
- [ ] Admin: PATCH /api/reviews/:id/flag

### Step 15: Invoices API
- [ ] GET /api/invoices (user's invoices)
- [ ] GET /api/invoices/all (admin: all invoices)
- [ ] POST /api/invoices/:bookingId/generate (admin generates invoice)
- [ ] GET /api/invoices/:id/pdf (download PDF)

### Step 16: Blocked Times API
- [ ] GET /api/blocked-times (public availability)
- [ ] GET /api/blocked-times/equipment/:id (equipment blocks)
- [ ] POST /api/blocked-times (admin create block)
- [ ] DELETE /api/blocked-times/:id (admin delete block)

### Step 17: Reports/Analytics API
- [ ] GET /api/reports/revenue (daily/weekly/monthly)
- [ ] GET /api/reports/bookings (stats by machine, period)
- [ ] GET /api/reports/profit-loss (income - expenses)
- [ ] GET /api/reports/equipment-usage (utilization stats)
- [ ] GET /api/reports/top-clients

---

## Priority 4: Frontend Components

### Step 18: Auth Components
- [ ] Create login form with phone/email
- [ ] Create signup form
- [ ] Create password reset flow
- [ ] Create auth context/provider (React context for auth state)
- [ ] Create protected route wrapper

### Step 19: Booking Flow
- [ ] Create multi-step booking wizard component
- [ ] Create location picker with map (Leaflet)
- [ ] Create saved locations selector
- [ ] Create live location toggle (get current GPS)
- [ ] Create equipment selector (multi-machine cart)
- [ ] Create datetime picker with 24/7 support
- [ ] Create duration input with auto-calculation
- [ ] Create 1-hour buffer display
- [ ] Create booking summary/review step
- [ ] Create booking confirmation page

### Step 20: Client Dashboard
- [ ] Profile card with avatar upload
- [ ] Rank progression visualizer
- [ ] Stats overview (bookings, spend, hours)
- [ ] Active bookings with countdown
- [ ] Booking history with filters
- [ ] Payment history
- [ ] My reviews
- [ ] Saved locations manager
- [ ] Notifications list
- [ ] In-app messaging UI

### Step 21: Admin Dashboard
- [ ] Overview with live stats
- [ ] Analytics charts (revenue, bookings, usage)
- [ ] Booking manager (full CRUD)
- [ ] Equipment manager (status toggle, maintenance mode)
- [ ] Availability manager (calendar + block dates)
- [ ] Payment manager (trigger M-Pesa, view receipts)
- [ ] Expense manager (add/edit daily expenses)
- [ ] Discount manager (create/edit/delete)
- [ ] Review manager (approve/flag)
- [ ] User manager (view, assign role, permissions)
- [ ] Reports page (daily/weekly/monthly P&L)
- [ ] Invoices page (generate, view)
- [ ] Message center (client conversations)

### Step 22: M-Pesa Integration (Phase 3 prep)
- [ ] Create STK push component
- [ ] Create payment status display
- [ ] Create M-Pesa receipt display
- [ ] Create payment success/failure pages

---

## Priority 5: Issue Reporting System

### Step 23: Machine Issue Flow
- [ ] Client "Report Issue" button on active booking
- [ ] Issue report form (description, optional photo)
- [ ] Backend: mark booking as interrupted
- [ ] Backend: mark equipment as maintenance
- [ ] Backend: create instant notification for admin
- [ ] Admin: view issue, set estimated fix time
- [ ] Admin: mark machine back online when fixed
- [ ] Backend: notify client when machine is back

---

## Commit Strategy

| Step | Commit Message |
|------|---------------|
| After SQL setup | db: Create full database schema (17 tables) |
| After auth routes | feat: Implement Supabase authentication |
| After equipment routes | feat: Add equipment API endpoints |
| After booking routes | feat: Add multi-machine booking system |
| After payments routes | feat: Add payments and expense tracking |
| After frontend auth | feat: Connect frontend to real auth |
| After booking flow | feat: Implement multi-step booking wizard |
| After client dashboard | feat: Build client dashboard |
| After admin dashboard | feat: Build admin dashboard |
| After issue reporting | feat: Add machine issue reporting system |
| After analytics | feat: Add reports and analytics |

---

Last Updated: May 2026