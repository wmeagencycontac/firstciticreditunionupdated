import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";

// Service role client for admin operations (server-side only)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Regular client for authenticated users
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types (you'll need to generate these from your Supabase project)
export interface Database {
  public: {
    Tables: {
      banking_users: {
        Row: {
          id: string;
          email: string;
          name: string;
          bio: string | null;
          picture: string | null;
          email_verified: boolean;
          role: "user" | "admin";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          bio?: string | null;
          picture?: string | null;
          email_verified?: boolean;
          role?: "user" | "admin";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          bio?: string | null;
          picture?: string | null;
          email_verified?: boolean;
          role?: "user" | "admin";
          created_at?: string;
          updated_at?: string;
        };
      };
      accounts: {
        Row: {
          id: number;
          user_id: string;
          account_number: string;
          account_type: "savings" | "checking";
          balance: number;
          currency: string;
          routing_number: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          account_number: string;
          account_type: "savings" | "checking";
          balance?: number;
          currency?: string;
          routing_number?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          account_number?: string;
          account_type?: "savings" | "checking";
          balance?: number;
          currency?: string;
          routing_number?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      transactions: {
        Row: {
          id: number;
          account_id: number;
          type: "credit" | "debit";
          amount: number;
          description: string;
          timestamp: string;
        };
        Insert: {
          id?: number;
          account_id: number;
          type: "credit" | "debit";
          amount: number;
          description: string;
          timestamp?: string;
        };
        Update: {
          id?: number;
          account_id?: number;
          type?: "credit" | "debit";
          amount?: number;
          description?: string;
          timestamp?: string;
        };
      };
      cards: {
        Row: {
          id: number;
          user_id: string;
          card_number: string;
          status: "active" | "inactive" | "blocked";
          created_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          card_number: string;
          status?: "active" | "inactive" | "blocked";
          created_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          card_number?: string;
          status?: "active" | "inactive" | "blocked";
          created_at?: string;
        };
      };
    };
  };
}
