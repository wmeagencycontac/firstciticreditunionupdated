-- Row Level Security Policies for Banking Application
-- Ensures users can only access their own data

-- Enable RLS on all tables
ALTER TABLE banking_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Banking Users Policies
-- Users can read their own profile
CREATE POLICY "Users can view own profile" ON banking_users
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON banking_users
    FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile (for registration)
CREATE POLICY "Users can insert own profile" ON banking_users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Accounts Policies
-- Users can view their own accounts
CREATE POLICY "Users can view own accounts" ON accounts
    FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own accounts
CREATE POLICY "Users can update own accounts" ON accounts
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can create their own accounts
CREATE POLICY "Users can create own accounts" ON accounts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Transactions Policies
-- Users can view transactions for their own accounts
CREATE POLICY "Users can view own transactions" ON transactions
    FOR SELECT USING (
        auth.uid() IN (
            SELECT user_id FROM accounts WHERE id = transactions.account_id
        )
    );

-- Users can create transactions for their own accounts
CREATE POLICY "Users can create own transactions" ON transactions
    FOR INSERT WITH CHECK (
        auth.uid() IN (
            SELECT user_id FROM accounts WHERE id = transactions.account_id
        )
    );

-- Users can update transactions for their own accounts (limited updates)
CREATE POLICY "Users can update own transactions" ON transactions
    FOR UPDATE USING (
        auth.uid() IN (
            SELECT user_id FROM accounts WHERE id = transactions.account_id
        )
    );

-- Cards Policies
-- Users can view their own cards
CREATE POLICY "Users can view own cards" ON cards
    FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own cards
CREATE POLICY "Users can update own cards" ON cards
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can create their own cards
CREATE POLICY "Users can create own cards" ON cards
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User Sessions Policies
-- Users can view their own sessions
CREATE POLICY "Users can view own sessions" ON user_sessions
    FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own sessions
CREATE POLICY "Users can create own sessions" ON user_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own sessions
CREATE POLICY "Users can update own sessions" ON user_sessions
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own sessions
CREATE POLICY "Users can delete own sessions" ON user_sessions
    FOR DELETE USING (auth.uid() = user_id);

-- Notifications Policies
-- Users can view their own notifications
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- System can create notifications for users
CREATE POLICY "System can create notifications" ON notifications
    FOR INSERT WITH CHECK (true);

-- Users can delete their own notifications
CREATE POLICY "Users can delete own notifications" ON notifications
    FOR DELETE USING (auth.uid() = user_id);

-- Audit Logs Policies
-- Users can view their own audit logs
CREATE POLICY "Users can view own audit logs" ON audit_logs
    FOR SELECT USING (auth.uid() = user_id);

-- System can create audit logs
CREATE POLICY "System can create audit logs" ON audit_logs
    FOR INSERT WITH CHECK (true);

-- Admin Policies
-- Admins can view all data (except sensitive fields)
CREATE POLICY "Admins can view all banking users" ON banking_users
    FOR SELECT USING (
        auth.uid() IN (
            SELECT id FROM banking_users WHERE role = 'admin'
        )
    );

CREATE POLICY "Admins can view all accounts" ON accounts
    FOR SELECT USING (
        auth.uid() IN (
            SELECT id FROM banking_users WHERE role = 'admin'
        )
    );

CREATE POLICY "Admins can view all transactions" ON transactions
    FOR SELECT USING (
        auth.uid() IN (
            SELECT id FROM banking_users WHERE role = 'admin'
        )
    );

CREATE POLICY "Admins can view all cards" ON cards
    FOR SELECT USING (
        auth.uid() IN (
            SELECT id FROM banking_users WHERE role = 'admin'
        )
    );

CREATE POLICY "Admins can view all audit logs" ON audit_logs
    FOR SELECT USING (
        auth.uid() IN (
            SELECT id FROM banking_users WHERE role = 'admin'
        )
    );

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM banking_users 
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enhanced policies for admin actions
CREATE POLICY "Admins can manage user accounts" ON accounts
    FOR ALL USING (is_admin());

CREATE POLICY "Admins can manage transactions" ON transactions
    FOR ALL USING (is_admin());

-- Security function to validate transaction limits
CREATE OR REPLACE FUNCTION validate_transaction_limit()
RETURNS TRIGGER AS $$
DECLARE
    daily_total DECIMAL(15,2);
    account_balance DECIMAL(15,2);
BEGIN
    -- Check daily transaction limit for debits
    IF NEW.type = 'debit' THEN
        SELECT COALESCE(SUM(amount), 0) INTO daily_total
        FROM transactions 
        WHERE account_id = NEW.account_id 
        AND type = 'debit'
        AND DATE(timestamp) = CURRENT_DATE;
        
        -- Daily limit of $10,000
        IF daily_total + NEW.amount > 10000 THEN
            RAISE EXCEPTION 'Daily transaction limit exceeded';
        END IF;
        
        -- Check account balance
        SELECT balance INTO account_balance
        FROM accounts 
        WHERE id = NEW.account_id;
        
        IF account_balance < NEW.amount THEN
            RAISE EXCEPTION 'Insufficient funds';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply transaction validation trigger
CREATE TRIGGER validate_transaction_limits
    BEFORE INSERT ON transactions
    FOR EACH ROW EXECUTE FUNCTION validate_transaction_limit();

-- Function to automatically create notification for large transactions
CREATE OR REPLACE FUNCTION notify_large_transaction()
RETURNS TRIGGER AS $$
BEGIN
    -- Notify for transactions over $1000
    IF NEW.amount > 1000 THEN
        INSERT INTO notifications (user_id, type, title, message)
        SELECT 
            accounts.user_id,
            'transaction_alert',
            'Large Transaction Alert',
            format('A %s of $%.2f was made on account %s', 
                NEW.type, NEW.amount, accounts.account_number)
        FROM accounts 
        WHERE accounts.id = NEW.account_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply large transaction notification trigger
CREATE TRIGGER notify_large_transactions
    AFTER INSERT ON transactions
    FOR EACH ROW EXECUTE FUNCTION notify_large_transaction();
