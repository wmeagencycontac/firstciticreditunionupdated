import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Copy,
  Check,
  User,
  CreditCard,
  DollarSign,
  Activity,
} from "lucide-react";

interface TestUserData {
  success: boolean;
  message: string;
  credentials: {
    email: string;
    password: string;
    name: string;
  };
  accounts: {
    checking: {
      accountNumber: string;
      balance: number;
    };
    savings: {
      accountNumber: string;
      balance: number;
    };
  };
  card: {
    cardNumber: string;
  };
  loginInstructions: {
    step1: string;
    step2: string;
    step3: string;
  };
}

export default function TestSetup() {
  const [testUserData, setTestUserData] = useState<TestUserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const createTestUser = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/test-setup/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTestUserData(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create test user",
      );
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const CopyButton = ({ text, field }: { text: string; field: string }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => copyToClipboard(text, field)}
      className="ml-2 h-6 w-6 p-0"
    >
      {copiedField === field ? (
        <Check className="h-3 w-3 text-green-500" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
    </Button>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Test User Setup</h1>
        <p className="text-muted-foreground">
          Create a pre-configured test user with banking accounts and sample
          data for testing the application.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Test User Features
          </CardTitle>
          <CardDescription>
            What you'll get with the test user setup
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">✅</Badge>
                <span>Verified email (no verification required)</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">💰</Badge>
                <span>Checking account with $2,500 balance</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">🏦</Badge>
                <span>Savings account with $15,000 balance</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">💳</Badge>
                <span>Active debit card</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">📊</Badge>
                <span>Sample transaction history</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">🔄</Badge>
                <span>Transfer capabilities</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">📱</Badge>
                <span>Full dashboard access</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">🛡️</Badge>
                <span>Strong password for security testing</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4 mb-6">
        <Button onClick={createTestUser} disabled={loading} size="lg">
          {loading ? "Creating Test User..." : "Create Test User"}
        </Button>
      </div>

      {error && (
        <Card className="mb-6 border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {testUserData && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">
                ✅ Test User Created Successfully!
              </CardTitle>
              <CardDescription>{testUserData.message}</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Login Credentials
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <span className="font-medium">Email:</span>
                  <span className="ml-2 font-mono">
                    {testUserData.credentials.email}
                  </span>
                </div>
                <CopyButton
                  text={testUserData.credentials.email}
                  field="email"
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <span className="font-medium">Password:</span>
                  <span className="ml-2 font-mono">
                    {testUserData.credentials.password}
                  </span>
                </div>
                <CopyButton
                  text={testUserData.credentials.password}
                  field="password"
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <span className="font-medium">Name:</span>
                  <span className="ml-2">{testUserData.credentials.name}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Bank Accounts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Checking Account</h4>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <span className="font-mono text-sm">
                        {testUserData.accounts.checking.accountNumber}
                      </span>
                      <p className="text-sm text-muted-foreground">
                        Balance: $
                        {testUserData.accounts.checking.balance.toLocaleString()}
                      </p>
                    </div>
                    <CopyButton
                      text={testUserData.accounts.checking.accountNumber}
                      field="checking"
                    />
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">Savings Account</h4>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <span className="font-mono text-sm">
                        {testUserData.accounts.savings.accountNumber}
                      </span>
                      <p className="text-sm text-muted-foreground">
                        Balance: $
                        {testUserData.accounts.savings.balance.toLocaleString()}
                      </p>
                    </div>
                    <CopyButton
                      text={testUserData.accounts.savings.accountNumber}
                      field="savings"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Debit Card
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <span className="font-mono text-sm">
                      {testUserData.card.cardNumber}
                    </span>
                    <p className="text-sm text-muted-foreground">
                      Status: Active
                    </p>
                  </div>
                  <CopyButton
                    text={testUserData.card.cardNumber}
                    field="card"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Quick Start Instructions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                <li className="flex gap-3">
                  <Badge className="min-w-[24px] h-6 rounded-full flex items-center justify-center text-xs">
                    1
                  </Badge>
                  <span>{testUserData.loginInstructions.step1}</span>
                </li>
                <li className="flex gap-3">
                  <Badge className="min-w-[24px] h-6 rounded-full flex items-center justify-center text-xs">
                    2
                  </Badge>
                  <span>{testUserData.loginInstructions.step2}</span>
                </li>
                <li className="flex gap-3">
                  <Badge className="min-w-[24px] h-6 rounded-full flex items-center justify-center text-xs">
                    3
                  </Badge>
                  <span>{testUserData.loginInstructions.step3}</span>
                </li>
              </ol>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Pro tip:</strong> The test user is pre-configured with
                  sample transactions, so you can immediately test features like
                  transaction history, account summaries, and money transfers
                  without having to set up additional data.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
