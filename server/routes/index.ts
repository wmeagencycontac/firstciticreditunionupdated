import { Express } from "express";
import { configureAuthRoutes } from "./auth-routes";
import { configureBankingRoutes } from "./banking-routes";
import { configureDevelopmentRoutes, configureUtilityRoutes } from "./development-routes";
import { authenticateToken } from "./banking";

/**
 * Configure all application routes
 * This is the main entry point for all route configuration
 */
export function configureRoutes(app: Express) {
  // Configure utility routes (health checks, etc.)
  configureUtilityRoutes(app);
  
  // Configure authentication routes
  configureAuthRoutes(app, authenticateToken);
  
  // Configure banking and financial routes
  configureBankingRoutes(app, authenticateToken);
  
  // Configure development and testing routes
  configureDevelopmentRoutes(app);
}

// Re-export commonly used middleware
export { authenticateToken } from "./banking";
export { authenticateUser as supabaseAuthenticateUser } from "./supabase-auth";
