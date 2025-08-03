import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

export default function Business() {
  return (
    <section className="container mx-auto px-4 py-20">
      <h2 className="text-4xl font-bold mb-8 text-foreground">Business Banking</h2>
      <div className="grid md:grid-cols-3 gap-8">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Business Accounts</CardTitle>
            <CardDescription>Manage your company’s finances with robust business checking and savings.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc ml-4 text-muted-foreground">
              <li>Multiple authorized users</li>
              <li>Easy expense tracking</li>
              <li>Online bill pay</li>
            </ul>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Merchant Services</CardTitle>
            <CardDescription>Accept payments in-store and online with secure merchant solutions.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc ml-4 text-muted-foreground">
              <li>POS and e-commerce tools</li>
              <li>Fast settlements</li>
              <li>Competitive processing rates</li>
            </ul>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Commercial Loans</CardTitle>
            <CardDescription>Flexible financing for business growth, equipment, and real estate.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc ml-4 text-muted-foreground">
              <li>Lines of credit</li>
              <li>Equipment loans</li>
              <li>Commercial mortgages</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
