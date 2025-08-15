import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeAll, afterAll, vi } from "vitest";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

// Mock server for API calls
export const server = setupServer(
  // Mock Supabase auth endpoints
  http.post("*/auth/v1/token", () => {
    return HttpResponse.json({
      access_token: "fake-access-token",
      token_type: "bearer",
      expires_in: 3600,
      refresh_token: "fake-refresh-token",
      user: {
        id: "fake-user-id",
        email: "test@example.com",
        created_at: new Date().toISOString(),
      },
    });
  }),

  // Mock banking API endpoints
  http.get("/api/accounts", () => {
    return HttpResponse.json([
      {
        id: 1,
        user_id: "fake-user-id",
        account_number: "1234567890",
        account_type: "checking",
        balance: 1000.0,
        currency: "USD",
        routing_number: "123456789",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);
  }),

  http.get("/api/transactions", () => {
    return HttpResponse.json([
      {
        id: 1,
        account_id: 1,
        type: "credit",
        amount: 100.0,
        description: "Test deposit",
        timestamp: new Date().toISOString(),
      },
    ]);
  }),

  http.get("/api/cards", () => {
    return HttpResponse.json([
      {
        id: 1,
        user_id: "fake-user-id",
        card_number: "****1234",
        status: "active",
        created_at: new Date().toISOString(),
      },
    ]);
  }),
);

// Setup and teardown
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => {
  server.resetHandlers();
  cleanup();
});
afterAll(() => server.close());

// Mock environment variables
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock crypto.getRandomValues for uuid generation
Object.defineProperty(global, "crypto", {
  value: {
    getRandomValues: (arr: any) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256);
      }
      return arr;
    },
  },
});

// Mock fetch globally
global.fetch = vi.fn();

// Console suppressions for tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Warning: ReactDOM.render is no longer supported")
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
