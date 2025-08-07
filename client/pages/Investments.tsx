import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { PieChart, BarChart3, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Investments() {
  return (
    <section className="container mx-auto px-4 py-20 bg-gradient-to-br from-slate-50 via-purple-50/20 to-violet-50/30">
      <div className="text-center mb-16">
        <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-[#00754A] to-[#005A39] bg-clip-text text-transparent">Investment Services</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Build wealth with our comprehensive investment platform and expert advisory services.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        <Card className="group border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02] bg-gradient-to-br from-white to-purple-50/30 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-200/30 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
          <CardHeader className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <PieChart className="w-6 h-6 text-[#00754A]" />
            </div>
            <CardTitle className="text-xl font-bold group-hover:text-[#00754A] transition-colors duration-300">Portfolio Management</CardTitle>
            <CardDescription className="text-base leading-relaxed">Track and optimize your investments with real-time analytics.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-muted-foreground mb-6">
              <li className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-[#00754A]" />Performance tracking</li>
              <li className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-[#00754A]" />Asset allocation tools</li>
              <li className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-[#00754A]" />Personalized insights</li>
            </ul>
            <Link to="/investments">
              <Button variant="outline" className="w-full border-[#00754A] text-[#00754A] hover:bg-green-50 transition-all duration-300">
                Learn More
              </Button>
            </Link>
          </CardContent>
        </Card>
        <Card className="group border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02] bg-gradient-to-br from-white to-orange-50/30 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-orange-200/30 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
          <CardHeader className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <BarChart3 className="w-6 h-6 text-[#00754A]" />
            </div>
            <CardTitle className="text-xl font-bold group-hover:text-[#00754A] transition-colors duration-300">Trading Tools</CardTitle>
            <CardDescription className="text-base leading-relaxed">Buy and sell stocks, ETFs, and more with advanced trading features.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-muted-foreground mb-6">
              <li className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-[#00754A]" />Real-time quotes</li>
              <li className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-[#00754A]" />Low commissions</li>
              <li className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-[#00754A]" />Mobile trading app</li>
            </ul>
            <Link to="/contact">
              <Button variant="outline" className="w-full border-[#00754A] text-[#00754A] hover:bg-green-50 transition-all duration-300">
                Learn More
              </Button>
            </Link>
          </CardContent>
        </Card>
        <Card className="group border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02] bg-gradient-to-br from-white to-violet-50/30 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-violet-200/30 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
          <CardHeader className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-100 to-violet-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <TrendingUp className="w-6 h-6 text-[#00754A]" />
            </div>
            <CardTitle className="text-xl font-bold group-hover:text-[#00754A] transition-colors duration-300">Market Insights</CardTitle>
            <CardDescription className="text-base leading-relaxed">Stay ahead with expert research, news, and market analysis.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-muted-foreground mb-6">
              <li className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-[#00754A]" />Daily market news</li>
              <li className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-[#00754A]" />Investment research</li>
              <li className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-[#00754A]" />Economic calendar</li>
            </ul>
            <Link to="/contact">
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
