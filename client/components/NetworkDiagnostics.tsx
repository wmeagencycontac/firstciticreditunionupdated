import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { isSupabaseConfigured } from "@/lib/supabase";

interface ConnectionStatus {
  api: "checking" | "connected" | "failed";
  supabase: "checking" | "configured" | "not-configured";
  timestamp: string;
}

const NetworkDiagnostics: React.FC = () => {
  const [status, setStatus] = useState<ConnectionStatus>({
    api: "checking",
    supabase: "checking",
    timestamp: new Date().toISOString(),
  });
  const [error, setError] = useState<string | null>(null);

  const checkConnections = async () => {
    setStatus((prev) => ({
      ...prev,
      api: "checking",
      timestamp: new Date().toISOString(),
    }));
    setError(null);

    try {
      // Test API connection
      const response = await fetch("/api/ping");
      if (response.ok) {
        setStatus((prev) => ({ ...prev, api: "connected" }));
      } else {
        setStatus((prev) => ({ ...prev, api: "failed" }));
        setError(`API responded with status: ${response.status}`);
      }
    } catch (err) {
      setStatus((prev) => ({ ...prev, api: "failed" }));
      setError(err instanceof Error ? err.message : "Unknown API error");
    }

    // Check Supabase configuration
    setStatus((prev) => ({
      ...prev,
      supabase: isSupabaseConfigured ? "configured" : "not-configured",
    }));
  };

  useEffect(() => {
    checkConnections();
  }, []);

  const getStatusColor = (connectionStatus: string) => {
    switch (connectionStatus) {
      case "connected":
      case "configured":
        return "bg-green-500";
      case "failed":
      case "not-configured":
        return "bg-red-500";
      case "checking":
      default:
        return "bg-yellow-500";
    }
  };

  const getStatusText = (
    type: "api" | "supabase",
    connectionStatus: string,
  ) => {
    if (type === "api") {
      switch (connectionStatus) {
        case "connected":
          return "API Connected";
        case "failed":
          return "API Failed";
        case "checking":
        default:
          return "Checking API...";
      }
    } else {
      switch (connectionStatus) {
        case "configured":
          return "Supabase Configured";
        case "not-configured":
          return "Supabase Not Configured";
        case "checking":
        default:
          return "Checking Supabase...";
      }
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔍 Network Diagnostics
        </CardTitle>
        <CardDescription>
          Connection status as of{" "}
          {new Date(status.timestamp).toLocaleTimeString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* API Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Backend API</span>
          <Badge className={getStatusColor(status.api)}>
            {getStatusText("api", status.api)}
          </Badge>
        </div>

        {/* Supabase Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Database (Supabase)</span>
          <Badge className={getStatusColor(status.supabase)}>
            {getStatusText("supabase", status.supabase)}
          </Badge>
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Environment Info */}
        <div className="text-xs text-gray-500 space-y-1">
          <div>Environment: {process.env.NODE_ENV || "unknown"}</div>
          <div>URL: {window.location.origin}</div>
          <div>User Agent: {navigator.userAgent.substring(0, 50)}...</div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <Button
            onClick={checkConnections}
            className="w-full"
            disabled={status.api === "checking"}
          >
            {status.api === "checking" ? "Checking..." : "Refresh Status"}
          </Button>

          {status.supabase === "not-configured" && (
            <Alert>
              <AlertDescription>
                <strong>Development Mode:</strong> Running without database.
                Some features may be limited.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => (window.location.href = "/")}
          >
            Home
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
          >
            Reload
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NetworkDiagnostics;
