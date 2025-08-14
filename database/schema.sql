-- Fusion Bank Production Database Schema
-- Comprehensive banking platform with security, encryption, and compliance

-- Enable Row Level Security and required extensions
ALTER DATABASE postgres SET log_statement = 'all';
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- USERS & AUTHENTICATION
-- =============================================

-- Extend auth.users with banking profile
CREATE TABLE IF NOT EXISTS public.banking_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  bio TEXT,
  picture TEXT,
  
  -- PII Fields (encrypted at application level)
  phone_number_encrypted TEXT,
  ssn_encrypted TEXT,
  date_of_birth_encrypted TEXT,
  
  -- Address (encrypted at application level)
  street_encrypted TEXT,
  city_encrypted TEXT,
  state_encrypted TEXT,
  zip_code_encrypted TEXT,
  
  -- Banking metadata
  account_type TEXT CHECK (account_type IN ('personal', 'business')) DEFAULT 'personal',
  email_verified BOOLEAN DEFAULT FALSE,
  kyc_status TEXT CHECK (kyc_status IN ('pending', 'in_review', 'approved', 'rejected')) DEFAULT 'pending',
  role TEXT CHECK (role IN ('user', 'admin')) DEFAULT 'user',
  
  -- Compliance
  terms_accepted_at TIMESTAMP WITH TIME ZONE,
  privacy_accepted_at TIMESTAMP WITH TIME ZONE,
  marketing_opted_in BOOLEAN DEFAULT FALSE,
  
  -- Status
  account_locked BOOLEAN DEFAULT FALSE,
  locked_reason TEXT,
  locked_at TIMESTAMP WITH TIME ZONE,
  
  -- Audit
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE
);

-- =============================================
-- ACCOUNTS & BANKING
-- =============================================

-- Bank accounts
CREATE TABLE IF NOT EXISTS public.accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.banking_users(id) ON DELETE CASCADE,
  
  -- Account details
  account_number TEXT UNIQUE NOT NULL,
  routing_number TEXT NOT NULL DEFAULT '031100209', -- Fusion Bank routing
  account_type TEXT CHECK (account_type IN ('checking', 'savings', 'business_checking')) NOT NULL,
  nickname TEXT,
  
  -- Balance and limits
  balance DECIMAL(15,2) DEFAULT 0.00,
  available_balance DECIMAL(15,2) DEFAULT 0.00,
  pending_balance DECIMAL(15,2) DEFAULT 0.00,
  daily_withdrawal_limit DECIMAL(10,2) DEFAULT 500.00,
  
  -- Status
  status TEXT CHECK (status IN ('active', 'suspended', 'closed', 'frozen')) DEFAULT 'active',
  currency TEXT DEFAULT 'USD',
  
  -- Metadata
  opened_date DATE DEFAULT CURRENT_DATE,
  closed_date DATE,
  last_activity_date DATE,
  
  -- Audit
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- TRANSACTIONS & TRANSFERS
-- =============================================

-- All financial transactions
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  
  -- Transaction details
  type TEXT CHECK (type IN ('credit', 'debit', 'transfer_in', 'transfer_out', 'fee', 'interest', 'deposit', 'withdrawal', 'mobile_deposit')) NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  balance_after DECIMAL(15,2) NOT NULL,
  
  -- Description and categorization
  description TEXT NOT NULL,
  category TEXT DEFAULT 'other',
  merchant_name TEXT,
  
  -- Transfer details (if applicable)
  transfer_id UUID,
  counterparty_account_id UUID REFERENCES public.accounts(id),
  counterparty_name TEXT,
  
  -- External transaction details
  external_transaction_id TEXT,
  external_provider TEXT, -- 'moov', 'gocardless', 'ach', 'wire'
  
  -- Status and processing
  status TEXT CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'reversed')) DEFAULT 'pending',
  pending_until TIMESTAMP WITH TIME ZONE,
  processed_at TIMESTAMP WITH TIME ZONE,
  
  -- Location and device (for security)
  transaction_location JSONB,
  device_fingerprint TEXT,
  ip_address INET,
  
  -- Audit
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transfers between accounts
CREATE TABLE IF NOT EXISTS public.transfers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Transfer details
  from_account_id UUID NOT NULL REFERENCES public.accounts(id),
  to_account_id UUID NOT NULL REFERENCES public.accounts(id),
  amount DECIMAL(15,2) NOT NULL,
  
  -- External transfers
  external_account_number TEXT,
  external_routing_number TEXT,
  external_account_holder TEXT,
  
  -- Description
  memo TEXT,
  purpose TEXT,
  
  -- Status
  status TEXT CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')) DEFAULT 'pending',
  
  -- Processing
  initiated_by UUID NOT NULL REFERENCES public.banking_users(id),
  approved_by UUID REFERENCES public.banking_users(id),
  external_reference_id TEXT,
  
  -- Audit
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- =============================================
-- CARDS & PAYMENTS
-- =============================================

