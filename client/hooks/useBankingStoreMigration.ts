/**
 * Migration utility to help transition from old useBankingStore to new architecture
 * This provides a compatibility layer during the refactoring process
 * @deprecated Use individual hooks (useAuth, useBankingQueries, useUIStore) directly
 */

import { useAuth } from "./useAuth";
import {
  useAccounts,
  useTransactions,
  useCards,
  useBankingTotals,
  useCreateTransaction,
  useTransferFunds,
} from "./useBankingQueries";
import { useUIStore, useUISelectors } from "@/store/useUIStore";

/**
 * Compatibility hook that mimics the old useBankingStore interface
 * @deprecated Migrate to individual hooks for better performance and separation of concerns
 */
export const useBankingStoreMigration = () => {
  const auth = useAuth();
  const { data: accounts = [], isLoading: accountsLoading } = useAccounts();
  const { data: transactions = [], isLoading: transactionsLoading } =
    useTransactions();
  const { data: cards = [] } = useCards();
  const { totalBalance, activeCards, recentTransactions } = useBankingTotals();

  const ui = useUIStore();
  const uiSelectors = useUISelectors();

  const createTransaction = useCreateTransaction();
  const transferFunds = useTransferFunds();

  return {
    // User state (from useAuth)
    user: auth.profile,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.loading,

    // Banking data (from TanStack Query)
    accounts,
    transactions,
    cards,

    // UI state (from useUIStore)
    selectedAccountId: ui.selectedAccountId,
    dashboardLoading: ui.dashboardLoading,
    transactionLoading: ui.transactionLoading,
    notifications: ui.notifications,

    // Computed values
    totalBalance,
    activeCards,
    recentTransactions,
    selectedAccount: accounts.find(
      (account) => account.id === ui.selectedAccountId,
    ),
    hasNotifications: uiSelectors.hasNotifications,

    // Actions - User
    setUser: () => {
      console.warn(
        "setUser is deprecated. User state is managed by useAuth hook.",
      );
    },
    setAuthenticated: () => {
      console.warn(
        "setAuthenticated is deprecated. Auth state is managed by useAuth hook.",
      );
    },
    setLoading: () => {
      console.warn(
        "setLoading is deprecated. Auth loading state is managed by useAuth hook.",
      );
    },

    // Actions - Banking data (now mutations)
    setAccounts: () => {
      console.warn(
        "setAccounts is deprecated. Use TanStack Query mutations to update server state.",
      );
    },
    setTransactions: () => {
      console.warn(
        "setTransactions is deprecated. Use TanStack Query mutations to update server state.",
      );
    },
    setCards: () => {
      console.warn(
        "setCards is deprecated. Use TanStack Query mutations to update server state.",
      );
    },
    addTransaction: () => {
      console.warn(
        "addTransaction is deprecated. Use useCreateTransaction mutation.",
      );
    },
    updateAccountBalance: () => {
      console.warn(
        "updateAccountBalance is deprecated. Balance updates are handled by server and TanStack Query.",
      );
    },

    // Actions - UI state
    setSelectedAccount: ui.setSelectedAccount,
    setDashboardLoading: ui.setDashboardLoading,
    setTransactionLoading: ui.setTransactionLoading,

    // Actions - Notifications
    addNotification: ui.addNotification,
    removeNotification: ui.removeNotification,
    clearNotifications: ui.clearNotifications,

    // Actions - Data fetching (now handled by TanStack Query)
    fetchUserData: () => {
      console.warn(
        "fetchUserData is deprecated. User data is fetched automatically by useAuth hook.",
      );
      return Promise.resolve();
    },
    fetchAccounts: () => {
      console.warn(
        "fetchAccounts is deprecated. Use useAccounts hook which fetches automatically.",
      );
      return Promise.resolve();
    },
    fetchTransactions: () => {
      console.warn(
        "fetchTransactions is deprecated. Use useTransactions hook which fetches automatically.",
      );
      return Promise.resolve();
    },
    fetchCards: () => {
      console.warn(
        "fetchCards is deprecated. Use useCards hook which fetches automatically.",
      );
      return Promise.resolve();
    },

    // Actions - Banking operations (now mutations)
    createTransaction: (transactionData: any) => {
      return createTransaction.mutateAsync(transactionData);
    },
    transferFunds: (
      fromAccountId: number,
      toAccountId: number,
      amount: number,
      description: string,
    ) => {
      return transferFunds.mutateAsync({
        fromAccountId,
        toAccountId,
        amount,
        description,
      });
    },

    // Utility actions
    reset: () => {
      ui.reset();
      console.warn(
        "Store reset partially completed. Auth state reset requires signing out.",
      );
    },
    refresh: () => {
      console.warn(
        "refresh is deprecated. TanStack Query handles automatic refetching.",
      );
      return Promise.resolve();
    },
  };
};

/**
 * Migration instructions for components using the old banking store:
 *
 * OLD:
 * const { user, accounts, transactions, createTransaction } = useBankingStore();
 *
 * NEW:
 * const { profile: user } = useAuth();
 * const { data: accounts } = useAccounts();
 * const { data: transactions } = useTransactions();
 * const createTransaction = useCreateTransaction();
 *
 * Benefits of new approach:
 * - Better performance with automatic caching and background updates
 * - Separation of concerns (auth, server state, UI state)
 * - Automatic loading and error states
 * - Optimistic updates and error handling
 * - Better TypeScript support
 */
