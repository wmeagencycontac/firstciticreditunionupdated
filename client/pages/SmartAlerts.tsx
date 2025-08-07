import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Bell,
  Smartphone,
  Mail,
  Shield,
  ArrowLeft,
  Building2,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Calendar,
  Settings,
} from "lucide-react";

export default function SmartAlerts() {
  const [alertSettings, setAlertSettings] = useState({
    transactions: true,
    balances: true,
    security: true,
    payments: false,
    marketing: false,
  });

  const alertTypes = [
    {
      category: "Transaction Alerts",
      icon: <CreditCard className="w-6 h-6" />,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      alerts: [
        {
          name: "All transactions",
          description: "Get notified for every purchase and deposit",
          enabled: true,
        },
        {
          name: "Large transactions",
          description: "Alerts for transactions over $500",
          enabled: true,
        },
        {
          name: "ATM withdrawals",
          description: "Notify when you use ATMs",
          enabled: true,
        },
        {
          name: "Online purchases",
          description: "Alerts for online and card-not-present transactions",
          enabled: false,
        },
      ],
    },
    {
      category: "Balance Alerts",
      icon: <TrendingUp className="w-6 h-6" />,
      color: "text-green-600",
      bgColor: "bg-green-100",
      alerts: [
        {
          name: "Low balance",
          description: "Alert when balance falls below $100",
          enabled: true,
        },
        {
          name: "High balance",
          description: "Notify when balance exceeds $5,000",
          enabled: false,
        },
        {
          name: "Daily balance",
          description: "Daily account balance summary",
          enabled: false,
        },
        {
          name: "Overdraft protection",
          description: "Alerts before potential overdrafts",
          enabled: true,
        },
      ],
    },
    {
      category: "Security Alerts",
      icon: <Shield className="w-6 h-6" />,
      color: "text-red-600",
      bgColor: "bg-red-100",
      alerts: [
        {
          name: "Login alerts",
          description: "Notify when someone logs into your account",
          enabled: true,
        },
        {
          name: "Password changes",
          description: "Alert when account password is changed",
          enabled: true,
        },
        {
          name: "Failed login attempts",
          description: "Notify of unsuccessful login attempts",
          enabled: true,
        },
        {
          name: "Device registration",
          description: "Alert when new devices are registered",
          enabled: true,
        },
      ],
    },
    {
      category: "Payment Reminders",
      icon: <Calendar className="w-6 h-6" />,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      alerts: [
        {
          name: "Bill due dates",
          description: "Remind you of upcoming bill payments",
          enabled: false,
        },
        {
          name: "Payment confirmations",
          description: "Confirm successful bill payments",
          enabled: false,
        },
        {
          name: "Auto-pay failures",
          description: "Alert when automatic payments fail",
          enabled: true,
        },
        {
          name: "Payment scheduling",
          description: "Remind you to schedule recurring payments",
          enabled: false,
        },
      ],
    },
  ];

  const deliveryMethods = [
    {
      method: "Push Notifications",
      icon: <Smartphone className="w-5 h-5" />,
      description: "Instant alerts on your mobile device",
      recommended: true,
    },
    {
      method: "Email",
      icon: <Mail className="w-5 h-5" />,
      description: "Detailed alerts sent to your email address",
      recommended: true,
    },
    {
      method: "SMS Text",
      icon: <Bell className="w-5 h-5" />,
      description: "Quick text message alerts (standard rates apply)",
      recommended: false,
    },
  ];

  const toggleAlert = (category: string, alertIndex: number) => {
    // This would normally update the alert settings
    console.log(`Toggle alert ${alertIndex} in ${category}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-50/30 to-indigo-50/60">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 border-b bg-white/80 backdrop-blur-md">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00754A] to-[#005A39] rounded-xl flex items-center justify-center shadow-lg shadow-green-500/25">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold text-[#00754A]">
                First City Credit Union
              </div>
              <div className="text-xs text-muted-foreground">Smart Alerts</div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-gradient-to-r from-[#00754A] to-[#005A39] hover:from-[#005A39] hover:to-[#004830] text-white shadow-lg shadow-green-500/30">
                Open an Account
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Bell className="w-10 h-10 text-[#00754A]" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-[#00754A] to-[#005A39] bg-clip-text text-transparent">
            Smart Alerts
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Stay informed with customizable alerts for transactions, balances,
            and account security. Get notified instantly on your phone, email,
            or SMS.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#00754A] to-[#005A39] hover:from-[#005A39] hover:to-[#004830] text-white px-8 shadow-lg"
              >
                Set Up Alerts
              </Button>
            </Link>
            <Link to="/login">
              <Button
                variant="outline"
                size="lg"
                className="border-[#00754A] text-[#00754A] hover:bg-green-50 px-8"
              >
                Manage Your Alerts
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Delivery Methods Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Choose How You Want to be Notified
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {deliveryMethods.map((method, index) => (
              <Card
                key={index}
                className={`relative hover:shadow-lg transition-shadow duration-300 ${method.recommended ? "ring-2 ring-[#00754A]" : ""}`}
              >
                {method.recommended && (
                  <Badge className="absolute -top-2 -right-2 bg-[#00754A] text-white">
                    Recommended
                  </Badge>
                )}
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    {method.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    {method.method}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {method.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Alert Categories Section */}
      <section className="container mx-auto px-4 py-16 bg-gray-50/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Customize Your Alert Preferences
          </h2>
          <div className="grid lg:grid-cols-2 gap-8">
            {alertTypes.map((category, categoryIndex) => (
              <Card
                key={categoryIndex}
                className="hover:shadow-lg transition-shadow duration-300"
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 ${category.bgColor} rounded-lg flex items-center justify-center`}
                    >
                      <span className={category.color}>{category.icon}</span>
                    </div>
                    {category.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {category.alerts.map((alert, alertIndex) => (
                      <div
                        key={alertIndex}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <Label
                            htmlFor={`alert-${categoryIndex}-${alertIndex}`}
                            className="font-medium cursor-pointer"
                          >
                            {alert.name}
                          </Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            {alert.description}
                          </p>
                        </div>
                        <Switch
                          id={`alert-${categoryIndex}-${alertIndex}`}
                          checked={alert.enabled}
                          onCheckedChange={() =>
                            toggleAlert(category.category, alertIndex)
                          }
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Why Smart Alerts Matter
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-green-200 bg-green-50/50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-green-900">
                      Fraud Protection
                    </h3>
                    <p className="text-green-800">
                      Get instant notifications of suspicious activity, helping
                      you catch fraud early and protect your accounts.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50/50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-blue-900">
                      Budget Management
                    </h3>
                    <p className="text-blue-800">
                      Stay on top of your spending with real-time transaction
                      alerts and balance notifications.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50/50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Settings className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-purple-900">
                      Full Control
                    </h3>
                    <p className="text-purple-800">
                      Customize which alerts you receive and how you receive
                      them. Turn notifications on or off anytime.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-orange-50/50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-orange-900">
                      Overdraft Prevention
                    </h3>
                    <p className="text-orange-800">
                      Avoid costly overdraft fees with low balance alerts and
                      spending notifications that help you stay within budget.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How to Set Up Section */}
      <section className="container mx-auto px-4 py-16 bg-gray-50/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            How to Set Up Smart Alerts
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-[#00754A] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  1
                </div>
                <h3 className="font-semibold text-lg mb-2">Sign In</h3>
                <p className="text-muted-foreground text-sm">
                  Log into your online banking account or mobile app
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-[#00754A] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  2
                </div>
                <h3 className="font-semibold text-lg mb-2">Choose Alerts</h3>
                <p className="text-muted-foreground text-sm">
                  Navigate to settings and select your preferred alert types
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-[#00754A] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  3
                </div>
                <h3 className="font-semibold text-lg mb-2">Stay Informed</h3>
                <p className="text-muted-foreground text-sm">
                  Start receiving instant notifications about your account
                  activity
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-gradient-to-br from-[#00754A] via-[#005A39] to-[#004830] text-white border-0 overflow-hidden relative shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-[#00754A]/90 to-[#005A39]/90"></div>
          <CardContent className="text-center py-16 relative z-10">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Bell className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4">
              Ready to stay informed about your finances?
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Set up smart alerts today and take control of your financial
              security and budgeting.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link to="/signup">
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-[#00754A] hover:bg-gray-100 px-8"
                >
                  Open an Account
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 px-8"
                >
                  Contact Support
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-[#00754A] to-[#005A39] rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div className="text-lg font-bold">First City Credit Union</div>
            </div>
            <p className="text-gray-400 mb-4">
              Member NCUA. Equal Housing Lender. Your deposits are insured up to
              $250,000.
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <Link
                to="/privacy"
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link
                to="/security"
                className="hover:text-white transition-colors"
              >
                Security
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
