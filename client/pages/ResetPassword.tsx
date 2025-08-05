import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CreditCard, ArrowLeft, Mail, Shield, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [maskedEmail, setMaskedEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        navigate("/dashboard");
      }
    });
  }, [navigate]);

  const maskEmail = (email: string): string => {
    const [localPart, domain] = email.split("@");
    const maskedLocal =
      localPart.length > 2
        ? localPart.charAt(0) +
          "*".repeat(localPart.length - 2) +
          localPart.charAt(localPart.length - 1)
        : localPart.charAt(0) + "*".repeat(localPart.length - 1);
    return `${maskedLocal}@${domain}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Please enter a valid email address");
      }

      // Send password reset email
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/reset-password-confirm`,
        },
      );

      if (resetError) {
        throw new Error(resetError.message);
      }

      // Success - show confirmation
      setMaskedEmail(maskEmail(email));
      setIsEmailSent(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (!email) return;

    setLoading(true);
    setError("");

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/reset-password-confirm`,
        },
      );

      if (resetError) {
        throw new Error(resetError.message);
      }

      setError("");
      // You could add a success toast here
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend email");
    } finally {
      setLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">
                SecureBank
              </span>
            </Link>
          </div>

          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Check your email</CardTitle>
              <CardDescription>
                We've sent password reset instructions to
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Masked email display */}
                <div className="text-center">
                  <div className="inline-flex items-center space-x-2 bg-muted/50 px-4 py-2 rounded-lg">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{maskedEmail}</span>
                  </div>
                </div>

                {/* Security notice */}
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        Security measures in place
                      </h4>
                      <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                        <li>• Link expires in 1 hour for your security</li>
                        <li>• All active sessions will be terminated</li>
                        <li>
                          • Email verification required for password reset
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Timer notice */}
                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span className="text-sm text-amber-700 dark:text-amber-300">
                      Didn't receive the email? Check your spam folder or wait
                      60 seconds to resend.
                    </span>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Action buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={handleResendEmail}
                    disabled={loading}
                    variant="outline"
                    className="w-full"
                  >
                    {loading ? "Sending..." : "Resend email"}
                  </Button>

                  <Button asChild variant="ghost" className="w-full">
                    <Link
                      to="/login"
                      className="flex items-center justify-center space-x-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back to login</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              For your security, this process is monitored and logged
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              SecureBank
            </span>
          </Link>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Reset your password</CardTitle>
            <CardDescription>
              Enter your email address and we'll send you instructions to reset
              your password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email address"
                  disabled={loading}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading || !email.trim()}
              >
                {loading
                  ? "Sending instructions..."
                  : "Send reset instructions"}
              </Button>
            </form>

            {/* Security info */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h4 className="text-sm font-medium mb-2 flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Security Information</span>
              </h4>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• We'll send a secure link to your registered email</p>
                <p>• The link will expire in 1 hour for security</p>
                <p>• All your current sessions will be logged out</p>
                <p>• If you don't have access to your email, contact support</p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Button asChild variant="ghost" className="text-sm">
                <Link
                  to="/login"
                  className="flex items-center justify-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to login</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Help section */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Need help? Contact{" "}
            <Link to="/contact" className="text-primary hover:underline">
              customer support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
