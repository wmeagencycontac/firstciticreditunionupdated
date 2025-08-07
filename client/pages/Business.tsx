import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Building, ShoppingCart, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Business() {
  return (
    <section className="container mx-auto px-4 py-20 bg-gradient-to-br from-gray-50 via-blue-50/20 to-indigo-50/30">
      <div className="text-center mb-16">
        <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-[#00754A] to-[#005A39] bg-clip-text text-transparent">Business Banking</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Comprehensive financial solutions to power your business growth and streamline operations.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        <Card className="group border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02] bg-gradient-to-br from-white to-blue-50/30 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-200/30 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
          <CardHeader className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Building className="w-6 h-6 text-[#00754A]" />
            </div>
            <CardTitle className="text-xl font-bold group-hover:text-[#00754A] transition-colors duration-300">Business Accounts</CardTitle>
            <CardDescription className="text-base leading-relaxed">Manage your company's finances with robust business checking and savings.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-muted-foreground mb-6">
              <li className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-[#00754A]" />Multiple authorized users</li>
              <li className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-[#00754A]" />Easy expense tracking</li>
              <li className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-[#00754A]" />Online bill pay</li>
            </ul>
            <Link to="/business">
              <Button variant="outline" className="w-full border-[#00754A] text-[#00754A] hover:bg-green-50 transition-all duration-300">
                Learn More
              </Button>
            </Link>
          </CardContent>
        </Card>
        <Card className="group border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02] bg-gradient-to-br from-white to-emerald-50/30 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-200/30 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
          <CardHeader className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <ShoppingCart className="w-6 h-6 text-[#00754A]" />
            </div>
            <CardTitle className="text-xl font-bold group-hover:text-[#00754A] transition-colors duration-300">Merchant Services</CardTitle>
            <CardDescription className="text-base leading-relaxed">Accept payments in-store and online with secure merchant solutions.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-muted-foreground mb-6">
              <li className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-[#00754A]" />POS and e-commerce tools</li>
              <li className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-[#00754A]" />Fast settlements</li>
              <li className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-[#00754A]" />Competitive processing rates</li>
            </ul>
            <Link to="/contact">
              <Button variant="outline" className="w-full border-[#00754A] text-[#00754A] hover:bg-green-50 transition-all duration-300">
                Learn More
              </Button>
            </Link>
          </CardContent>
        </Card>
        <Card className="group border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02] bg-gradient-to-br from-white to-indigo-50/30 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-200/30 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
          <CardHeader className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <TrendingUp className="w-6 h-6 text-[#00754A]" />
            </div>
            <CardTitle className="text-xl font-bold group-hover:text-[#00754A] transition-colors duration-300">Commercial Loans</CardTitle>
            <CardDescription className="text-base leading-relaxed">Flexible financing for business growth, equipment, and real estate.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-muted-foreground mb-6">
              <li className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-[#00754A]" />Lines of credit</li>
              <li className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-[#00754A]" />Equipment loans</li>
              <li className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-[#00754A]" />Commercial mortgages</li>
            </ul>
            <Link to="/loans">
              <Button variant="outline" className="w-full border-[#00754A] text-[#00754A] hover:bg-green-50 transition-all duration-300">
                Learn More
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
