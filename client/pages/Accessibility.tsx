import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Eye, Ear, Hand, Heart, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Accessibility() {
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
          <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mb-6 mx-auto">
            <Heart className="w-8 h-8 text-[#00754A]" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-[#00754A] to-[#005A39] bg-clip-text text-transparent">
            Accessibility
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We are committed to ensuring that our services are accessible to
            everyone, regardless of ability or disability.
          </p>
        </div>

        <div className="space-y-8">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-[#00754A]">
                Our Commitment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Fusion Bank is committed to providing equal access
                to our financial services and digital platforms for all users.
                We strive to meet or exceed accessibility standards and
                continuously work to improve the user experience for people with
                disabilities.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our accessibility efforts are guided by the Web Content
                Accessibility Guidelines (WCAG) 2.1 Level AA standards and
                Section 508 of the Rehabilitation Act.
              </p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50/30">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mb-4">
                  <Eye className="w-6 h-6 text-[#00754A]" />
                </div>
                <CardTitle className="text-xl text-[#00754A]">
                  Visual Accessibility
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>High contrast color schemes</li>
                  <li>Scalable text and interface elements</li>
                  <li>Alternative text for images</li>
                  <li>Screen reader compatibility</li>
                  <li>Focus indicators for keyboard navigation</li>
                  <li>Descriptive link text</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-green-50/30">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center mb-4">
                  <Ear className="w-6 h-6 text-[#00754A]" />
                </div>
                <CardTitle className="text-xl text-[#00754A]">
                  Auditory Accessibility
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Captions for video content</li>
                  <li>Visual notifications and alerts</li>
                  <li>Text alternatives to audio information</li>
                  <li>TTY/TDD phone support</li>
                  <li>Multiple communication channels</li>
                  <li>Written instructions and documentation</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50/30">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mb-4">
                  <Hand className="w-6 h-6 text-[#00754A]" />
                </div>
                <CardTitle className="text-xl text-[#00754A]">
                  Motor Accessibility
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Full keyboard navigation support</li>
                  <li>Large clickable areas</li>
                  <li>Customizable interface timing</li>
                  <li>Voice banking options</li>
                  <li>Mobile app accessibility features</li>
                  <li>Simplified navigation paths</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-orange-50/30">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-[#00754A]" />
                </div>
                <CardTitle className="text-xl text-[#00754A]">
                  Cognitive Accessibility
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Clear and simple language</li>
                  <li>Consistent navigation and layout</li>
                  <li>Error prevention and clear messages</li>
                  <li>Help and support documentation</li>
                  <li>Progress indicators for multi-step processes</li>
                  <li>Timeout warnings and extensions</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-[#00754A]">
                Assistive Technology Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our digital platforms are designed to work with common assistive
                technologies:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-[#00754A] mb-2">
                    Screen Readers
                  </h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                    <li>JAWS (Job Access With Speech)</li>
                    <li>NVDA (NonVisual Desktop Access)</li>
                    <li>VoiceOver (macOS/iOS)</li>
                    <li>TalkBack (Android)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-[#00754A] mb-2">
                    Other Technologies
                  </h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                    <li>Voice recognition software</li>
                    <li>Switch navigation devices</li>
                    <li>Magnification software</li>
                    <li>Alternative keyboards</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-[#00754A]">
                Branch Accessibility
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our physical locations are designed to be accessible to all
                customers:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>ADA-compliant entrances and facilities</li>
                <li>Accessible parking spaces</li>
                <li>Lowered service counters</li>
                <li>TTY phones available upon request</li>
                <li>Sign language interpreters (with advance notice)</li>
                <li>Large print materials</li>
                <li>Audio loops and assistive listening devices</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-[#00754A]">
                Feedback and Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We welcome feedback about the accessibility of our services and
                are committed to continuous improvement.
              </p>

              <div className="bg-green-50 rounded-lg p-6">
                <h4 className="font-semibold text-[#00754A] mb-3">
                  Contact Our Accessibility Team
                </h4>
                <div className="space-y-2 text-muted-foreground">
                  <p>
                    <strong>Phone:</strong> (555) 123-4567
                  </p>
                  <p>
                    <strong>TTY:</strong> (555) 123-4568
                  </p>
                  <p>
                    <strong>Email:</strong> accessibility@fccu.com
                  </p>
                  <p>
                    <strong>Mail:</strong> Accessibility Services
                    <br />
                    Fusion Bank
                    <br />
                    123 Banking Street
                    <br />
                    City, State 12345
                  </p>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed mt-4">
                When contacting us about accessibility, please include details
                about the specific challenge you encountered and any assistive
                technology you were using.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-[#00754A]">
                Ongoing Improvements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We are committed to continuously improving accessibility
                through:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Regular accessibility audits and testing</li>
                <li>User testing with people with disabilities</li>
                <li>Staff training on accessibility best practices</li>
                <li>Collaboration with disability advocacy organizations</li>
                <li>Implementation of new assistive technologies</li>
                <li>Updates based on evolving accessibility standards</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-16">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/help">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#00754A] to-[#005A39] hover:from-[#005A39] hover:to-[#004830] text-white"
              >
                Get Help & Support
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                variant="outline"
                size="lg"
                className="border-[#00754A] text-[#00754A] hover:bg-green-50"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
