import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

export default function Investments() {
  return (
    <section className="container mx-auto px-4 py-20">
      <h2 className="text-4xl font-bold mb-8 text-foreground">Investments</h2>
      <div className="grid md:grid-cols-3 gap-8">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Portfolio Management</CardTitle>
            <CardDescription>Track and optimize your investments with real-time analytics.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc ml-4 text-muted-foreground">
              <li>Performance tracking</li>
              <li>Asset allocation tools</li>
              <li>Personalized insights</li>
            </ul>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Trading Tools</CardTitle>
            <CardDescription>Buy and sell stocks, ETFs, and more with advanced trading features.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc ml-4 text-muted-foreground">
              <li>Real-time quotes</li>
              <li>Low commissions</li>
              <li>Mobile trading app</li>
            </ul>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Market Insights</CardTitle>
            <CardDescription>Stay ahead with expert research, news, and market analysis.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc ml-4 text-muted-foreground">
              <li>Daily market news</li>
              <li>Investment research</li>
              <li>Economic calendar</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
