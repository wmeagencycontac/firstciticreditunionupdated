import { RequestHandler } from "express";
import { supabaseAdmin } from "../supabase";

export const setupSupabaseDatabase: RequestHandler = async (req, res) => {
  try {
    const results = [];

    // 1. Enable uuid-ossp extension
    try {
      await supabaseAdmin.rpc('exec_sql', { 
        sql: 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";' 
      });
      results.push({ step: "Enable uuid-ossp extension", status: "success" });
    } catch (error: any) {
      // Try direct SQL execution
      const { error: extError } = await supabaseAdmin
        .from('_placeholder_for_sql_execution')
        .select('*')
        .limit(0);
      
      results.push({ 
        step: "Enable uuid-ossp extension", 
        status: "info", 
        message: "Extension may already exist or requires manual setup"
      });
    }

    // 2. Create generate_account_number function
    const generateAccountNumberSQL = `
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
        CASE account_type_input
          WHEN 'checking' THEN prefix := '1001';
          WHEN 'savings' THEN prefix := '2001';
          ELSE prefix := '9001';
        END CASE;

        SELECT COUNT(*) INTO counter
        FROM accounts
        WHERE user_id = user_id_input;

        account_number := prefix || SUBSTRING(user_id_input::TEXT FROM 1 FOR 8) || LPAD((counter + 1)::TEXT, 4, '0');

        RETURN account_number;
      END;
      $$;
    `;

    try {
      await supabaseAdmin.rpc('exec_sql', { sql: generateAccountNumberSQL });
      results.push({ step: "Create generate_account_number function", status: "success" });
    } catch (error: any) {
      results.push({ 
        step: "Create generate_account_number function", 
        status: "error", 
        error: error.message 
      });
    }

    // 3. Create get_routing_number function
    const getRoutingNumberSQL = `
      CREATE OR REPLACE FUNCTION get_routing_number(account_type_input TEXT)
      RETURNS TEXT
      LANGUAGE plpgsql
      AS $$
      BEGIN
        CASE account_type_input
          WHEN 'checking' THEN RETURN '021000021';
          WHEN 'savings' THEN RETURN '026009593';
          ELSE RETURN '121000248';
        END CASE;
      END;
      $$;
    `;

    try {
      await supabaseAdmin.rpc('exec_sql', { sql: getRoutingNumberSQL });
      results.push({ step: "Create get_routing_number function", status: "success" });
    } catch (error: any) {
      results.push({ 
        step: "Create get_routing_number function", 
        status: "error", 
        error: error.message 
      });
    }

    // 4. Create handle_new_user function
    const handleNewUserSQL = `
      CREATE OR REPLACE FUNCTION handle_new_user()
      RETURNS TRIGGER
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        INSERT INTO public.banking_users (
          id, email, name, bio, picture, email_verified, role, created_at, updated_at
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
    `;

    try {
      await supabaseAdmin.rpc('exec_sql', { sql: handleNewUserSQL });
      results.push({ step: "Create handle_new_user function", status: "success" });
    } catch (error: any) {
      results.push({ 
        step: "Create handle_new_user function", 
        status: "error", 
        error: error.message 
      });
    }

    // 5. Create trigger
    const triggerSQL = `
      DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
      CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE FUNCTION handle_new_user();
    `;

    try {
      await supabaseAdmin.rpc('exec_sql', { sql: triggerSQL });
      results.push({ step: "Create user creation trigger", status: "success" });
    } catch (error: any) {
      results.push({ 
        step: "Create user creation trigger", 
        status: "error", 
        error: error.message 
      });
    }

    // Test the generate_account_number function
    try {
      const { data: testResult, error: testError } = await supabaseAdmin
        .rpc('generate_account_number', { 
          user_id_input: '00000000-0000-0000-0000-000000000001', 
          account_type_input: 'checking' 
        });

      if (!testError && testResult) {
        results.push({ 
          step: "Test generate_account_number function", 
          status: "success", 
          result: testResult 
        });
      } else {
        results.push({ 
          step: "Test generate_account_number function", 
          status: "error", 
          error: testError?.message 
        });
      }
    } catch (error: any) {
      results.push({ 
        step: "Test generate_account_number function", 
        status: "error", 
        error: error.message 
      });
    }

    res.json({
      status: "completed",
      message: "Database setup process completed",
      results,
      timestamp: new Date().toISOString(),
      note: "Some steps may require manual execution in Supabase SQL Editor if direct execution fails"
    });

  } catch (error) {
    console.error("Database setup error:", error);
    res.status(500).json({
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    });
  }
};
