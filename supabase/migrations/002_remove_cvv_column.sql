-- SECURITY MIGRATION: Remove CVV column from cards table
-- CVV data should never be stored in the database for PCI compliance
-- This migration removes the CVV column from both Supabase and legacy schemas

-- Remove CVV column from cards table if it exists
ALTER TABLE cards DROP COLUMN IF EXISTS cvv;

-- Remove CVV-related columns from enhanced cards table if it exists  
ALTER TABLE cards DROP COLUMN IF EXISTS cvv_encrypted;

-- Add comment for security audit trail
COMMENT ON TABLE cards IS 'Cards table - CVV data removed for PCI compliance and security';

-- Log this security action in audit_logs if the table exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'audit_logs') THEN
        INSERT INTO audit_logs (
            action, 
            resource_type, 
            details,
            created_at
        ) VALUES (
            'cvv_column_removed',
            'cards_table',
            jsonb_build_object(
                'reason', 'PCI compliance and security',
                'migration', '002_remove_cvv_column.sql',
                'timestamp', NOW()
            ),
            NOW()
        );
    END IF;
END $$;
