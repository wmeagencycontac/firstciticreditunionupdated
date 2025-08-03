import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

export default function About() {
  return (
    <section className="container mx-auto px-4 py-20">
      <h2 className="text-4xl font-bold mb-8 text-foreground">About Us</h2>
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Company History</CardTitle>
            <CardDescription>Decades of innovation and service in banking.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Founded in 1985, SecureBank has grown from a local credit union to a national leader in digital banking, serving millions with trust and integrity.</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Leadership Team</CardTitle>
            <CardDescription>Experienced professionals guiding our vision.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc ml-4 text-muted-foreground">
              <li>Jane Doe, CEO</li>
              <li>John Smith, CFO</li>
              <li>Maria Lee, CTO</li>
            </ul>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Our Values</CardTitle>
            <CardDescription>Integrity, innovation, and customer focus.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc ml-4 text-muted-foreground">
              <li>Customer-first service</li>
              <li>Transparency</li>
              <li>Community impact</li>
            </ul>
          </CardContent>
        </Card>
      </div>
      <div className="text-center text-muted-foreground max-w-2xl mx-auto">
        <p>At SecureBank, we believe in empowering our customers to achieve their financial goals with confidence and security. Our commitment to innovation and service excellence drives everything we do.</p>
      </div>
    </section>
  );
}
