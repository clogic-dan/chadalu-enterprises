-- CHADALU Enterprises - Complete Database Setup
-- Run this ONCE in Supabase SQL Editor

-- ============================================
-- DROP EXISTING
-- ============================================
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS client_locations CASCADE;
DROP TABLE IF EXISTS blocked_times CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS booking_items CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS expenses CASCADE;
DROP TABLE IF EXISTS discounts CASCADE;
DROP TABLE IF EXISTS user_permissions CASCADE;
DROP TABLE IF EXISTS equipment CASCADE;
DROP TABLE IF EXISTS expense_categories CASCADE;
DROP TABLE IF EXISTS equipment_categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

DROP TYPE IF EXISTS payment_status;
DROP TYPE IF EXISTS booking_status;
DROP TYPE IF EXISTS equipment_status;
DROP TYPE IF EXISTS user_role;

-- ============================================
-- TYPES
-- ============================================
CREATE TYPE user_role AS ENUM ('client', 'admin', 'super_admin');
CREATE TYPE equipment_status AS ENUM ('available', 'in_use', 'booked', 'maintenance', 'inactive');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'active', 'completed', 'cancelled', 'interrupted');
CREATE TYPE payment_status AS ENUM ('pending', 'initiated', 'completed', 'failed', 'refunded');

-- ============================================
-- USERS
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  role user_role DEFAULT 'client',
  avatar_url TEXT,
  rank INTEGER DEFAULT 1 CHECK (rank BETWEEN 1 AND 6),
  total_bookings INTEGER DEFAULT 0,
  total_spent_kes DECIMAL(12,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- USER PERMISSIONS
-- ============================================
CREATE TABLE user_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  permission VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, permission)
);

-- ============================================
-- EQUIPMENT CATEGORIES
-- ============================================
CREATE TABLE equipment_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  icon VARCHAR(50),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- EQUIPMENT (with price options: per round, hour, day, hire)
-- ============================================
CREATE TABLE equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  category_id UUID REFERENCES equipment_categories(id) ON DELETE SET NULL,
  description TEXT,
  specs JSONB DEFAULT '{}',
  units_total INTEGER DEFAULT 1 CHECK (units_total > 0),
  units_available INTEGER DEFAULT 1 CHECK (units_available >= 0),
  price_hourly DECIMAL(10,2),
  price_daily DECIMAL(10,2) NOT NULL CHECK (price_daily >= 0),
  price_weekly DECIMAL(10,2),
  price_monthly DECIMAL(10,2),
  price_hire DECIMAL(10,2),
  status equipment_status DEFAULT 'available',
  maintenance_note TEXT,
  estimated_ready_at TIMESTAMPTZ,
  image_urls JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- BOOKINGS
-- ============================================
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  status booking_status DEFAULT 'pending',
  location_address TEXT,
  location_lat DECIMAL(10,7),
  location_lng DECIMAL(10,7),
  notes TEXT,
  total_amount DECIMAL(12,2) DEFAULT 0 CHECK (total_amount >= 0),
  discount_id UUID,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  final_amount DECIMAL(12,2) DEFAULT 0 CHECK (final_amount >= 0),
  cancel_reason TEXT,
  referred_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- BOOKING ITEMS
-- ============================================
CREATE TABLE booking_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  equipment_id UUID REFERENCES equipment(id) ON DELETE CASCADE,
  units INTEGER DEFAULT 1 CHECK (units > 0),
  start_at TIMESTAMPTZ NOT NULL,
  expected_end_at TIMESTAMPTZ NOT NULL,
  buffered_end_at TIMESTAMPTZ NOT NULL,
  actual_start TIMESTAMPTZ,
  actual_end TIMESTAMPTZ,
  price_per_unit DECIMAL(10,2) NOT NULL CHECK (price_per_unit >= 0),
  total_price DECIMAL(10,2) NOT NULL CHECK (total_price >= 0),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- PAYMENTS
-- ============================================
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  amount_kes DECIMAL(12,2) NOT NULL CHECK (amount_kes >= 0),
  mpesa_phone VARCHAR(20),
  mpesa_receipt_code VARCHAR(50),
  status payment_status DEFAULT 'pending',
  triggered_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- REVIEWS
-- ============================================
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  equipment_id UUID REFERENCES equipment(id) ON DELETE SET NULL,
  stars INTEGER CHECK (stars BETWEEN 1 AND 5),
  comment TEXT,
  flagged BOOLEAN DEFAULT false,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- BLOCKED TIMES
