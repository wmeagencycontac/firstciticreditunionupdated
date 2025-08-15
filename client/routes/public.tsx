import { Routes, Route } from "react-router-dom";
import Index from "../pages/Index";
import Login from "../pages/Login";
import OtpLogin from "../pages/OtpLogin";
import Signup from "../pages/Signup";
import ResetPassword from "../pages/ResetPassword";
import ResetPasswordConfirm from "../pages/ResetPasswordConfirm";
import PasswordResetTest from "../pages/PasswordResetTest";
import Contact from "../pages/Contact";
import Personal from "../pages/Personal";
import Business from "../pages/Business";
import Investments from "../pages/Investments";
import About from "../pages/About";
import CheckingAccounts from "../pages/CheckingAccounts";
import SavingsAccounts from "../pages/SavingsAccounts";
import CreditCards from "../pages/CreditCards";
import Loans from "../pages/Loans";
import HelpCenter from "../pages/HelpCenter";
import SecurityCenter from "../pages/SecurityCenter";
import DemoExperience from "../pages/DemoExperience";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import TermsOfService from "../pages/TermsOfService";
import Accessibility from "../pages/Accessibility";
import ApplicationForm from "../pages/ApplicationForm";
import LiveChat from "../pages/LiveChat";
import SavingsCalculator from "../pages/SavingsCalculator";
import HelpSearch from "../pages/HelpSearch";
import InteractiveDemo from "../pages/InteractiveDemo";
import MobileDepositService from "../pages/MobileDepositService";
import InstantTransfers from "../pages/InstantTransfers";
import SmartAlerts from "../pages/SmartAlerts";
import CompanyHistory from "../pages/CompanyHistory";
import Team from "../pages/Team";
import Mission from "../pages/Mission";

/**
 * Public routes accessible to all users without authentication
 */
export function PublicRoutes() {
  return (
    <Routes>
      {/* Landing and Auth Pages */}
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/otp-login" element={<OtpLogin />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/reset-password-confirm" element={<ResetPasswordConfirm />} />
      <Route path="/password-reset-test" element={<PasswordResetTest />} />

      {/* Banking Product Pages */}
      <Route path="/personal" element={<Personal />} />
      <Route path="/business" element={<Business />} />
      <Route path="/investments" element={<Investments />} />
      <Route path="/checking" element={<CheckingAccounts />} />
      <Route path="/savings" element={<SavingsAccounts />} />
      <Route path="/credit-cards" element={<CreditCards />} />
      <Route path="/loans" element={<Loans />} />

      {/* Information Pages */}
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/help" element={<HelpCenter />} />
      <Route path="/security" element={<SecurityCenter />} />
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

      {/* Service Information Pages */}
      <Route path="/mobile-deposit-service" element={<MobileDepositService />} />
      <Route path="/instant-transfers" element={<InstantTransfers />} />
      <Route path="/smart-alerts" element={<SmartAlerts />} />

      {/* Company Information */}
      <Route path="/company-history" element={<CompanyHistory />} />
      <Route path="/team" element={<Team />} />
      <Route path="/mission" element={<Mission />} />
    </Routes>
  );
}
