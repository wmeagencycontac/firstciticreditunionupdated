import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import PrivateRoute from "./components/auth/PrivateRoute";
import AdminRoute from "./components/auth/AdminRoute";
import NetworkErrorBoundary from "./components/NetworkErrorBoundary";
import Index from "./pages/Index";
import Login from "./pages/Login";
import OtpLogin from "./pages/OtpLogin";
import Signup from "./pages/Signup";
import ResetPassword from "./pages/ResetPassword";
import ResetPasswordConfirm from "./pages/ResetPasswordConfirm";
import PasswordResetTest from "./pages/PasswordResetTest";
import DashboardLayout from "./pages/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminDashboardPro from "./pages/AdminDashboardPro";
import AdminSetup from "./pages/AdminSetup";
import TestSetup from "./pages/TestSetup";
import Debug from "./pages/Debug";
import SupabaseTest from "./pages/SupabaseTest";
import IntegrationTest from "./pages/IntegrationTest";
import Placeholder from "./pages/Placeholder";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Personal from "./pages/Personal";
import Business from "./pages/Business";
import Investments from "./pages/Investments";
import About from "./pages/About";
import CheckingAccounts from "./pages/CheckingAccounts";
import SavingsAccounts from "./pages/SavingsAccounts";
import CreditCards from "./pages/CreditCards";
import Loans from "./pages/Loans";
import HelpCenter from "./pages/HelpCenter";
import SecurityCenter from "./pages/SecurityCenter";
import DemoExperience from "./pages/DemoExperience";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Accessibility from "./pages/Accessibility";
import ApplicationForm from "./pages/ApplicationForm";
import LiveChat from "./pages/LiveChat";
import SavingsCalculator from "./pages/SavingsCalculator";
import HelpSearch from "./pages/HelpSearch";
import InteractiveDemo from "./pages/InteractiveDemo";
import MobileDepositService from "./pages/MobileDepositService";
import MobileDeposit from "./pages/MobileDeposit";
import InstantTransfers from "./pages/InstantTransfers";
import SmartAlerts from "./pages/SmartAlerts";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import CompanyHistory from "./pages/CompanyHistory";
import Team from "./pages/Team";
import Mission from "./pages/Mission";
import EmailNotificationTest from "./pages/EmailNotificationTest";

const queryClient = new QueryClient();

export default function App() {
  return (
    <NetworkErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/otp-login" element={<OtpLogin />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route
                  path="/reset-password-confirm"
                  element={<ResetPasswordConfirm />}
                />
                <Route
                  path="/password-reset-test"
                  element={<PasswordResetTest />}
                />
                <Route path="/dashboard" element={<PrivateRoute />}>
                  <Route path="" element={<DashboardLayout />}>
                    <Route index element={<Dashboard />} />
                  </Route>
                </Route>

                {/* Admin Routes */}
                <Route path="/admin/setup" element={<AdminSetup />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminRoute />}>
                  <Route index element={<AdminDashboard />} />
                </Route>
                <Route path="/admin/dashboard-pro" element={<AdminRoute />}>
                  <Route index element={<AdminDashboardPro />} />
                </Route>

                {/* Test Setup Route */}
                <Route path="/test-setup" element={<TestSetup />} />

                {/* Debug Route */}
                <Route path="/debug" element={<Debug />} />

                {/* Supabase Test Route */}
                <Route path="/supabase-test" element={<SupabaseTest />} />

                {/* Integration Test Route */}
                <Route path="/integration-test" element={<IntegrationTest />} />

                {/* Banking Pages */}
                <Route path="/personal" element={<Personal />} />
                <Route path="/business" element={<Business />} />
                <Route path="/investments" element={<Investments />} />
                <Route path="/checking" element={<CheckingAccounts />} />
                <Route path="/savings" element={<SavingsAccounts />} />
                <Route path="/credit-cards" element={<CreditCards />} />
                <Route path="/loans" element={<Loans />} />
                <Route path="/help" element={<HelpCenter />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/security" element={<SecurityCenter />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/demo" element={<DemoExperience />} />

                {/* Legal Pages */}
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/accessibility" element={<Accessibility />} />

                {/* Interactive Features */}
                <Route path="/apply" element={<ApplicationForm />} />
                <Route path="/chat" element={<LiveChat />} />
                <Route path="/calculator" element={<SavingsCalculator />} />
                <Route path="/search" element={<HelpSearch />} />
                <Route path="/demo-interactive" element={<InteractiveDemo />} />

                {/* Service Pages */}
                <Route
                  path="/mobile-deposit-service"
                  element={<MobileDepositService />}
                />
                <Route path="/mobile-deposit" element={<MobileDeposit />} />
                <Route
                  path="/instant-transfers"
                  element={<InstantTransfers />}
                />
                <Route path="/smart-alerts" element={<SmartAlerts />} />

                {/* User Account Pages */}
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/settings" element={<Settings />} />

                {/* Company Info Pages */}
                <Route path="/company-history" element={<CompanyHistory />} />
                <Route path="/team" element={<Team />} />
                <Route path="/mission" element={<Mission />} />

                {/* Development/Testing Pages */}
                <Route path="/email-test" element={<EmailNotificationTest />} />

                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </NetworkErrorBoundary>
  );
}
