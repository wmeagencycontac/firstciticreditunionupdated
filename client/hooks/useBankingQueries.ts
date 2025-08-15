import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useUIStore } from "@/store/useUIStore";
import type { Account, Transaction, Card, BankingUser } from "@/lib/supabase";

// Query Keys
export const BANKING_QUERY_KEYS = {
  accounts: ["accounts"] as const,
  transactions: ["transactions"] as const,
  transactionsByAccount: (accountId: number) =>
    ["transactions", accountId] as const,
  cards: ["cards"] as const,
  user: ["banking-user"] as const,
} as const;

// User Queries
export const useBankingUser = () => {
  return useQuery({
    queryKey: BANKING_QUERY_KEYS.user,
    queryFn: async (): Promise<BankingUser | null> => {
      if (!isSupabaseConfigured) {
        throw new Error("Supabase not configured");
      }

      const {
        data: { user },
      } = await supabase!.auth.getUser();

      if (!user) return null;

      const { data: profile, error } = await supabase!
        .from("banking_users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return profile;
    },
    enabled: isSupabaseConfigured,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Account Queries
export const useAccounts = () => {
  const { data: user } = useBankingUser();

  return useQuery({
    queryKey: BANKING_QUERY_KEYS.accounts,
    queryFn: async (): Promise<Account[]> => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase!
        .from("accounts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at");

      if (error) throw error;
      return data || [];
    },
    enabled: !!user && isSupabaseConfigured,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Transaction Queries
export const useTransactions = (accountId?: number) => {
  const { data: user } = useBankingUser();

  return useQuery({
    queryKey: accountId
      ? BANKING_QUERY_KEYS.transactionsByAccount(accountId)
      : BANKING_QUERY_KEYS.transactions,
    queryFn: async (): Promise<Transaction[]> => {
      if (!user) throw new Error("User not authenticated");

      let query = supabase!
        .from("transactions")
        .select(
          `
          *,
          accounts!inner(user_id, account_number, account_type)
        `,
        )
        .eq("accounts.user_id", user.id)
        .order("timestamp", { ascending: false })
        .limit(50);

      if (accountId) {
        query = query.eq("account_id", accountId);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data || [];
    },
    enabled: !!user && isSupabaseConfigured,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Card Queries
export const useCards = () => {
  const { data: user } = useBankingUser();

  return useQuery({
    queryKey: BANKING_QUERY_KEYS.cards,
    queryFn: async (): Promise<Card[]> => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase!
        .from("cards")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at");

      if (error) throw error;
      return data || [];
    },
    enabled: !!user && isSupabaseConfigured,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Banking Mutations
export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  const addNotification = useUIStore((state) => state.addNotification);

  return useMutation({
    mutationFn: async (
      transactionData: Omit<Transaction, "id" | "timestamp" | "created_at">,
    ) => {
      const { data, error } = await supabase!
        .from("transactions")
        .insert({
          ...transactionData,
          timestamp: new Date().toISOString(),
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({
        queryKey: BANKING_QUERY_KEYS.transactions,
      });
      queryClient.invalidateQueries({ queryKey: BANKING_QUERY_KEYS.accounts });

      addNotification({
        type: "success",
        title: "Transaction Created",
        message: `${data.type} of $${data.amount} completed`,
      });
    },
    onError: (error) => {
      console.error("Error creating transaction:", error);
      addNotification({
        type: "error",
        title: "Transaction Failed",
        message: "Failed to create transaction",
      });
    },
  });
};

export const useTransferFunds = () => {
  const queryClient = useQueryClient();
  const addNotification = useUIStore((state) => state.addNotification);
  const createTransaction = useCreateTransaction();

  return useMutation({
    mutationFn: async ({
      fromAccountId,
      toAccountId,
      amount,
      description,
    }: {
      fromAccountId: number;
      toAccountId: number;
      amount: number;
      description: string;
    }) => {
      // Create both transactions
      await Promise.all([
        createTransaction.mutateAsync({
          account_id: fromAccountId,
          type: "debit",
          amount,
          description: `Transfer to account ${toAccountId}: ${description}`,
        }),
        createTransaction.mutateAsync({
          account_id: toAccountId,
          type: "credit",
          amount,
          description: `Transfer from account ${fromAccountId}: ${description}`,
        }),
      ]);
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({
        queryKey: BANKING_QUERY_KEYS.transactions,
      });
      queryClient.invalidateQueries({ queryKey: BANKING_QUERY_KEYS.accounts });

      addNotification({
        type: "success",
        title: "Transfer Completed",
        message: `Successfully transferred $${variables.amount}`,
      });
    },
    onError: (error) => {
      console.error("Error transferring funds:", error);
      addNotification({
        type: "error",
        title: "Transfer Failed",
        message: "Failed to transfer funds",
      });
    },
  });
};

// Computed values hooks
export const useBankingTotals = () => {
  const { data: accounts = [] } = useAccounts();
  const { data: cards = [] } = useCards();
  const { data: transactions = [] } = useTransactions();

  return {
    totalBalance: accounts.reduce((sum, account) => sum + account.balance, 0),
    activeCards: cards.filter((card) => card.status === "active"),
    recentTransactions: transactions.slice(0, 10),
  };
};

export const useSelectedAccount = () => {
  const selectedAccountId = useUIStore((state) => state.selectedAccountId);
  const { data: accounts = [] } = useAccounts();

  return accounts.find((account) => account.id === selectedAccountId) || null;
};
