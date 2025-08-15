import { Express } from "express";
import { configureAuthRoutes } from "./auth-routes";
import { configureBankingRoutes } from "./banking-routes";
import {
  configureDevelopmentRoutes,
  configureUtilityRoutes,
} from "./development-routes";
import {
  configureSupabaseRoutes,
  configureLegacyDeprecationRoutes,
  configureApiMigrationStatus,
} from "./supabase-only-routes";
import { authenticateToken } from "./banking";

/**
 * Configure all application routes
 * This is the main entry point for all route configuration
 */
export function configureRoutes(app: Express) {
  // Configure utility routes (health checks, etc.)
  configureUtilityRoutes(app);

  // Configure API migration status endpoint
  configureApiMigrationStatus(app);

  // Configure NEW Supabase-only routes (v2 API)
  configureSupabaseRoutes(app);

  // Configure legacy deprecation notices
  configureLegacyDeprecationRoutes(app);

  // Configure legacy routes (for backward compatibility)
  // TODO: Remove these after migration period (target: 2024-06-01)
  configureAuthRoutes(app, authenticateToken);
  configureBankingRoutes(app, authenticateToken);

  // Configure development and testing routes
  configureDevelopmentRoutes(app);
}

// Re-export commonly used middleware
export { authenticateToken } from "./banking";
export { authenticateUser as supabaseAuthenticateUser } from "./supabase-auth";
