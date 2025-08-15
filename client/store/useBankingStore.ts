import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Account, Transaction, Card, BankingUser } from "@/lib/supabase";

interface BankingState {
  // User state
  user: BankingUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Banking data
  accounts: Account[];
  transactions: Transaction[];
  cards: Card[];

  // UI state
  selectedAccountId: number | null;
  dashboardLoading: boolean;
  transactionLoading: boolean;

  // Notification state
  notifications: Array<{
    id: string;
    type: "success" | "error" | "info" | "warning";
    title: string;
    message: string;
    timestamp: string;
  }>;

  // Actions
  setUser: (user: BankingUser | null) => void;
  setAuthenticated: (authenticated: boolean) => void;
  setLoading: (loading: boolean) => void;

  // Banking actions
  setAccounts: (accounts: Account[]) => void;
  setTransactions: (transactions: Transaction[]) => void;
  setCards: (cards: Card[]) => void;
  addTransaction: (transaction: Transaction) => void;
  updateAccountBalance: (accountId: number, newBalance: number) => void;

  // UI actions
  setSelectedAccount: (accountId: number | null) => void;
  setDashboardLoading: (loading: boolean) => void;
  setTransactionLoading: (loading: boolean) => void;

  // Notification actions
  addNotification: (
    notification: Omit<BankingState["notifications"][0], "id" | "timestamp">,
  ) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;

  // Data fetching actions
  fetchUserData: () => Promise<void>;
  fetchAccounts: () => Promise<void>;
  fetchTransactions: (accountId?: number) => Promise<void>;
  fetchCards: () => Promise<void>;

  // Banking operations
  createTransaction: (
    transaction: Omit<Transaction, "id" | "timestamp" | "created_at">,
  ) => Promise<void>;
  transferFunds: (
    fromAccountId: number,
    toAccountId: number,
    amount: number,
    description: string,
  ) => Promise<void>;

  // Utility actions
  reset: () => void;
  refresh: () => Promise<void>;
}

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  accounts: [],
  transactions: [],
  cards: [],
  selectedAccountId: null,
  dashboardLoading: false,
  transactionLoading: false,
  notifications: [],
};

