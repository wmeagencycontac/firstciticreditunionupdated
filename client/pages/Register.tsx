import { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { CreditCard, Eye, EyeOff, User } from "lucide-react";
import { auth } from "@/lib/supabase";

interface SimpleRegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  agreeToPrivacy: boolean;
  optInMarketing: boolean;
}

export default function Register() {
  const [formData, setFormData] = useState<SimpleRegistrationData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    agreeToPrivacy: false,
    optInMarketing: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const navigate = useNavigate();

  const updateFormData = (updates: Partial<SimpleRegistrationData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    setValidationErrors((prev) => {
      const newErrors = { ...prev };
      Object.keys(updates).forEach((key) => {
        delete newErrors[key];
      });
      return newErrors;
    });
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errors.email = "Invalid email format";
    if (!formData.password) errors.password = "Password is required";
    else if (formData.password.length < 6)
      errors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      errors.confirmPassword = "Passwords do not match";
    if (!formData.agreeToTerms)
      errors.agreeToTerms = "You must agree to the terms and conditions";
    if (!formData.agreeToPrivacy)
      errors.agreeToPrivacy = "You must agree to the privacy policy";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      const fullName = `${formData.firstName} ${formData.lastName}`;

      const { data, error: signUpError } = await auth.signUp(
        formData.email,
        formData.password,
        fullName,
        "", // bio
        "", // picture
      );

      if (signUpError) {
        throw new Error(signUpError.message);
      }

      if (!data.user) {
        throw new Error("Registration failed");
      }

      // Success - redirect to login with success message
      navigate("/login", {
        state: {
          message:
            "Registration successful! Please check your email to verify your account, then sign in.",
          email: formData.email,
        },
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred during registration",
      );
    } finally {
      setLoading(false);
    }
  };

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
            <CardTitle className="text-2xl">Create Your Account</CardTitle>
            <CardDescription>
              Join SecureBank and start your banking journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      updateFormData({ firstName: e.target.value })
                    }
                    placeholder="Enter your first name"
                    className={
                      validationErrors.firstName ? "border-destructive" : ""
                    }
                  />
                  {validationErrors.firstName && (
                    <p className="text-sm text-destructive">
                      {validationErrors.firstName}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      updateFormData({ lastName: e.target.value })
                    }
                    placeholder="Enter your last name"
                    className={
                      validationErrors.lastName ? "border-destructive" : ""
                    }
                  />
                  {validationErrors.lastName && (
                    <p className="text-sm text-destructive">
                      {validationErrors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData({ email: e.target.value })}
                  placeholder="Enter your email address"
                  className={validationErrors.email ? "border-destructive" : ""}
                />
                {validationErrors.email && (
                  <p className="text-sm text-destructive">
                    {validationErrors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      updateFormData({ password: e.target.value })
                    }
                    placeholder="Create a strong password"
                    className={
                      validationErrors.password ? "border-destructive" : ""
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {validationErrors.password && (
                  <p className="text-sm text-destructive">
                    {validationErrors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      updateFormData({ confirmPassword: e.target.value })
                    }
                    placeholder="Confirm your password"
                    className={
                      validationErrors.confirmPassword
                        ? "border-destructive"
                        : ""
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {validationErrors.confirmPassword && (
                  <p className="text-sm text-destructive">
                    {validationErrors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Password Requirements */}
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Password requirements:</p>
                <ul className="list-disc list-inside space-y-1 ml-4 text-xs">
                  <li>At least 6 characters long</li>
                  <li>Mix of letters and numbers recommended</li>
                </ul>
              </div>

              {/* Legal Agreements */}
              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) =>
                      updateFormData({ agreeToTerms: !!checked })
                    }
                    className={
                      validationErrors.agreeToTerms ? "border-destructive" : ""
                    }
                  />
                  <Label htmlFor="agreeToTerms" className="text-sm leading-5">
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      className="text-primary hover:underline"
                      target="_blank"
                    >
                      Terms and Conditions
                    </Link>{" "}
                    *
                  </Label>
                </div>
                {validationErrors.agreeToTerms && (
                  <p className="text-sm text-destructive ml-6">
                    {validationErrors.agreeToTerms}
                  </p>
                )}

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="agreeToPrivacy"
                    checked={formData.agreeToPrivacy}
                    onCheckedChange={(checked) =>
                      updateFormData({ agreeToPrivacy: !!checked })
                    }
                    className={
                      validationErrors.agreeToPrivacy
                        ? "border-destructive"
                        : ""
                    }
                  />
                  <Label htmlFor="agreeToPrivacy" className="text-sm leading-5">
                    I agree to the{" "}
                    <Link
                      to="/privacy"
                      className="text-primary hover:underline"
                      target="_blank"
                    >
                      Privacy Policy
                    </Link>{" "}
                    *
                  </Label>
                </div>
                {validationErrors.agreeToPrivacy && (
                  <p className="text-sm text-destructive ml-6">
                    {validationErrors.agreeToPrivacy}
                  </p>
                )}

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="optInMarketing"
                    checked={formData.optInMarketing}
                    onCheckedChange={(checked) =>
                      updateFormData({ optInMarketing: !!checked })
                    }
                  />
                  <Label htmlFor="optInMarketing" className="text-sm leading-5">
                    I would like to receive marketing communications and product
                    updates (optional)
                  </Label>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </div>

            {/* Demo Notice */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <User className="w-4 h-4 mr-1" />
                Quick Start
              </h4>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Create your account here</p>
                <p>• Check your email for verification</p>
                <p>
                  • Or visit{" "}
                  <Link
                    to="/supabase-test"
                    className="text-primary hover:underline"
                  >
                    /supabase-test
                  </Link>{" "}
                  to try features instantly
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Your information is protected with Supabase Authentication and
            bank-level security
          </p>
        </div>
      </div>
    </div>
  );
}
