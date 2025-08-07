import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/20 to-indigo-50/30">
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
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mb-6 mx-auto">
            <FileText className="w-8 h-8 text-[#00754A]" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-[#00754A] to-[#005A39] bg-clip-text text-transparent">
            Terms of Service
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Please read these terms carefully before using our services. By
            using our services, you agree to these terms.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Effective Date: January 1, 2024
          </p>
        </div>

        <div className="space-y-8">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-[#00754A]">
                Acceptance of Terms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                By accessing or using First City Credit Union's services,
                including our website, mobile applications, and banking
                services, you agree to be bound by these Terms of Service and
                all applicable laws and regulations. If you do not agree with
                any of these terms, you are prohibited from using our services.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-[#00754A]">
                Account Terms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h4 className="font-semibold text-[#00754A] mb-3">
                Account Opening and Eligibility
              </h4>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>You must be at least 18 years old to open an account</li>
                <li>You must provide accurate and complete information</li>
                <li>You are responsible for maintaining account security</li>
                <li>
                  We reserve the right to verify your identity and eligibility
                </li>
              </ul>

              <h4 className="font-semibold text-[#00754A] mb-3">
                Account Responsibilities
              </h4>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Keep your login credentials confidential</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Maintain sufficient funds for transactions</li>
                <li>Review statements and report discrepancies promptly</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-[#00754A]">
                Electronic Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our electronic banking services include online banking, mobile
                banking, and electronic communications.
              </p>
              <h4 className="font-semibold text-[#00754A] mb-3">
                Service Availability
              </h4>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>
                  Services are generally available 24/7, subject to maintenance
                </li>
                <li>We may suspend services for updates or security reasons</li>
                <li>Internet connectivity required for access</li>
              </ul>

              <h4 className="font-semibold text-[#00754A] mb-3">
                Electronic Communications
              </h4>
              <p className="text-muted-foreground leading-relaxed">
                By using our services, you consent to receive electronic
                communications from us, including statements, notices, and other
                disclosures.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-[#00754A]">
                Fees and Charges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Fees and charges may apply to certain services and transactions:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Account maintenance fees as disclosed in fee schedule</li>
                <li>Transaction fees for certain transfers or withdrawals</li>
                <li>Overdraft fees for insufficient funds</li>
                <li>Third-party fees from other financial institutions</li>
                <li>Foreign transaction fees for international purchases</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Current fee schedules are available on our website and upon
                request.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-[#00754A]">
                Security and Fraud Prevention
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We implement security measures to protect your account, but you
                also have responsibilities:
              </p>
              <h4 className="font-semibold text-[#00754A] mb-3">
                Your Security Responsibilities
              </h4>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>Use strong, unique passwords</li>
                <li>Log out completely after each session</li>
                <li>Never share your login credentials</li>
                <li>Report suspicious activity immediately</li>
                <li>Keep your contact information current</li>
              </ul>

              <h4 className="font-semibold text-[#00754A] mb-3">
                Our Security Measures
              </h4>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Multi-factor authentication</li>
                <li>Encryption of sensitive data</li>
                <li>Fraud monitoring systems</li>
                <li>Regular security audits</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-[#00754A]">
                Limitation of Liability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our liability is limited as follows:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>
                  We are not liable for indirect, incidental, or consequential
                  damages
                </li>
                <li>
                  Our liability for any claim is limited to the amount of the
                  transaction in question
                </li>
                <li>
                  We are not responsible for third-party actions or services
                </li>
                <li>
                  We are not liable for losses due to your failure to follow
                  security procedures
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-[#00754A]">
                Modifications and Termination
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h4 className="font-semibold text-[#00754A] mb-3">
                Changes to Terms
              </h4>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We may modify these terms at any time. We will provide notice of
                material changes as required by law.
              </p>

              <h4 className="font-semibold text-[#00754A] mb-3">
                Account Termination
              </h4>
              <p className="text-muted-foreground leading-relaxed">
                Either party may terminate the relationship at any time, subject
                to applicable laws and regulations. Upon termination, you remain
                liable for all outstanding obligations.
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
                If you have questions about these Terms of Service, please
                contact us:
              </p>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="font-semibold text-[#00754A] mb-2">
                  Customer Service
                </p>
                <p className="text-muted-foreground">First City Credit Union</p>
                <p className="text-muted-foreground">123 Banking Street</p>
                <p className="text-muted-foreground">City, State 12345</p>
                <p className="text-muted-foreground">Email: support@fccu.com</p>
                <p className="text-muted-foreground">Phone: (555) 123-4567</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-16">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/privacy">
              <Button
                variant="outline"
                size="lg"
                className="border-[#00754A] text-[#00754A] hover:bg-green-50"
              >
                Privacy Policy
              </Button>
            </Link>
            <Link to="/accessibility">
              <Button
                variant="outline"
                size="lg"
                className="border-[#00754A] text-[#00754A] hover:bg-green-50"
              >
                Accessibility
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
