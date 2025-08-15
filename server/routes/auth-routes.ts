import { Express } from "express";
import rateLimit from "express-rate-limit";

// Legacy Auth Routes
import { handleLogin, handleProfile, handleLogout } from "./auth";
import { handleRegistration } from "./registration";
import {
  handleRequestOTP,
  handleVerifyOTP,
  handleGetOTPUser,
} from "./otp-auth";

// Supabase Auth Routes
import {
  signUp as supabaseSignUp,
  signIn as supabaseSignIn,
  signOut as supabaseSignOut,
  getProfile as supabaseGetProfile,
  authenticateUser as supabaseAuthenticateUser,
} from "./supabase-auth";

// Admin Auth Routes
import {
  handleAdminLogin,
  handleAdminLogout,
  handleAdminProfile,
} from "./admin-auth";
import { handleCreateAdmin, handleCheckAdminExists } from "./admin-setup";

// Auth rate limiting (very restrictive)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 auth attempts per windowMs
  message: {
    error:
      "Too many authentication attempts from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Configure all authentication-related routes
 */
export function configureAuthRoutes(app: Express, authenticateToken: any) {
  // ===== LEGACY AUTH ROUTES =====
  app.post("/api/auth/login", authLimiter, handleLogin);
  app.post("/api/auth/register", authLimiter, handleRegistration);
  app.get("/api/auth/profile", handleProfile);
  app.post("/api/auth/logout", handleLogout);

  // ===== OTP AUTHENTICATION =====
  app.post("/api/otp/request-code", authLimiter, handleRequestOTP);
  app.post("/api/otp/verify-code", authLimiter, handleVerifyOTP);
  app.get("/api/otp/user/:userId", handleGetOTPUser);

  // ===== SUPABASE AUTH ROUTES =====
  app.post("/api/supabase/auth/signup", authLimiter, supabaseSignUp);
  app.post("/api/supabase/auth/signin", authLimiter, supabaseSignIn);
  app.post(
    "/api/supabase/auth/signout",
    supabaseAuthenticateUser,
    supabaseSignOut,
  );
  app.get(
    "/api/supabase/auth/profile",
    supabaseAuthenticateUser,
    supabaseGetProfile,
  );

  // ===== ADMIN AUTH ROUTES =====
  app.post("/api/admin/setup", handleCreateAdmin);
  app.get("/api/admin/check", handleCheckAdminExists);
  app.post("/api/admin/login", authLimiter, handleAdminLogin);
  app.post("/api/admin/logout", authenticateToken, handleAdminLogout);
  app.get("/api/admin/profile", authenticateToken, handleAdminProfile);
}
