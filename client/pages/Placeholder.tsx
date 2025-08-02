import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, ArrowLeft, MessageSquare } from "lucide-react";

interface PlaceholderProps {
  title: string;
  description: string;
  suggestedPrompt?: string;
}

export default function Placeholder({ 
  title, 
  description, 
  suggestedPrompt = "Can you help me build out this page?" 
}: PlaceholderProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">SecureBank</span>
            </div>
            <Link to="/">
              <Button variant="ghost">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="border-0 shadow-xl">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-muted-foreground" />
              </div>
              <CardTitle className="text-2xl">{title}</CardTitle>
              <CardDescription className="text-base">
                {description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  This page is ready to be built! Continue the conversation to add content and functionality to this section.
                </p>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm font-medium mb-2">💡 Try asking:</p>
                  <p className="text-sm text-muted-foreground italic">
                    "{suggestedPrompt}"
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to="/dashboard">
                    <Button>Go to Dashboard</Button>
                  </Link>
                  <Link to="/">
                    <Button variant="outline">Back to Home</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
