-- CHADALU Enterprises - Complete Fresh Database Setup
-- Run this in Supabase SQL Editor (will drop ALL existing tables)

-- ============================================
-- DROP EVERYTHING
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
-- 1. ENUM TYPES
-- ============================================
CREATE TYPE user_role AS ENUM ('client', 'admin');
CREATE TYPE equipment_status AS ENUM ('available', 'in_use', 'booked', 'maintenance', 'inactive');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'active', 'completed', 'cancelled', 'interrupted');
CREATE TYPE payment_status AS ENUM ('pending', 'initiated', 'completed', 'failed', 'refunded');

-- ============================================
-- 2. USERS TABLE
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
-- 3. USER PERMISSIONS TABLE
-- ============================================
CREATE TABLE user_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  permission VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, permission)
);

-- ============================================
-- 4. EQUIPMENT CATEGORIES TABLE
-- ============================================
CREATE TABLE equipment_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  icon VARCHAR(50),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 5. EQUIPMENT TABLE
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
  price_daily DECIMAL(10,2) NOT NULL CHECK (price_daily >= 0),
  price_weekly DECIMAL(10,2),
  price_monthly DECIMAL(10,2),
  status equipment_status DEFAULT 'available',
  maintenance_note TEXT,
  estimated_ready_at TIMESTAMPTZ,
  image_urls JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 6. BOOKINGS TABLE
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
-- 7. BOOKING ITEMS TABLE
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
-- 8. SESSIONS TABLE
-- ============================================
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_item_id UUID REFERENCES booking_items(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  actual_start TIMESTAMPTZ NOT NULL,
  actual_end TIMESTAMPTZ,
  marked_by_admin_id UUID REFERENCES users(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 9. PAYMENTS TABLE
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
-- 10. REVIEWS TABLE
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
-- 11. BLOCKED TIMES TABLE
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
-- 12. EXPENSE CATEGORIES TABLE
-- ============================================
CREATE TABLE expense_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  type VARCHAR(20) CHECK (type IN ('fuel', 'oil', 'spare_parts', 'maintenance', 'salary', 'transport', 'other')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 13. EXPENSES TABLE
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
-- 14. DISCOUNTS TABLE
-- ============================================
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

-- ============================================
-- 15. CLIENT LOCATIONS TABLE
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
-- 16. NOTIFICATIONS TABLE
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
-- 17. MESSAGES TABLE
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
-- 18. INVOICES TABLE
-- ============================================
CREATE TABLE invoices (
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
-- INDEXES
-- ============================================
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_created_at ON bookings(created_at DESC);

CREATE INDEX idx_booking_items_booking_id ON booking_items(booking_id);
CREATE INDEX idx_booking_items_equipment ON booking_items(equipment_id);
CREATE INDEX idx_booking_items_start ON booking_items(start_at);

CREATE INDEX idx_payments_booking_id ON payments(booking_id);
CREATE INDEX idx_payments_status ON payments(status);

CREATE INDEX idx_expenses_date ON expenses(date);
CREATE INDEX idx_expenses_category ON expenses(category_id);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);

CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
CREATE INDEX idx_messages_booking ON messages(booking_id);

CREATE INDEX idx_blocked_times_equipment ON blocked_times(equipment_id);

CREATE INDEX idx_discounts_referral_code ON discounts(referral_code);

CREATE INDEX idx_client_locations_user ON client_locations(user_id);

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
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Public read
CREATE POLICY "public_read_equipment" ON equipment FOR SELECT USING (true);
CREATE POLICY "public_read_categories" ON equipment_categories FOR SELECT USING (true);
CREATE POLICY "public_read_blocked_times" ON blocked_times FOR SELECT USING (true);
CREATE POLICY "public_read_active_discounts" ON discounts FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_approved_reviews" ON reviews FOR SELECT USING (approved = true);
CREATE POLICY "public_read_expense_categories" ON expense_categories FOR SELECT USING (true);

-- Users
CREATE POLICY "users_select_own" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_update_own" ON users FOR UPDATE USING (auth.uid() = id);

-- Bookings
CREATE POLICY "users_select_own_bookings" ON bookings FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "users_insert_bookings" ON bookings FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "users_update_own_bookings" ON bookings FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "admins_manage_bookings" ON bookings FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- Booking Items
CREATE POLICY "users_view_own_items" ON booking_items FOR SELECT USING (EXISTS (SELECT 1 FROM bookings WHERE id = booking_id AND user_id = auth.uid()));
CREATE POLICY "admins_manage_items" ON booking_items FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- Payments
CREATE POLICY "users_view_own_payments" ON payments FOR SELECT USING (EXISTS (SELECT 1 FROM bookings WHERE id = booking_id AND user_id = auth.uid()));
CREATE POLICY "admins_manage_payments" ON payments FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- Equipment
CREATE POLICY "admins_manage_equipment" ON equipment FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- Categories
CREATE POLICY "admins_manage_categories" ON equipment_categories FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- Reviews
CREATE POLICY "admins_manage_reviews" ON reviews FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- Expenses
CREATE POLICY "admins_manage_expenses" ON expenses FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- Expense Categories
CREATE POLICY "admins_manage_expense_categories" ON expense_categories FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- Discounts
CREATE POLICY "admins_manage_discounts" ON discounts FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- Blocked Times
CREATE POLICY "admins_manage_blocked_times" ON blocked_times FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- Client Locations
CREATE POLICY "users_own_locations" ON client_locations FOR ALL USING (user_id = auth.uid());

-- Messages
CREATE POLICY "users_send_messages" ON messages FOR INSERT WITH CHECK (sender_id = auth.uid());
CREATE POLICY "users_own_messages" ON messages FOR SELECT USING (sender_id = auth.uid() OR receiver_id = auth.uid() OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "admins_manage_messages" ON messages FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- Invoices
CREATE POLICY "users_own_invoices" ON invoices FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "admins_manage_invoices" ON invoices FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- Sessions
CREATE POLICY "admins_manage_sessions" ON sessions FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- Permissions
CREATE POLICY "admins_manage_permissions" ON user_permissions FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- Notifications
CREATE POLICY "users_own_notifications" ON notifications FOR ALL USING (user_id = auth.uid());

-- Admins access users
CREATE POLICY "admins_manage_users" ON users FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- ============================================
-- TRIGGER FUNCTIONS
-- ============================================

-- Auto update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER equipment_updated_at BEFORE UPDATE ON equipment FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Update user stats on booking complete
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
('Tools', '🛠️', 'Shovels, buckets, hand tools');

-- Equipment
INSERT INTO equipment (name, slug, category_id, description, specs, units_total, units_available, price_daily, price_weekly, price_monthly, status, image_urls) VALUES
('Road Roller (2-Ton Double Drum)', 'road-roller', (SELECT id FROM equipment_categories WHERE name = 'Compaction'), 'Heavy-duty 2-ton double drum road roller for compaction', '{"power": "15HP Diesel", "weight": "2000kg", "width": "1.2m"}', 1, 1, 8500, 51000, 180000, 'available', '[]'),
('Concrete Vibrator / Poker', 'concrete-vibrator', (SELECT id FROM equipment_categories WHERE name = 'Concrete'), 'High-frequency concrete vibrator', '{"power": "2HP Electric", "weight": "15kg"}', 1, 1, 1800, 10800, 38000, 'available', '[]'),
('Concrete Mixer (350L)', 'concrete-mixer', (SELECT id FROM equipment_categories WHERE name = 'Concrete'), 'Heavy-duty 350L concrete mixer', '{"power": "3HP", "capacity": "350L", "weight": "120kg"}', 2, 2, 4500, 27000, 95000, 'available', '[]'),
('Skip Hoist', 'skip-hoist', (SELECT id FROM equipment_categories WHERE name = 'Lifting'), 'Material elevator for construction sites', '{"power": "5HP", "capacity": "500kg", "height": "50m"}', 1, 1, 6000, 36000, 127000, 'available', '[]'),
('Water Pump (3" Petrol)', 'water-pump', (SELECT id FROM equipment_categories WHERE name = 'Pumping'), '3-inch petrol water pump', '{"power": "5HP", "flow_rate": "600L/min", "weight": "35kg"}', 1, 1, 2200, 13200, 46500, 'available', '[]'),
('Shovel', 'shovel', (SELECT id FROM equipment_categories WHERE name = 'Tools'), 'Heavy-duty construction shovel', '{"material": "steel", "handle": "wood"}', 10, 10, 200, 1200, 4200, 'available', '[]'),
('Bucket', 'bucket', (SELECT id FROM equipment_categories WHERE name = 'Tools'), 'Heavy-duty construction bucket', '{"material": "metal", "capacity": "20L"}', 10, 10, 100, 600, 2100, 'available', '[]');

-- Expense Categories
INSERT INTO expense_categories (name, type) VALUES
('Fuel', 'fuel'),
('Oil', 'oil'),
('Spare Parts', 'spare_parts'),
('Maintenance', 'maintenance'),
('Salary', 'salary'),
('Transport', 'transport'),
('Other', 'other');

-- ============================================
-- VERIFY
-- ============================================
SELECT '✅ Database setup complete!' as status;
SELECT count(*) as total_tables FROM information_schema.tables WHERE table_schema = 'public';
SELECT name, price_daily, units_available FROM equipment;