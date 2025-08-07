import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowUpDown,
  Zap,
  Shield,
  Clock,
  ArrowLeft,
  Building2,
  Users,
  CreditCard,
  Smartphone,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

export default function InstantTransfers() {
  const [selectedTransferType, setSelectedTransferType] = useState("internal");

  const transferTypes = [
    {
      id: "internal",
      title: "Between Your Accounts",
      description: "Transfer money instantly between your checking and savings",
      fee: "Free",
      time: "Instant",
      icon: <ArrowUpDown className="w-6 h-6" />,
    },
    {
      id: "external",
      title: "To Other Banks",
      description: "Send money to accounts at other financial institutions",
      fee: "$0.50",
      time: "1-3 Business Days",
      icon: <Building2 className="w-6 h-6" />,
    },
    {
      id: "p2p",
      title: "Person to Person",
      description: "Send money to friends and family using email or phone",
      fee: "Free",
      time: "Instant",
      icon: <Users className="w-6 h-6" />,
    },
  ];

  const features = [
    {
      icon: <Zap className="w-6 h-6 text-[#00754A]" />,
      title: "Lightning Fast",
      description: "Most transfers complete in seconds, not days",
    },
    {
      icon: <Shield className="w-6 h-6 text-[#00754A]" />,
      title: "Bank-Level Security",
      description: "Protected by 256-bit encryption and fraud monitoring",
    },
    {
      icon: <Clock className="w-6 h-6 text-[#00754A]" />,
      title: "24/7 Availability",
      description: "Send money anytime, even on weekends and holidays",
    },
    {
      icon: <Smartphone className="w-6 h-6 text-[#00754A]" />,
      title: "Mobile & Web",
      description: "Access from our mobile app or online banking platform",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/30 to-indigo-50/60">
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
              <div className="text-xs text-muted-foreground">
                Instant Transfers
              </div>
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
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <ArrowUpDown className="w-10 h-10 text-[#00754A]" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-[#00754A] to-[#005A39] bg-clip-text text-transparent">
            Instant Transfers
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Send money between accounts instantly with real-time notifications.
            Fast, secure, and available 24/7.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#00754A] to-[#005A39] hover:from-[#005A39] hover:to-[#004830] text-white px-8 shadow-lg"
              >
                Start Transferring Today
              </Button>
            </Link>
            <Link to="/login">
              <Button
                variant="outline"
                size="lg"
                className="border-[#00754A] text-[#00754A] hover:bg-green-50 px-8"
              >
                Access Your Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Transfer Types Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Choose Your Transfer Type
          </h2>
          <Tabs
            value={selectedTransferType}
            onValueChange={setSelectedTransferType}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger
                value="internal"
                className="data-[state=active]:bg-[#00754A] data-[state=active]:text-white"
              >
                Internal
              </TabsTrigger>
              <TabsTrigger
                value="external"
                className="data-[state=active]:bg-[#00754A] data-[state=active]:text-white"
              >
                External
              </TabsTrigger>
              <TabsTrigger
                value="p2p"
                className="data-[state=active]:bg-[#00754A] data-[state=active]:text-white"
              >
                Person to Person
              </TabsTrigger>
            </TabsList>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {transferTypes.map((type) => (
                <Card
                  key={type.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    selectedTransferType === type.id
                      ? "ring-2 ring-[#00754A] shadow-lg"
                      : ""
                  }`}
                  onClick={() => setSelectedTransferType(type.id)}
                >
                  <CardContent className="p-6">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                        selectedTransferType === type.id
                          ? "bg-[#00754A] text-white"
                          : "bg-blue-100 text-[#00754A]"
                      }`}
                    >
                      {type.icon}
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{type.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      {type.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <Badge
                        variant={type.fee === "Free" ? "default" : "secondary"}
                        className={
                          type.fee === "Free"
                            ? "bg-green-100 text-green-800"
                            : ""
                        }
                      >
                        {type.fee}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {type.time}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <TabsContent value="internal" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Between Your Accounts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">How it works:</h4>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>• Select source and destination accounts</li>
                        <li>• Enter transfer amount</li>
                        <li>• Confirm and send instantly</li>
                        <li>• Receive real-time notification</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Benefits:</h4>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>• Completely free transfers</li>
                        <li>• Instant processing</li>
                        <li>• Available 24/7</li>
                        <li>• No daily limits</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="external" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    To Other Banks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Requirements:</h4>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>• External account must be verified</li>
                        <li>• Valid routing and account numbers</li>
                        <li>• Account must be in your name</li>
                        <li>• Initial verification deposits required</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Transfer limits:</h4>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>• Daily limit: $2,500</li>
                        <li>• Monthly limit: $10,000</li>
                        <li>• Processing: 1-3 business days</li>
                        <li>• Small fee: $0.50 per transfer</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="p2p" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    Person to Person
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Send money using:</h4>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>• Recipient's email address</li>
                        <li>• Phone number</li>
                        <li>• First City member ID</li>
                        <li>• QR code scanning</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Features:</h4>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>• Instant delivery</li>
                        <li>• Free for members</li>
                        <li>• Request money feature</li>
                        <li>• Payment notifications</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 bg-gray-50/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Why Choose Our Transfer Service?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow duration-300"
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security Notice */}
      <section className="container mx-auto px-4 py-16">
        <Card className="max-w-4xl mx-auto border-orange-200 bg-orange-50/50">
          <CardContent className="p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-orange-900">
                  Important Security Information
                </h3>
                <p className="text-orange-800 mb-4">
                  Always verify recipient information before sending transfers.
                  First City Credit Union will never ask for your login
                  credentials or account information via email or phone calls.
                </p>
                <ul className="space-y-1 text-orange-700 text-sm">
                  <li>• Double-check recipient details before confirming</li>
                  <li>
                    • Use strong, unique passwords for your online banking
                  </li>
                  <li>• Enable two-factor authentication for added security</li>
                  <li>• Report suspicious activity immediately</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-gradient-to-br from-[#00754A] via-[#005A39] to-[#004830] text-white border-0 overflow-hidden relative shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-[#00754A]/90 to-[#005A39]/90"></div>
          <CardContent className="text-center py-16 relative z-10">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ArrowUpDown className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4">
              Ready to start transferring money instantly?
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Join over 150,000 members who trust First City Credit Union for
              fast, secure money transfers.
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
                  Learn More
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
