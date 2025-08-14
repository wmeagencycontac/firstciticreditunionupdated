import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Play,
  Smartphone,
  CreditCard,
  TrendingUp,
  ArrowRight,
  Users,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function DemoExperience() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-indigo-50/20 to-purple-50/30">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 border-b bg-white/80 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00754A] to-[#005A39] rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
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
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-[#00754A] to-[#005A39] bg-clip-text text-transparent">
            Demo Experience
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Experience Fusion Bank's features with our interactive
            demo and see how we can help manage your finances.
          </p>
        </div>

        {/* Demo Options */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          <Card className="group border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02] bg-gradient-to-br from-white to-green-50/30 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-green-200/30 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
            <CardHeader className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Smartphone className="w-6 h-6 text-[#00754A]" />
              </div>
              <CardTitle className="text-xl font-bold group-hover:text-[#00754A] transition-colors duration-300">
                Mobile Banking Demo
              </CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Explore our mobile app features and user-friendly interface.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-muted-foreground mb-6">
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-[#00754A]" />
                  Account overview and balances
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-[#00754A]" />
                  Mobile check deposit
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-[#00754A]" />
                  Transfer funds between accounts
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-[#00754A]" />
                  Pay bills and manage payees
                </li>
              </ul>
              <Link to="/demo-interactive?type=mobile">
                <Button className="w-full bg-gradient-to-r from-[#00754A] to-[#005A39] hover:from-[#005A39] hover:to-[#004830] text-white">
                  <Play className="w-4 h-4 mr-2" />
                  Start Demo
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02] bg-gradient-to-br from-white to-blue-50/30 overflow-hidden relative border-2 border-[#00754A]/20">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-200/30 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
            <div className="absolute top-4 right-4 bg-gradient-to-r from-[#00754A] to-[#005A39] text-white px-3 py-1 rounded-full text-xs font-semibold">
              POPULAR
            </div>
            <CardHeader className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <CreditCard className="w-6 h-6 text-[#00754A]" />
              </div>
              <CardTitle className="text-xl font-bold group-hover:text-[#00754A] transition-colors duration-300">
                Online Banking Demo
              </CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Experience the full power of our online banking platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-muted-foreground mb-6">
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-[#00754A]" />
                  Comprehensive account management
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-[#00754A]" />
                  Detailed transaction history
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-[#00754A]" />
                  Download statements and tax documents
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-[#00754A]" />
                  Advanced security settings
                </li>
              </ul>
              <Link to="/demo-interactive?type=online">
                <Button className="w-full bg-gradient-to-r from-[#00754A] to-[#005A39] hover:from-[#005A39] hover:to-[#004830] text-white">
                  <Play className="w-4 h-4 mr-2" />
                  Start Demo
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02] bg-gradient-to-br from-white to-purple-50/30 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-200/30 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
            <CardHeader className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-6 h-6 text-[#00754A]" />
              </div>
              <CardTitle className="text-xl font-bold group-hover:text-[#00754A] transition-colors duration-300">
                Investment Tools Demo
              </CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Discover our investment platform and financial planning tools.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-muted-foreground mb-6">
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-[#00754A]" />
                  Portfolio tracking and analytics
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-[#00754A]" />
                  Investment research tools
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-[#00754A]" />
                  Retirement planning calculators
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-[#00754A]" />
                  Goal-based savings tracking
                </li>
              </ul>
              <Link to="/demo-interactive?type=investment">
                <Button className="w-full bg-gradient-to-r from-[#00754A] to-[#005A39] hover:from-[#005A39] hover:to-[#004830] text-white">
                  <Play className="w-4 h-4 mr-2" />
                  Start Demo
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Features */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-[#00754A] mb-6 text-center">
            Interactive Features You Can Try
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "💳",
                title: "Virtual Debit Card",
                description: "See how card controls work",
              },
              {
                icon: "📱",
                title: "Mobile Check Deposit",
                description: "Experience deposit capture",
              },
              {
                icon: "💸",
                title: "Money Transfers",
                description: "Send money to friends",
              },
              {
                icon: "📊",
                title: "Spending Analytics",
                description: "Track your expenses",
              },
              {
                icon: "🏦",
                title: "ATM Locator",
                description: "Find nearby ATMs",
              },
              {
                icon: "🔔",
                title: "Custom Alerts",
                description: "Set up notifications",
              },
              {
                icon: "💡",
                title: "Financial Insights",
                description: "Get personalized tips",
              },
              {
                icon: "🎯",
                title: "Savings Goals",
                description: "Set and track goals",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="text-center border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-white to-green-50/20 cursor-pointer"
              >
                <CardContent className="p-6">
                  <div className="text-3xl mb-3">{feature.icon}</div>
                  <h3 className="font-semibold text-[#00754A] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Demo Scenarios */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-green-50/30">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-[#00754A]" />
              </div>
              <CardTitle className="text-xl font-bold text-[#00754A]">
                Personal Banking Scenario
              </CardTitle>
              <CardDescription>
                Experience managing personal finances as John, a young
                professional.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground mb-6">
                <li>• Managing checking and savings accounts</li>
                <li>• Paying bills and transferring money</li>
                <li>• Setting up automatic savings</li>
                <li>• Using mobile banking features</li>
              </ul>
              <Button className="w-full bg-gradient-to-r from-[#00754A] to-[#005A39] hover:from-[#005A39] hover:to-[#004830] text-white">
                Try Personal Scenario
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50/30">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6 text-[#00754A]" />
              </div>
              <CardTitle className="text-xl font-bold text-[#00754A]">
                Business Banking Scenario
              </CardTitle>
              <CardDescription>
                Experience business banking as Sarah, a small business owner.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground mb-6">
                <li>• Managing business accounts</li>
                <li>• Processing payroll and vendor payments</li>
                <li>• Handling merchant services</li>
                <li>• Accessing business credit solutions</li>
              </ul>
              <Button className="w-full bg-gradient-to-r from-[#00754A] to-[#005A39] hover:from-[#005A39] hover:to-[#004830] text-white">
                Try Business Scenario
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-[#00754A] mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            After exploring our demo, join thousands of satisfied members who
            trust Fusion Bank with their financial future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#00754A] to-[#005A39] hover:from-[#005A39] hover:to-[#004830] text-white"
              >
                Open an Account
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                variant="outline"
                size="lg"
                className="border-[#00754A] text-[#00754A] hover:bg-green-50"
              >
                Talk to an Expert
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
