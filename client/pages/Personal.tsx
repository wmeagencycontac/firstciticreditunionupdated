import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

export default function Personal() {
  return (
    <section className="container mx-auto px-4 py-20">
      <h2 className="text-4xl font-bold mb-8 text-foreground">Personal Banking</h2>
      <div className="grid md:grid-cols-3 gap-8">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Checking Accounts</CardTitle>
            <CardDescription>Flexible, fee-free checking for everyday spending and bill pay.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc ml-4 text-muted-foreground">
              <li>No monthly fees</li>
              <li>Instant debit card</li>
              <li>Mobile check deposit</li>
            </ul>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Savings Accounts</CardTitle>
            <CardDescription>High-yield savings to help you reach your goals faster.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc ml-4 text-muted-foreground">
              <li>Competitive APY</li>
              <li>Automatic savings tools</li>
              <li>No minimum balance</li>
            </ul>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Personal Loans</CardTitle>
            <CardDescription>Affordable loans for life’s big moments, with fast approval.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc ml-4 text-muted-foreground">
              <li>Low fixed rates</li>
              <li>Flexible terms</li>
              <li>Easy online application</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
