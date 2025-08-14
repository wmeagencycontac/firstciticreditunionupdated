import { RequestHandler } from "express";
import { supabaseAdmin } from "../supabase";

export const testSupabaseConnection: RequestHandler = async (req, res) => {
  try {
    // Test basic connection
    const { data: healthCheck, error: healthError } = await supabaseAdmin
      .from("health_check")
      .select("*")
      .limit(1);

    // Check if core tables exist
    const tables = [
      "banking_users",
      "accounts", 
      "transactions",
      "cards"
    ];

    const tableChecks = await Promise.allSettled(
      tables.map(async (table) => {
        const { data, error } = await supabaseAdmin
          .from(table)
          .select("count", { count: "exact", head: true });
        
        return {
          table,
          exists: !error,
          error: error?.message,
          count: data || 0
        };
      })
    );

    const results = tableChecks.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          table: tables[index],
          exists: false,
          error: result.reason?.message || "Unknown error"
        };
      }
    });

    // Test if we can create a database function (if needed)
    const { data: functionData, error: functionError } = await supabaseAdmin
      .rpc('generate_account_number', { 
        user_id_input: 'test', 
        account_type_input: 'checking' 
      });

    res.json({
      status: "connected",
      url: process.env.SUPABASE_URL,
      tables: results,
      hasGenerateAccountFunction: !functionError,
      functionError: functionError?.message,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Supabase connection test error:", error);
    res.status(500).json({
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    });
  }
};
