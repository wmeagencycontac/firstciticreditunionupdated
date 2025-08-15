import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { isSupabaseConfigured } from "@/lib/supabase";

interface NetworkErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface NetworkErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

class NetworkErrorBoundary extends React.Component<
  NetworkErrorBoundaryProps,
  NetworkErrorBoundaryState
> {
  constructor(props: NetworkErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): NetworkErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log the error for debugging
    console.error("NetworkErrorBoundary caught an error:", error, errorInfo);
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      const { error } = this.state;
      const { fallback: Fallback } = this.props;

      if (Fallback) {
        return <Fallback error={error!} resetError={this.resetError} />;
      }

      return (
        <DefaultNetworkErrorDisplay
          error={error!}
          resetError={this.resetError}
        />
      );
    }

    return this.props.children;
  }
}

const DefaultNetworkErrorDisplay: React.FC<{
  error: Error;
  resetError: () => void;
}> = ({ error, resetError }) => {
  const isNetworkError =
    error.message.includes("fetch") ||
    error.message.includes("Network") ||
    error.message.includes("Supabase not configured");

  const isSupabaseError =
    error.message.includes("Supabase not configured") || !isSupabaseConfigured;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-red-600">
            {isNetworkError ? "🌐 Connection Issue" : "⚠️ Application Error"}
          </CardTitle>
          <CardDescription className="text-center">
            {isSupabaseError
              ? "Database connection not configured"
              : "Unable to connect to the server"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isSupabaseError ? (
            <Alert>
              <AlertTitle>Development Mode</AlertTitle>
              <AlertDescription>
                The application is running without a configured database
                connection. Some features may not work as expected.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert variant="destructive">
              <AlertTitle>Network Error</AlertTitle>
              <AlertDescription>
                {error.message || "An unknown network error occurred."}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Button onClick={resetError} className="w-full">
              Try Again
            </Button>

            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="w-full"
            >
              Reload Page
            </Button>

            {isSupabaseError && (
              <Button
                variant="secondary"
                onClick={() => (window.location.href = "/")}
                className="w-full"
              >
                Continue in Demo Mode
              </Button>
            )}
          </div>

          {process.env.NODE_ENV === "development" && (
            <details className="mt-4">
              <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                Technical Details
              </summary>
              <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono text-gray-700 overflow-auto max-h-32">
                <div>
                  <strong>Error:</strong> {error.name}
                </div>
                <div>
                  <strong>Message:</strong> {error.message}
                </div>
                <div>
                  <strong>Supabase Configured:</strong>{" "}
                  {isSupabaseConfigured ? "Yes" : "No"}
                </div>
                {error.stack && (
                  <div className="mt-2">
                    <strong>Stack:</strong>
                    <pre className="whitespace-pre-wrap">{error.stack}</pre>
                  </div>
                )}
              </div>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Hook to handle network errors in functional components
export const useNetworkErrorHandler = () => {
  const handleNetworkError = React.useCallback((error: unknown) => {
    if (error instanceof Error) {
      if (
        error.message.includes("fetch") ||
        error.message.includes("Network")
      ) {
        console.error("Network error detected:", error);
        // You could show a toast notification here instead of throwing
        throw error;
      }
    }
  }, []);

  return { handleNetworkError };
};

export default NetworkErrorBoundary;
