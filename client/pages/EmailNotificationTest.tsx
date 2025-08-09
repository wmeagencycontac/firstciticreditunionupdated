import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, Mail, Send } from "lucide-react";

export default function EmailNotificationTest() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  const testTransactionEmail = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/test-email/transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      setMessage(data.message);
      setResults([{ type: "transaction", success: data.success }]);
    } catch (error) {
      setMessage("Failed to send test email");
      setResults([{ type: "transaction", success: false }]);
    }
    setLoading(false);
  };

  const testProfileEmail = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/test-email/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      setMessage(data.message);
      setResults([{ type: "profile_update", success: data.success }]);
    } catch (error) {
      setMessage("Failed to send test email");
      setResults([{ type: "profile_update", success: false }]);
    }
    setLoading(false);
  };

  const testAllEmails = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/test-email/all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      setMessage(data.message);
      setResults(data.results || []);
    } catch (error) {
      setMessage("Failed to send test emails");
      setResults([]);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mail className="w-6 h-6 text-[#00754A]" />
              <span>Email Notification Test</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Test Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email to test notifications"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-4">
              <Button
                onClick={testTransactionEmail}
                disabled={!email || loading}
                variant="outline"
              >
                <Send className="w-4 h-4 mr-2" />
                Test Transaction Email
              </Button>

              <Button
                onClick={testProfileEmail}
                disabled={!email || loading}
                variant="outline"
              >
                <Send className="w-4 h-4 mr-2" />
                Test Profile Update Email
              </Button>

              <Button
                onClick={testAllEmails}
                disabled={!email || loading}
                className="bg-[#00754A] hover:bg-[#005A39]"
              >
                <Send className="w-4 h-4 mr-2" />
                Test All Email Types
              </Button>
            </div>

            {message && (
              <Alert>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            {results.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Test Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {results.map((result, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium capitalize">
                          {result.type.replace('_', ' ')}
                        </span>
                        {result.success ? (
                          <div className="flex items-center space-x-2 text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            <span>Sent</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2 text-red-600">
                            <XCircle className="w-4 h-4" />
                            <span>Failed</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Email Notification System Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3 text-[#00754A]">Transaction Notifications</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Deposits (all methods)</li>
                  <li>• Withdrawals (all methods)</li>
                  <li>• Transfers (incoming)</li>
                  <li>• Transfers (outgoing)</li>
                  <li>• Mobile deposits</li>
                  <li>• Real-time balance updates</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3 text-[#00754A]">Profile Update Notifications</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Name changes</li>
                  <li>• Email address updates</li>
                  <li>• Phone number changes</li>
                  <li>• Address modifications</li>
                  <li>• Security information updates</li>
                  <li>• IP address tracking</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Security Features</h4>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• All emails include security warnings</li>
                <li>• Account numbers are masked (****1234)</li>
                <li>• Timestamps in local time format</li>
                <li>• Contact information for suspicious activity</li>
                <li>• Professional email templates with branding</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
