import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);

      // Submit to Netlify Forms
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData as any).toString(),
      });

      if (response.ok) {
        toast({
          title: "Message sent successfully!",
          description: "We'll get back to you within 24 hours.",
        });
        (e.target as HTMLFormElement).reset();
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      toast({
        title: "Error sending message",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get in touch with First City Credit Union. We're here to help with
            all your banking needs.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  Visit Our Branch
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold">Main Branch</h3>
                  <p className="text-gray-600">
                    123 Financial Avenue
                    <br />
                    Downtown District
                    <br />
                    City, State 12345
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Business Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>9:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>9:00 AM - 2:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between font-semibold">
                      <span>24/7 Online Banking</span>
                      <span>Always Available</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-blue-600" />
                  Phone & Email
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium">Main Line</p>
                    <p className="text-gray-600">(555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium">Email Support</p>
                    <p className="text-gray-600">support@firstcitycu.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium">24/7 Emergency</p>
                    <p className="text-gray-600">(555) 911-HELP</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you as soon as
                possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                name="contact"
                method="POST"
                data-netlify="true"
                data-netlify-honeypot="bot-field"
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {/* Netlify form fields */}
                <input type="hidden" name="form-name" value="contact" />
                <input type="hidden" name="bot-field" />

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      required
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      required
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="john.doe@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Select name="subject" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a topic" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="account-inquiry">
                        Account Inquiry
                      </SelectItem>
                      <SelectItem value="loan-application">
                        Loan Application
                      </SelectItem>
                      <SelectItem value="technical-support">
                        Technical Support
                      </SelectItem>
                      <SelectItem value="fraud-report">Fraud Report</SelectItem>
                      <SelectItem value="general-question">
                        General Question
                      </SelectItem>
                      <SelectItem value="complaint">Complaint</SelectItem>
                      <SelectItem value="compliment">Compliment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    placeholder="Please describe how we can help you..."
                    rows={5}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      id="consent"
                      name="consent"
                      required
                      className="mt-1"
                    />
                    <Label
                      htmlFor="consent"
                      className="text-sm leading-relaxed"
                    >
                      I consent to First City Credit Union collecting and
                      processing my personal information for the purpose of
                      responding to my inquiry. *
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Security Notice */}
        <Card className="mt-12 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="font-semibold text-blue-900 mb-2">
                Security Notice
              </h3>
              <p className="text-blue-800 text-sm">
                Never share sensitive information like account numbers, SSN, or
                passwords through email or contact forms. For secure account
                inquiries, please log into your online banking account or visit
                our branch.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
