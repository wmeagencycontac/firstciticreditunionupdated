import { Express } from "express";
import {
  configureDevelopmentRoutes,
  configureUtilityRoutes,
} from "./development-routes";
import {
  configureSupabaseRoutes,
  configureLegacyDeprecationRoutes,
  configureApiMigrationStatus,
} from "./supabase-only-routes";

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

  // Configure development and testing routes
  configureDevelopmentRoutes(app);
}

// Re-export commonly used middleware
export { authenticateUser as supabaseAuthenticateUser } from "./supabase-auth";
