import { Express } from "express";
import rateLimit from "express-rate-limit";

// Supabase Auth Routes
import {
  signUp as supabaseSignUp,
  signIn as supabaseSignIn,
  signOut as supabaseSignOut,
  getProfile as supabaseGetProfile,
  authenticateUser as supabaseAuthenticateUser,
} from "./supabase-auth";

// Supabase Banking Routes
import {
  getAccounts as supabaseGetAccounts,
  createAccount as supabaseCreateAccount,
  getTransactions as supabaseGetTransactions,
  createTransaction as supabaseCreateTransaction,
  transfer as supabaseTransfer,
  getCards as supabaseGetCards,
  createCard as supabaseCreateCard,
  getRecentTransactions as supabaseGetRecentTransactions,
} from "./supabase-banking";

// Profile Routes
import {
  createBankingProfile,
  getBankingProfile,
  updateBankingProfile,
} from "./supabase-profile";

// Auth rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 auth attempts per windowMs
  message: {
    error: "Too many authentication attempts from this IP, please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Configure Supabase-only routes (new preferred API)
 * This will eventually replace all legacy endpoints
 */
export function configureSupabaseRoutes(app: Express) {
  // ===== AUTHENTICATION ROUTES =====
  app.post("/api/v2/auth/signup", authLimiter, supabaseSignUp);
  app.post("/api/v2/auth/signin", authLimiter, supabaseSignIn);
  app.post("/api/v2/auth/signout", supabaseAuthenticateUser, supabaseSignOut);
  app.get("/api/v2/auth/profile", supabaseAuthenticateUser, supabaseGetProfile);

  // ===== PROFILE MANAGEMENT =====
  app.post("/api/v2/profile", supabaseAuthenticateUser, createBankingProfile);
  app.get("/api/v2/profile/:userId", supabaseAuthenticateUser, getBankingProfile);
  app.put("/api/v2/profile/:userId", supabaseAuthenticateUser, updateBankingProfile);

  // ===== BANKING ROUTES =====
  
  // Account Management
  app.get("/api/v2/accounts", supabaseAuthenticateUser, supabaseGetAccounts);
  app.post("/api/v2/accounts", supabaseAuthenticateUser, supabaseCreateAccount);

  // Transactions
  app.get("/api/v2/transactions", supabaseAuthenticateUser, supabaseGetTransactions);
  app.post("/api/v2/transactions", supabaseAuthenticateUser, supabaseCreateTransaction);
  app.get("/api/v2/transactions/recent", supabaseAuthenticateUser, supabaseGetRecentTransactions);

  // Transfers
  app.post("/api/v2/transfer", supabaseAuthenticateUser, supabaseTransfer);

  // Cards
  app.get("/api/v2/cards", supabaseAuthenticateUser, supabaseGetCards);
  app.post("/api/v2/cards", supabaseAuthenticateUser, supabaseCreateCard);
}

/**
 * Configure legacy API deprecation notices
 * These endpoints will return deprecation warnings and redirect to v2
 */
export function configureLegacyDeprecationRoutes(app: Express) {
  const deprecationNotice = (req: any, res: any, next: any) => {
    res.setHeader('X-API-Deprecated', 'true');
    res.setHeader('X-API-Sunset', '2024-06-01'); // Set sunset date
    res.setHeader('X-API-Migration-Guide', '/docs/api-migration');
    
    // Log usage for monitoring
    console.warn(`[DEPRECATED API] ${req.method} ${req.path} - Client: ${req.ip}`);
    
    next();
  };

  // Add deprecation notice to legacy auth routes
  app.use('/api/auth/*', deprecationNotice);
  app.use('/api/dashboard', deprecationNotice);
  app.use('/api/accounts', deprecationNotice);
  app.use('/api/transactions', deprecationNotice);
  app.use('/api/account-summary', deprecationNotice);
  app.use('/api/all-transactions', deprecationNotice);
  app.use('/api/send-transfer', deprecationNotice);
  app.use('/api/cards', deprecationNotice);
}

/**
 * API Migration status endpoint
 */
export function configureApiMigrationStatus(app: Express) {
  app.get("/api/migration-status", (req, res) => {
    res.json({
      version: "2.0",
      legacy_support: true,
      legacy_sunset_date: "2024-06-01",
      migration_guide: "/docs/api-migration",
      endpoints: {
        v2: {
          auth: "/api/v2/auth/*",
          profile: "/api/v2/profile/*", 
          accounts: "/api/v2/accounts",
          transactions: "/api/v2/transactions",
          cards: "/api/v2/cards",
          transfer: "/api/v2/transfer"
        },
        legacy: {
          status: "deprecated",
          removal_date: "2024-06-01",
          endpoints: [
            "/api/auth/*",
            "/api/dashboard",
            "/api/accounts",
            "/api/transactions",
            "/api/account-summary"
          ]
        }
      }
    });
  });
}
