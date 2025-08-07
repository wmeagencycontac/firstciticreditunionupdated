import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { CreditCard, PiggyBank, DollarSign, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Personal() {
  return (
    <section className="container mx-auto px-4 py-20 bg-gradient-to-br from-white via-green-50/20 to-emerald-50/30">
      <div className="text-center mb-16">
        <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-[#00754A] to-[#005A39] bg-clip-text text-transparent">Personal Banking</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Banking solutions designed around your life, with the security and service you deserve.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        <Card className="group border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02] bg-gradient-to-br from-white to-green-50/30 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-green-200/30 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
          <CardHeader className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <CreditCard className="w-6 h-6 text-[#00754A]" />
            </div>
            <CardTitle className="text-xl font-bold group-hover:text-[#00754A] transition-colors duration-300">Checking Accounts</CardTitle>
            <CardDescription className="text-base leading-relaxed">Flexible, fee-free checking for everyday spending and bill pay.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-muted-foreground mb-6">
              <li className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-[#00754A]" />No monthly fees</li>
              <li className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-[#00754A]" />Instant debit card</li>
              <li className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-[#00754A]" />Mobile check deposit</li>
            </ul>
            <Button variant="outline" className="w-full border-[#00754A] text-[#00754A] hover:bg-green-50 transition-all duration-300">
              Learn More
            </Button>
          </CardContent>
        </Card>
        <Card className="group border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02] bg-gradient-to-br from-white to-blue-50/30 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-200/30 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
          <CardHeader className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <PiggyBank className="w-6 h-6 text-[#00754A]" />
            </div>
            <CardTitle className="text-xl font-bold group-hover:text-[#00754A] transition-colors duration-300">Savings Accounts</CardTitle>
            <CardDescription className="text-base leading-relaxed">High-yield savings to help you reach your goals faster.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-muted-foreground mb-6">
              <li className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-[#00754A]" />Competitive APY</li>
              <li className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-[#00754A]" />Automatic savings tools</li>
              <li className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-[#00754A]" />No minimum balance</li>
            </ul>
            <Button variant="outline" className="w-full border-[#00754A] text-[#00754A] hover:bg-green-50 transition-all duration-300">
              Learn More
            </Button>
          </CardContent>
        </Card>
        <Card className="group border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02] bg-gradient-to-br from-white to-purple-50/30 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-200/30 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
          <CardHeader className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <DollarSign className="w-6 h-6 text-[#00754A]" />
            </div>
            <CardTitle className="text-xl font-bold group-hover:text-[#00754A] transition-colors duration-300">Personal Loans</CardTitle>
            <CardDescription className="text-base leading-relaxed">Affordable loans for life's big moments, with fast approval.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-muted-foreground mb-6">
              <li className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-[#00754A]" />Low fixed rates</li>
              <li className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-[#00754A]" />Flexible terms</li>
              <li className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-[#00754A]" />Easy online application</li>
            </ul>
            <Button variant="outline" className="w-full border-[#00754A] text-[#00754A] hover:bg-green-50 transition-all duration-300">
              Learn More
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
