import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function QuickTest() {
  const [status, setStatus] = useState("Ready to test");
  const [testResults, setTestResults] = useState<any>(null);

  const runQuickTest = async () => {
    setStatus("Testing...");
    try {
      // Test 1: Create test user
      setStatus("Creating test user...");
      const setupRes = await fetch("/api/test-setup/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!setupRes.ok) {
        throw new Error(
          `Setup failed: ${setupRes.status} ${await setupRes.text()}`,
        );
      }

      const setupData = await setupRes.json();
      setStatus("Test user created successfully");

      // Test 2: Login
      setStatus("Logging in...");
      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: setupData.credentials.email,
          password: setupData.credentials.password,
        }),
      });

      if (!loginRes.ok) {
        throw new Error(
          `Login failed: ${loginRes.status} ${await loginRes.text()}`,
        );
      }

      const loginData = await loginRes.json();
      setStatus("Login successful");

      // Test 3: Dashboard
      setStatus("Fetching dashboard...");
      const dashRes = await fetch("/api/dashboard", {
        headers: {
          Authorization: `Bearer ${loginData.token}`,
        },
      });

      if (!dashRes.ok) {
        throw new Error(
          `Dashboard failed: ${dashRes.status} ${await dashRes.text()}`,
        );
      }

      const dashData = await dashRes.json();
      setStatus("✅ All tests passed!");
      setTestResults({
        user: dashData.user,
        accountCount: dashData.accounts.length,
        totalBalance: dashData.totalBalance,
        recentActivity: dashData.recentActivity.length,
      });
    } catch (error) {
      setStatus(`❌ Error: ${error}`);
      console.error("Test error:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Quick API Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button onClick={runQuickTest} className="w-full">
              Run Quick Test
            </Button>

            <div className="p-4 bg-muted rounded">
              <strong>Status:</strong> {status}
            </div>

            {testResults && (
              <div className="p-4 bg-green-50 rounded">
                <h4 className="font-semibold mb-2">Test Results:</h4>
                <ul className="space-y-1 text-sm">
                  <li>
                    User: {testResults.user.firstName}{" "}
                    {testResults.user.lastName}
                  </li>
                  <li>Email: {testResults.user.email}</li>
                  <li>Accounts: {testResults.accountCount}</li>
                  <li>Balance: ${testResults.totalBalance}</li>
                  <li>Recent transactions: {testResults.recentActivity}</li>
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
