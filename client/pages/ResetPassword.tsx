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
import { Building2, ArrowLeft, Mail, Shield, Clock } from "lucide-react";
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
      <div className="min-h-screen bg-gradient-to-br from-background via-green-50/30 to-emerald-50/60 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-br from-green-200/30 to-emerald-300/20 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-tr from-blue-200/20 to-green-200/30 rounded-full blur-3xl -z-10"></div>

        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <Link
              to="/"
              className="inline-flex items-center space-x-3 mb-6 group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-[#00754A] to-[#005A39] rounded-xl flex items-center justify-center shadow-lg shadow-green-500/25 group-hover:scale-105 transition-transform duration-300">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-[#00754A]">
                  First City Credit Union
                </div>
                <div className="text-sm text-muted-foreground">
                  Password Reset
                </div>
              </div>
            </Link>
          </div>

          <Card className="border-0 shadow-xl shadow-green-500/10 bg-white/80 backdrop-blur-md">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Mail className="w-8 w-8 text-[#00754A]" />
              </div>
              <CardTitle className="text-2xl text-foreground">
                Check your email
              </CardTitle>
              <CardDescription className="text-base">
                We've sent password reset instructions to
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Masked email display */}
                <div className="text-center">
                  <div className="inline-flex items-center space-x-2 bg-green-50 border border-green-200 px-4 py-3 rounded-lg">
                    <Mail className="w-4 h-4 text-[#00754A]" />
                    <span className="font-medium text-foreground">
                      {maskedEmail}
                    </span>
                  </div>
                </div>

                {/* Security notice */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-[#00754A] mt-0.5" />
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-[#00754A]">
                        Security measures in place
                      </h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
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
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span className="text-sm text-amber-700">
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
                    className="w-full border-[#00754A] text-[#00754A] hover:bg-green-50 transition-all duration-300"
                  >
                    {loading ? "Sending..." : "Resend email"}
                  </Button>

                  <Button
                    asChild
                    variant="ghost"
                    className="w-full text-[#00754A] hover:bg-green-50"
                  >
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
              For your security, this process is monitored and logged • Member
              NCUA
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-green-50/30 to-emerald-50/60 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-br from-green-200/30 to-emerald-300/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-tr from-blue-200/20 to-green-200/30 rounded-full blur-3xl -z-10"></div>

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center space-x-3 mb-6 group"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-[#00754A] to-[#005A39] rounded-xl flex items-center justify-center shadow-lg shadow-green-500/25 group-hover:scale-105 transition-transform duration-300">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div className="text-left">
              <div className="text-2xl font-bold text-[#00754A]">
                First City Credit Union
              </div>
              <div className="text-sm text-muted-foreground">
                Password Reset
              </div>
            </div>
          </Link>
        </div>

        <Card className="border-0 shadow-xl shadow-green-500/10 bg-white/80 backdrop-blur-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-foreground">
              Reset your password
            </CardTitle>
            <CardDescription className="text-base">
              Enter your email address and we'll send you instructions to reset
              your password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email address"
                  disabled={loading}
                  className="focus:ring-[#00754A] focus:border-[#00754A]"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#00754A] to-[#005A39] hover:from-[#005A39] hover:to-[#004830] text-white shadow-lg shadow-green-500/30 hover:shadow-green-500/40 transition-all duration-300"
                disabled={loading || !email.trim()}
              >
                {loading
                  ? "Sending instructions..."
                  : "Send reset instructions"}
              </Button>
            </form>

            {/* Security info */}
            <div className="mt-6 p-4 bg-green-50/50 border border-green-200/50 rounded-lg">
              <h4 className="text-sm font-medium mb-2 flex items-center space-x-2 text-[#00754A]">
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
              <Button
                asChild
                variant="ghost"
                className="text-sm text-[#00754A] hover:bg-green-50"
              >
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
            <Link
              to="/contact"
              className="text-[#00754A] hover:text-[#005A39] hover:underline font-medium"
            >
              customer support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