-- ============================================
CREATE TABLE blocked_times (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id UUID REFERENCES equipment(id) ON DELETE CASCADE,
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ NOT NULL,
  reason VARCHAR(255),
  created_by_admin_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- EXPENSE CATEGORIES
-- ============================================
CREATE TABLE expense_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  type VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- EXPENSES
-- ============================================
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES expense_categories(id) ON DELETE SET NULL,
  amount DECIMAL(12,2) NOT NULL CHECK (amount >= 0),
  description TEXT,
  equipment_id UUID REFERENCES equipment(id) ON DELETE SET NULL,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  date DATE DEFAULT CURRENT_DATE,
  recorded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- DISCOUNTS
-- ============================================
CREATE TABLE discounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  type VARCHAR(20) CHECK (type IN ('milestone', 'referral', 'seasonal', 'promo', 'custom')),
  discount_type VARCHAR(20) CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10,2) NOT NULL,
  min_bookings INTEGER,
  min_spent_kes DECIMAL(12,2),
  referral_code VARCHAR(50),
  max_uses INTEGER,
  used_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  starts_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- CLIENT LOCATIONS
-- ============================================
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

-- ============================================
-- NOTIFICATIONS
-- ============================================
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

-- ============================================
-- MESSAGES
-- ============================================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
  receiver_id UUID REFERENCES users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- INVOICES
-- ============================================
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'draft',
  due_date DATE,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- SEED DATA
-- ============================================
INSERT INTO equipment_categories (name, icon, description) VALUES
('Earth Moving', '🚜', 'Excavators, bulldozers, loaders'),
('Compaction', '🌂', 'Road rollers, plate compactors'),
('Concrete', '🧱', 'Mixers, vibrators, pumps'),
('Power Generation', '⚡', 'Generators, transformers'),
('Pumping', '💧', 'Water pumps, dewatering pumps'),
('Material Handling', '🏗️', 'Forklifts, hoists, cranes'),
('Cutting', '🔪', 'Concrete cutters, grinders'),
('Other', '📦', 'Miscellaneous equipment');

INSERT INTO equipment (name, slug, category_id, description, units_total, units_available, price_hourly, price_daily, price_weekly, price_monthly, image_urls) 
SELECT 
  name, 
  LOWER(REPLACE(name, ' ', '-')),
  id,
  'High quality ' || LOWER(name) || ' for construction',
  1, 1,
  500, 3500, 20000, 75000,
  '["https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=400"]'
FROM equipment_categories;

-- ============================================
-- RLS POLICIES
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_times ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;

-- Public read for equipment and categories
CREATE POLICY "Public equipment read" ON equipment FOR SELECT USING (true);
CREATE POLICY "Public categories read" ON equipment_categories FOR SELECT USING (true);

-- Allow insert for users signup
CREATE POLICY "Anyone can insert users" ON users FOR INSERT WITH CHECK (true);

-- Allow authenticated users to read basic user data
CREATE POLICY "Auth users read" ON users FOR SELECT USING (auth.uid() IS NOT NULL);

-- Users can update own profile
CREATE POLICY "Users update own" ON users FOR UPDATE USING (auth.uid() = id);

-- Admins can do everything
CREATE POLICY "Admins manage users" ON users FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

CREATE POLICY "Admins manage equipment" ON equipment FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

CREATE POLICY "Admins manage categories" ON equipment_categories FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

CREATE POLICY "Admins manage bookings" ON bookings FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

CREATE POLICY "Admins manage expenses" ON expenses FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

CREATE POLICY "Admins manage discounts" ON discounts FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

CREATE POLICY "Admins manage reviews" ON reviews FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

CREATE POLICY "Admins manage blocked_times" ON blocked_times FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

CREATE POLICY "Admins manage expense_categories" ON expense_categories FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Active discounts public read
CREATE POLICY "Active discounts read" ON discounts FOR SELECT USING (is_active = true);

-- Public approved reviews
CREATE POLICY "Approved reviews read" ON reviews FOR SELECT USING (approved = true);

-- Users can read their own bookings
CREATE POLICY "User bookings read" ON bookings FOR SELECT USING (
  auth.uid() = user_id OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Users can read their own payments
CREATE POLICY "User payments read" ON payments FOR SELECT USING (
  auth.uid() IS NOT NULL
);

-- Users can manage own notifications
CREATE POLICY "User notifications" ON notifications FOR ALL USING (
  user_id = auth.uid() OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Users can manage own locations
CREATE POLICY "User locations" ON client_locations FOR ALL USING (
  auth.uid() = user_id
);

-- Messages - user can see own
CREATE POLICY "User messages" ON messages FOR SELECT USING (
  auth.uid() = sender_id OR auth.uid() = receiver_id OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Users can insert messages
CREATE POLICY "User messages insert" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

SELECT 'Database setup complete!' as status;