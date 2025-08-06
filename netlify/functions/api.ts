import type { Context, Config } from "@netlify/functions";
import "dotenv/config";

// Import all the existing handlers
import {
  signUp as supabaseSignUp,
  signIn as supabaseSignIn,
  signOut as supabaseSignOut,
  getProfile as supabaseGetProfile,
  authenticateUser as supabaseAuthenticateUser,
} from "../../server/routes/supabase-auth";

import {
  createBankingProfile,
  getBankingProfile,
  updateBankingProfile,
} from "../../server/routes/supabase-profile";

import {
  getAccounts as supabaseGetAccounts,
  createAccount as supabaseCreateAccount,
  getTransactions as supabaseGetTransactions,
  createTransaction as supabaseCreateTransaction,
  transfer as supabaseTransfer,
  getCards as supabaseGetCards,
  createCard as supabaseCreateCard,
  getRecentTransactions as supabaseGetRecentTransactions,
} from "../../server/routes/supabase-banking";

import { handleDemo } from "../../server/routes/demo";

// Helper to convert Express handlers to Netlify Functions
const wrapExpressHandler = (handler: any) => {
  return async (req: Request) => {
    const url = new URL(req.url);
    const body = req.method !== "GET" ? await req.json().catch(() => ({})) : {};

    // Mock Express request object
    const mockReq = {
      method: req.method,
      url: url.pathname + url.search,
      headers: Object.fromEntries(req.headers.entries()),
      body,
      params: {},
      query: Object.fromEntries(url.searchParams.entries()),
    };

    // Mock Express response object
    let responseData: any;
    let statusCode = 200;
    let responseHeaders: Record<string, string> = {};

    const mockRes = {
      status: (code: number) => ({
        json: (data: any) => {
          statusCode = code;
          responseData = data;
          return mockRes;
        },
      }),
      json: (data: any) => {
        responseData = data;
        return mockRes;
      },
      setHeader: (name: string, value: string) => {
        responseHeaders[name] = value;
      },
    };

    // Extract route parameters
    const pathParts = url.pathname.split("/").filter(Boolean);
    if (pathParts.length > 2) {
      const routeParts = pathParts.slice(2); // Remove 'api' prefix
      if (
        routeParts[0] === "supabase" &&
        routeParts[1] === "profile" &&
        routeParts[2]
      ) {
        mockReq.params = { userId: routeParts[2] };
      }
    }

    try {
      await handler(mockReq, mockRes);
      return new Response(JSON.stringify(responseData), {
        status: statusCode,
        headers: {
          "Content-Type": "application/json",
          ...responseHeaders,
        },
      });
    } catch (error) {
      console.error("Handler error:", error);
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  };
};

// Route handler
export default async (req: Request, context: Context) => {
  const url = new URL(req.url);
  const path = url.pathname;

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  try {
    // Route matching
    if (path === "/api/ping") {
      const ping = Netlify.env.get("PING_MESSAGE") ?? "ping";
      return new Response(JSON.stringify({ message: ping }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    if (path === "/api/demo") {
      return wrapExpressHandler(handleDemo)(req);
    }

    // Supabase Auth routes
    if (path === "/api/supabase/auth/signup" && req.method === "POST") {
      return wrapExpressHandler(supabaseSignUp)(req);
    }

    if (path === "/api/supabase/auth/signin" && req.method === "POST") {
      return wrapExpressHandler(supabaseSignIn)(req);
    }

    if (path === "/api/supabase/auth/signout" && req.method === "POST") {
      return wrapExpressHandler(supabaseSignOut)(req);
    }

    if (path === "/api/supabase/auth/profile" && req.method === "GET") {
      return wrapExpressHandler(supabaseGetProfile)(req);
    }

    // Banking Profile routes
    if (path === "/api/supabase/auth/create-profile" && req.method === "POST") {
      return wrapExpressHandler(createBankingProfile)(req);
    }

    if (path.startsWith("/api/supabase/profile/")) {
      if (req.method === "GET") {
        return wrapExpressHandler(getBankingProfile)(req);
      }
      if (req.method === "PUT") {
        return wrapExpressHandler(updateBankingProfile)(req);
      }
    }

    // Supabase Banking routes
    if (path === "/api/supabase/accounts") {
      if (req.method === "GET") {
        return wrapExpressHandler(supabaseGetAccounts)(req);
      }
      if (req.method === "POST") {
        return wrapExpressHandler(supabaseCreateAccount)(req);
      }
    }

    if (path === "/api/supabase/transactions") {
      if (req.method === "GET") {
        return wrapExpressHandler(supabaseGetTransactions)(req);
      }
      if (req.method === "POST") {
        return wrapExpressHandler(supabaseCreateTransaction)(req);
      }
    }

    if (path === "/api/supabase/transfer" && req.method === "POST") {
      return wrapExpressHandler(supabaseTransfer)(req);
    }

    if (path === "/api/supabase/cards") {
      if (req.method === "GET") {
        return wrapExpressHandler(supabaseGetCards)(req);
      }
      if (req.method === "POST") {
        return wrapExpressHandler(supabaseCreateCard)(req);
      }
    }

    if (path === "/api/supabase/transactions/recent" && req.method === "GET") {
      return wrapExpressHandler(supabaseGetRecentTransactions)(req);
    }

    // 404 for unmatched routes
    return new Response(JSON.stringify({ error: "Route not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("API Function error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const config: Config = {
  path: "/api/*",
};
