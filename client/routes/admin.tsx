import { Routes, Route } from "react-router-dom";
import AdminRoute from "../components/auth/AdminRoute";
import AdminLogin from "../pages/AdminLogin";
import AdminDashboard from "../pages/AdminDashboard";
import AdminDashboardPro from "../pages/AdminDashboardPro";
import AdminSetup from "../pages/AdminSetup";

/**
 * Admin routes requiring admin authentication
 */
export function AdminRoutes() {
  return (
    <Routes>
      {/* Admin Auth Routes (no protection needed) */}
      <Route path="/admin/setup" element={<AdminSetup />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      
      {/* Protected Admin Routes */}
      <Route path="/admin/dashboard" element={<AdminRoute />}>
        <Route index element={<AdminDashboard />} />
      </Route>
      <Route path="/admin/dashboard-pro" element={<AdminRoute />}>
        <Route index element={<AdminDashboardPro />} />
      </Route>
    </Routes>
  );
}
