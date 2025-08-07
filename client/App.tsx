import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import OtpLogin from "./pages/OtpLogin";
import Register from "./pages/Register";
import Signup from "./pages/Signup";
import EnhancedRegistration from "./pages/EnhancedRegistration";
import ResetPassword from "./pages/ResetPassword";
import ResetPasswordConfirm from "./pages/ResetPasswordConfirm";
import PasswordResetTest from "./pages/PasswordResetTest";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
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

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
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
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Admin Routes */}
            <Route path="/admin/setup" element={<AdminSetup />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            {/* Test Setup Route */}
            <Route path="/test-setup" element={<TestSetup />} />

            {/* Debug Route */}
            <Route path="/debug" element={<Debug />} />

            {/* Supabase Test Route */}
            <Route path="/supabase-test" element={<SupabaseTest />} />

            {/* Integration Test Route */}
            <Route path="/integration-test" element={<IntegrationTest />} />

            {/* Banking Pages */}
            <Route path="/register" element={<Register />} />
            <Route
              path="/register-enhanced"
              element={<EnhancedRegistration />}
            />
            <Route path="/personal" element={<Personal />} />
            <Route path="/business" element={<Business />} />
            <Route path="/investments" element={<Investments />} />
            <Route path="/checking" element={<CheckingAccounts />} />
            <Route path="/savings" element={<SavingsAccounts />} />
            <Route
              path="/credit-cards"
              element={
                <Placeholder
                  title="Credit Cards"
                  description="Find the perfect credit card for your spending and reward preferences."
                  suggestedPrompt="Can you build a credit cards page showcasing different card types, rewards programs, and application process?"
                />
              }
            />
            <Route
              path="/loans"
              element={
                <Placeholder
                  title="Loans"
                  description="Finance your goals with our competitive loan products and rates."
                  suggestedPrompt="Can you create a loans page with personal loans, auto loans, and mortgage options?"
                />
              }
            />
            <Route
              path="/help"
              element={
                <Placeholder
                  title="Help Center"
                  description="Find answers to your questions and get the support you need."
                  suggestedPrompt="Can you build a help center with FAQs, support categories, and contact options?"
                />
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route
              path="/security"
              element={
                <Placeholder
                  title="Security Center"
                  description="Learn about how we protect your accounts and personal information."
                  suggestedPrompt="Can you create a security page explaining our security measures, fraud protection, and safety tips?"
                />
              }
            />
            <Route path="/transactions" element={<Transactions />} />
            <Route
              path="/demo"
              element={
                <Placeholder
                  title="Demo Experience"
                  description="Experience SecureBank's features with our interactive demo."
                  suggestedPrompt="Can you create an interactive demo showcasing key banking features and functionality?"
                />
              }
            />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
