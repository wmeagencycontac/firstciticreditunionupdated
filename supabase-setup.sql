-- Supabase Database Setup Script
-- Run this in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create generate_account_number function
CREATE OR REPLACE FUNCTION generate_account_number(
  user_id_input UUID,
  account_type_input TEXT
)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  account_number TEXT;
  counter INTEGER;
  prefix TEXT;
BEGIN
  -- Set prefix based on account type
  CASE account_type_input
    WHEN 'checking' THEN prefix := '1001';
    WHEN 'savings' THEN prefix := '2001';
    ELSE prefix := '9001';
  END CASE;

  -- Get count of existing accounts for this user
  SELECT COUNT(*) INTO counter
  FROM accounts
  WHERE user_id = user_id_input;

  -- Generate account number: prefix + user_id_short + counter
  account_number := prefix || SUBSTRING(user_id_input::TEXT FROM 1 FOR 8) || LPAD((counter + 1)::TEXT, 4, '0');

  RETURN account_number;
END;
$$;

-- Create function to get routing number based on account type
CREATE OR REPLACE FUNCTION get_routing_number(account_type_input TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  CASE account_type_input
    WHEN 'checking' THEN RETURN '021000021'; -- Chase Bank routing
    WHEN 'savings' THEN RETURN '026009593';  -- Bank of America routing
    ELSE RETURN '121000248'; -- Wells Fargo routing
  END CASE;
END;
$$;

-- Create trigger function to auto-create banking profile
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.banking_users (
    id,
    email,
    name,
    bio,
    picture,
    email_verified,
    role,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    NEW.raw_user_meta_data->>'bio',
    NEW.raw_user_meta_data->>'picture',
    NEW.email_confirmed_at IS NOT NULL,
    'user',
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$;

-- Create trigger to auto-create banking profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Insert some sample data for testing (optional)
-- Note: You can remove this section if you don't want test data

-- Insert a test user (if needed)
-- INSERT INTO banking_users (id, email, name, bio, picture, email_verified, role, created_at, updated_at)
-- VALUES (
--   '00000000-0000-0000-0000-000000000001',
--   'test@example.com',
--   'Test User',
--   'Test banking user',
--   NULL,
--   true,
--   'user',
--   NOW(),
--   NOW()
-- ) ON CONFLICT (id) DO NOTHING;

-- Row Level Security (RLS) Policies
-- Enable RLS on all tables
ALTER TABLE banking_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;

-- Banking users can only see their own profile
CREATE POLICY "Users can view own profile" ON banking_users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON banking_users
  FOR UPDATE USING (auth.uid() = id);

-- Accounts policies
CREATE POLICY "Users can view own accounts" ON accounts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own accounts" ON accounts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Transactions policies  
CREATE POLICY "Users can view own transactions" ON transactions
  FOR SELECT USING (
    account_id IN (
      SELECT id FROM accounts WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own transactions" ON transactions
  FOR INSERT WITH CHECK (
    account_id IN (
      SELECT id FROM accounts WHERE user_id = auth.uid()
    )
  );

-- Cards policies
CREATE POLICY "Users can view own cards" ON cards
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cards" ON cards
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admin policies (service role can do everything)
CREATE POLICY "Service role can do anything on banking_users" ON banking_users
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can do anything on accounts" ON accounts
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can do anything on transactions" ON transactions
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can do anything on cards" ON cards
  FOR ALL USING (auth.role() = 'service_role');
