import { useState } from "react";
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
} from "lucide-react";

export default function Index() {
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              SecureBank
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/personal"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Personal
            </Link>
            <Link
              to="/business"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Business
            </Link>
            <Link
              to="/investments"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Investments
            </Link>
            <Link
              to="/about"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Banking made <span className="text-primary">simple</span> and{" "}
            <span className="text-primary">secure</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experience the future of banking with our comprehensive digital
            platform. Manage your finances, make payments, and grow your wealth
            with confidence.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Open Account Today
              </Button>
            </Link>
            <Link to="/demo">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Try Demo
              </Button>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">2M+</div>
              <div className="text-sm text-muted-foreground">Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">$50B+</div>
              <div className="text-sm text-muted-foreground">Assets</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything you need to manage your money
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our comprehensive banking platform provides all the tools you need
            for modern financial management.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Mobile Banking</CardTitle>
              <CardDescription>
                Bank on the go with our award-winning mobile app. Check
                balances, transfer money, and deposit checks.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Bank-Level Security</CardTitle>
              <CardDescription>
                Your money and data are protected with military-grade encryption
                and multi-factor authentication.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Investment Tools</CardTitle>
              <CardDescription>
                Grow your wealth with our investment platform. Access stocks,
                bonds, and expert financial advice.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Fraud Protection</CardTitle>
              <CardDescription>
                Advanced AI monitors your accounts 24/7 for suspicious activity
                and unauthorized transactions.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Expert Support</CardTitle>
              <CardDescription>
                Get help when you need it with 24/7 customer support from real
                banking professionals.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Global Access</CardTitle>
              <CardDescription>
                Access your accounts from anywhere in the world with no foreign
                transaction fees.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-primary text-primary-foreground border-0">
          <CardContent className="text-center py-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to get started?
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Join millions of customers who trust SecureBank with their
              financial future. Open your account in minutes and start banking
              smarter today.
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
                <Button variant="secondary" size="default">
                  Get Started
                </Button>
              </div>
            </div>
            <p className="text-sm opacity-75 mt-4">
              No fees, no minimum balance. FDIC insured up to $250,000.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-muted/30 border-t">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">SecureBank</span>
              </div>
              <p className="text-muted-foreground mb-4">
                Your trusted partner for modern banking and financial services.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Banking</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link
                    to="/checking"
                    className="hover:text-foreground transition-colors"
                  >
                    Checking
                  </Link>
                </li>
                <li>
                  <Link
                    to="/savings"
                    className="hover:text-foreground transition-colors"
                  >
                    Savings
                  </Link>
                </li>
                <li>
                  <Link
                    to="/credit-cards"
                    className="hover:text-foreground transition-colors"
                  >
                    Credit Cards
                  </Link>
                </li>
                <li>
                  <Link
                    to="/loans"
                    className="hover:text-foreground transition-colors"
                  >
                    Loans
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link
                    to="/help"
                    className="hover:text-foreground transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-foreground transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/security"
                    className="hover:text-foreground transition-colors"
                  >
                    Security
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="hover:text-foreground transition-colors"
                  >
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <div className="space-y-2 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>1-800-SECURE</span>
                </div>
                <div>
                  <p>Available 24/7</p>
                  <p>Mon-Fri: 8am-8pm EST</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 SecureBank. All rights reserved. Member FDIC.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
