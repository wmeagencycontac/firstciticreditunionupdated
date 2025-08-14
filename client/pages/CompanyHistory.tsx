import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  Award,
  Users,
  Building,
  TrendingUp,
  Globe,
  Shield,
} from "lucide-react";

export default function CompanyHistory() {
  const milestones = [
    {
      year: "1985",
      title: "Foundation",
      description:
        "Fusion Bank was founded with a mission to provide secure and accessible banking services to communities nationwide.",
      icon: Building,
      color: "bg-blue-500",
    },
    {
      year: "1992",
      title: "First Digital Initiative",
      description:
        "Launched our first digital banking platform, pioneering online banking services in the region.",
      icon: Globe,
      color: "bg-green-500",
    },
    {
      year: "1998",
      title: "Nationwide Expansion",
      description:
        "Expanded operations nationwide with 50+ branches and over 100,000 customers.",
      icon: TrendingUp,
      color: "bg-purple-500",
    },
    {
      year: "2005",
      title: "Mobile Banking Launch",
      description:
        "First bank in the region to launch comprehensive mobile banking services.",
      icon: Globe,
      color: "bg-orange-500",
    },
    {
      year: "2012",
      title: "Security Innovation",
      description:
        "Implemented advanced security measures including biometric authentication and AI fraud detection.",
      icon: Shield,
      color: "bg-red-500",
    },
    {
      year: "2018",
      title: "Digital Transformation",
      description:
        "Complete digital transformation with AI-powered customer service and instant account opening.",
      icon: Award,
      color: "bg-indigo-500",
    },
    {
      year: "2024",
      title: "Modern Banking Era",
      description:
        "Leading the future of banking with cutting-edge technology and customer-first approach.",
      icon: Users,
      color: "bg-[#00754A]",
    },
  ];

  const achievements = [
    {
      title: "5 Million+ Customers",
      description: "Trusted by millions of customers nationwide",
      icon: Users,
    },
    {
      title: "99.9% Uptime",
      description: "Industry-leading reliability and security",
      icon: Shield,
    },
    {
      title: "50+ Awards",
      description: "Recognized for excellence in banking services",
      icon: Award,
    },
    {
      title: "200+ Branches",
      description: "Convenient locations across the country",
      icon: Building,
    },
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Story</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              For nearly four decades, Fusion Bank has been at the forefront of
              banking innovation, consistently delivering secure, reliable, and
              customer-focused financial services.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Mission Statement */}
        <Card className="mb-12 bg-gradient-to-r from-[#00754A] to-[#005A39] text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-xl opacity-90 max-w-4xl mx-auto">
              To empower individuals and businesses with innovative banking
              solutions that are secure, accessible, and tailored to their
              unique financial needs, while building lasting relationships based
              on trust and excellence.
            </p>
          </CardContent>
        </Card>

        {/* Timeline */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
            Our Journey Through Time
          </h2>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gradient-to-b from-[#00754A] to-[#005A39]"></div>

            <div className="space-y-8">
              {milestones.map((milestone, index) => {
                const IconComponent = milestone.icon;
                const isLeft = index % 2 === 0;

                return (
                  <div
                    key={milestone.year}
                    className={`relative flex items-center ${isLeft ? "justify-start" : "justify-end"}`}
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
                      <div
                        className={`w-12 h-12 rounded-full ${milestone.color} flex items-center justify-center`}
                      >
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    {/* Content card */}
                    <Card
                      className={`w-5/12 ${isLeft ? "mr-auto" : "ml-auto"} transition-all duration-300 hover:shadow-lg`}
                    >
                      <CardHeader>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className="text-sm">
                            {milestone.year}
                          </Badge>
                          <CardTitle className="text-lg">
                            {milestone.title}
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
            Key Achievements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => {
              const IconComponent = achievement.icon;
              return (
                <Card
                  key={index}
                  className="text-center p-6 hover:shadow-lg transition-all duration-300"
                >
                  <CardContent className="space-y-4">
                    <div className="w-16 h-16 bg-[#00754A]/10 rounded-full flex items-center justify-center mx-auto">
                      <IconComponent className="w-8 h-8 text-[#00754A]" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {achievement.title}
                    </h3>
                    <p className="text-gray-600">{achievement.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Call to Action */}
        <Card className="text-center p-8 bg-gradient-to-r from-gray-50 to-white">
          <CardContent>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Join Our Legacy
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Be part of our continuing story. Experience the difference that
              decades of innovation and customer dedication can make for your
              financial future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button className="bg-[#00754A] hover:bg-[#005A39]">
                  Open an Account
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline">Contact Us</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
