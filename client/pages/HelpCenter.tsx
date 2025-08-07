import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { HelpCircle, Phone, Mail, MessageCircle, Search, FileText, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

export default function HelpCenter() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-cyan-50/20 to-blue-50/30">
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
            <Link to="/contact">
              <Button className="bg-gradient-to-r from-[#00754A] to-[#005A39] hover:from-[#005A39] hover:to-[#004830] text-white">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-[#00754A] to-[#005A39] bg-clip-text text-transparent">
            Help Center
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Find answers to your questions and get the support you need.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search for help articles, FAQs, or topics..."
              className="pl-12 h-14 text-lg bg-white border-2 border-green-200 focus:border-[#00754A] rounded-xl"
            />
            <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-[#00754A] to-[#005A39] hover:from-[#005A39] hover:to-[#004830] text-white">
              Search
            </Button>
          </div>
        </div>

        {/* Contact Options */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="group border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02] bg-gradient-to-br from-white to-green-50/30 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-green-200/30 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
            <CardHeader className="relative text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                <Phone className="w-8 h-8 text-[#00754A]" />
              </div>
              <CardTitle className="text-xl font-bold group-hover:text-[#00754A] transition-colors duration-300">
                Call Us
              </CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Speak with our customer service team
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-2xl font-bold text-[#00754A] mb-2">(555) 123-4567</div>
              <div className="text-sm text-muted-foreground mb-4">
                Mon-Fri: 8AM-8PM<br />
                Sat: 9AM-5PM<br />
                Sun: Closed
              </div>
              <Button className="w-full bg-gradient-to-r from-[#00754A] to-[#005A39] hover:from-[#005A39] hover:to-[#004830] text-white">
                Call Now
              </Button>
            </CardContent>
          </Card>

          <Card className="group border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02] bg-gradient-to-br from-white to-blue-50/30 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-200/30 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
            <CardHeader className="relative text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                <MessageCircle className="w-8 h-8 text-[#00754A]" />
              </div>
              <CardTitle className="text-xl font-bold group-hover:text-[#00754A] transition-colors duration-300">
                Live Chat
              </CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Chat with our support team in real-time
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-lg font-semibold text-[#00754A] mb-2">Available Now</div>
              <div className="text-sm text-muted-foreground mb-4">
                Average response time:<br />
                Less than 2 minutes
              </div>
              <Button className="w-full bg-gradient-to-r from-[#00754A] to-[#005A39] hover:from-[#005A39] hover:to-[#004830] text-white">
                Start Chat
              </Button>
            </CardContent>
          </Card>

          <Card className="group border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02] bg-gradient-to-br from-white to-purple-50/30 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-200/30 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
            <CardHeader className="relative text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                <Mail className="w-8 h-8 text-[#00754A]" />
              </div>
              <CardTitle className="text-xl font-bold group-hover:text-[#00754A] transition-colors duration-300">
                Email Support
              </CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Send us a message for detailed help
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-lg font-semibold text-[#00754A] mb-2">support@fccu.com</div>
              <div className="text-sm text-muted-foreground mb-4">
                Response time:<br />
                Within 24 hours
              </div>
              <Button className="w-full bg-gradient-to-r from-[#00754A] to-[#005A39] hover:from-[#005A39] hover:to-[#004830] text-white">
                Send Email
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Popular Help Topics */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-[#00754A] mb-8 text-center">Popular Help Topics</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Online Banking Login", icon: "🔐" },
              { title: "Mobile App Setup", icon: "📱" },
              { title: "Account Balance & Statements", icon: "📊" },
              { title: "Debit Card Issues", icon: "💳" },
              { title: "Transfer Money", icon: "💸" },
              { title: "Direct Deposit Setup", icon: "🏦" },
              { title: "Lost or Stolen Cards", icon: "🚨" },
              { title: "Account Security", icon: "🛡️" },
              { title: "Loan Applications", icon: "📄" }
            ].map((topic, index) => (
              <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-white cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-3">{topic.icon}</div>
                  <h3 className="font-semibold text-[#00754A] hover:text-[#005A39] transition-colors">
                    {topic.title}
                  </h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-[#00754A] mb-6 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              {
                question: "How do I reset my online banking password?",
                answer: "You can reset your password by clicking 'Forgot Password' on the login page, or by calling our support team."
              },
              {
                question: "What are your current interest rates?",
                answer: "Interest rates vary by account type and credit profile. Visit our rates page or contact us for current rates."
              },
              {
                question: "How do I report a lost or stolen debit card?",
                answer: "Call us immediately at (555) 123-4567 or use the 'Card Controls' feature in our mobile app to temporarily lock your card."
              },
              {
                question: "What's the difference between checking and savings accounts?",
                answer: "Checking accounts are designed for frequent transactions, while savings accounts help you earn interest on deposited funds."
              }
            ].map((faq, index) => (
              <Card key={index} className="border border-green-200">
                <CardHeader>
                  <CardTitle className="text-lg text-[#00754A] flex items-center gap-2">
                    <HelpCircle className="w-5 h-5" />
                    {faq.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center">
          <p className="text-muted-foreground mb-4">Can't find what you're looking for?</p>
          <Link to="/contact">
            <Button variant="outline" size="lg" className="border-[#00754A] text-[#00754A] hover:bg-green-50">
              Contact Our Support Team
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
