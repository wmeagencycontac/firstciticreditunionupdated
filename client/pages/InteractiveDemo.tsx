import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchParams, Link } from "react-router-dom";
import {
  Building2,
  Smartphone,
  CreditCard,
  TrendingUp,
  Eye,
  EyeOff,
  ArrowLeft,
  Home,
  CheckCircle,
  DollarSign,
} from "lucide-react";

export default function InteractiveDemo() {
  const [searchParams] = useSearchParams();
  const demoType = searchParams.get("type") || "mobile";
  const [currentStep, setCurrentStep] = useState(1);
  const [showBalance, setShowBalance] = useState(true);
  const [demoData] = useState({
    balance: 15420.5,
    savings: 8750.25,
    checkingTransactions: [
      { id: 1, description: "Coffee Shop", amount: -4.95, date: "Today" },
      {
        id: 2,
        description: "Salary Deposit",
        amount: 3200.0,
        date: "Yesterday",
      },
      {
        id: 3,
        description: "Grocery Store",
        amount: -87.45,
        date: "2 days ago",
      },
    ],
  });

  const demoTitles = {
    mobile: "Mobile Banking Demo",
    online: "Online Banking Demo",
    investment: "Investment Tools Demo",
  };

  const demoSteps = {
    mobile: [
      { title: "Login", description: "Secure biometric authentication" },
      { title: "Dashboard", description: "View account overview" },
      { title: "Transfers", description: "Move money between accounts" },
      { title: "Deposit", description: "Mobile check deposit" },
    ],
    online: [
      { title: "Login", description: "Multi-factor authentication" },
      { title: "Accounts", description: "Comprehensive account management" },
      { title: "Statements", description: "Download and view statements" },
      { title: "Settings", description: "Security and preferences" },
    ],
    investment: [
      { title: "Portfolio", description: "View investment holdings" },
      { title: "Research", description: "Market analysis tools" },
      { title: "Trading", description: "Execute investment transactions" },
      { title: "Reports", description: "Performance analytics" },
    ],
  };

  const getCurrentSteps = () =>
    demoSteps[demoType as keyof typeof demoSteps] || demoSteps.mobile;

  const renderDemoContent = () => {
    const steps = getCurrentSteps();
    const currentStepData = steps[currentStep - 1];

    if (!currentStepData) return null;

    switch (currentStepData.title) {
      case "Login":
        return (
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[#00754A] to-[#005A39] rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#00754A]">
                First City Credit Union
              </h3>
              <p className="text-muted-foreground">Secure Login</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Username
                </label>
                <Input value="demo_user" disabled className="bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Password
                </label>
                <div className="relative">
                  <Input
                    type="password"
                    value="••••••••"
                    disabled
                    className="bg-gray-50"
                  />
                  <EyeOff className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>

              {demoType === "mobile" && (
                <div className="flex items-center justify-center py-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
                    <span className="text-xl">👆</span>
                  </div>
                  <span className="ml-3 text-sm text-muted-foreground">
                    Use fingerprint to login
                  </span>
                </div>
              )}

              <Button className="w-full bg-gradient-to-r from-[#00754A] to-[#005A39] text-white">
                {demoType === "mobile" ? "Login with Touch ID" : "Secure Login"}
              </Button>
            </div>
          </div>
        );

      case "Dashboard":
      case "Accounts":
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-[#00754A]">
                Account Overview
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBalance(!showBalance)}
                className="text-muted-foreground"
              >
                {showBalance ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Checking Account
                      </p>
                      <p className="text-2xl font-bold text-[#00754A]">
                        {showBalance
                          ? `$${demoData.balance.toLocaleString()}`
                          : "••••••"}
                      </p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-cyan-50">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Savings Account
                      </p>
                      <p className="text-2xl font-bold text-blue-600">
                        {showBalance
                          ? `$${demoData.savings.toLocaleString()}`
                          : "••••••"}
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Recent Transactions</h4>
              <div className="space-y-2">
                {demoData.checkingTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{tx.description}</p>
                      <p className="text-xs text-muted-foreground">{tx.date}</p>
                    </div>
                    <p
                      className={`font-semibold ${tx.amount > 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {tx.amount > 0 ? "+" : ""}$
                      {Math.abs(tx.amount).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "Transfers":
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-2xl font-bold text-[#00754A] mb-6">
              Transfer Money
            </h3>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    From Account
                  </label>
                  <select className="w-full p-3 border rounded-lg bg-gray-50">
                    <option>Checking Account - $15,420.50</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    To Account
                  </label>
                  <select className="w-full p-3 border rounded-lg">
                    <option>Savings Account - $8,750.25</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Amount</label>
                <Input value="500.00" className="text-lg" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Memo (Optional)
                </label>
                <Input value="Monthly savings" />
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-700">
                  ✓ Transfer will be completed instantly
                </p>
              </div>

              <Button className="w-full bg-gradient-to-r from-[#00754A] to-[#005A39] text-white">
                Complete Transfer
              </Button>
            </div>
          </div>
        );

      case "Deposit":
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-2xl font-bold text-[#00754A] mb-6">
              Mobile Check Deposit
            </h3>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-green-300 rounded-lg p-8 text-center bg-green-50">
                <Smartphone className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <p className="text-lg font-medium text-green-700 mb-2">
                  Position your check here
                </p>
                <p className="text-sm text-muted-foreground">
                  Make sure all four corners are visible
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Deposit Amount
                </label>
                <Input value="$1,250.00" className="text-lg" />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">
                  Deposit Details
                </h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <p>• Funds available immediately up to $200</p>
                  <p>• Remaining funds available next business day</p>
                  <p>• Keep your check for 30 days</p>
                </div>
              </div>

              <Button className="w-full bg-gradient-to-r from-[#00754A] to-[#005A39] text-white">
                Deposit Check
              </Button>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-[#00754A] mb-4">
              {currentStepData.title}
            </h3>
            <p className="text-muted-foreground mb-6">
              {currentStepData.description}
            </p>
            <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mx-auto flex items-center justify-center">
              <span className="text-4xl">🚧</span>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              This feature would show{" "}
              {currentStepData.description.toLowerCase()}
            </p>
          </div>
        );
    }
  };

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
              First City Credit Union
            </div>
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/demo">
              <Button
                variant="ghost"
                className="text-[#00754A] hover:bg-green-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Demos
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

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#00754A] mb-2">
            {demoTitles[demoType as keyof typeof demoTitles]}
          </h1>
          <p className="text-muted-foreground">
            Experience our banking features in this interactive demonstration
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Progress Sidebar */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-[#00754A]">
                  Demo Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {getCurrentSteps().map((step, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      currentStep === index + 1
                        ? "bg-green-50 border border-green-200"
                        : currentStep > index + 1
                          ? "bg-gray-50"
                          : "hover:bg-gray-50"
                    }`}
                    onClick={() => setCurrentStep(index + 1)}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                        currentStep > index + 1
                          ? "bg-green-500 text-white"
                          : currentStep === index + 1
                            ? "bg-[#00754A] text-white"
                            : "bg-gray-300 text-gray-600"
                      }`}
                    >
                      {currentStep > index + 1 ? "✓" : index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{step.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {step.description}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Demo Info */}
            <Card className="shadow-lg mt-6">
              <CardHeader>
                <CardTitle className="text-lg text-[#00754A]">
                  Demo Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Simulated real banking interface</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Safe demo environment</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>No real transactions</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Learn at your own pace</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Demo Content */}
          <div className="lg:col-span-3">
            <div className="mb-6">{renderDemoContent()}</div>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
                className="border-[#00754A] text-[#00754A] hover:bg-green-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {currentStep < getCurrentSteps().length ? (
                <Button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="bg-gradient-to-r from-[#00754A] to-[#005A39] hover:from-[#005A39] hover:to-[#004830] text-white"
                >
                  Next Step
                  <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                </Button>
              ) : (
                <Link to="/signup">
                  <Button className="bg-gradient-to-r from-[#00754A] to-[#005A39] hover:from-[#005A39] hover:to-[#004830] text-white">
                    Open Real Account
                    <Home className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-[#00754A] mb-4">
              Ready to Experience the Real Thing?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              This demo shows just a fraction of what First City Credit Union
              offers. Open an account today to access all features with your own
              secure banking portal.
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
              <Link to="/demo">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[#00754A] text-[#00754A] hover:bg-green-50"
                >
                  Try Other Demos
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
