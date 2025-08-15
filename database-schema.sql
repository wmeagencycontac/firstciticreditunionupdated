-- Fusion Bank Database Schema
-- This file contains the complete Supabase PostgreSQL schema

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (handled by Supabase Auth)
-- Additional banking user profile data
CREATE TABLE IF NOT EXISTS banking_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  bio TEXT,
  picture TEXT,
  email_verified BOOLEAN DEFAULT false,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  locked BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Accounts table
CREATE TABLE IF NOT EXISTS accounts (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES banking_users(id) ON DELETE CASCADE,
  account_number TEXT NOT NULL UNIQUE,
  account_type TEXT NOT NULL CHECK (account_type IN ('checking', 'savings')),
  balance NUMERIC(15,2) DEFAULT 0.00,
  currency TEXT DEFAULT 'USD',
  routing_number TEXT DEFAULT '123456789',
  locked BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  account_id INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  from_account_id INTEGER REFERENCES accounts(id),
  to_account_id INTEGER REFERENCES accounts(id),
  type TEXT NOT NULL CHECK (type IN ('credit', 'debit', 'transfer')),
  category TEXT DEFAULT 'other',
  amount NUMERIC(15,2) NOT NULL,
  description TEXT NOT NULL,
  merchant TEXT,
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
  admin_created BOOLEAN DEFAULT false,
  admin_reason TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cards table
CREATE TABLE IF NOT EXISTS cards (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES banking_users(id) ON DELETE CASCADE,
  account_id INTEGER REFERENCES accounts(id) ON DELETE CASCADE,
  card_number TEXT NOT NULL,
  card_type TEXT DEFAULT 'debit' CHECK (card_type IN ('debit', 'credit')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'blocked')),
  expiry_date TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mobile deposits table
CREATE TABLE IF NOT EXISTS mobile_deposits (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES banking_users(id) ON DELETE CASCADE,
  account_id INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  amount NUMERIC(15,2) NOT NULL,
  check_front_image TEXT, -- URL to uploaded image
  check_back_image TEXT,  -- URL to uploaded image
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE,
  processed_by UUID REFERENCES banking_users(id)
);

-- Support tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES banking_users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  admin_response TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Account unlock requests
CREATE TABLE IF NOT EXISTS unlock_requests (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES banking_users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE,
  processed_by UUID REFERENCES banking_users(id)
);

-- Admin activity log
CREATE TABLE IF NOT EXISTS admin_activity (
  id SERIAL PRIMARY KEY,
  admin_id UUID NOT NULL REFERENCES banking_users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  target_user_id UUID REFERENCES banking_users(id),
  target_account_id INTEGER REFERENCES accounts(id),
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mass flood simulation log
CREATE TABLE IF NOT EXISTS mass_flood_logs (
  id SERIAL PRIMARY KEY,
  admin_id UUID NOT NULL REFERENCES banking_users(id) ON DELETE CASCADE,
  target_user_id UUID NOT NULL REFERENCES banking_users(id) ON DELETE CASCADE,
  transaction_count INTEGER NOT NULL,
  total_amount NUMERIC(15,2) NOT NULL,
  transaction_type TEXT NOT NULL,
  date_range_start DATE NOT NULL,
  date_range_end DATE NOT NULL,
  categories TEXT[], -- Array of categories used
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_account_id ON transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_timestamp ON transactions(timestamp);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_cards_user_id ON cards(user_id);
CREATE INDEX IF NOT EXISTS idx_mobile_deposits_user_id ON mobile_deposits(user_id);
CREATE INDEX IF NOT EXISTS idx_mobile_deposits_status ON mobile_deposits(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);

-- RLS (Row Level Security) Policies
ALTER TABLE banking_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE mobile_deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE unlock_requests ENABLE ROW LEVEL SECURITY;

-- Banking users policies
CREATE POLICY "Users can view own profile" ON banking_users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON banking_users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all users" ON banking_users FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM banking_users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);
CREATE POLICY "Admins can update all users" ON banking_users FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM banking_users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Accounts policies
CREATE POLICY "Users can view own accounts" ON accounts FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins can view all accounts" ON accounts FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM banking_users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);
CREATE POLICY "Admins can update all accounts" ON accounts FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM banking_users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Transactions policies
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (
  account_id IN (
    SELECT id FROM accounts WHERE user_id = auth.uid()
  )
);
CREATE POLICY "Users can create transactions" ON transactions FOR INSERT WITH CHECK (
  account_id IN (
    SELECT id FROM accounts WHERE user_id = auth.uid()
  )
);
CREATE POLICY "Admins can view all transactions" ON transactions FOR ALL USING (
  EXISTS (
    SELECT 1 FROM banking_users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Cards policies
CREATE POLICY "Users can view own cards" ON cards FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins can view all cards" ON cards FOR ALL USING (
  EXISTS (
    SELECT 1 FROM banking_users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Mobile deposits policies
CREATE POLICY "Users can view own deposits" ON mobile_deposits FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create deposits" ON mobile_deposits FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can view all deposits" ON mobile_deposits FOR ALL USING (
  EXISTS (
    SELECT 1 FROM banking_users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Support tickets policies
CREATE POLICY "Users can view own tickets" ON support_tickets FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create tickets" ON support_tickets FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can view all tickets" ON support_tickets FOR ALL USING (
  EXISTS (
    SELECT 1 FROM banking_users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Unlock requests policies
CREATE POLICY "Users can view own unlock requests" ON unlock_requests FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create unlock requests" ON unlock_requests FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can view all unlock requests" ON unlock_requests FOR ALL USING (
  EXISTS (
    SELECT 1 FROM banking_users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Functions for automatic account creation and balance updates
CREATE OR REPLACE FUNCTION create_user_accounts()
RETURNS TRIGGER AS $$
BEGIN
  -- Create checking account
  INSERT INTO accounts (user_id, account_number, account_type, balance)
  VALUES (
    NEW.id,
    'CHK-' || LPAD((RANDOM() * 999999999)::INTEGER::TEXT, 9, '0'),
    'checking',
    0.00
  );
  
  -- Create savings account
  INSERT INTO accounts (user_id, account_number, account_type, balance)
  VALUES (
    NEW.id,
    'SAV-' || LPAD((RANDOM() * 999999999)::INTEGER::TEXT, 9, '0'),
    'savings',
    0.00
  );
  
  -- Create debit card
  INSERT INTO cards (user_id, card_number, card_type, expiry_date)
  VALUES (
    NEW.id,
    '4532' || LPAD((RANDOM() * 999999999999)::BIGINT::TEXT, 12, '0'),
    'debit',
    TO_CHAR((NOW() + INTERVAL '4 years')::DATE, 'MM/YY')
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create accounts when user is created
CREATE TRIGGER trigger_create_user_accounts
  AFTER INSERT ON banking_users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_accounts();

-- Function to update account balance when transactions are added
CREATE OR REPLACE FUNCTION update_account_balance()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.type = 'credit' THEN
    UPDATE accounts 
    SET balance = balance + NEW.amount,
        updated_at = NOW()
    WHERE id = NEW.account_id;
  ELSIF NEW.type = 'debit' THEN
    UPDATE accounts 
    SET balance = balance - NEW.amount,
        updated_at = NOW()
    WHERE id = NEW.account_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update balance when transactions are added
CREATE TRIGGER trigger_update_account_balance
  AFTER INSERT ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_account_balance();

-- Function to automatically approve mobile deposits (for demo purposes)
-- In production, this would be a manual admin process
CREATE OR REPLACE FUNCTION auto_process_deposit()
RETURNS TRIGGER AS $$
BEGIN
  -- Only auto-approve small amounts for demo
  IF NEW.amount <= 500.00 THEN
    -- Update deposit status
    UPDATE mobile_deposits 
    SET status = 'approved',
        processed_at = NOW(),
        admin_notes = 'Auto-approved (demo mode)'
    WHERE id = NEW.id;
    
    -- Create credit transaction
    INSERT INTO transactions (account_id, type, amount, description, category)
    VALUES (
      NEW.account_id,
      'credit',
      NEW.amount,
      'Mobile deposit - Check #' || NEW.id,
      'deposit'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auto-processing deposits
CREATE TRIGGER trigger_auto_process_deposit
  AFTER INSERT ON mobile_deposits
  FOR EACH ROW
  EXECUTE FUNCTION auto_process_deposit();

-- Insert default admin user (you'll need to update this with your actual admin user ID)
-- INSERT INTO banking_users (id, email, name, role, email_verified)
-- VALUES ('00000000-0000-0000-0000-000000000000', 'admin@firstcitycu.com', 'Admin User', 'admin', true)
-- ON CONFLICT (id) DO NOTHING;
