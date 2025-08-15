import { Routes, Route } from "react-router-dom";
import TestSetup from "../pages/TestSetup";
import Debug from "../pages/Debug";
import SupabaseTest from "../pages/SupabaseTest";
import IntegrationTest from "../pages/IntegrationTest";
import EmailNotificationTest from "../pages/EmailNotificationTest";
import DevBanking from "../pages/DevBanking";

/**
 * Development and testing routes (only available in development mode)
 */
export function DevelopmentRoutes() {
  // Only show development routes in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <Routes>
      {/* Test and Debug Routes */}
      <Route path="/test-setup" element={<TestSetup />} />
      <Route path="/debug" element={<Debug />} />
      <Route path="/supabase-test" element={<SupabaseTest />} />
      <Route path="/integration-test" element={<IntegrationTest />} />
      <Route path="/email-test" element={<EmailNotificationTest />} />
      <Route path="/dev-banking" element={<DevBanking />} />
    </Routes>
  );
}
