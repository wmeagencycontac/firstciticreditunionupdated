import { Routes, Route } from "react-router-dom";
import { PublicRoutes } from "./public";
import { AdminRoutes } from "./admin";
import { DashboardRoutes } from "./dashboard";
import { DevelopmentRoutes } from "./development";
import NotFound from "../pages/NotFound";

/**
 * Main application routes
 * Combines all route modules into a single routing structure
 */
export function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/*" element={<PublicRoutes />} />
      
      {/* Admin Routes */}
      <Route path="/*" element={<AdminRoutes />} />
      
      {/* Dashboard Routes */}
      <Route path="/*" element={<DashboardRoutes />} />
      
      {/* Development Routes (only in dev mode) */}
      <Route path="/*" element={<DevelopmentRoutes />} />
      
      {/* Catch-all route for 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