-- Debit/Credit cards
CREATE TABLE IF NOT EXISTS public.cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.banking_users(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  
  -- Card details (encrypted)
  card_number_encrypted TEXT NOT NULL,
  card_number_last_four TEXT NOT NULL,
  cvv_encrypted TEXT NOT NULL,
  
  -- Card metadata
  card_type TEXT CHECK (card_type IN ('debit', 'credit')) DEFAULT 'debit',
  card_brand TEXT CHECK (card_brand IN ('visa', 'mastercard', 'amex', 'discover')) DEFAULT 'visa',
  nickname TEXT,
  
  -- Expiration
  expiry_month INTEGER CHECK (expiry_month BETWEEN 1 AND 12),
  expiry_year INTEGER CHECK (expiry_year >= EXTRACT(YEAR FROM CURRENT_DATE)),
  
  -- Status and limits
  status TEXT CHECK (status IN ('active', 'suspended', 'expired', 'lost', 'stolen', 'cancelled')) DEFAULT 'active',
  daily_limit DECIMAL(10,2) DEFAULT 1000.00,
  monthly_limit DECIMAL(10,2) DEFAULT 5000.00,
  
  -- Security
  pin_hash TEXT,
  contactless_enabled BOOLEAN DEFAULT TRUE,
  international_enabled BOOLEAN DEFAULT FALSE,
  
  -- Audit
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  activated_at TIMESTAMP WITH TIME ZONE,
  last_used_at TIMESTAMP WITH TIME ZONE
);

-- =============================================
-- KYC & DOCUMENT MANAGEMENT
-- =============================================

-- KYC documents and verification
CREATE TABLE IF NOT EXISTS public.kyc_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.banking_users(id) ON DELETE CASCADE,
  
  -- Document details
  document_type TEXT CHECK (document_type IN ('drivers_license', 'passport', 'state_id', 'selfie', 'proof_of_address', 'ssn_card')) NOT NULL,
  file_path_encrypted TEXT NOT NULL, -- Stored in secure vault
  file_hash TEXT NOT NULL,
  file_size_bytes INTEGER,
  mime_type TEXT,
  
  -- Verification
  verification_status TEXT CHECK (verification_status IN ('pending', 'verified', 'rejected', 'expired')) DEFAULT 'pending',
  verification_provider TEXT, -- 'manual', 'jumio', 'onfido', 'face_api'
  verification_reference_id TEXT,
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID REFERENCES public.banking_users(id),
  
  -- Rejection details
  rejection_reason TEXT,
  rejection_notes TEXT,
  
  -- Expiration
  expires_at TIMESTAMP WITH TIME ZONE,
  
  -- Audit
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- MOBILE DEPOSITS
-- =============================================

