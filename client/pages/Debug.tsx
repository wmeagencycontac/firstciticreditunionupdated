import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Debug() {
  const [output, setOutput] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const addOutput = (message: string) => {
    setOutput(prev => prev + message + "\n");
  };

  const testPing = async () => {
    try {
      addOutput("Testing ping endpoint...");
      const response = await fetch("/api/ping");
      const data = await response.json();
      addOutput(`✅ Ping: ${JSON.stringify(data)}`);
    } catch (error) {
      addOutput(`❌ Ping error: ${error}`);
    }
  };

  const testSetup = async () => {
    try {
      addOutput("Testing test setup endpoint...");
      const response = await fetch("/api/test-setup/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      
      if (response.ok) {
        const data = await response.json();
        addOutput(`✅ Test setup: ${JSON.stringify(data, null, 2)}`);
        return data;
      } else {
        const errorText = await response.text();
        addOutput(`❌ Test setup failed (${response.status}): ${errorText}`);
      }
    } catch (error) {
      addOutput(`❌ Test setup error: ${error}`);
    }
  };

  const testLogin = async () => {
    try {
      addOutput("Testing login with test credentials...");
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "test@bankingapp.com",
          password: "TestPassword123!",
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        addOutput(`✅ Login successful: ${data.user.name}`);
        localStorage.setItem("auth_token", data.token);
        return data.token;
      } else {
        const errorText = await response.text();
        addOutput(`❌ Login failed (${response.status}): ${errorText}`);
      }
    } catch (error) {
      addOutput(`❌ Login error: ${error}`);
    }
  };

  const testDashboard = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        addOutput("❌ No auth token found. Please login first.");
        return;
      }

      addOutput("Testing dashboard endpoint...");
      const response = await fetch("/api/dashboard", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        addOutput(`✅ Dashboard: User ${data.user.firstName}, ${data.accounts.length} accounts, $${data.totalBalance} total`);
      } else {
        const errorText = await response.text();
        addOutput(`❌ Dashboard failed (${response.status}): ${errorText}`);
      }
    } catch (error) {
      addOutput(`❌ Dashboard error: ${error}`);
    }
  };

  const runFullTest = async () => {
    setLoading(true);
    setOutput("");
    
    addOutput("=== Starting Full API Test ===\n");
    
    await testPing();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await testSetup();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const token = await testLogin();
    if (token) {
      await new Promise(resolve => setTimeout(resolve, 500));
      await testDashboard();
    }
    
    addOutput("\n=== Test Complete ===");
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">API Debug Console</h1>
      
      <div className="space-y-4 mb-6">
        <Button onClick={testPing} disabled={loading}>Test Ping</Button>
        <Button onClick={testSetup} disabled={loading}>Test Setup</Button>
        <Button onClick={testLogin} disabled={loading}>Test Login</Button>
        <Button onClick={testDashboard} disabled={loading}>Test Dashboard</Button>
        <Button onClick={runFullTest} disabled={loading} variant="default">
          {loading ? "Running..." : "Run Full Test"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Output</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-sm bg-muted p-4 rounded max-h-96 overflow-auto whitespace-pre-wrap">
            {output || "Click a button to test API endpoints..."}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
