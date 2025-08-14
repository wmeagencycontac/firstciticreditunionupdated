import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  CreditCard,
  DollarSign,
  Shield,
  ArrowRight,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function CheckingAccounts() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50/20 to-emerald-50/30">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 border-b bg-white/80 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00754A] to-[#005A39] rounded-xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div className="text-xl font-bold text-[#00754A]">
              Fusion Bank
            </div>
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button
                variant="ghost"
                className="text-[#00754A] hover:bg-green-50"
              >
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-gradient-to-r from-[#00754A] to-[#005A39] hover:from-[#005A39] hover:to-[#004830] text-white">
                Open Account
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-[#00754A] to-[#005A39] bg-clip-text text-transparent">
            Checking Accounts
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Choose from our range of checking accounts designed for your
            lifestyle and financial needs.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Basic Checking */}
          <Card className="group border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02] bg-gradient-to-br from-white to-green-50/30 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-green-200/30 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
            <CardHeader className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <CreditCard className="w-6 h-6 text-[#00754A]" />
              </div>
              <CardTitle className="text-xl font-bold group-hover:text-[#00754A] transition-colors duration-300">
                Basic Checking
              </CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Simple, straightforward checking for everyday banking needs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#00754A] mb-4">
                $0 Monthly Fee
              </div>
              <ul className="space-y-3 text-muted-foreground mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00754A]" />
                  No minimum balance required
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00754A]" />
                  Free debit card
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00754A]" />
                  Online and mobile banking
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00754A]" />
                  Mobile check deposit
                </li>
              </ul>
              <Link to="/apply?type=checking-basic">
                <Button className="w-full bg-gradient-to-r from-[#00754A] to-[#005A39] hover:from-[#005A39] hover:to-[#004830] text-white">
                  Open Account
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Premium Checking */}
          <Card className="group border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02] bg-gradient-to-br from-white to-blue-50/30 overflow-hidden relative border-2 border-[#00754A]/20">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-200/30 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
            <div className="absolute top-4 right-4 bg-gradient-to-r from-[#00754A] to-[#005A39] text-white px-3 py-1 rounded-full text-xs font-semibold">
              POPULAR
            </div>
            <CardHeader className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-6 h-6 text-[#00754A]" />
              </div>
              <CardTitle className="text-xl font-bold group-hover:text-[#00754A] transition-colors duration-300">
                Premium Checking
              </CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Enhanced features with premium benefits and rewards.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#00754A] mb-4">
                $15/month
              </div>
              <ul className="space-y-3 text-muted-foreground mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00754A]" />
                  Everything in Basic Checking
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00754A]" />
                  No ATM fees worldwide
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00754A]" />
                  Cashback rewards on purchases
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00754A]" />
                  Priority customer support
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00754A]" />
                  Overdraft protection
                </li>
              </ul>
              <Link to="/apply?type=checking-premium">
                <Button className="w-full bg-gradient-to-r from-[#00754A] to-[#005A39] hover:from-[#005A39] hover:to-[#004830] text-white">
                  Open Account
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Student Checking */}
          <Card className="group border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02] bg-gradient-to-br from-white to-purple-50/30 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-200/30 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
            <CardHeader className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <DollarSign className="w-6 h-6 text-[#00754A]" />
              </div>
              <CardTitle className="text-xl font-bold group-hover:text-[#00754A] transition-colors duration-300">
                Student Checking
              </CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Special checking account designed for students aged 16-25.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#00754A] mb-4">
                Free for Students
              </div>
              <ul className="space-y-3 text-muted-foreground mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00754A]" />
                  No monthly fees until age 25
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00754A]" />
                  No minimum balance
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00754A]" />
                  Free financial education resources
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00754A]" />
                  Student discounts and offers
                </li>
              </ul>
              <Link to="/apply?type=checking-student">
                <Button className="w-full bg-gradient-to-r from-[#00754A] to-[#005A39] hover:from-[#005A39] hover:to-[#004830] text-white">
                  Open Account
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Additional Information */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-[#00754A] mb-6">
            Why Choose Our Checking Accounts?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-3">Security First</h3>
              <p className="text-muted-foreground leading-relaxed">
                Your money is protected with advanced encryption, fraud
                monitoring, and FDIC insurance up to $250,000.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">
                Digital Convenience
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Manage your account 24/7 with our mobile app, online banking,
                and extensive ATM network.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link to="/contact">
            <Button
              variant="outline"
              size="lg"
              className="border-[#00754A] text-[#00754A] hover:bg-green-50"
            >
              Questions? Contact Us
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
