import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { useUIStore } from "@/store/useUIStore";
import { validateSchema } from "@shared/schemas";
import {
  UserSchema,
  AccountSchema,
  TransactionSchema,
  CardSchema,
  LoginRequestSchema,
  TransferSchema,
} from "@shared/schemas";

// Base API configuration
const API_BASE = "/api/v2";

// Utility function for API calls
async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Network error" }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

// Query Keys for v2 API
export const SUPABASE_QUERY_KEYS = {
  profile: ['v2', 'profile'] as const,
  accounts: ['v2', 'accounts'] as const,
  transactions: ['v2', 'transactions'] as const,
  transactionsByAccount: (accountId: string) => ['v2', 'transactions', accountId] as const,
  cards: ['v2', 'cards'] as const,
  recentTransactions: ['v2', 'transactions', 'recent'] as const,
} as const;

// ===== AUTH HOOKS =====

export const useSupabaseAuth = () => {
  const { user, profile, isAuthenticated, loading } = useAuth();
  
  return {
    user,
    profile,
    isAuthenticated,
    loading,
  };
};

// ===== PROFILE HOOKS =====

export const useUserProfile = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: SUPABASE_QUERY_KEYS.profile,
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");
      
      const data = await apiCall<any>(`/profile/${user.id}`);
      const validation = validateSchema(UserSchema, data);
      
      if (!validation.success) {
        throw new Error('Invalid profile data');
      }
      
      return validation.data;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// ===== ACCOUNT HOOKS =====

export const useSupabaseAccounts = () => {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: SUPABASE_QUERY_KEYS.accounts,
    queryFn: async () => {
      const data = await apiCall<any[]>('/accounts');
      
      // Validate each account
      return data.map(account => {
        const validation = validateSchema(AccountSchema, account);
        if (!validation.success) {
          console.warn('Invalid account data:', account);
          return account; // Return as-is for now, but log the issue
        }
        return validation.data;
      });
    },
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// ===== TRANSACTION HOOKS =====

export const useSupabaseTransactions = (accountId?: string) => {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: accountId 
      ? SUPABASE_QUERY_KEYS.transactionsByAccount(accountId)
      : SUPABASE_QUERY_KEYS.transactions,
    queryFn: async () => {
      const endpoint = accountId ? `/transactions?account_id=${accountId}` : '/transactions';
      const data = await apiCall<any[]>(endpoint);
      
      // Validate each transaction
      return data.map(transaction => {
        const validation = validateSchema(TransactionSchema, transaction);
        if (!validation.success) {
          console.warn('Invalid transaction data:', transaction);
          return transaction; // Return as-is for now, but log the issue
        }
        return validation.data;
      });
    },
    enabled: isAuthenticated,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useRecentTransactions = () => {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: SUPABASE_QUERY_KEYS.recentTransactions,
    queryFn: async () => {
      const data = await apiCall<any[]>('/transactions/recent');
      
      return data.map(transaction => {
        const validation = validateSchema(TransactionSchema, transaction);
        if (!validation.success) {
          console.warn('Invalid recent transaction data:', transaction);
          return transaction;
        }
        return validation.data;
      });
    },
    enabled: isAuthenticated,
    staleTime: 30 * 1000, // 30 seconds
  });
};

// ===== CARD HOOKS =====

export const useSupabaseCards = () => {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: SUPABASE_QUERY_KEYS.cards,
    queryFn: async () => {
      const data = await apiCall<any[]>('/cards');
      
      return data.map(card => {
        const validation = validateSchema(CardSchema, card);
        if (!validation.success) {
          console.warn('Invalid card data:', card);
          return card;
        }
        return validation.data;
      });
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// ===== MUTATION HOOKS =====

export const useCreateSupabaseTransaction = () => {
  const queryClient = useQueryClient();
  const addNotification = useUIStore((state) => state.addNotification);

  return useMutation({
    mutationFn: async (transactionData: any) => {
      const validation = validateSchema(
        TransactionSchema.omit({ id: true, timestamp: true, createdAt: true }),
        transactionData
      );
      
      if (!validation.success) {
        throw new Error('Invalid transaction data');
      }

      return apiCall<any>('/transactions', {
        method: 'POST',
        body: JSON.stringify(validation.data),
      });
    },
    onSuccess: (data) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: SUPABASE_QUERY_KEYS.transactions });
      queryClient.invalidateQueries({ queryKey: SUPABASE_QUERY_KEYS.accounts });
      queryClient.invalidateQueries({ queryKey: SUPABASE_QUERY_KEYS.recentTransactions });
      
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
        message: error.message || "Failed to create transaction",
      });
    },
  });
};

export const useSupabaseTransfer = () => {
  const queryClient = useQueryClient();
  const addNotification = useUIStore((state) => state.addNotification);

  return useMutation({
    mutationFn: async (transferData: any) => {
      const validation = validateSchema(TransferSchema, transferData);
      
      if (!validation.success) {
        throw new Error('Invalid transfer data');
      }

      return apiCall<any>('/transfer', {
        method: 'POST',
        body: JSON.stringify(validation.data),
      });
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: SUPABASE_QUERY_KEYS.transactions });
      queryClient.invalidateQueries({ queryKey: SUPABASE_QUERY_KEYS.accounts });
      queryClient.invalidateQueries({ queryKey: SUPABASE_QUERY_KEYS.recentTransactions });
      
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
        message: error.message || "Failed to transfer funds",
      });
    },
  });
};

export const useCreateSupabaseCard = () => {
  const queryClient = useQueryClient();
  const addNotification = useUIStore((state) => state.addNotification);

  return useMutation({
    mutationFn: async (cardData: any) => {
      return apiCall<any>('/cards', {
        method: 'POST',
        body: JSON.stringify(cardData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUPABASE_QUERY_KEYS.cards });
      
      addNotification({
        type: "success",
        title: "Card Created",
        message: "New card has been created successfully",
      });
    },
    onError: (error) => {
      console.error("Error creating card:", error);
      addNotification({
        type: "error",
        title: "Card Creation Failed",
        message: error.message || "Failed to create card",
      });
    },
  });
};

// ===== COMPUTED VALUES =====

export const useSupabaseBankingTotals = () => {
  const { data: accounts = [] } = useSupabaseAccounts();
  const { data: cards = [] } = useSupabaseCards();
  const { data: recentTransactions = [] } = useRecentTransactions();

  return {
    totalBalance: accounts.reduce((sum, account) => sum + (account.balance || 0), 0),
    activeCards: cards.filter((card) => card.status === "active"),
    recentTransactions: recentTransactions.slice(0, 10),
    accountCount: accounts.length,
    cardCount: cards.length,
  };
};

export const useSelectedSupabaseAccount = () => {
  const selectedAccountId = useUIStore((state) => state.selectedAccountId);
  const { data: accounts = [] } = useSupabaseAccounts();
  
  return accounts.find((account) => account.id === selectedAccountId) || null;
};
