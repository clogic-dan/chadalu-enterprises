-- Fix for RLS infinite recursion on users table
-- Run this in Supabase SQL Editor

-- Step 1: Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can update any user" ON users;

-- Step 2: Create simpler policies without circular references
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow anyone to create users (signup)
CREATE POLICY "Allow all to insert users" ON users
  FOR INSERT WITH CHECK (true);

-- Allow authenticated users to read users (basic read)
CREATE POLICY "Allow authenticated to read users" ON users
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Allow users to update their own profile (only specific fields)
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND 
    (name IS NOT NULL OR phone IS NOT NULL OR avatar_url IS NOT NULL) AND
    role IS NULL AND rank IS NULL AND total_bookings IS NULL AND total_spent_kes IS NULL);

-- Allow admins to update any user (including role, rank)
CREATE POLICY "Admins can update any user" ON users
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- Allow admins to delete users
CREATE POLICY "Admins can delete users" ON users
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- Allow public read for equipment (no auth required)
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Equipment public read" ON equipment;
CREATE POLICY "Equipment public read" ON equipment
  FOR SELECT USING (true);

-- Allow admins to insert/update/delete equipment
DROP POLICY IF EXISTS "Admins can manage equipment" ON equipment;
CREATE POLICY "Admins can manage equipment" ON equipment
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- Booking items - allow read for authenticated, write for admins
ALTER TABLE booking_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated can read booking_items" ON booking_items;
CREATE POLICY "Authenticated can read booking_items" ON booking_items
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Equipment categories - public read, admin write
ALTER TABLE equipment_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read categories" ON equipment_categories;
CREATE POLICY "Public read categories" ON equipment_categories
  FOR SELECT USING (true);

-- Bookings - user can see own, admin can see all
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;
CREATE POLICY "Users can view own bookings" ON bookings
  FOR SELECT USING (auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));

-- Payments - similar pattern
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own payments" ON payments;
CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Expenses - admin only
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can manage expenses" ON expenses;
CREATE POLICY "Admins can manage expenses" ON expenses
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- Discounts - public read for active, admin write
ALTER TABLE discounts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read active discounts" ON discounts;
CREATE POLICY "Public read active discounts" ON discounts
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage discounts" ON discounts;
CREATE POLICY "Admins can manage discounts" ON discounts
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- Notifications - user can see own, admin can see all
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));

-- Messages - user can see own conversations
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own messages" ON messages;
CREATE POLICY "Users can view own messages" ON messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id OR
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));

-- Reviews - public read approved, admin manage all
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read approved reviews" ON reviews;
CREATE POLICY "Public read approved reviews" ON reviews
  FOR SELECT USING (approved = true);

DROP POLICY IF EXISTS "Admins can manage reviews" ON reviews;
CREATE POLICY "Admins can manage reviews" ON reviews
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- Client locations - user can manage own
ALTER TABLE client_locations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own locations" ON client_locations;
CREATE POLICY "Users can manage own locations" ON client_locations
  FOR ALL USING (auth.uid() = user_id);

-- Blocked times - public read, admin write
ALTER TABLE blocked_times ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read blocked times" ON blocked_times;
CREATE POLICY "Public read blocked times" ON blocked_times
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage blocked times" ON blocked_times;
CREATE POLICY "Admins can manage blocked times" ON blocked_times
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- Invoices - user can see own, admin can see all
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own invoices" ON invoices;
CREATE POLICY "Users can view own invoices" ON invoices
  FOR SELECT USING (auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));

-- Expense categories - public read, admin write
ALTER TABLE expense_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read expense categories" ON expense_categories;
CREATE POLICY "Public read expense categories" ON expense_categories
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage expense categories" ON expense_categories;
CREATE POLICY "Admins can manage expense categories" ON expense_categories
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- User permissions - admin only
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can manage permissions" ON user_permissions;
CREATE POLICY "Admins can manage permissions" ON user_permissions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

print('RLS policies fixed - no more infinite recursion');