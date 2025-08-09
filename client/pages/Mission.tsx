import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Target, 
  Eye, 
  Heart,
  Shield,
  Users,
  Globe,
  TrendingUp,
  Award,
  CheckCircle
} from "lucide-react";

export default function Mission() {
  const values = [
    {
      icon: Shield,
      title: "Security First",
      description: "We prioritize the security and privacy of our customers' financial information above all else."
    },
    {
      icon: Users,
      title: "Customer-Centric",
      description: "Every decision we make is guided by what's best for our customers and their financial well-being."
    },
    {
      icon: TrendingUp,
      title: "Innovation",
      description: "We continuously evolve our services to meet the changing needs of the digital age."
    },
    {
      icon: Heart,
      title: "Community Impact",
      description: "We're committed to making a positive impact in the communities we serve."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We strive for excellence in every interaction and service we provide."
    },
    {
      icon: Globe,
      title: "Accessibility",
      description: "We believe banking should be accessible to everyone, regardless of their background or location."
    }
  ];

  const commitments = [
    "Provide transparent, fair, and competitive financial services",
    "Maintain the highest standards of data security and privacy",
    "Support financial literacy and education in our communities",
    "Offer innovative solutions that simplify banking experiences",
    "Build lasting relationships based on trust and reliability",
    "Contribute to sustainable economic growth and development"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <Link to="/about">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to About
              </Button>
            </Link>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Our Mission & Vision
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the driving forces behind SecureBank and our commitment to 
              transforming the banking experience for everyone.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Mission Statement */}
        <Card className="mb-12 bg-gradient-to-r from-[#00754A] to-[#005A39] text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <CardContent className="p-12 relative z-10">
            <div className="text-center">
              <Target className="w-16 h-16 mx-auto mb-6 opacity-90" />
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-xl opacity-90 max-w-4xl mx-auto leading-relaxed">
                To empower individuals and businesses with innovative, secure, and accessible 
                banking solutions that foster financial growth and stability, while building 
                lasting relationships based on trust, transparency, and exceptional service.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Vision Statement */}
        <Card className="mb-12 bg-gradient-to-r from-blue-600 to-blue-800 text-white overflow-hidden relative">
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-32 -translate-x-32"></div>
          <CardContent className="p-12 relative z-10">
            <div className="text-center">
              <Eye className="w-16 h-16 mx-auto mb-6 opacity-90" />
              <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
              <p className="text-xl opacity-90 max-w-4xl mx-auto leading-relaxed">
                To be the world's most trusted and innovative banking partner, leading the 
                transformation of financial services through technology, while maintaining 
                the human touch that makes banking personal and meaningful.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Core Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 text-center">
                  <CardContent>
                    <div className="w-16 h-16 bg-[#00754A]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-[#00754A]" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Our Commitments */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
            Our Commitments
          </h2>
          <Card className="p-8">
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {commitments.map((commitment, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-[#00754A] mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700">{commitment}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Impact Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Making a Difference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-[#00754A] mb-2">5M+</div>
                <p className="text-gray-600">Customers Served</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#00754A] mb-2">$50B+</div>
                <p className="text-gray-600">Assets Under Management</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#00754A] mb-2">1000+</div>
                <p className="text-gray-600">Communities Supported</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="text-center p-8 bg-gradient-to-r from-gray-50 to-white">
          <CardContent>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Experience Our Mission
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join millions of customers who trust SecureBank with their financial journey. 
              Experience banking that's built on strong values and innovative solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button className="bg-[#00754A] hover:bg-[#005A39]">
                  Start Your Journey
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline">
                  Contact Us
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
