import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { DollarSign, Home, Car, GraduationCap, ArrowRight, Check, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Loans() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-orange-50/20 to-yellow-50/30">
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
            Loans
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Finance your goals with our competitive loan products and rates designed to help you succeed.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Personal Loans */}
          <Card className="group border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02] bg-gradient-to-br from-white to-green-50/30 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-green-200/30 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
            <CardHeader className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <DollarSign className="w-6 h-6 text-[#00754A]" />
              </div>
              <CardTitle className="text-xl font-bold group-hover:text-[#00754A] transition-colors duration-300">
                Personal Loans
              </CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Flexible personal loans for any purpose with competitive rates.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#00754A] mb-1">6.99% APR</div>
              <div className="text-sm text-muted-foreground mb-4">Starting rate with excellent credit</div>
              <ul className="space-y-3 text-muted-foreground mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00754A]" />
                  $2,000 - $50,000 loan amounts
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00754A]" />
                  2-7 year repayment terms
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00754A]" />
                  No prepayment penalties
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00754A]" />
                  Fast approval process
                </li>
              </ul>
              <Button className="w-full bg-gradient-to-r from-[#00754A] to-[#005A39] hover:from-[#005A39] hover:to-[#004830] text-white">
                Apply Now
              </Button>
            </CardContent>
          </Card>

          {/* Auto Loans */}
          <Card className="group border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02] bg-gradient-to-br from-white to-blue-50/30 overflow-hidden relative border-2 border-[#00754A]/20">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-200/30 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
            <div className="absolute top-4 right-4 bg-gradient-to-r from-[#00754A] to-[#005A39] text-white px-3 py-1 rounded-full text-xs font-semibold">
              LOW RATES
            </div>
            <CardHeader className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Car className="w-6 h-6 text-[#00754A]" />
              </div>
              <CardTitle className="text-xl font-bold group-hover:text-[#00754A] transition-colors duration-300">
                Auto Loans
              </CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Finance your new or used vehicle with our competitive auto loans.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#00754A] mb-1">4.49% APR</div>
              <div className="text-sm text-muted-foreground mb-4">New vehicles with excellent credit</div>
              <ul className="space-y-3 text-muted-foreground mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00754A]" />
                  New and used vehicle financing
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00754A]" />
                  Up to 84-month terms
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00754A]" />
                  Pre-approval available
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00754A]" />
                  Refinancing options
                </li>
              </ul>
              <Button className="w-full bg-gradient-to-r from-[#00754A] to-[#005A39] hover:from-[#005A39] hover:to-[#004830] text-white">
                Apply Now
              </Button>
            </CardContent>
          </Card>

          {/* Home Loans */}
          <Card className="group border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02] bg-gradient-to-br from-white to-orange-50/30 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-orange-200/30 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
            <CardHeader className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Home className="w-6 h-6 text-[#00754A]" />
              </div>
              <CardTitle className="text-xl font-bold group-hover:text-[#00754A] transition-colors duration-300">
                Home Loans
              </CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Make homeownership a reality with our mortgage and home equity options.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#00754A] mb-1">5.75% APR</div>
              <div className="text-sm text-muted-foreground mb-4">30-year fixed mortgage</div>
              <ul className="space-y-3 text-muted-foreground mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00754A]" />
                  First-time buyer programs
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00754A]" />
                  Fixed and adjustable rates
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00754A]" />
                  Home equity lines of credit
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00754A]" />
                  Refinancing available
                </li>
              </ul>
              <Button className="w-full bg-gradient-to-r from-[#00754A] to-[#005A39] hover:from-[#005A39] hover:to-[#004830] text-white">
                Apply Now
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Additional Loan Types */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50/30">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6 text-[#00754A]" />
              </div>
              <CardTitle className="text-xl font-bold text-[#00754A]">
                Student Loans
              </CardTitle>
              <CardDescription>
                Invest in your education with our competitive student loan options.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground mb-4">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00754A]" />
                  Undergraduate and graduate loans
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00754A]" />
                  Flexible repayment options
                </li>
              </ul>
              <Button variant="outline" className="w-full border-[#00754A] text-[#00754A] hover:bg-green-50">
                Learn More
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-green-50/30">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6 text-[#00754A]" />
              </div>
              <CardTitle className="text-xl font-bold text-[#00754A]">
                Business Loans
              </CardTitle>
              <CardDescription>
                Grow your business with our commercial lending solutions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground mb-4">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00754A]" />
                  Equipment financing
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00754A]" />
                  Working capital loans
                </li>
              </ul>
              <Button variant="outline" className="w-full border-[#00754A] text-[#00754A] hover:bg-green-50">
                Learn More
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
