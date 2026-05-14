-- CHADALU — Supplemental Migration (Add Missing Tables)
-- Run AFTER your existing setup

-- ============================================
-- ADD MISSING TABLES (if not exist)
-- ============================================

-- Equipment Categories
CREATE TABLE IF NOT EXISTS equipment_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  icon VARCHAR(50),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Equipment (add columns if missing)
ALTER TABLE equipment ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE;
ALTER TABLE equipment ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES equipment_categories(id);
ALTER TABLE equipment ADD COLUMN IF NOT EXISTS specs JSONB DEFAULT '{}';
ALTER TABLE equipment ADD COLUMN IF NOT EXISTS units_total INTEGER DEFAULT 1 CHECK (units_total > 0);
ALTER TABLE equipment ADD COLUMN IF NOT EXISTS units_available INTEGER DEFAULT 1 CHECK (units_available >= 0);
ALTER TABLE equipment ADD COLUMN IF NOT EXISTS price_daily DECIMAL(10,2) CHECK (price_daily >= 0);
ALTER TABLE equipment ADD COLUMN IF NOT EXISTS price_weekly DECIMAL(10,2);
ALTER TABLE equipment ADD COLUMN IF NOT EXISTS price_monthly DECIMAL(10,2);
ALTER TABLE equipment ADD COLUMN IF NOT EXISTS maintenance_note TEXT;
ALTER TABLE equipment ADD COLUMN IF NOT EXISTS estimated_ready_at TIMESTAMPTZ;
ALTER TABLE equipment ADD COLUMN IF NOT EXISTS image_urls JSONB DEFAULT '[]';

-- Booking Items (if not exist)
CREATE TABLE IF NOT EXISTS booking_items (
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

-- Sessions (tracks actual usage)
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_item_id UUID REFERENCES booking_items(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  actual_start TIMESTAMPTZ NOT NULL,
  actual_end TIMESTAMPTZ,
  marked_by_admin_id UUID REFERENCES users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Discounts
CREATE TABLE IF NOT EXISTS discounts (
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

-- Client Locations
CREATE TABLE IF NOT EXISTS client_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100),
  address TEXT NOT NULL,
  lat DECIMAL(10,7),
  lng DECIMAL(10,7),
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Blocked Times
CREATE TABLE IF NOT EXISTS blocked_times (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id UUID REFERENCES equipment(id) ON DELETE CASCADE,
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ NOT NULL,
  reason VARCHAR(255),
  created_by_admin_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Expense Categories
CREATE TABLE IF NOT EXISTS expense_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  type VARCHAR(20) CHECK (type IN ('fuel', 'oil', 'spare_parts', 'maintenance', 'salary', 'transport', 'other')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Expenses
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES expense_categories(id),
  amount DECIMAL(12,2) NOT NULL CHECK (amount >= 0),
  description TEXT,
  equipment_id UUID REFERENCES equipment(id),
  booking_id UUID REFERENCES bookings(id),
  date DATE DEFAULT CURRENT_DATE,
  recorded_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- User Permissions
CREATE TABLE IF NOT EXISTS user_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  permission VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, permission)
);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
  receiver_id UUID REFERENCES users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Invoices
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  amount DECIMAL(12,2) NOT NULL CHECK (amount >= 0),
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'cancelled')),
  due_date DATE,
  paid_date DATE,
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- ADD MISSING COLUMNS TO EXISTING TABLES
-- ============================================

-- Add columns to bookings
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS location_address TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS location_lat DECIMAL(10,7);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS location_lng DECIMAL(10,7);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES users(id);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS discount_id UUID REFERENCES discounts(id);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10,2) DEFAULT 0;

-- Add columns to users
ALTER TABLE users ADD COLUMN IF NOT EXISTS name VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS rank INTEGER DEFAULT 1 CHECK (rank BETWEEN 1 AND 6);
ALTER TABLE users ADD COLUMN IF NOT EXISTS total_bookings INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS total_spent_kes DECIMAL(12,2) DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Add columns to reviews
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS flagged BOOLEAN DEFAULT false;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS approved BOOLEAN DEFAULT false;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Add columns to payments
ALTER TABLE payments ADD COLUMN IF NOT EXISTS mpesa_phone VARCHAR(20);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS mpesa_receipt_code VARCHAR(50);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS triggered_at TIMESTAMPTZ;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_booking_items_booking_id ON booking_items(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_items_equipment ON booking_items(equipment_id);
CREATE INDEX IF NOT EXISTS idx_booking_items_start ON booking_items(start_at);

CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category_id);

CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id);

CREATE INDEX IF NOT EXISTS idx_blocked_times_equipment ON blocked_times(equipment_id);

CREATE INDEX IF NOT EXISTS idx_discounts_referral_code ON discounts(referral_code);

CREATE INDEX IF NOT EXISTS idx_client_locations_user ON client_locations(user_id);

-- ============================================
-- ENABLE RLS
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_times ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Public read for equipment
CREATE POLICY "public_read_equipment" ON equipment FOR SELECT USING (true);
CREATE POLICY "public_read_categories" ON equipment_categories FOR SELECT USING (true);
CREATE POLICY "public_read_blocked_times" ON blocked_times FOR SELECT USING (true);
CREATE POLICY "public_read_active_discounts" ON discounts FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_approved_reviews" ON reviews FOR SELECT USING (approved = true);
CREATE POLICY "public_read_expense_categories" ON expense_categories FOR SELECT USING (true);

-- Users policies
CREATE POLICY "users_select_own" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_update_own" ON users FOR UPDATE USING (auth.uid() = id);

-- Bookings policies
CREATE POLICY "users_select_own_bookings" ON bookings FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "users_insert_bookings" ON bookings FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "users_update_own_bookings" ON bookings FOR UPDATE USING (user_id = auth.uid());

-- Admin policies
CREATE POLICY "admins_all_access" ON users FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "admins_manage_bookings" ON bookings FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "admins_manage_booking_items" ON booking_items FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "admins_manage_payments" ON payments FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "admins_manage_reviews" ON reviews FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "admins_manage_equipment" ON equipment FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "admins_manage_categories" ON equipment_categories FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "admins_manage_expenses" ON expenses FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "admins_manage_expense_categories" ON expense_categories FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "admins_manage_discounts" ON discounts FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "admins_manage_blocked_times" ON blocked_times FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "admins_manage_invoices" ON invoices FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "admins_manage_sessions" ON sessions FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "admins_manage_permissions" ON user_permissions FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Client locations
CREATE POLICY "users_own_locations" ON client_locations FOR ALL USING (user_id = auth.uid());

-- Messages
CREATE POLICY "users_send_messages" ON messages FOR INSERT WITH CHECK (sender_id = auth.uid());
CREATE POLICY "users_own_messages" ON messages FOR SELECT USING (sender_id = auth.uid() OR receiver_id = auth.uid() OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- Invoices
CREATE POLICY "users_own_invoices" ON invoices FOR SELECT USING (user_id = auth.uid());

-- ============================================
-- TRIGGER FUNCTIONS
-- ============================================

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS users_updated_at ON users;
CREATE TRIGGER users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS equipment_updated_at ON equipment;
CREATE TRIGGER equipment_updated_at BEFORE UPDATE ON equipment FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS bookings_updated_at ON bookings;
CREATE TRIGGER bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS reviews_updated_at ON reviews;
CREATE TRIGGER reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Booking complete -> update user stats
CREATE OR REPLACE FUNCTION update_user_on_booking_complete()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' AND NEW.user_id IS NOT NULL THEN
    UPDATE users SET 
      total_bookings = total_bookings + 1,
      total_spent_kes = total_spent_kes + COALESCE(NEW.final_amount, 0)
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS booking_complete_update_user ON bookings;
CREATE TRIGGER booking_complete_update_user AFTER UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_user_on_booking_complete();

-- ============================================
-- SEED DATA
-- ============================================

-- Equipment Categories
INSERT INTO equipment_categories (name, icon, description) VALUES
('Compaction', '🚜', 'Rollers and compactors'),
('Concrete', '🔧', 'Vibrators, mixers, pokers'),
('Lifting', '🏗️', 'Hoists and elevators'),
('Pumping', '💧', 'Water pumps'),
('Tools', '🛠️', 'Shovels, buckets, hand tools')
ON CONFLICT (name) DO NOTHING;

-- Expense Categories
INSERT INTO expense_categories (name, type) VALUES
('Fuel', 'fuel'),
('Oil', 'oil'),
('Spare Parts', 'spare_parts'),
('Maintenance', 'maintenance'),
('Salary', 'salary'),
('Transport', 'transport'),
('Other', 'other')
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- VERIFY
-- ============================================
SELECT 'Setup complete!' as status;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;