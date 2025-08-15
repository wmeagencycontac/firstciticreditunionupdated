import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface Notification {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message: string;
  timestamp: string;
}

interface UIState {
  // Notification state
  notifications: Notification[];

  // Loading states for UI feedback
  dashboardLoading: boolean;
  transactionLoading: boolean;

  // Selected/active states
  selectedAccountId: number | null;

  // Modal/dialog states
  isTransferModalOpen: boolean;
  isTransactionModalOpen: boolean;

  // Actions
  addNotification: (
    notification: Omit<Notification, "id" | "timestamp">,
  ) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;

  setDashboardLoading: (loading: boolean) => void;
  setTransactionLoading: (loading: boolean) => void;
  setSelectedAccount: (accountId: number | null) => void;

  setTransferModalOpen: (open: boolean) => void;
  setTransactionModalOpen: (open: boolean) => void;

  reset: () => void;
}

const initialState = {
  notifications: [],
  dashboardLoading: false,
  transactionLoading: false,
  selectedAccountId: null,
  isTransferModalOpen: false,
  isTransactionModalOpen: false,
};

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

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

        setDashboardLoading: (dashboardLoading) => set({ dashboardLoading }),
        setTransactionLoading: (transactionLoading) =>
          set({ transactionLoading }),
        setSelectedAccount: (selectedAccountId) => set({ selectedAccountId }),

        setTransferModalOpen: (isTransferModalOpen) =>
          set({ isTransferModalOpen }),
        setTransactionModalOpen: (isTransactionModalOpen) =>
          set({ isTransactionModalOpen }),

        reset: () => set(initialState),
      }),
      {
        name: "ui-store",
        partialize: (state) => ({
          // Only persist non-volatile UI state
          selectedAccountId: state.selectedAccountId,
          notifications: state.notifications,
        }),
      },
    ),
    {
      name: "ui-store",
    },
  ),
);

// Selectors for computed UI values
export const useUISelectors = () => {
  const store = useUIStore();

  return {
    hasNotifications: store.notifications.length > 0,
    unreadNotificationsCount: store.notifications.length,
    isAnyModalOpen: store.isTransferModalOpen || store.isTransactionModalOpen,
    isLoading: store.dashboardLoading || store.transactionLoading,
  };
};
