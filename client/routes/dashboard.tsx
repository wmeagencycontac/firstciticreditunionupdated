import { Routes, Route } from "react-router-dom";
import PrivateRoute from "../components/auth/PrivateRoute";
import DashboardLayout from "../pages/DashboardLayout";
import Dashboard from "../pages/Dashboard";
import Transactions from "../pages/Transactions";
import MobileDeposit from "../pages/MobileDeposit";
import Notifications from "../pages/Notifications";
import Settings from "../pages/Settings";

/**
 * User dashboard routes requiring authentication
 */
export function DashboardRoutes() {
  return (
    <Routes>
      {/* Main Dashboard with Layout */}
      <Route path="/dashboard" element={<PrivateRoute />}>
        <Route path="" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="mobile-deposit" element={<MobileDeposit />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>

      {/* Standalone authenticated routes */}
      <Route path="/transactions" element={<PrivateRoute />}>
        <Route index element={<Transactions />} />
      </Route>
      <Route path="/mobile-deposit" element={<PrivateRoute />}>
        <Route index element={<MobileDeposit />} />
      </Route>
      <Route path="/notifications" element={<PrivateRoute />}>
        <Route index element={<Notifications />} />
      </Route>
      <Route path="/settings" element={<PrivateRoute />}>
        <Route index element={<Settings />} />
      </Route>
    </Routes>
  );
}
