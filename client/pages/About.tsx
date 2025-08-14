import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { History, Users, Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <section className="container mx-auto px-4 py-20 bg-gradient-to-br from-emerald-50 via-teal-50/20 to-cyan-50/30">
      <div className="text-center mb-16">
        <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-[#00754A] to-[#005A39] bg-clip-text text-transparent">
          About Fusion Bank
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Your trusted financial partner, serving our community with integrity
          and innovation for over 70 years.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <Card className="group border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02] bg-gradient-to-br from-white to-emerald-50/30 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-200/30 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
          <CardHeader className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <History className="w-6 h-6 text-[#00754A]" />
            </div>
            <CardTitle className="text-xl font-bold group-hover:text-[#00754A] transition-colors duration-300">
              Our History
            </CardTitle>
            <CardDescription className="text-base leading-relaxed">
              Seven decades of innovation and service in banking.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Founded in 1952, Fusion Bank has grown from a small
              community institution to a modern digital-first credit union,
              serving over 150,000 members with trust and integrity.
            </p>
            <Link to="/company-history">
              <Button
                variant="outline"
                className="w-full border-[#00754A] text-[#00754A] hover:bg-green-50 transition-all duration-300"
              >
                Learn More
              </Button>
            </Link>
          </CardContent>
        </Card>
        <Card className="group border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02] bg-gradient-to-br from-white to-teal-50/30 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-teal-200/30 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
          <CardHeader className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-teal-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Users className="w-6 h-6 text-[#00754A]" />
            </div>
            <CardTitle className="text-xl font-bold group-hover:text-[#00754A] transition-colors duration-300">
              Leadership Team
            </CardTitle>
            <CardDescription className="text-base leading-relaxed">
              Experienced professionals guiding our vision.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-muted-foreground mb-6">
              <li className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-[#00754A]" />
                Sarah Johnson, CEO
              </li>
              <li className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-[#00754A]" />
                Michael Chen, CFO
              </li>
              <li className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-[#00754A]" />
                Elena Rodriguez, CTO
              </li>
            </ul>
            <Link to="/team">
              <Button
                variant="outline"
                className="w-full border-[#00754A] text-[#00754A] hover:bg-green-50 transition-all duration-300"
              >
                Meet the Team
              </Button>
            </Link>
          </CardContent>
        </Card>
        <Card className="group border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02] bg-gradient-to-br from-white to-cyan-50/30 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-cyan-200/30 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
          <CardHeader className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Heart className="w-6 h-6 text-[#00754A]" />
            </div>
            <CardTitle className="text-xl font-bold group-hover:text-[#00754A] transition-colors duration-300">
              Our Values
            </CardTitle>
            <CardDescription className="text-base leading-relaxed">
              Integrity, innovation, and community focus.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-muted-foreground mb-6">
              <li className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-[#00754A]" />
                Member-first service
              </li>
              <li className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-[#00754A]" />
                Financial transparency
              </li>
              <li className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-[#00754A]" />
                Community impact
              </li>
            </ul>
            <Link to="/mission">
              <Button
                variant="outline"
                className="w-full border-[#00754A] text-[#00754A] hover:bg-green-50 transition-all duration-300"
              >
                Our Mission
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      <div className="text-center bg-gradient-to-r from-white to-green-50/50 rounded-2xl p-8 border border-green-200/50">
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-6">
          At Fusion Bank, we believe in empowering our members to
          achieve their financial goals with confidence and security. Our
          commitment to innovation, community service, and member satisfaction
          drives everything we do.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/signup">
            <Button className="bg-gradient-to-r from-[#00754A] to-[#005A39] hover:from-[#005A39] hover:to-[#004830] text-white shadow-lg shadow-green-500/30 hover:shadow-green-500/40 transition-all duration-300 hover:scale-105">
              Become a Member
            </Button>
          </Link>
          <Link to="/contact">
            <Button
              variant="outline"
              className="border-[#00754A] text-[#00754A] hover:bg-green-50 transition-all duration-300 hover:scale-105"
            >
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
