import { Express } from "express";

// Legacy Banking Routes
import {
  handleGetAccounts,
  handleGetAccountDetails,
  handleGetTransactions as handleGetAccountTransactions,
} from "./accounts";
import { handleGetDashboard } from "./dashboard";
import { handleGetTransactions, handleCreateTransaction } from "./transactions";
import {
  handleAccountSummary,
  handleGetAllTransactions,
  handleSendTransfer,
  handleGetCards,
  handleCreateCard,
  handleAdminVerifyUser,
  handleGetPendingUsers,
} from "./banking";

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

import { authenticateUser as supabaseAuthenticateUser } from "./supabase-auth";

/**
 * Configure all banking-related routes
 */
export function configureBankingRoutes(app: Express, authenticateToken: any) {
  // ===== LEGACY BANKING ROUTES =====
  
  // Dashboard and Account Overview
  app.get("/api/dashboard", handleGetDashboard);
  app.get("/api/accounts", handleGetAccounts);
  app.get("/api/accounts/:accountId", handleGetAccountDetails);
  app.get("/api/accounts/:accountId/transactions", handleGetAccountTransactions);

  // Transactions
  app.get("/api/transactions", handleGetTransactions);
  app.post("/api/transactions", handleCreateTransaction);

  // Protected Banking Endpoints
  app.get("/api/account-summary", authenticateToken, handleAccountSummary);
  app.get("/api/all-transactions", authenticateToken, handleGetAllTransactions);
  app.post("/api/send-transfer", authenticateToken, handleSendTransfer);
  app.get("/api/cards", authenticateToken, handleGetCards);
  app.post("/api/cards", authenticateToken, handleCreateCard);

  // Admin Banking Endpoints
  app.get("/api/admin/users-pending", authenticateToken, handleGetPendingUsers);
  app.post("/api/admin/verify-users", authenticateToken, handleAdminVerifyUser);

  // ===== SUPABASE BANKING ROUTES =====
  
  // Profile Management
  app.post("/api/supabase/auth/create-profile", createBankingProfile);
  app.get("/api/supabase/profile/:userId", getBankingProfile);
  app.put("/api/supabase/profile/:userId", updateBankingProfile);

  // Account Management
  app.get("/api/supabase/accounts", supabaseAuthenticateUser, supabaseGetAccounts);
  app.post("/api/supabase/accounts", supabaseAuthenticateUser, supabaseCreateAccount);

  // Transactions
  app.get("/api/supabase/transactions", supabaseAuthenticateUser, supabaseGetTransactions);
  app.post("/api/supabase/transactions", supabaseAuthenticateUser, supabaseCreateTransaction);
  app.get("/api/supabase/transactions/recent", supabaseAuthenticateUser, supabaseGetRecentTransactions);

  // Transfers
  app.post("/api/supabase/transfer", supabaseAuthenticateUser, supabaseTransfer);

  // Cards
  app.get("/api/supabase/cards", supabaseAuthenticateUser, supabaseGetCards);
  app.post("/api/supabase/cards", supabaseAuthenticateUser, supabaseCreateCard);
}
