# DATABASE SCHEMA — CHADALU Enterprises

> Last Updated: May 2026
> Status: Ready to create in Supabase

---

## Core Tables

### 1. users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  role VARCHAR(20) DEFAULT 'client' CHECK (role IN ('client', 'admin', 'super_admin')),
  avatar_url TEXT,
  rank INTEGER DEFAULT 1 CHECK (rank BETWEEN 1 AND 6),
  total_bookings INTEGER DEFAULT 0,
  total_spent_kes DECIMAL(12,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 2. user_permissions
```sql
CREATE TABLE user_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  permission VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, permission)
);

-- Permissions list:
-- bookings.view, bookings.create, bookings.update, bookings.delete
-- equipment.view, equipment.create, equipment.update, equipment.delete
-- payments.view, payments.create, payments.update, payments.delete
-- users.view, users.create, users.update, users.delete
-- expenses.view, expenses.create, expenses.update, expenses.delete
-- reports.view, reports.export
-- discounts.view, discounts.create, discounts.update, discounts.delete
-- analytics.view
-- messages.view, messages.create, messages.delete
-- invoices.view, invoices.create, invoices.export
```

### 3. equipment
```sql
CREATE TABLE equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  category_id UUID REFERENCES equipment_categories(id),
  description TEXT,
  specs JSONB DEFAULT '{}',
  units_total INTEGER DEFAULT 1,
  units_available INTEGER DEFAULT 1,
  price_daily DECIMAL(10,2) NOT NULL,
  price_weekly DECIMAL(10,2),
  price_monthly DECIMAL(10,2),
  status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'in_use', 'booked', 'maintenance', 'inactive')),
  maintenance_note TEXT,
  estimated_ready_at TIMESTAMPTZ,
  image_urls JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 4. equipment_categories
```sql
CREATE TABLE equipment_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  icon VARCHAR(50),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 5. bookings
```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  status VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'active', 'completed', 'cancelled', 'interrupted')),
  location_address TEXT,
  location_lat DECIMAL(10,7),
  location_lng DECIMAL(10,7),
  notes TEXT,
  total_amount DECIMAL(12,2) DEFAULT 0,
  discount_id UUID REFERENCES discounts(id),
  discount_amount DECIMAL(10,2) DEFAULT 0,
  final_amount DECIMAL(12,2) DEFAULT 0,
  cancel_reason TEXT,
  referred_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 6. booking_items
```sql
CREATE TABLE booking_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  equipment_id UUID REFERENCES equipment(id) ON DELETE CASCADE,
  units INTEGER DEFAULT 1,
  start_at TIMESTAMPTZ NOT NULL,
  expected_end_at TIMESTAMPTZ NOT NULL,
  buffered_end_at TIMESTAMPTZ NOT NULL,
  actual_start TIMESTAMPTZ,
  actual_end TIMESTAMPTZ,
  price_per_unit DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 7. payments
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  amount_kes DECIMAL(12,2) NOT NULL,
  mpesa_phone VARCHAR(20),
  mpesa_receipt_code VARCHAR(50),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'initiated', 'completed', 'failed', 'refunded')),
  triggered_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 8. sessions (tracks actual equipment usage)
```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_item_id UUID REFERENCES booking_items(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  actual_start TIMESTAMPTZ NOT NULL,
  actual_end TIMESTAMPTZ,
  marked_by_admin_id UUID REFERENCES users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 9. reviews
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  equipment_id UUID REFERENCES equipment(id) ON DELETE CASCADE,
  stars INTEGER CHECK (stars BETWEEN 1 AND 5),
  comment TEXT,
  flagged BOOLEAN DEFAULT false,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 10. blocked_times (admin-set inactive dates)
```sql
CREATE TABLE blocked_times (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id UUID REFERENCES equipment(id) ON DELETE CASCADE,
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ NOT NULL,
  reason VARCHAR(255),
  created_by_admin_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 11. expenses
```sql
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES expense_categories(id) ON DELETE SET NULL,
  amount DECIMAL(12,2) NOT NULL,
  description TEXT,
  equipment_id UUID REFERENCES equipment(id),
  booking_id UUID REFERENCES bookings(id),
  date DATE DEFAULT CURRENT_DATE,
  recorded_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 12. expense_categories
```sql
CREATE TABLE expense_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  type VARCHAR(20) CHECK (type IN ('fuel', 'oil', 'spare_parts', 'maintenance', 'salary', 'transport', 'other')),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 13. discounts
```sql
CREATE TABLE discounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  type VARCHAR(20) CHECK (type IN ('milestone', 'referral', 'seasonal', 'promo', 'custom')),
  discount_type VARCHAR(20) CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10,2) NOT NULL,
  min_bookings INTEGER,
  min_spent_kes DECIMAL(12,2),
  referral_code VARCHAR(50) UNIQUE,
  max_uses INTEGER,
  used_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  starts_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 14. client_locations
```sql
CREATE TABLE client_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100),
  address TEXT NOT NULL,
  lat DECIMAL(10,7),
  lng DECIMAL(10,7),
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 15. notifications
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Types: booking_created, booking_confirmed, booking_cancelled, 
-- booking_started, booking_completed, payment_due, payment_received,
-- machine_issue, rank_up, new_message, discount_available
```

### 16. messages
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id),
  sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
  receiver_id UUID REFERENCES users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 17. invoices
```sql
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  booking_id UUID REFERENCES bookings(id),
  user_id UUID REFERENCES users(id),
  amount DECIMAL(12,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'cancelled')),
  due_date DATE,
  paid_date DATE,
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## Indexes

