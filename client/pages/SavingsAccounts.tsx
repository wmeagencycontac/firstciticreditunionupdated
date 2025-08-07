import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { PiggyBank, TrendingUp, Target, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function SavingsAccounts() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/20 to-cyan-50/30">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 border-b bg-white/80 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00754A] to-[#005A39] rounded-xl flex items-center justify-center">
              <PiggyBank className="w-6 h-6 text-white" />
            </div>
            <div className="text-xl font-bold text-[#00754A]">
              First City Credit Union
            </div>
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost" className="text-[#00754A] hover:bg-green-50">
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
            Savings Accounts
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Grow your savings with competitive rates and flexible terms that work for your financial goals.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Regular Savings */}
          <Card className="group border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02] bg-gradient-to-br from-white to-blue-50/30 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-200/30 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
            <CardHeader className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <PiggyBank className="w-6 h-6 text-[#00754A]" />
              </div>
              <CardTitle className="text-xl font-bold group-hover:text-[#00754A] transition-colors duration-300">
                Regular Savings
              </CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Start saving with our flexible, no-hassle savings account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#00754A] mb-1">2.50% APY</div>
              <div className="text-sm text-muted-foreground mb-4">$100 minimum to open</div>
              <ul className="space-y-3 text-muted-foreground mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00754A]" />
                  No monthly maintenance fees
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00754A]" />
                  Online and mobile access
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00754A]" />
                  Automatic savings programs
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00754A]" />
                  FDIC insured up to $250,000
                </li>
              </ul>
              <Button className="w-full bg-gradient-to-r from-[#00754A] to-[#005A39] hover:from-[#005A39] hover:to-[#004830] text-white">
                Open Account
              </Button>
            </CardContent>
          </Card>

          {/* High-Yield Savings */}
          <Card className="group border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02] bg-gradient-to-br from-white to-green-50/30 overflow-hidden relative border-2 border-[#00754A]/20">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-green-200/30 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
            <div className="absolute top-4 right-4 bg-gradient-to-r from-[#00754A] to-[#005A39] text-white px-3 py-1 rounded-full text-xs font-semibold">
              BEST RATE
            </div>
            <CardHeader className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-6 h-6 text-[#00754A]" />
              </div>
              <CardTitle className="text-xl font-bold group-hover:text-[#00754A] transition-colors duration-300">
                High-Yield Savings
              </CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Maximize your earnings with our premium savings account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#00754A] mb-1">4.25% APY</div>
              <div className="text-sm text-muted-foreground mb-4">$1,000 minimum to open</div>
              <ul className="space-y-3 text-muted-foreground mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00754A]" />
                  Competitive interest rates
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00754A]" />
                  No monthly fees with $1,000 balance
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00754A]" />
                  Interest compounded daily
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00754A]" />
                  Priority customer service
                </li>
              </ul>
              <Button className="w-full bg-gradient-to-r from-[#00754A] to-[#005A39] hover:from-[#005A39] hover:to-[#004830] text-white">
                Open Account
              </Button>
            </CardContent>
          </Card>

          {/* Goal Savings */}
          <Card className="group border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02] bg-gradient-to-br from-white to-purple-50/30 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-200/30 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
            <CardHeader className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Target className="w-6 h-6 text-[#00754A]" />
              </div>
              <CardTitle className="text-xl font-bold group-hover:text-[#00754A] transition-colors duration-300">
                Goal Savings
              </CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Save for specific goals with our dedicated savings program.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#00754A] mb-1">3.75% APY</div>
              <div className="text-sm text-muted-foreground mb-4">$25 minimum to open</div>
              <ul className="space-y-3 text-muted-foreground mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00754A]" />
                  Multiple savings goals
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00754A]" />
                  Visual progress tracking
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00754A]" />
                  Automatic transfers
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00754A]" />
                  Round-up savings program
                </li>
              </ul>
              <Button className="w-full bg-gradient-to-r from-[#00754A] to-[#005A39] hover:from-[#005A39] hover:to-[#004830] text-white">
                Open Account
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Savings Calculator */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-[#00754A] mb-6 text-center">Savings Calculator</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Calculate Your Savings Growth</h3>
              <p className="text-muted-foreground mb-4">
                See how your money can grow with our competitive interest rates and compound interest.
              </p>
              <Button variant="outline" className="border-[#00754A] text-[#00754A] hover:bg-green-50">
                Use Calculator
              </Button>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
              <h4 className="font-semibold text-[#00754A] mb-2">Example Calculation</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Initial deposit:</span>
                  <span className="font-semibold">$1,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Monthly deposit:</span>
                  <span className="font-semibold">$200</span>
                </div>
                <div className="flex justify-between">
                  <span>APY:</span>
                  <span className="font-semibold">4.25%</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-[#00754A]">
                  <span>After 5 years:</span>
                  <span>$13,847</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-[#00754A] mb-6">Savings Tips</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-[#00754A] mb-2">Start Small</h3>
              <p className="text-muted-foreground text-sm">
                Even $25 a month can grow significantly over time with compound interest.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[#00754A] mb-2">Automate It</h3>
              <p className="text-muted-foreground text-sm">
                Set up automatic transfers to make saving effortless and consistent.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[#00754A] mb-2">Set Goals</h3>
              <p className="text-muted-foreground text-sm">
                Having specific savings goals makes it easier to stay motivated and on track.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link to="/contact">
            <Button variant="outline" size="lg" className="border-[#00754A] text-[#00754A] hover:bg-green-50">
              Questions? Contact Us
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
