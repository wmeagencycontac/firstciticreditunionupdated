import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import OtpLogin from "./pages/OtpLogin";
import Register from "./pages/Register";
import EnhancedRegistration from "./pages/EnhancedRegistration";
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
import NotFound from "./pages/NotFound";

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
            <Route path="/otp-login" element={<OtpLogin />} />
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

            {/* Banking Pages */}
            <Route path="/register" element={<Register />} />
            <Route
              path="/register-enhanced"
              element={<EnhancedRegistration />}
            />
            <Route
              path="/personal"
              element={
                <Placeholder
                  title="Personal Banking"
                  description="Discover our comprehensive personal banking services and products."
                  suggestedPrompt="Can you create a personal banking page showcasing checking accounts, savings accounts, and personal loans?"
                />
              }
            />
            <Route
              path="/business"
              element={
                <Placeholder
                  title="Business Banking"
                  description="Grow your business with our specialized business banking solutions."
                  suggestedPrompt="Can you build a business banking page with business accounts, merchant services, and commercial loans?"
                />
              }
            />
            <Route
              path="/investments"
              element={
                <Placeholder
                  title="Investment Services"
                  description="Build your wealth with our comprehensive investment platform and advisory services."
                  suggestedPrompt="Can you create an investments page with portfolio management, trading tools, and market insights?"
                />
              }
            />
            <Route
              path="/checking"
              element={
                <Placeholder
                  title="Checking Accounts"
                  description="Choose from our range of checking accounts designed for your lifestyle."
                  suggestedPrompt="Can you build a checking accounts page comparing different account types and their features?"
                />
              }
            />
            <Route
              path="/savings"
              element={
                <Placeholder
                  title="Savings Accounts"
                  description="Grow your savings with competitive rates and flexible terms."
                  suggestedPrompt="Can you create a savings accounts page with different savings options and interest rate calculators?"
                />
              }
            />
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
            <Route
              path="/about"
              element={
                <Placeholder
                  title="About SecureBank"
                  description="Learn about our mission, values, and commitment to serving our customers."
                  suggestedPrompt="Can you create an about page with company history, leadership team, and our values?"
                />
              }
            />
            <Route
              path="/contact"
              element={
                <Placeholder
                  title="Contact Us"
                  description="Get in touch with our customer service team for assistance."
                  suggestedPrompt="Can you build a contact page with multiple contact methods, branch locations, and a contact form?"
                />
              }
            />
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
