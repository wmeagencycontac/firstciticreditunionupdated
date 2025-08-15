import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface AuthState {
  // Auth state
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  setLoading: (loading: boolean) => void;
  setAuthenticated: (authenticated: boolean) => void;
  
  // Utility
  reset: () => void;
}

const initialState = {
  isLoading: false,
  isAuthenticated: false,
};

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      ...initialState,

      setLoading: (isLoading) => set({ isLoading }),
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      
      reset: () => set(initialState),
    }),
    {
      name: "auth-store",
    },
  ),
);
