import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { CreditCard, Gift, Shield, Star, ArrowRight, Check, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function CreditCards() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/20 to-indigo-50/30">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 border-b bg-white/80 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00754A] to-[#005A39] rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
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
                Apply Now
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-[#00754A] to-[#005A39] bg-clip-text text-transparent">
            Credit Cards
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Find the perfect credit card for your spending and reward preferences with competitive rates and benefits.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Cashback Card */}
          <Card className="group border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02] bg-gradient-to-br from-white to-green-50/30 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-green-200/30 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
            <CardHeader className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Gift className="w-6 h-6 text-[#00754A]" />
              </div>
              <CardTitle className="text-xl font-bold group-hover:text-[#00754A] transition-colors duration-300">
                Cashback Rewards Card
              </CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Earn cash back on every purchase with no annual fee.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#00754A] mb-1">3% Cashback</div>
              <div className="text-sm text-muted-foreground mb-4">On gas, groceries & dining</div>
              <ul className="space-y-3 text-muted-foreground mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00754A]" />
                  1% cashback on all other purchases
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00754A]" />
                  No annual fee
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00754A]" />
                  12.99% - 24.99% Variable APR
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00754A]" />
                  0% intro APR for 15 months
                </li>
              </ul>
              <Button className="w-full bg-gradient-to-r from-[#00754A] to-[#005A39] hover:from-[#005A39] hover:to-[#004830] text-white">
                Apply Now
              </Button>
            </CardContent>
          </Card>

          {/* Premium Rewards Card */}
          <Card className="group border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02] bg-gradient-to-br from-white to-purple-50/30 overflow-hidden relative border-2 border-[#00754A]/20">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-200/30 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
            <div className="absolute top-4 right-4 bg-gradient-to-r from-[#00754A] to-[#005A39] text-white px-3 py-1 rounded-full text-xs font-semibold">
              PREMIUM
            </div>
            <CardHeader className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Star className="w-6 h-6 text-[#00754A]" />
              </div>
              <CardTitle className="text-xl font-bold group-hover:text-[#00754A] transition-colors duration-300">
                Premium Rewards Card
              </CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Premium benefits with travel rewards and exclusive perks.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#00754A] mb-1">5X Points</div>
              <div className="text-sm text-muted-foreground mb-4">On travel & dining</div>
              <ul className="space-y-3 text-muted-foreground mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00754A]" />
                  2X points on all other purchases
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00754A]" />
                  $95 annual fee
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00754A]" />
                  Travel insurance included
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00754A]" />
                  Airport lounge access
                </li>
              </ul>
              <Button className="w-full bg-gradient-to-r from-[#00754A] to-[#005A39] hover:from-[#005A39] hover:to-[#004830] text-white">
                Apply Now
              </Button>
            </CardContent>
          </Card>

          {/* Secured Card */}
          <Card className="group border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02] bg-gradient-to-br from-white to-blue-50/30 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-200/30 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
            <CardHeader className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-6 h-6 text-[#00754A]" />
              </div>
              <CardTitle className="text-xl font-bold group-hover:text-[#00754A] transition-colors duration-300">
                Secured Credit Card
              </CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Build or rebuild your credit with our secured card program.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#00754A] mb-1">Build Credit</div>
              <div className="text-sm text-muted-foreground mb-4">$200 minimum deposit</div>
              <ul className="space-y-3 text-muted-foreground mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00754A]" />
                  No credit check required
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00754A]" />
                  Reports to credit bureaus
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00754A]" />
                  Graduate to unsecured card
                </li>
              </ul>
              <Button className="w-full bg-gradient-to-r from-[#00754A] to-[#005A39] hover:from-[#005A39] hover:to-[#004830] text-white">
                Apply Now
              </Button>
            </CardContent>
          </Card>
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
