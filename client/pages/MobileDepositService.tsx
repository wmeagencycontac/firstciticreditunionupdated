import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Camera,
  Smartphone,
  CheckCircle,
  Clock,
  Shield,
  ArrowLeft,
  Download,
  Building2,
  Star,
} from "lucide-react";

export default function MobileDepositService() {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      id: 1,
      title: "Open the App",
      description:
        "Launch the Fusion Bank mobile app on your smartphone",
      icon: <Smartphone className="w-6 h-6" />,
    },
    {
      id: 2,
      title: "Select Mobile Deposit",
      description:
        "Navigate to the deposit section and choose 'Mobile Deposit'",
      icon: <Camera className="w-6 h-6" />,
    },
    {
      id: 3,
      title: "Capture Check Images",
      description: "Take clear photos of the front and back of your check",
      icon: <CheckCircle className="w-6 h-6" />,
    },
    {
      id: 4,
      title: "Submit for Processing",
      description:
        "Review details and submit your deposit for instant processing",
      icon: <Clock className="w-6 h-6" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-green-50/30 to-emerald-50/60">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 border-b bg-white/80 backdrop-blur-md">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00754A] to-[#005A39] rounded-xl flex items-center justify-center shadow-lg shadow-green-500/25">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold text-[#00754A]">
                Fusion Bank
              </div>
              <div className="text-xs text-muted-foreground">
                Mobile Deposit Service
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
          <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Camera className="w-10 h-10 text-[#00754A]" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-[#00754A] to-[#005A39] bg-clip-text text-transparent">
            Mobile Deposit
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Deposit checks instantly with your smartphone camera. Available
            24/7, with funds typically available within 1 business day.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#00754A] to-[#005A39] hover:from-[#005A39] hover:to-[#004830] text-white px-8 shadow-lg"
              >
                Get Started Today
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

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-foreground">
              Why Choose Mobile Deposit?
            </h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-[#00754A]" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Available 24/7</h3>
                  <p className="text-muted-foreground">
                    Deposit checks anytime, anywhere - no need to visit a branch
                    or ATM.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-[#00754A]" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Bank-Level Security
                  </h3>
                  <p className="text-muted-foreground">
                    Your deposits are protected with 256-bit encryption and
                    multi-factor authentication.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-[#00754A]" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Instant Confirmation
                  </h3>
                  <p className="text-muted-foreground">
                    Receive immediate confirmation and track your deposit status
                    in real-time.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:pl-8">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Deposit Limits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Daily Limit:</span>
                    <Badge variant="secondary">$5,000</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Monthly Limit:
                    </span>
                    <Badge variant="secondary">$25,000</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Processing Time:
                    </span>
                    <Badge className="bg-green-100 text-[#00754A]">
                      1 Business Day
                    </Badge>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      Limits may be higher for premium account holders. Contact
                      us for details.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-16 bg-gray-50/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            How Mobile Deposit Works
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <Card
                key={step.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  activeStep === step.id
                    ? "ring-2 ring-[#00754A] shadow-lg"
                    : ""
                }`}
                onClick={() => setActiveStep(step.id)}
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                      activeStep === step.id
                        ? "bg-[#00754A] text-white"
                        : "bg-gray-100 text-[#00754A]"
                    }`}
                  >
                    {step.icon}
                  </div>
                  <div
                    className={`text-2xl font-bold mb-2 ${
                      activeStep === step.id
                        ? "text-[#00754A]"
                        : "text-gray-400"
                    }`}
                  >
                    {step.id}
                  </div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* App Download Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-gradient-to-br from-[#00754A] via-[#005A39] to-[#004830] text-white border-0 overflow-hidden relative shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-[#00754A]/90 to-[#005A39]/90"></div>
          <CardContent className="text-center py-16 relative z-10">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Download className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4">
              Ready to start mobile deposits?
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Download our mobile app and start depositing checks instantly.
              Available for iOS and Android.
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
                  Contact Us
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
              <div className="text-lg font-bold">Fusion Bank</div>
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
