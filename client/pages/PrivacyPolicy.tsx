import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Shield, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50/20 to-slate-50/30">
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
            <Link to="/help">
              <Button
                variant="ghost"
                className="text-[#00754A] hover:bg-green-50"
              >
                Help
              </Button>
            </Link>
            <Link to="/contact">
              <Button className="bg-gradient-to-r from-[#00754A] to-[#005A39] hover:from-[#005A39] hover:to-[#004830] text-white">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-20 max-w-4xl">
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center mb-6 mx-auto">
            <Shield className="w-8 h-8 text-[#00754A]" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-[#00754A] to-[#005A39] bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Your privacy is important to us. Learn how we collect, use, and
            protect your personal information.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Last updated: January 2024
          </p>
        </div>

        <div className="space-y-8">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-[#00754A]">
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p className="text-muted-foreground leading-relaxed mb-4">
                We collect information you provide directly to us, information
                we collect automatically when you use our services, and
                information from third parties.
              </p>
              <h4 className="font-semibold text-[#00754A] mb-2">
                Personal Information:
              </h4>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-4">
                <li>Name, address, phone number, and email address</li>
                <li>Social Security number and date of birth</li>
                <li>Employment and income information</li>
                <li>Account numbers and transaction history</li>
              </ul>
              <h4 className="font-semibold text-[#00754A] mb-2">
                Automatically Collected Information:
              </h4>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Device information and IP address</li>
                <li>Usage data and login information</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-[#00754A]">
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use your information to provide and improve our services,
                communicate with you, and comply with legal requirements.
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Process transactions and maintain your accounts</li>
                <li>Verify your identity and prevent fraud</li>
                <li>Provide customer service and support</li>
                <li>Send important notices and updates</li>
                <li>Improve our products and services</li>
                <li>Comply with legal and regulatory requirements</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-[#00754A]">
                Information Sharing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We do not sell your personal information. We may share your
                information in limited circumstances:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>With your consent or at your direction</li>
                <li>With service providers who help us operate our business</li>
                <li>To comply with legal requirements or court orders</li>
                <li>To protect our rights and prevent fraud</li>
                <li>In connection with a business transaction</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-[#00754A]">
                Data Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We implement appropriate technical and organizational measures
                to protect your personal information:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>256-bit SSL encryption for data transmission</li>
                <li>Multi-factor authentication</li>
                <li>Regular security audits and monitoring</li>
                <li>Employee training on data protection</li>
                <li>Secure data storage and access controls</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-[#00754A]">
                Your Rights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You have certain rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Access and review your personal information</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of certain information</li>
                <li>Opt out of certain communications</li>
                <li>Request a copy of your information</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                To exercise these rights, please contact us using the
                information provided below.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-[#00754A]">
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you have questions about this Privacy Policy or our privacy
                practices, please contact us:
              </p>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="font-semibold text-[#00754A] mb-2">
                  Privacy Officer
                </p>
                <p className="text-muted-foreground">Fusion Bank</p>
                <p className="text-muted-foreground">123 Banking Street</p>
                <p className="text-muted-foreground">City, State 12345</p>
                <p className="text-muted-foreground">Email: privacy@fccu.com</p>
                <p className="text-muted-foreground">Phone: (555) 123-4567</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-16">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/terms">
              <Button
                variant="outline"
                size="lg"
                className="border-[#00754A] text-[#00754A] hover:bg-green-50"
              >
                Terms of Service
              </Button>
            </Link>
            <Link to="/security">
              <Button
                variant="outline"
                size="lg"
                className="border-[#00754A] text-[#00754A] hover:bg-green-50"
              >
                Security Center
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
