import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";

// Mock Supabase client for testing
const mockSupabase = {
  auth: {
    getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
    getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
    onAuthStateChange: vi.fn().mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    }),
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    resetPasswordForEmail: vi.fn(),
  },
  from: vi.fn().mockReturnValue({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
    execute: vi.fn().mockResolvedValue({ data: [], error: null }),
  }),
};

// Mock the supabase module
vi.mock("@/lib/supabase", () => ({
  supabase: mockSupabase,
  isSupabaseConfigured: true,
  auth: mockSupabase.auth,
  db: {
    getAccounts: vi.fn().mockResolvedValue({ data: [], error: null }),
    getTransactions: vi.fn().mockResolvedValue({ data: [], error: null }),
    getBankingProfile: vi.fn().mockResolvedValue({ data: null, error: null }),
    getCards: vi.fn().mockResolvedValue({ data: [], error: null }),
  },
}));

interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  initialEntries?: string[];
  queryClient?: QueryClient;
  mockAuthState?: {
    user?: any;
    session?: any;
    loading?: boolean;
  };
}

const AllTheProviders = ({
  children,
  initialEntries = ["/"],
  queryClient,
  mockAuthState,
}: {
  children: React.ReactNode;
  initialEntries?: string[];
  queryClient?: QueryClient;
  mockAuthState?: CustomRenderOptions["mockAuthState"];
}) => {
  const testQueryClient =
    queryClient ||
    new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          cacheTime: 0,
        },
      },
    });

  // Mock AuthContext value
  const mockAuthContextValue = {
    user: mockAuthState?.user || null,
    session: mockAuthState?.session || null,
    profile: null,
    loading: mockAuthState?.loading || false,
    signOut: vi.fn(),
  };

  return (
    <QueryClientProvider client={testQueryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <AuthProvider value={mockAuthContextValue}>{children}</AuthProvider>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

const customRender = (ui: ReactElement, options: CustomRenderOptions = {}) => {
  const { initialEntries, queryClient, mockAuthState, ...renderOptions } =
    options;

  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders
        initialEntries={initialEntries}
        queryClient={queryClient}
        mockAuthState={mockAuthState}
      >
        {children}
      </AllTheProviders>
    ),
    ...renderOptions,
  });
};

// Test data factories
export const createMockUser = (overrides = {}) => ({
  id: "test-user-id",
  email: "test@example.com",
  name: "Test User",
  email_verified: true,
  role: "user" as const,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});

export const createMockAccount = (overrides = {}) => ({
  id: 1,
  user_id: "test-user-id",
  account_number: "1234567890",
  account_type: "checking" as const,
  balance: 1000.0,
  currency: "USD",
  routing_number: "123456789",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});

export const createMockTransaction = (overrides = {}) => ({
  id: 1,
  account_id: 1,
  type: "credit" as const,
  amount: 100.0,
  description: "Test transaction",
  timestamp: new Date().toISOString(),
  created_at: new Date().toISOString(),
  ...overrides,
});

export const createMockCard = (overrides = {}) => ({
  id: 1,
  user_id: "test-user-id",
  card_number: "****1234",
  card_type: "debit" as const,
  status: "active" as const,
  created_at: new Date().toISOString(),
  ...overrides,
});

// Custom render with common setup
export const renderWithAuth = (
  ui: ReactElement,
  options: CustomRenderOptions = {},
) => {
  const mockUser = createMockUser();
  const mockSession = { user: mockUser };

  return customRender(ui, {
    ...options,
    mockAuthState: {
      user: mockUser,
      session: mockSession,
      loading: false,
      ...options.mockAuthState,
    },
  });
};

export const renderWithoutAuth = (
  ui: ReactElement,
  options: CustomRenderOptions = {},
) => {
  return customRender(ui, {
    ...options,
    mockAuthState: {
      user: null,
      session: null,
      loading: false,
      ...options.mockAuthState,
    },
  });
};

// Wait utilities
export const waitForLoadingToFinish = () =>
  new Promise((resolve) => setTimeout(resolve, 0));

// Custom matchers
expect.extend({
  toBeInTheDocument: (received) => {
    const pass = received && document.body.contains(received);
    return {
      message: () => `expected element to be in the document`,
      pass,
    };
  },
});

// Re-export everything
export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";

// Override render method
export { customRender as render };

// Export test utilities
export { mockSupabase, AllTheProviders };
