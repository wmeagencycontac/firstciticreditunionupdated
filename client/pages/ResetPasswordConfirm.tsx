import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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
import { Progress } from "@/components/ui/progress";
import {
  CreditCard,
  Eye,
  EyeOff,
  Shield,
  Check,
  X,
  AlertTriangle,
  LogOut,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface PasswordStrength {
  score: number;
  feedback: string[];
  isValid: boolean;
}

export default function ResetPasswordConfirm() {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    feedback: [],
    isValid: false,
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have the required URL parameters
    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");
    const type = searchParams.get("type");

    if (type === "recovery" && accessToken && refreshToken) {
      // Set the session with the tokens from the URL
      supabase.auth
        .setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        })
        .then(({ error }) => {
          if (error) {
            setError(
              "Invalid or expired reset link. Please request a new password reset.",
            );
          } else {
            setIsTokenValid(true);
          }
        });
    } else {
      setError("Invalid reset link. Please request a new password reset.");
    }
  }, [searchParams]);

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    const feedback: string[] = [];
    let score = 0;

    // Length check
    if (password.length >= 8) {
      score += 20;
    } else {
      feedback.push("At least 8 characters required");
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
      score += 20;
    } else {
      feedback.push("Include at least one uppercase letter");
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
      score += 20;
    } else {
      feedback.push("Include at least one lowercase letter");
    }

    // Number check
    if (/\d/.test(password)) {
      score += 20;
    } else {
      feedback.push("Include at least one number");
    }

    // Special character check
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      score += 20;
    } else {
      feedback.push("Include at least one special character");
    }

    return {
      score,
      feedback,
      isValid: score >= 80 && password.length >= 8,
    };
  };

  useEffect(() => {
    if (password) {
      setPasswordStrength(calculatePasswordStrength(password));
    } else {
      setPasswordStrength({ score: 0, feedback: [], isValid: false });
    }
  }, [password]);

  const getStrengthColor = (score: number) => {
    if (score < 40) return "bg-red-500";
    if (score < 60) return "bg-orange-500";
    if (score < 80) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = (score: number) => {
    if (score < 40) return "Weak";
    if (score < 60) return "Fair";
    if (score < 80) return "Good";
    return "Strong";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validation
      if (!passwordStrength.isValid) {
        throw new Error("Please ensure your password meets all requirements");
      }

      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      // Update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        throw new Error(updateError.message);
      }

      // Sign out all other sessions (this invalidates all existing sessions except current)
      await supabase.auth.signOut({ scope: "others" });

      setIsSuccess(true);

      // Redirect to login after a short delay
      setTimeout(() => {
        navigate("/login", {
          state: {
            message:
              "Password updated successfully. Please sign in with your new password.",
          },
        });
      }, 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update password",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isTokenValid && !error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-xl">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-muted-foreground">
                  Validating reset link...
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
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
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-2xl">
                Password updated successfully
              </CardTitle>
              <CardDescription>
                Your password has been changed and all other sessions have been
                logged out
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-green-900 dark:text-green-100">
                        Security actions completed
                      </h4>
                      <ul className="text-xs text-green-700 dark:text-green-300 space-y-1">
                        <li>• Password successfully updated</li>
                        <li>• All other devices logged out</li>
                        <li>• Account security enhanced</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground text-center">
                  Redirecting to login page in a few seconds...
                </p>

                <Button asChild className="w-full">
                  <Link to="/login">Sign in now</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error && !isTokenValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
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
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle className="text-2xl">Invalid reset link</CardTitle>
              <CardDescription>
                This password reset link is invalid or has expired
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <Button asChild className="w-full">
                    <Link to="/reset-password">Request new reset link</Link>
                  </Button>

                  <Button asChild variant="outline" className="w-full">
                    <Link to="/login">Back to login</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
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
            <CardTitle className="text-2xl">Create new password</CardTitle>
            <CardDescription>
              Choose a strong password to secure your account
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
                <Label htmlFor="password">New password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your new password"
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {/* Password strength indicator */}
                {password && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        Password strength
                      </span>
                      <span
                        className={`font-medium ${
                          passwordStrength.score >= 80
                            ? "text-green-600"
                            : passwordStrength.score >= 60
                              ? "text-yellow-600"
                              : passwordStrength.score >= 40
                                ? "text-orange-600"
                                : "text-red-600"
                        }`}
                      >
                        {getStrengthText(passwordStrength.score)}
                      </span>
                    </div>
                    <Progress value={passwordStrength.score} className="h-2" />

                    {passwordStrength.feedback.length > 0 && (
                      <div className="space-y-1">
                        {passwordStrength.feedback.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2 text-xs text-muted-foreground"
                          >
                            <X className="w-3 h-3 text-red-500" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm new password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Confirm your new password"
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {confirmPassword && (
                  <div className="flex items-center space-x-2 text-xs">
                    {password === confirmPassword ? (
                      <>
                        <Check className="w-3 h-3 text-green-500" />
                        <span className="text-green-600">Passwords match</span>
                      </>
                    ) : (
                      <>
                        <X className="w-3 h-3 text-red-500" />
                        <span className="text-red-600">
                          Passwords do not match
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Security notice */}
              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <LogOut className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      Security action
                    </h4>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      Updating your password will automatically log out all
                      other devices for your security.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={
                  loading ||
                  !passwordStrength.isValid ||
                  !confirmPassword ||
                  password !== confirmPassword
                }
              >
                {loading ? "Updating password..." : "Update password"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Button asChild variant="ghost" className="text-sm">
                <Link to="/login">Cancel and return to login</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            This secure session will expire in 1 hour
          </p>
        </div>
      </div>
    </div>
  );
}
