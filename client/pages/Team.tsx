import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Linkedin, 
  Mail, 
  Award,
  Users,
  Building,
  Globe
} from "lucide-react";

export default function Team() {
  const leadership = [
    {
      name: "Sarah Chen",
      role: "Chief Executive Officer",
      image: "/placeholder.svg",
      bio: "With over 20 years in financial services, Sarah leads SecureBank with a vision for innovative, customer-centric banking solutions.",
      experience: "Former VP at Goldman Sachs, MBA from Wharton",
      email: "sarah.chen@securebank.com",
      linkedin: "#"
    },
    {
      name: "Michael Rodriguez",
      role: "Chief Technology Officer",
      image: "/placeholder.svg",
      bio: "Michael drives our digital transformation initiatives and ensures our technology infrastructure remains cutting-edge and secure.",
      experience: "Former Engineering Director at JPMorgan Chase, MS Computer Science from MIT",
      email: "michael.rodriguez@securebank.com",
      linkedin: "#"
    },
    {
      name: "Emily Watson",
      role: "Chief Financial Officer",
      image: "/placeholder.svg",
      bio: "Emily oversees all financial operations and strategic planning, ensuring sustainable growth and financial stability.",
      experience: "Former CFO at Regional Trust Bank, CPA, MBA from Harvard",
      email: "emily.watson@securebank.com",
      linkedin: "#"
    },
    {
      name: "David Kim",
      role: "Chief Risk Officer",
      image: "/placeholder.svg",
      bio: "David ensures the highest standards of security and compliance across all banking operations and customer interactions.",
      experience: "Former Risk Management Director at Wells Fargo, PhD in Risk Management",
      email: "david.kim@securebank.com",
      linkedin: "#"
    }
  ];

  const departments = [
    {
      name: "Customer Experience",
      head: "Jennifer Thompson",
      size: "45 team members",
      description: "Dedicated to providing exceptional customer service and support across all touchpoints.",
      icon: Users
    },
    {
      name: "Security & Compliance",
      head: "Robert Johnson",
      size: "32 team members",
      description: "Ensuring the highest standards of security, privacy, and regulatory compliance.",
      icon: Building
    },
    {
      name: "Product Innovation",
      head: "Lisa Park",
      size: "28 team members",
      description: "Developing next-generation banking products and digital experiences.",
      icon: Award
    },
    {
      name: "Global Operations",
      head: "Ahmed Hassan",
      size: "67 team members",
      description: "Managing worldwide operations and expanding our global footprint.",
      icon: Globe
    }
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
              Meet Our Team
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our dedicated professionals bring decades of experience and a passion for 
              innovation to deliver exceptional banking services.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Leadership Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
            Leadership Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {leadership.map((member, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-20 h-20 bg-gradient-to-r from-[#00754A] to-[#005A39] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                      <Badge variant="secondary" className="mb-3">{member.role}</Badge>
                      <p className="text-gray-600 text-sm mb-3">{member.bio}</p>
                      <p className="text-xs text-gray-500 mb-4">{member.experience}</p>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" className="p-2">
                          <Mail className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="p-2">
                          <Linkedin className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Departments */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
            Our Departments
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {departments.map((dept, index) => {
              const IconComponent = dept.icon;
              return (
                <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-[#00754A]/10 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-[#00754A]" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{dept.name}</CardTitle>
                        <p className="text-sm text-gray-600">{dept.size}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-3">{dept.description}</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">Led by:</span>
                      <Badge variant="outline">{dept.head}</Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Company Culture */}
        <Card className="mb-12 bg-gradient-to-r from-[#00754A] to-[#005A39] text-white">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold text-center mb-6">Our Culture</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-90" />
                <h3 className="text-xl font-bold mb-2">Collaboration</h3>
                <p className="opacity-90">We work together to achieve common goals and support each other's growth.</p>
              </div>
              <div className="text-center">
                <Award className="w-12 h-12 mx-auto mb-4 opacity-90" />
                <h3 className="text-xl font-bold mb-2">Excellence</h3>
                <p className="opacity-90">We strive for excellence in everything we do, from customer service to innovation.</p>
              </div>
              <div className="text-center">
                <Building className="w-12 h-12 mx-auto mb-4 opacity-90" />
                <h3 className="text-xl font-bold mb-2">Integrity</h3>
                <p className="opacity-90">We operate with the highest ethical standards and transparency in all our actions.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Join Our Team */}
        <Card className="text-center p-8 bg-gradient-to-r from-gray-50 to-white">
          <CardContent>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Join Our Team
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              We're always looking for talented individuals who share our passion for 
              innovation and customer service. Explore career opportunities with SecureBank.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button className="bg-[#00754A] hover:bg-[#005A39]">
                  View Open Positions
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline">
                  Learn More About Us
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