export const useBankingStore = create<BankingState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // User actions
        setUser: (user) => set({ user }),
        setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
        setLoading: (isLoading) => set({ isLoading }),

        // Banking actions
        setAccounts: (accounts) => set({ accounts }),
        setTransactions: (transactions) => set({ transactions }),
        setCards: (cards) => set({ cards }),

        addTransaction: (transaction) => {
          const { transactions } = get();
          set({ transactions: [transaction, ...transactions] });
        },

        updateAccountBalance: (accountId, newBalance) => {
          const { accounts } = get();
          const updatedAccounts = accounts.map((account) =>
            account.id === accountId
              ? { ...account, balance: newBalance }
              : account,
          );
          set({ accounts: updatedAccounts });
        },

        // UI actions
        setSelectedAccount: (selectedAccountId) => set({ selectedAccountId }),
        setDashboardLoading: (dashboardLoading) => set({ dashboardLoading }),
        setTransactionLoading: (transactionLoading) =>
          set({ transactionLoading }),

        // Notification actions
        addNotification: (notification) => {
          const id = Math.random().toString(36).substr(2, 9);
          const timestamp = new Date().toISOString();
          const newNotification = { ...notification, id, timestamp };

          set((state) => ({
            notifications: [newNotification, ...state.notifications],
          }));

          // Auto-remove notification after 5 seconds
          setTimeout(() => {
            get().removeNotification(id);
          }, 5000);
        },

        removeNotification: (id) => {
          set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
          }));
        },

        clearNotifications: () => set({ notifications: [] }),

        // Data fetching actions
        fetchUserData: async () => {
          if (!isSupabaseConfigured) {
            console.warn("Supabase not configured - skipping user data fetch");
            set({ isLoading: false, isAuthenticated: false, user: null });
            return;
          }
          try {
            set({ isLoading: true });
            const {
              data: { user },
            } = await supabase!.auth.getUser();

            if (user) {
              const { data: profile } = await supabase!
                .from("banking_users")
                .select("*")
                .eq("id", user.id)
                .single();

              set({ user: profile, isAuthenticated: true });
            } else {
              set({ user: null, isAuthenticated: false });
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
            get().addNotification({
              type: "error",
              title: "Error",
              message: "Failed to fetch user data",
            });
          } finally {
            set({ isLoading: false });
          }
        },

        fetchAccounts: async () => {
          try {
            const { user } = get();
            if (!user) return;

            const { data, error } = await supabase
              .from("accounts")
              .select("*")
              .eq("user_id", user.id)
              .order("created_at");

            if (error) throw error;
            set({ accounts: data || [] });
          } catch (error) {
            console.error("Error fetching accounts:", error);
            get().addNotification({
              type: "error",
              title: "Error",
              message: "Failed to fetch accounts",
            });
          }
        },

        fetchTransactions: async (accountId) => {
          try {
            set({ transactionLoading: true });
            const { user } = get();
            if (!user) return;

            let query = supabase
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

            set({ transactions: data || [] });
          } catch (error) {
            console.error("Error fetching transactions:", error);
            get().addNotification({
              type: "error",
              title: "Error",
              message: "Failed to fetch transactions",
            });
          } finally {
            set({ transactionLoading: false });
          }
        },

        fetchCards: async () => {
          try {
            const { user } = get();
            if (!user) return;

            const { data, error } = await supabase
              .from("cards")
              .select("*")
              .eq("user_id", user.id)
              .order("created_at");

            if (error) throw error;
            set({ cards: data || [] });
          } catch (error) {
            console.error("Error fetching cards:", error);
            get().addNotification({
              type: "error",
              title: "Error",
              message: "Failed to fetch cards",
            });
          }
        },

        // Banking operations
        createTransaction: async (transactionData) => {
          try {
            const { data, error } = await supabase
              .from("transactions")
              .insert({
                ...transactionData,
                timestamp: new Date().toISOString(),
                created_at: new Date().toISOString(),
              })
              .select()
              .single();

            if (error) throw error;

            // Add to local state
            get().addTransaction(data);

            // Update account balance (handled by database trigger)
            await get().fetchAccounts();

            get().addNotification({
              type: "success",
              title: "Transaction Created",
              message: `${transactionData.type} of $${transactionData.amount} completed`,
            });
          } catch (error) {
            console.error("Error creating transaction:", error);
            get().addNotification({
              type: "error",
              title: "Transaction Failed",
              message: "Failed to create transaction",
            });
            throw error;
          }
        },

        transferFunds: async (
          fromAccountId,
          toAccountId,
          amount,
          description,
        ) => {
          try {
            // Create debit transaction for sender
            await get().createTransaction({
              account_id: fromAccountId,
              type: "debit",
              amount,
              description: `Transfer to account ${toAccountId}: ${description}`,
            });

            // Create credit transaction for receiver
            await get().createTransaction({
              account_id: toAccountId,
              type: "credit",
              amount,
              description: `Transfer from account ${fromAccountId}: ${description}`,
            });

            get().addNotification({
              type: "success",
              title: "Transfer Completed",
              message: `Successfully transferred $${amount}`,
            });
          } catch (error) {
            console.error("Error transferring funds:", error);
            get().addNotification({
              type: "error",
              title: "Transfer Failed",
              message: "Failed to transfer funds",
            });
            throw error;
          }
        },

        // Utility actions
        reset: () => set(initialState),

        refresh: async () => {
          const { user } = get();
          if (!user) return;

          set({ dashboardLoading: true });
          try {
            await Promise.all([
              get().fetchAccounts(),
              get().fetchTransactions(),
              get().fetchCards(),
            ]);
          } finally {
            set({ dashboardLoading: false });
          }
        },
      }),
      {
        name: "banking-store",
        partialize: (state) => ({
          // Only persist essential data, not loading states
          selectedAccountId: state.selectedAccountId,
          notifications: state.notifications,
        }),
      },
    ),
    {
      name: "banking-store",
    },
  ),
);

// Selectors for computed values
export const useBankingSelectors = () => {
  const store = useBankingStore();

  return {
    totalBalance: store.accounts.reduce(
      (sum, account) => sum + account.balance,
      0,
    ),
    activeCards: store.cards.filter((card) => card.status === "active"),
    recentTransactions: store.transactions.slice(0, 10),
    selectedAccount: store.accounts.find(
      (account) => account.id === store.selectedAccountId,
    ),
    hasNotifications: store.notifications.length > 0,
  };
};
