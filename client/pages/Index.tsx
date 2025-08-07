import { useState } from "react";
import Personal from "./Personal";
import Business from "./Business";
import Investments from "./Investments";
import About from "./About";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Shield,
  Smartphone,
  CreditCard,
  TrendingUp,
  Lock,
  Users,
  Globe,
  Phone,
  Building2,
  Zap,
  Clock,
  CheckCircle,
  Star,
  Award,
  Camera,
  ArrowUpDown,
  Bell,
  Menu,
  X,
} from "lucide-react";

export default function Index() {
  const [email, setEmail] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-green-50/30 to-emerald-50/60">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 transition-all duration-300">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00754A] to-[#005A39] rounded-xl flex items-center justify-center shadow-lg shadow-green-500/25">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold text-[#00754A]">
                First City Credit Union
              </div>
              <div className="text-xs text-muted-foreground">
                Your Future. Your Credit Union.
              </div>
            </div>
          </div>
          <div className="hidden lg:flex items-center space-x-8">
            <Link
              to="/personal"
              className="text-muted-foreground hover:text-[#00754A] transition-all duration-300 font-medium relative group"
            >
              Personal
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#00754A] to-[#005A39] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              to="/business"
              className="text-muted-foreground hover:text-[#00754A] transition-all duration-300 font-medium relative group"
            >
              Business
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#00754A] to-[#005A39] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              to="/investments"
              className="text-muted-foreground hover:text-[#00754A] transition-all duration-300 font-medium relative group"
            >
              Investments
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#00754A] to-[#005A39] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              to="/about"
              className="text-muted-foreground hover:text-[#00754A] transition-all duration-300 font-medium relative group"
            >
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#00754A] to-[#005A39] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/test-setup">
              <Button variant="outline" size="sm" className="hidden md:flex">
                Test Setup
              </Button>
            </Link>
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login">
                <Button
                  variant="ghost"
                  className="text-[#00754A] hover:bg-green-50 transition-all duration-300 hover:scale-105"
                >
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-gradient-to-r from-[#00754A] to-[#005A39] hover:from-[#005A39] hover:to-[#004830] text-white shadow-lg shadow-green-500/30 hover:shadow-green-500/40 transition-all duration-300 hover:scale-105">
                  Open an Account
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-green-200/50">
            <div className="flex flex-col space-y-4 pt-4">
              <Link
                to="/personal"
                className="text-muted-foreground hover:text-[#00754A] transition-colors font-medium px-4 py-2 rounded-lg hover:bg-green-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Personal Banking
              </Link>
              <Link
                to="/business"
                className="text-muted-foreground hover:text-[#00754A] transition-colors font-medium px-4 py-2 rounded-lg hover:bg-green-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Business Banking
              </Link>
              <Link
                to="/investments"
                className="text-muted-foreground hover:text-[#00754A] transition-colors font-medium px-4 py-2 rounded-lg hover:bg-green-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Investments
              </Link>
              <Link
                to="/about"
                className="text-muted-foreground hover:text-[#00754A] transition-colors font-medium px-4 py-2 rounded-lg hover:bg-green-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <div className="flex flex-col space-y-2 pt-2">
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className="w-full text-[#00754A] hover:bg-green-50 justify-start"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button
                    className="w-full bg-gradient-to-r from-[#00754A] to-[#005A39] hover:from-[#005A39] hover:to-[#004830] text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Open an Account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 lg:py-24 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-br from-green-200/30 to-emerald-300/20 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-tr from-blue-200/20 to-green-200/30 rounded-full blur-3xl -z-10"></div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Your Future. <br />
              <span className="bg-gradient-to-r from-[#00754A] to-[#005A39] bg-clip-text text-transparent">Your Credit Union.</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Experience banking that puts you first. From mobile deposit to
              instant transfers, we're here to help you achieve your financial
              goals with trust and convenience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link to="/signup">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-[#00754A] to-[#005A39] hover:from-[#005A39] hover:to-[#004830] text-white px-8 shadow-lg shadow-green-500/30 hover:shadow-green-500/40 transition-all duration-300 hover:scale-105"
                >
                  Open an Account
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-[#00754A] text-[#00754A] hover:bg-green-50 px-8 transition-all duration-300 hover:scale-105 hover:shadow-md"
                >
                  Login
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#00754A]" />
                <span>NCUA Insured</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#00754A]" />
                <span>256-bit SSL Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#00754A]" />
                <span>2FA Protected</span>
              </div>
            </div>
          </div>

          <div className="lg:pl-8 animate-slide-in">
            {/* Feature Cards */}
            <div className="grid gap-6">
              <Card className="border-0 shadow-lg shadow-green-500/10 hover:shadow-xl hover:shadow-green-500/20 transition-all duration-500 hover:scale-[1.02] group bg-gradient-to-br from-white to-green-50/30">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110">
                      <Camera className="w-7 h-7 text-[#00754A]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xl mb-2 text-foreground group-hover:text-[#00754A] transition-colors duration-300">
                        Mobile Deposit
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Deposit checks instantly with your smartphone camera.
                        Available 24/7.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg shadow-green-500/10 hover:shadow-xl hover:shadow-green-500/20 transition-all duration-500 hover:scale-[1.02] group bg-gradient-to-br from-white to-green-50/30">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110">
                      <ArrowUpDown className="w-7 h-7 text-[#00754A]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xl mb-2 text-foreground group-hover:text-[#00754A] transition-colors duration-300">
                        Instant Transfers
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Send money between accounts instantly with real-time
                        notifications.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg shadow-green-500/10 hover:shadow-xl hover:shadow-green-500/20 transition-all duration-500 hover:scale-[1.02] group bg-gradient-to-br from-white to-green-50/30">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110">
                      <Bell className="w-7 h-7 text-[#00754A]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xl mb-2 text-foreground group-hover:text-[#00754A] transition-colors duration-300">
                        Smart Alerts
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Stay informed with customizable alerts for transactions
                        and balances.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-20 pt-16 border-t border-green-200/50">
          <div className="text-center group hover:scale-105 transition-transform duration-300">
            <div className="text-4xl font-bold bg-gradient-to-r from-[#00754A] to-[#005A39] bg-clip-text text-transparent mb-2">150K+</div>
            <div className="text-sm text-muted-foreground font-medium group-hover:text-[#00754A] transition-colors duration-300">Members</div>
          </div>
          <div className="text-center group hover:scale-105 transition-transform duration-300">
            <div className="text-4xl font-bold bg-gradient-to-r from-[#00754A] to-[#005A39] bg-clip-text text-transparent mb-2">$2.5B+</div>
            <div className="text-sm text-muted-foreground font-medium group-hover:text-[#00754A] transition-colors duration-300">Assets</div>
          </div>
          <div className="text-center group hover:scale-105 transition-transform duration-300">
            <div className="text-4xl font-bold bg-gradient-to-r from-[#00754A] to-[#005A39] bg-clip-text text-transparent mb-2">99.9%</div>
            <div className="text-sm text-muted-foreground font-medium group-hover:text-[#00754A] transition-colors duration-300">Uptime</div>
          </div>
          <div className="text-center group hover:scale-105 transition-transform duration-300">
            <div className="text-4xl font-bold bg-gradient-to-r from-[#00754A] to-[#005A39] bg-clip-text text-transparent mb-2">24/7</div>
            <div className="text-sm text-muted-foreground font-medium group-hover:text-[#00754A] transition-colors duration-300">Support</div>
          </div>
        </div>
      </section>

      {/* Personal Banking Section */}
      <div id="personal">
        <Personal />
      </div>
      {/* Business Banking Section */}
      <div id="business">
        <Business />
      </div>
      {/* Investments Section */}
      <div id="investments">
        <Investments />
      </div>
      {/* About Section */}
      <div id="about">
        <About />
      </div>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-br from-[#00754A] via-[#005A39] to-[#004830] text-white border-0 overflow-hidden relative shadow-2xl shadow-green-500/25">
          <div className="absolute inset-0 bg-gradient-to-r from-[#00754A]/90 to-[#005A39]/90"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-white/10 to-transparent rounded-full -translate-y-48 translate-x-48"></div>
          <CardContent className="text-center py-16 relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to join First City Credit Union?
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Join over 150,000 members who trust First City Credit Union with
              their financial future. Open your account in minutes and start
              banking smarter today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <div className="flex gap-2 w-full sm:w-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white text-foreground border-0 w-full sm:w-64"
                />
                <Link to="/signup">
                  <Button
                    variant="secondary"
                    size="default"
                    className="bg-white text-[#00754A] hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
            <p className="text-sm opacity-75 mt-4">
              No fees, no minimum balance. NCUA insured up to $250,000.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#00754A] to-[#005A39] rounded-xl flex items-center justify-center shadow-lg">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-xl font-bold">
                    First City Credit Union
                  </div>
                  <div className="text-xs text-gray-400">
                    Your Future. Your Credit Union.
                  </div>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                Your trusted partner for modern banking and financial services
                since 1952.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-[#00754A]">Banking</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    to="/checking"
                    className="hover:text-white transition-colors"
                  >
                    Checking Accounts
                  </Link>
                </li>
                <li>
                  <Link
                    to="/savings"
                    className="hover:text-white transition-colors"
                  >
                    Savings Accounts
                  </Link>
                </li>
                <li>
                  <Link
                    to="/credit-cards"
                    className="hover:text-white transition-colors"
                  >
                    Credit Cards
                  </Link>
                </li>
                <li>
                  <Link
                    to="/loans"
                    className="hover:text-white transition-colors"
                  >
                    Loans & Mortgages
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-[#00754A]">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    to="/help"
                    className="hover:text-white transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/security"
                    className="hover:text-white transition-colors"
                  >
                    Security Center
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-[#00754A]">Contact</h3>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>(555) 123-FCCU</span>
                </div>
                <div>
                  <p className="font-medium text-white">Member Services:</p>
                  <p>Available 24/7</p>
                  <p>Mon-Fri: 7am-10pm EST</p>
                  <p>Sat-Sun: 8am-6pm EST</p>
                </div>
                <div className="flex items-center gap-4 pt-2">
                  <Shield className="w-5 h-5 text-[#00754A]" />
                  <span className="text-sm">NCUA Member</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p>
                &copy; 2024 First City Credit Union. All rights reserved. Member
                NCUA. Equal Housing Lender.
              </p>
              <div className="flex items-center gap-6 text-sm">
                <Link
                  to="/terms"
                  className="hover:text-white transition-colors"
                >
                  Terms
                </Link>
                <Link
                  to="/privacy"
                  className="hover:text-white transition-colors"
                >
                  Privacy
                </Link>
                <Link
                  to="/accessibility"
                  className="hover:text-white transition-colors"
                >
                  Accessibility
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
