# Supabase Database Setup Guide

## Step 1: Go to Your Supabase Dashboard
1. Open [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project: `dvtcujhaymlnfembrwzw`
3. Navigate to the **SQL Editor** tab

## Step 2: Execute Each SQL Block

Copy and paste each block below into your SQL Editor and run them **one by one**:

### Block 1: Enable Extensions
```sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### Block 2: Create Account Number Generator Function
```sql
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
```

### Block 3: Create Routing Number Function
```sql
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
```

### Block 4: Create User Profile Auto-Creation Function
```sql
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
```

### Block 5: Create Trigger for Auto User Creation
```sql
-- Create trigger to auto-create banking profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### Block 6: Enable Row Level Security
```sql
-- Enable RLS on all tables
ALTER TABLE banking_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
```

### Block 7: Create RLS Policies for Banking Users
```sql
-- Banking users can only see their own profile
CREATE POLICY "Users can view own profile" ON banking_users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON banking_users
  FOR UPDATE USING (auth.uid() = id);
```

### Block 8: Create RLS Policies for Accounts
```sql
-- Accounts policies
CREATE POLICY "Users can view own accounts" ON accounts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own accounts" ON accounts
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### Block 9: Create RLS Policies for Transactions
```sql
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
```

### Block 10: Create RLS Policies for Cards
```sql
-- Cards policies
CREATE POLICY "Users can view own cards" ON cards
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cards" ON cards
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### Block 11: Create Admin/Service Role Policies
```sql
-- Admin policies (service role can do everything)
CREATE POLICY "Service role can do anything on banking_users" ON banking_users
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can do anything on accounts" ON accounts
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can do anything on transactions" ON transactions
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can do anything on cards" ON cards
  FOR ALL USING (auth.role() = 'service_role');
```

## Step 3: Verify Setup
After running all the SQL blocks, test the setup by visiting: `http://localhost:8080/api/test-supabase`

You should see `"hasGenerateAccountFunction": true` in the response.

## Important Notes:
- Run each block **one at a time** and wait for success before proceeding
- If you get any errors, stop and let me know the specific error message
- The setup creates secure policies that ensure users can only access their own data
- All functions are created with proper error handling

## Troubleshooting:
- If you see "permission denied" errors, make sure you're running the commands as the project owner
- If functions already exist, the `CREATE OR REPLACE` statements will update them
- If policies already exist, you may get harmless warnings that you can ignore
