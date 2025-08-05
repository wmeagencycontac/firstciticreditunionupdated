import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Real-time subscription management
export class RealtimeManager {
  private subscriptions: Map<string, any> = new Map();

  // Subscribe to live transaction updates
  subscribeToTransactions(userId: string, callback: (payload: any) => void) {
    const channelName = `transactions:${userId}`;

    if (this.subscriptions.has(channelName)) {
      return this.subscriptions.get(channelName);
    }

    const subscription = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "transactions",
          filter: `account_id=in.(select id from accounts where user_id=eq.${userId})`,
        },
        callback,
      )
      .subscribe();

    this.subscriptions.set(channelName, subscription);
    return subscription;
  }

  // Subscribe to account balance updates
  subscribeToAccounts(userId: string, callback: (payload: any) => void) {
    const channelName = `accounts:${userId}`;

    if (this.subscriptions.has(channelName)) {
      return this.subscriptions.get(channelName);
    }

    const subscription = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "accounts",
          filter: `user_id=eq.${userId}`,
        },
        callback,
      )
      .subscribe();

    this.subscriptions.set(channelName, subscription);
    return subscription;
  }

  // Unsubscribe from a specific channel
  unsubscribe(channelName: string) {
    const subscription = this.subscriptions.get(channelName);
    if (subscription) {
      supabase.removeChannel(subscription);
      this.subscriptions.delete(channelName);
    }
  }

  // Unsubscribe from all channels
  unsubscribeAll() {
    this.subscriptions.forEach((subscription) => {
      supabase.removeChannel(subscription);
    });
    this.subscriptions.clear();
  }
}

// Create a global instance
export const realtimeManager = new RealtimeManager();

// Authentication helpers
export const auth = {
  // Sign up new user
  async signUp(
    email: string,
    password: string,
    name: string,
    bio?: string,
    picture?: string,
  ) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          bio,
          picture,
        },
      },
    });
    return { data, error };
  },

  // Sign in user
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  // Sign out user
  async signOut() {
    // Clean up realtime subscriptions
    realtimeManager.unsubscribeAll();

    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get current user
  async getUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    return { user, error };
  },

  // Listen for auth state changes
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },

  // Reset password
  async resetPassword(email: string, redirectTo?: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectTo || `${window.location.origin}/reset-password-confirm`,
    });
    return { data, error };
  },

  // Update password
  async updatePassword(password: string) {
    const { data, error } = await supabase.auth.updateUser({
      password: password
    });
    return { data, error };
  },

  // Sign out from other devices
  async signOutOthers() {
    const { error } = await supabase.auth.signOut({ scope: 'others' });
    return { error };
  },

  // Sign out from all devices
  async signOutEverywhere() {
    const { error } = await supabase.auth.signOut({ scope: 'global' });
    return { error };
  },
};

// Database helpers with type safety
export const db = {
  // Get user's accounts
  async getAccounts(userId: string) {
    const { data, error } = await supabase
      .from("accounts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    return { data, error };
  },

  // Get transactions for a specific account or all user accounts
  async getTransactions(userId: string, accountId?: number, limit = 50) {
    let query = supabase
      .from("transactions")
      .select(
        `
        *,
        accounts!inner(user_id, account_number, account_type)
      `,
      )
      .eq("accounts.user_id", userId)
      .order("timestamp", { ascending: false })
      .limit(limit);

    if (accountId) {
      query = query.eq("account_id", accountId);
    }

    const { data, error } = await query;
    return { data, error };
  },

  // Get user's cards
  async getCards(userId: string) {
    const { data, error } = await supabase
      .from("cards")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    return { data, error };
  },

  // Get user's banking profile
  async getBankingProfile(userId: string) {
    const { data, error } = await supabase
      .from("banking_users")
      .select("*")
      .eq("id", userId)
      .single();

    return { data, error };
  },
};

// Export types
export type Account = {
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

export type Transaction = {
  id: number;
  account_id: number;
  type: "credit" | "debit";
  amount: number;
  description: string;
  timestamp: string;
};

export type Card = {
  id: number;
  user_id: string;
  card_number: string;
  status: "active" | "inactive" | "blocked";
  created_at: string;
};

export type BankingUser = {
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
