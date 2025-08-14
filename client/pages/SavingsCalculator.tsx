import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Link } from "react-router-dom";
import {
  Building2,
  Calculator,
  TrendingUp,
  DollarSign,
  Target,
  PiggyBank,
} from "lucide-react";

interface CalculationResult {
  finalAmount: number;
  totalContributions: number;
  totalInterest: number;
  monthlyBreakdown: Array<{
    month: number;
    balance: number;
    interest: number;
    totalContributions: number;
  }>;
}

export default function SavingsCalculator() {
  const [initialAmount, setInitialAmount] = useState(1000);
  const [monthlyContribution, setMonthlyContribution] = useState(200);
  const [annualRate, setAnnualRate] = useState(4.25);
  const [years, setYears] = useState(5);
  const [result, setResult] = useState<CalculationResult | null>(null);

  const calculateSavings = () => {
    const monthlyRate = annualRate / 100 / 12;
    const totalMonths = years * 12;
    let balance = initialAmount;
    const breakdown = [];
    let totalContributions = initialAmount;

    for (let month = 1; month <= totalMonths; month++) {
      // Add monthly contribution
      balance += monthlyContribution;
      totalContributions += monthlyContribution;

      // Calculate interest
      const monthlyInterest = balance * monthlyRate;
      balance += monthlyInterest;

      breakdown.push({
        month,
        balance: Math.round(balance * 100) / 100,
        interest: Math.round(monthlyInterest * 100) / 100,
        totalContributions: totalContributions,
      });
    }

    const finalAmount = Math.round(balance * 100) / 100;
    const totalInterest =
      Math.round((finalAmount - totalContributions) * 100) / 100;

    setResult({
      finalAmount,
      totalContributions,
      totalInterest,
      monthlyBreakdown: breakdown,
    });
  };

  useEffect(() => {
    calculateSavings();
  }, [initialAmount, monthlyContribution, annualRate, years]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50/20 to-emerald-50/30">
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
            <Link to="/savings">
              <Button
                variant="ghost"
                className="text-[#00754A] hover:bg-green-50"
              >
                Savings Accounts
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-gradient-to-r from-[#00754A] to-[#005A39] hover:from-[#005A39] hover:to-[#004830] text-white">
                Open Account
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-20 max-w-6xl">
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center mb-6 mx-auto">
            <Calculator className="w-8 h-8 text-[#00754A]" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-[#00754A] to-[#005A39] bg-clip-text text-transparent">
            Savings Calculator
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            See how your savings can grow with compound interest and regular
            contributions.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-[#00754A] flex items-center gap-2">
                <PiggyBank className="w-6 h-6" />
                Savings Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Initial Amount */}
              <div className="space-y-3">
                <Label htmlFor="initial">Initial Deposit</Label>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <Input
                      id="initial"
                      type="number"
                      value={initialAmount}
                      onChange={(e) => setInitialAmount(Number(e.target.value))}
                      className="text-lg"
                    />
                  </div>
                  <div className="text-lg font-semibold text-[#00754A]">
                    ${initialAmount.toLocaleString()}
                  </div>
                </div>
                <Slider
                  value={[initialAmount]}
                  onValueChange={(value) => setInitialAmount(value[0])}
                  max={50000}
                  min={0}
                  step={100}
                  className="w-full"
                />
              </div>

              {/* Monthly Contribution */}
              <div className="space-y-3">
                <Label htmlFor="monthly">Monthly Contribution</Label>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <Input
                      id="monthly"
                      type="number"
                      value={monthlyContribution}
                      onChange={(e) =>
                        setMonthlyContribution(Number(e.target.value))
                      }
                      className="text-lg"
                    />
                  </div>
                  <div className="text-lg font-semibold text-[#00754A]">
                    ${monthlyContribution.toLocaleString()}/mo
                  </div>
                </div>
                <Slider
                  value={[monthlyContribution]}
                  onValueChange={(value) => setMonthlyContribution(value[0])}
                  max={2000}
                  min={0}
                  step={25}
                  className="w-full"
                />
              </div>

              {/* Annual Interest Rate */}
              <div className="space-y-3">
                <Label htmlFor="rate">Annual Interest Rate (APY)</Label>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <Input
                      id="rate"
                      type="number"
                      step="0.01"
                      value={annualRate}
                      onChange={(e) => setAnnualRate(Number(e.target.value))}
                      className="text-lg"
                    />
                  </div>
                  <div className="text-lg font-semibold text-[#00754A]">
                    {annualRate}%
                  </div>
                </div>
                <Slider
                  value={[annualRate]}
                  onValueChange={(value) => setAnnualRate(value[0])}
                  max={10}
                  min={0.1}
                  step={0.1}
                  className="w-full"
                />
              </div>

              {/* Time Period */}
              <div className="space-y-3">
                <Label htmlFor="years">Time Period</Label>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <Input
                      id="years"
                      type="number"
                      value={years}
                      onChange={(e) => setYears(Number(e.target.value))}
                      className="text-lg"
                    />
                  </div>
                  <div className="text-lg font-semibold text-[#00754A]">
                    {years} {years === 1 ? "year" : "years"}
                  </div>
                </div>
                <Slider
                  value={[years]}
                  onValueChange={(value) => setYears(value[0])}
                  max={30}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Quick Presets */}
              <div className="space-y-3">
                <Label>Quick Presets</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setInitialAmount(500);
                      setMonthlyContribution(100);
                      setAnnualRate(4.25);
                      setYears(3);
                    }}
                    className="text-sm"
                  >
                    Emergency Fund
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setInitialAmount(2000);
                      setMonthlyContribution(300);
                      setAnnualRate(4.25);
                      setYears(5);
                    }}
                    className="text-sm"
                  >
                    Down Payment
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setInitialAmount(1000);
                      setMonthlyContribution(500);
                      setAnnualRate(5.0);
                      setYears(10);
                    }}
                    className="text-sm"
                  >
                    Retirement
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setInitialAmount(0);
                      setMonthlyContribution(150);
                      setAnnualRate(4.25);
                      setYears(4);
                    }}
                    className="text-sm"
                  >
                    Education
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Panel */}
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardContent className="p-4 text-center">
                  <DollarSign className="w-8 h-8 text-[#00754A] mx-auto mb-2" />
                  <div className="text-2xl font-bold text-[#00754A]">
                    ${result?.finalAmount.toLocaleString() || "0"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Final Balance
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                <CardContent className="p-4 text-center">
                  <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">
                    ${result?.totalContributions.toLocaleString() || "0"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Contributions
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-600">
                    ${result?.totalInterest.toLocaleString() || "0"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Interest Earned
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chart Visualization */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-[#00754A]">
                  Growth Visualization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-t from-green-50 to-white rounded-lg p-4 flex items-end justify-between">
                  {result?.monthlyBreakdown
                    .filter(
                      (_, index) =>
                        index %
                          Math.ceil(result.monthlyBreakdown.length / 12) ===
                        0,
                    )
                    .map((data, index) => {
                      const height =
                        (data.balance / (result.finalAmount || 1)) * 100;
                      return (
                        <div
                          key={index}
                          className="flex flex-col items-center group"
                        >
                          <div className="relative">
                            <div
                              className="w-8 bg-gradient-to-t from-[#00754A] to-[#005A39] rounded-t-md transition-all duration-300 group-hover:opacity-80"
                              style={{ height: `${height * 2}px` }}
                            />
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              ${data.balance.toLocaleString()}
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground mt-2">
                            Year {Math.ceil(data.month / 12)}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>

            {/* Breakdown */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-[#00754A]">
                  Summary Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Initial Deposit:</span>
                  <span className="font-semibold">
                    ${initialAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Monthly Contributions:</span>
                  <span className="font-semibold">
                    ${monthlyContribution.toLocaleString()} × {years * 12}{" "}
                    months
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Interest Rate:</span>
                  <span className="font-semibold">{annualRate}% APY</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Time Period:</span>
                  <span className="font-semibold">{years} years</span>
                </div>
                <div className="flex justify-between items-center py-2 text-lg font-bold text-[#00754A] border-t-2">
                  <span>Final Balance:</span>
                  <span>${result?.finalAmount.toLocaleString() || "0"}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-[#00754A] mb-4">
              Ready to Start Saving?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Open a high-yield savings account today and start earning{" "}
              {annualRate}% APY on your deposits.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/savings">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#00754A] to-[#005A39] hover:from-[#005A39] hover:to-[#004830] text-white"
                >
                  View Savings Accounts
                </Button>
              </Link>
              <Link to="/signup">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[#00754A] text-[#00754A] hover:bg-green-50"
                >
                  Open Account Today
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[#00754A] text-[#00754A] hover:bg-green-50"
                >
                  Speak with Advisor
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