-- Mobile check deposits
CREATE TABLE IF NOT EXISTS public.mobile_deposits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.banking_users(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  
  -- Check details
  check_amount DECIMAL(10,2) NOT NULL,
  check_date DATE,
  check_number TEXT,
  bank_name TEXT,
  
  -- Images (encrypted paths)
  front_image_encrypted TEXT NOT NULL,
  back_image_encrypted TEXT NOT NULL,
  front_image_hash TEXT NOT NULL,
  back_image_hash TEXT NOT NULL,
  
  -- Processing
  status TEXT CHECK (status IN ('pending', 'processing', 'approved', 'rejected', 'funds_available')) DEFAULT 'pending',
  processed_by UUID REFERENCES public.banking_users(id),
  processed_at TIMESTAMP WITH TIME ZONE,
  funds_available_at TIMESTAMP WITH TIME ZONE,
  
  -- Hold information
  hold_amount DECIMAL(10,2) DEFAULT 0.00,
  hold_release_date DATE,
  
  -- Rejection details
  rejection_reason TEXT,
  rejection_notes TEXT,
  
  -- Transaction reference
  transaction_id UUID REFERENCES public.transactions(id),
  
  -- Audit
  deposited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ADMIN & AUDIT
-- =============================================

-- Admin audit log
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES public.banking_users(id),
  
  -- Action details
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL, -- 'user', 'account', 'transaction', 'card', etc.
  resource_id UUID,
  
  -- Changes
  old_values JSONB,
  new_values JSONB,
  
  -- Context
  ip_address INET,
  user_agent TEXT,
  session_id TEXT,
  
  -- Target user (if applicable)
  target_user_id UUID REFERENCES public.banking_users(id),
  
  -- Audit
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.banking_users(id) ON DELETE CASCADE,
  
  -- Notification details
  type TEXT CHECK (type IN ('transaction', 'security', 'kyc', 'promotion', 'system')) NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  
  -- Status
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  
  -- Channel preferences
  sent_via_email BOOLEAN DEFAULT FALSE,
  sent_via_push BOOLEAN DEFAULT FALSE,
  sent_via_sms BOOLEAN DEFAULT FALSE,
  
  -- Related entities
  related_transaction_id UUID REFERENCES public.transactions(id),
  related_account_id UUID REFERENCES public.accounts(id),
  
  -- Audit
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- User indexes
CREATE INDEX IF NOT EXISTS idx_banking_users_email ON public.banking_users(email);
CREATE INDEX IF NOT EXISTS idx_banking_users_role ON public.banking_users(role);
CREATE INDEX IF NOT EXISTS idx_banking_users_kyc_status ON public.banking_users(kyc_status);

-- Account indexes
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON public.accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_accounts_account_number ON public.accounts(account_number);
CREATE INDEX IF NOT EXISTS idx_accounts_status ON public.accounts(status);

-- Transaction indexes
CREATE INDEX IF NOT EXISTS idx_transactions_account_id ON public.transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_timestamp ON public.transactions(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON public.transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_transfer_id ON public.transactions(transfer_id);

-- Transfer indexes
CREATE INDEX IF NOT EXISTS idx_transfers_from_account ON public.transfers(from_account_id);
CREATE INDEX IF NOT EXISTS idx_transfers_to_account ON public.transfers(to_account_id);
CREATE INDEX IF NOT EXISTS idx_transfers_status ON public.transfers(status);

-- Card indexes
CREATE INDEX IF NOT EXISTS idx_cards_user_id ON public.cards(user_id);
CREATE INDEX IF NOT EXISTS idx_cards_account_id ON public.cards(account_id);
CREATE INDEX IF NOT EXISTS idx_cards_last_four ON public.cards(card_number_last_four);

-- KYC indexes
CREATE INDEX IF NOT EXISTS idx_kyc_documents_user_id ON public.kyc_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_kyc_documents_status ON public.kyc_documents(verification_status);

-- Mobile deposit indexes
CREATE INDEX IF NOT EXISTS idx_mobile_deposits_user_id ON public.mobile_deposits(user_id);
CREATE INDEX IF NOT EXISTS idx_mobile_deposits_account_id ON public.mobile_deposits(account_id);
CREATE INDEX IF NOT EXISTS idx_mobile_deposits_status ON public.mobile_deposits(status);

-- Audit indexes
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_admin_id ON public.admin_audit_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_timestamp ON public.admin_audit_log(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_target_user ON public.admin_audit_log(target_user_id);

-- Notification indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications(type);

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.banking_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mobile_deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.banking_users 
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to get current user role
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
BEGIN
  RETURN COALESCE(
    (SELECT role FROM public.banking_users WHERE id = auth.uid()),
    'user'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- BANKING USERS POLICIES
CREATE POLICY "Users can view their own profile" ON public.banking_users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.banking_users
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can update their own profile" ON public.banking_users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can update any user" ON public.banking_users
  FOR UPDATE USING (public.is_admin(auth.uid()));

CREATE POLICY "Anyone can insert during signup" ON public.banking_users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ACCOUNTS POLICIES
CREATE POLICY "Users can access their own accounts" ON public.accounts
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can access all accounts" ON public.accounts
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can create their own accounts" ON public.accounts
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can create accounts for any user" ON public.accounts
  FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update any account" ON public.accounts
  FOR UPDATE USING (public.is_admin(auth.uid()));

-- TRANSACTIONS POLICIES
CREATE POLICY "Users can view their own transactions" ON public.transactions
  FOR SELECT USING (
    account_id IN (
      SELECT id FROM public.accounts WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all transactions" ON public.transactions
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can create transactions for their accounts" ON public.transactions
  FOR INSERT WITH CHECK (
    account_id IN (
      SELECT id FROM public.accounts WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can create transactions for any account" ON public.transactions
  FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

-- TRANSFERS POLICIES
CREATE POLICY "Users can view their own transfers" ON public.transfers
  FOR SELECT USING (
    from_account_id IN (
      SELECT id FROM public.accounts WHERE user_id = auth.uid()
    ) OR
    to_account_id IN (
      SELECT id FROM public.accounts WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all transfers" ON public.transfers
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can create transfers from their accounts" ON public.transfers
  FOR INSERT WITH CHECK (
    from_account_id IN (
      SELECT id FROM public.accounts WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can create any transfer" ON public.transfers
  FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

-- CARDS POLICIES
CREATE POLICY "Users can access their own cards" ON public.cards
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can access all cards" ON public.cards
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can request their own cards" ON public.cards
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can create cards for any user" ON public.cards
  FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

-- KYC DOCUMENTS POLICIES
CREATE POLICY "Users can access their own KYC documents" ON public.kyc_documents
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can access all KYC documents" ON public.kyc_documents
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can upload their own KYC documents" ON public.kyc_documents
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can update KYC document status" ON public.kyc_documents
  FOR UPDATE USING (public.is_admin(auth.uid()));

-- MOBILE DEPOSITS POLICIES
CREATE POLICY "Users can access their own mobile deposits" ON public.mobile_deposits
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can access all mobile deposits" ON public.mobile_deposits
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can create their own mobile deposits" ON public.mobile_deposits
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can update mobile deposit status" ON public.mobile_deposits
  FOR UPDATE USING (public.is_admin(auth.uid()));

-- ADMIN AUDIT LOG POLICIES
CREATE POLICY "Only admins can access audit logs" ON public.admin_audit_log
  FOR ALL USING (public.is_admin(auth.uid()));

-- NOTIFICATIONS POLICIES
CREATE POLICY "Users can access their own notifications" ON public.notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "System can create notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Function to generate unique account numbers
CREATE OR REPLACE FUNCTION public.generate_account_number(
  user_id_input UUID,
  account_type_input TEXT
)
RETURNS TEXT AS $$
DECLARE
  account_number TEXT;
  exists_check INTEGER;
BEGIN
  LOOP
    -- Generate account number: type prefix + 8 random digits
    account_number := CASE 
      WHEN account_type_input = 'checking' THEN '1'
      WHEN account_type_input = 'savings' THEN '2'
      WHEN account_type_input = 'business_checking' THEN '3'
      ELSE '1'
    END || LPAD(FLOOR(RANDOM() * 100000000)::TEXT, 8, '0');
    
    -- Check if account number already exists
    SELECT COUNT(*) INTO exists_check 
    FROM public.accounts 
    WHERE account_number = account_number;
    
    EXIT WHEN exists_check = 0;
  END LOOP;
  
  RETURN account_number;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to all tables
CREATE TRIGGER update_banking_users_updated_at BEFORE UPDATE ON public.banking_users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON public.accounts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_transfers_updated_at BEFORE UPDATE ON public.transfers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cards_updated_at BEFORE UPDATE ON public.cards
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_kyc_documents_updated_at BEFORE UPDATE ON public.kyc_documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mobile_deposits_updated_at BEFORE UPDATE ON public.mobile_deposits
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to automatically update account balance after transaction
CREATE OR REPLACE FUNCTION public.update_account_balance()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the account balance based on transaction type
  IF NEW.status = 'completed' THEN
    IF NEW.type IN ('credit', 'deposit', 'transfer_in', 'interest') THEN
      UPDATE public.accounts 
      SET balance = balance + NEW.amount,
          available_balance = available_balance + NEW.amount,
          last_activity_date = CURRENT_DATE,
          updated_at = NOW()
      WHERE id = NEW.account_id;
    ELSIF NEW.type IN ('debit', 'withdrawal', 'transfer_out', 'fee') THEN
      UPDATE public.accounts 
      SET balance = balance - NEW.amount,
          available_balance = available_balance - NEW.amount,
          last_activity_date = CURRENT_DATE,
          updated_at = NOW()
      WHERE id = NEW.account_id;
    END IF;
    
    -- Update the balance_after field
    UPDATE public.transactions 
    SET balance_after = (
      SELECT balance FROM public.accounts WHERE id = NEW.account_id
    )
    WHERE id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply balance update trigger
CREATE TRIGGER update_balance_after_transaction 
  AFTER INSERT OR UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_account_balance();

-- =============================================
-- INITIAL DATA & SETUP
-- =============================================

-- Insert default admin user (only if doesn't exist)
-- This will be created through the application during admin setup
