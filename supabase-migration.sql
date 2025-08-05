-- Supabase Banking Application Schema Migration
-- Run this in your Supabase SQL Editor

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create banking users table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.banking_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  bio TEXT,
  picture TEXT,
  email_verified BOOLEAN DEFAULT false,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on banking_users
ALTER TABLE public.banking_users ENABLE ROW LEVEL SECURITY;

-- Banking accounts table
CREATE TABLE IF NOT EXISTS public.accounts (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_number TEXT UNIQUE NOT NULL,
  account_type TEXT NOT NULL CHECK (account_type IN ('savings', 'checking')),
  balance DECIMAL(10,2) DEFAULT 0.00,
  currency TEXT DEFAULT 'USD',
  routing_number TEXT DEFAULT '322078972',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on accounts
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;

-- Transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
  id BIGSERIAL PRIMARY KEY,
  account_id BIGINT NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('credit', 'debit')),
  amount DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on transactions
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Cards table
CREATE TABLE IF NOT EXISTS public.cards (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  card_number TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'blocked')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on cards
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;

-- Email verification tokens table
CREATE TABLE IF NOT EXISTS public.verifications (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at BIGINT NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on verifications
ALTER TABLE public.verifications ENABLE ROW LEVEL SECURITY;

-- User sessions table (for custom session management if needed)
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at BIGINT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on user_sessions
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_banking_users_email ON public.banking_users(email);
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON public.accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_accounts_number ON public.accounts(account_number);
CREATE INDEX IF NOT EXISTS idx_transactions_account_id ON public.transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_timestamp ON public.transactions(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_cards_user_id ON public.cards(user_id);
CREATE INDEX IF NOT EXISTS idx_cards_number ON public.cards(card_number);

-- Create RLS policies

-- Banking users policies
CREATE POLICY "Users can view their own banking profile" ON public.banking_users
  FOR SELECT USING ((SELECT auth.uid()) = id);

CREATE POLICY "Users can update their own banking profile" ON public.banking_users
  FOR UPDATE USING ((SELECT auth.uid()) = id);

-- Accounts policies
CREATE POLICY "Users can view their own accounts" ON public.accounts
  FOR SELECT USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can create their own accounts" ON public.accounts
  FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update their own accounts" ON public.accounts
  FOR UPDATE USING ((SELECT auth.uid()) = user_id);

-- Transactions policies
CREATE POLICY "Users can view transactions for their accounts" ON public.transactions
  FOR SELECT USING (
    account_id IN (
      SELECT id FROM public.accounts WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "System can create transactions" ON public.transactions
  FOR INSERT WITH CHECK (true); -- Will be restricted via server-side logic

-- Cards policies
CREATE POLICY "Users can view their own cards" ON public.cards
  FOR SELECT USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can create their own cards" ON public.cards
  FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update their own cards" ON public.cards
  FOR UPDATE USING ((SELECT auth.uid()) = user_id);

-- Verification policies (admin/system use)
CREATE POLICY "Users can view their own verifications" ON public.verifications
  FOR SELECT USING ((SELECT auth.uid()) = user_id);

-- Session policies
CREATE POLICY "Users can view their own sessions" ON public.user_sessions
  FOR SELECT USING ((SELECT auth.uid()) = user_id);

-- Functions for account and card number generation
CREATE OR REPLACE FUNCTION generate_account_number(user_id_input UUID, account_type_input TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  member_id TEXT;
  share_number TEXT;
BEGIN
  -- Convert UUID to a numeric representation (take first 5 chars after removing hyphens)
  member_id := LPAD(
    (ABS(HASHTEXT(user_id_input::TEXT)) % 99999)::TEXT, 
    5, '0'
  );
  
  IF account_type_input = 'savings' THEN
    -- Savings: [memberID][00][shareNumber] → e.g. `1234560001`
    share_number := '0001';
    RETURN member_id || '00' || share_number;
  ELSE
    -- Checking: member number with type code
    RETURN member_id || '10';
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION generate_card_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  bin TEXT := '4111';
  middle TEXT;
  check_digit TEXT;
BEGIN
  -- Generate random middle digits
  middle := LPAD((RANDOM() * 999999999999)::BIGINT::TEXT, 12, '0');
  
  -- Simple checksum
  check_digit := (RANDOM() * 9)::INT::TEXT;
  
  RETURN bin || middle || check_digit;
END;
$$;

-- Function to create banking profile after user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.banking_users (id, email, name, email_verified, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    NEW.email_confirmed_at IS NOT NULL,
    'user'
  );
  RETURN NEW;
END;
$$;

-- Trigger to automatically create banking profile
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create Realtime subscription for live transaction feeds
-- You can subscribe to these in your frontend for real-time updates
SELECT realtime.publication_add_table('transactions');
SELECT realtime.publication_add_table('accounts');
