import { Express } from "express";

// Development/Testing Routes
import { handleDemo } from "./demo";
import { handleCreateTestUser, handleGetTestUserInfo } from "./test-setup";
import {
  testTransactionEmail,
  testProfileUpdateEmail,
  testAllNotifications,
} from "./test-email-notifications";

/**
 * Configure development and testing routes
 * These routes should only be available in development mode
 */
export function configureDevelopmentRoutes(app: Express) {
  // Basic demo route (available in all environments)
  app.get("/api/demo", handleDemo);
  
  // Development-only routes
  if (process.env.NODE_ENV === "development") {
    // Test Setup Endpoints
    app.post("/api/test-setup/create", handleCreateTestUser);
    app.get("/api/test-setup/info", handleGetTestUserInfo);

    // Email Testing Endpoints
    app.post("/api/test-email/transaction", testTransactionEmail);
    app.post("/api/test-email/profile", testProfileUpdateEmail);
    app.post("/api/test-email/all", testAllNotifications);

    // Migration Endpoint
    app.post("/api/migrate-to-supabase", async (req, res) => {
      try {
        const { migrateDataToSupabase } = await import("../migrate-to-supabase");
        const result = await migrateDataToSupabase();
        res.json({ success: true, result });
      } catch (error) {
        console.error("Migration error:", error);
        res.status(500).json({ error: "Migration failed", details: error });
      }
    });
  }
}

/**
 * Configure basic utility routes available in all environments
 */
export function configureUtilityRoutes(app: Express) {
  // Health check / ping endpoint
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });
}