```sql
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_booking_items_booking_id ON booking_items(booking_id);
CREATE INDEX idx_booking_items_equipment ON booking_items(equipment_id);
CREATE INDEX idx_payments_booking_id ON payments(booking_id);
CREATE INDEX idx_expenses_date ON expenses(date);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
CREATE INDEX idx_blocked_times_equipment ON blocked_times(equipment_id);
```

---

## Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users can view/edit own profile
CREATE POLICY "users_select_own" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_update_own" ON users FOR UPDATE USING (auth.uid() = id);

-- Admins can view all users
CREATE POLICY "admins_select_users" ON users FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Users can view own bookings
CREATE POLICY "users_select_own_bookings" ON bookings FOR SELECT USING (user_id = auth.uid());

-- Admins can view all bookings
CREATE POLICY "admins_select_bookings" ON bookings FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Similar policies for all other tables...
```

---

## Trigger Functions

```sql
-- Auto-update units_available when booking status changes
CREATE OR REPLACE FUNCTION update_equipment_availability()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IN ('confirmed', 'active') THEN
    UPDATE equipment SET units_available = units_available - 1 WHERE id = NEW.equipment_id;
  ELSIF OLD.status IN ('confirmed', 'active') AND NEW.status NOT IN ('confirmed', 'active') THEN
    UPDATE equipment SET units_available = units_available + 1 WHERE id = OLD.equipment_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Auto-update user stats on booking completion
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    UPDATE users SET 
      total_bookings = total_bookings + 1,
      total_spent_kes = total_spent_kes + COALESCE(NEW.final_amount, 0)
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

---

## Seed Data

### Equipment Categories
```sql
INSERT INTO equipment_categories (name, icon, description) VALUES
('Compaction', '🚜', 'Rollers and compactors'),
('Concrete', '🔧', 'Vibrators, mixers, pokers'),
('Lifting', '🏗️', 'Hoists and elevators'),
('Pumping', '💧', 'Water pumps'),
('Tools', '🛠️', 'Shovels, buckets, hand tools');
```

### Equipment
```sql
INSERT INTO equipment (name, slug, category_id, description, specs, units_total, price_daily, price_weekly, price_monthly, status, image_urls) VALUES
('Road Roller (2-Ton Double Drum)', 'road-roller', (SELECT id FROM equipment_categories WHERE name='Compaction'), 'Heavy-duty road roller for compaction', '{"power": "15HP", "weight": "2000kg", "width": "1.2m"}', 1, 8500, 51000, 180000, 'available', '[]'),
('Concrete Vibrator / Poker', 'concrete-vibrator', (SELECT id FROM equipment_categories WHERE name='Concrete'), 'High-frequency concrete vibrator', '{"power": "2HP", "weight": "15kg", "hose_length": "6m"}', 1, 1800, 10800, 38000, 'available', '[]'),
('Concrete Mixer (350L)', 'concrete-mixer', (SELECT id FROM equipment_categories WHERE name='Concrete'), 'Heavy-duty concrete mixer', '{"power": "3HP", "capacity": "350L", "weight": "120kg"}', 2, 4500, 27000, 95000, 'available', '[]'),
('Skip Hoist', 'skip-hoist', (SELECT id FROM equipment_categories WHERE name='Lifting'), 'Material elevator for construction sites', '{"power": "5HP", "capacity": "500kg", "height": "50m"}', 1, 6000, 36000, 127000, 'available', '[]'),
('Water Pump (3", Petrol)', 'water-pump', (SELECT id FROM equipment_categories WHERE name='Pumping'), '3-inch petrol water pump', '{"power": "5HP", "flow_rate": "600L/min", "weight": "35kg"}', 1, 2200, 13200, 46500, 'available', '[]'),
('Shovel', 'shovel', (SELECT id FROM equipment_categories WHERE name='Tools'), 'Heavy-duty construction shovel', '{"material": "steel", "handle": "wood"}', 10, 200, 1200, 4200, 'available', '[]'),
('Bucket', 'bucket', (SELECT id FROM equipment_categories WHERE name='Tools'), 'Heavy-duty construction bucket', '{"material": "metal", "capacity": "20L"}', 10, 100, 600, 2100, 'available', '[]');
```

### Expense Categories
```sql
INSERT INTO expense_categories (name, type) VALUES
('Fuel', 'fuel'),
('Oil', 'oil'),
('Spare Parts', 'spare_parts'),
('Maintenance', 'maintenance'),
('Salary', 'salary'),
('Transport', 'transport'),
('Other', 'other');
```

### Default Admin User
```sql
INSERT INTO users (name, phone, email, password_hash, role, rank) VALUES
('Admin', '+254722995675', 'admin@chadalu.co.ke', '$2b$10$placeholder', 'admin', 6);
```

---

## Key Features Summary

| Feature | Table | Notes |
|---------|-------|-------|
| Multi-machine booking | bookings + booking_items | One booking, multiple items |
| Live location | client_locations | Lat/lng, multiple saved |
| Issue reporting | bookings.status = 'interrupted' | Triggers notification to admin |
| In-app messaging | messages | Client ↔ Admin chat |
| Expenses tracking | expenses + expense_categories | Fuel, oil, spare parts, salary |
| Profit/Loss reports | expenses + bookings + payments | Daily/weekly/monthly |
| Discounts | discounts | Milestone, referral, seasonal |
| Referral discounts | discounts.type = 'referral' | Admin sets referral codes |
| Inactive dates | blocked_times | Admin blocks equipment |
| Invoices | invoices | Generated from completed bookings |
| Notifications | notifications | Real-time alerts |