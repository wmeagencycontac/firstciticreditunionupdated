import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Shield,
  Lock,
  Eye,
  AlertTriangle,
  Smartphone,
  Check,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function SecurityCenter() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-red-50/20 to-orange-50/30">
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
            <Link to="/help">
              <Button className="bg-gradient-to-r from-[#00754A] to-[#005A39] hover:from-[#005A39] hover:to-[#004830] text-white">
                Get Help
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-[#00754A] to-[#005A39] bg-clip-text text-transparent">
            Security Center
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Learn about how we protect your accounts and personal information
            with industry-leading security measures.
          </p>
        </div>

        {/* Security Features */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          <Card className="group border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02] bg-gradient-to-br from-white to-green-50/30 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-green-200/30 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
            <CardHeader className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-6 h-6 text-[#00754A]" />
              </div>
              <CardTitle className="text-xl font-bold group-hover:text-[#00754A] transition-colors duration-300">
                Advanced Encryption
              </CardTitle>
              <CardDescription className="text-base leading-relaxed">
                256-bit SSL encryption protects all your data in transit.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-muted-foreground mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00754A]" />
                  Bank-level encryption technology
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00754A]" />
                  Secure data transmission
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00754A]" />
                  Protected against cyber threats
                </li>
              </ul>
              <Button
                variant="outline"
                className="w-full border-[#00754A] text-[#00754A] hover:bg-green-50"
              >
                Learn More
              </Button>
            </CardContent>
          </Card>

          <Card className="group border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02] bg-gradient-to-br from-white to-blue-50/30 overflow-hidden relative border-2 border-[#00754A]/20">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-200/30 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
            <div className="absolute top-4 right-4 bg-gradient-to-r from-[#00754A] to-[#005A39] text-white px-3 py-1 rounded-full text-xs font-semibold">
              24/7
            </div>
            <CardHeader className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Eye className="w-6 h-6 text-[#00754A]" />
              </div>
              <CardTitle className="text-xl font-bold group-hover:text-[#00754A] transition-colors duration-300">
                Fraud Monitoring
              </CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Real-time transaction monitoring and fraud detection.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-muted-foreground mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00754A]" />
                  AI-powered fraud detection
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00754A]" />
                  Instant alerts for suspicious activity
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00754A]" />
                  Zero liability protection
                </li>
              </ul>
              <Button
                variant="outline"
                className="w-full border-[#00754A] text-[#00754A] hover:bg-green-50"
              >
                Learn More
              </Button>
            </CardContent>
          </Card>

          <Card className="group border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02] bg-gradient-to-br from-white to-purple-50/30 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-200/30 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
            <CardHeader className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Lock className="w-6 h-6 text-[#00754A]" />
              </div>
              <CardTitle className="text-xl font-bold group-hover:text-[#00754A] transition-colors duration-300">
                Multi-Factor Authentication
              </CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Extra layers of security to verify your identity.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-muted-foreground mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00754A]" />
                  SMS and email verification
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00754A]" />
                  Biometric authentication
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00754A]" />
                  Security questions
                </li>
              </ul>
              <Button
                variant="outline"
                className="w-full border-[#00754A] text-[#00754A] hover:bg-green-50"
              >
                Learn More
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Security Tips */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-[#00754A] mb-6">
            Security Tips for You
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-[#00754A]" />
                Mobile App Security
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#00754A] mt-0.5" />
                  Enable biometric login (fingerprint/face ID)
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#00754A] mt-0.5" />
                  Set up account alerts and notifications
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#00754A] mt-0.5" />
                  Log out completely when finished
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#00754A] mt-0.5" />
                  Download our app only from official app stores
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#00754A]" />
                Password Best Practices
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#00754A] mt-0.5" />
                  Use unique, complex passwords
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#00754A] mt-0.5" />
                  Never share your login credentials
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#00754A] mt-0.5" />
                  Change passwords regularly
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#00754A] mt-0.5" />
                  Use a password manager
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Warning Signs */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-8 mb-8 border border-red-200">
          <h2 className="text-2xl font-bold text-red-700 mb-6 flex items-center gap-3">
            <AlertTriangle className="w-8 h-8" />
            Warning Signs of Fraud
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-red-700 mb-3">
                Phishing Attempts
              </h3>
              <ul className="space-y-2 text-red-600 text-sm">
                <li>• Unexpected emails asking for account information</li>
                <li>• Suspicious links or attachments</li>
                <li>• Urgent requests for password verification</li>
                <li>• Spelling errors in official-looking emails</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-red-700 mb-3">
                Suspicious Activity
              </h3>
              <ul className="space-y-2 text-red-600 text-sm">
                <li>• Unauthorized transactions</li>
                <li>• Unknown devices accessing your account</li>
                <li>• Unexpected account changes</li>
                <li>• Missing statements or notifications</li>
              </ul>
            </div>
          </div>
          <div className="mt-6">
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              Report Suspicious Activity
            </Button>
          </div>
        </div>

        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Have security concerns or questions?
          </p>
          <Link to="/help">
            <Button
              variant="outline"
              size="lg"
              className="border-[#00754A] text-[#00754A] hover:bg-green-50"
            >
              Contact Security Team
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
