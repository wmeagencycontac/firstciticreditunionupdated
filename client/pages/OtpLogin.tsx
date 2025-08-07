import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Loader2, Mail, Shield, CheckCircle, AlertCircle, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

type Step = "email" | "verification" | "success";

export default function OtpLogin() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const { toast } = useToast();

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/otp/request-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStep("verification");
        toast({
          title: "Code sent!",
          description: "Check your email for the verification code.",
        });
      } else {
        setError(data.error || "Failed to send verification code");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/otp/verify-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code: otp }),
      });

      const data = await response.json();

      if (response.ok) {
        setUserId(data.user_id);
        setStep("success");
        toast({
          title: "Successfully authenticated!",
          description: "You have been logged in securely.",
        });
      } else {
        setError(data.error || "Invalid verification code");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/otp/request-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        toast({
          title: "Code resent!",
          description: "A new verification code has been sent to your email.",
        });
      } else {
        const data = await response.json();
        setError(data.error || "Failed to resend code");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-green-50/30 to-emerald-50/60 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-br from-green-200/30 to-emerald-300/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-tr from-blue-200/20 to-green-200/30 rounded-full blur-3xl -z-10"></div>
      
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-3 mb-6 group">
            <div className="w-12 h-12 bg-gradient-to-br from-[#00754A] to-[#005A39] rounded-xl flex items-center justify-center shadow-lg shadow-green-500/25 group-hover:scale-105 transition-transform duration-300">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div className="text-left">
              <div className="text-2xl font-bold text-[#00754A]">
                First City Credit Union
              </div>
              <div className="text-sm text-muted-foreground">
                Secure Login Portal
              </div>
            </div>
          </Link>
        </div>

        <Card className="shadow-xl shadow-green-500/10 border-0 bg-white/80 backdrop-blur-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="h-8 w-8 text-[#00754A]" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              {step === "email" && "Secure Login"}
              {step === "verification" && "Enter Verification Code"}
              {step === "success" && "Login Successful"}
            </CardTitle>
            <CardDescription className="text-base">
              {step === "email" &&
                "Enter your email to receive a secure login code"}
              {step === "verification" && `We've sent a 6-digit code to ${email}`}
              {step === "success" && "You have been authenticated successfully"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {step === "email" && (
              <form onSubmit={handleRequestOTP} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="focus:ring-[#00754A] focus:border-[#00754A]"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-[#00754A] to-[#005A39] hover:from-[#005A39] hover:to-[#004830] text-white shadow-lg shadow-green-500/30 hover:shadow-green-500/40 transition-all duration-300" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending Code...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Send Verification Code
                    </>
                  )}
                </Button>
              </form>
            )}

            {step === "verification" && (
              <form onSubmit={handleVerifyOTP} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-sm font-medium">Verification Code</Label>
                  <div className="flex justify-center">
                    <InputOTP value={otp} onChange={setOtp} maxLength={6}>
                      <InputOTPGroup>
                        {Array.from({ length: 6 }).map((_, index) => (
                          <InputOTPSlot key={index} index={index} className="border-green-200 focus:border-[#00754A] focus:ring-[#00754A]" />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    Enter the 6-digit code sent to your email
                  </p>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#00754A] to-[#005A39] hover:from-[#005A39] hover:to-[#004830] text-white shadow-lg shadow-green-500/30 hover:shadow-green-500/40 transition-all duration-300"
                  disabled={isLoading || otp.length !== 6}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify Code"
                  )}
                </Button>
              </form>
            )}

            {step === "success" && (
              <div className="text-center space-y-6">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="h-10 w-10 text-[#00754A]" />
                </div>
                <div className="space-y-2">
                  <p className="text-xl font-semibold text-foreground">Welcome back!</p>
                  <p className="text-sm text-muted-foreground">
                    User ID: {userId}
                  </p>
                  <p className="text-sm text-muted-foreground">Email: {email}</p>
                </div>
                <div className="space-y-3">
                  <Button asChild className="w-full bg-gradient-to-r from-[#00754A] to-[#005A39] hover:from-[#005A39] hover:to-[#004830] text-white shadow-lg shadow-green-500/30 hover:shadow-green-500/40 transition-all duration-300">
                    <Link to="/dashboard">Go to Dashboard</Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full border-[#00754A] text-[#00754A] hover:bg-green-50 transition-all duration-300">
                    <Link to="/">Return to Home</Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>

          {step === "verification" && (
            <CardFooter className="flex flex-col space-y-3 bg-green-50/30 rounded-b-lg">
              <p className="text-sm text-muted-foreground text-center">
                Didn't receive the code?
              </p>
              <Button
                variant="link"
                onClick={handleResendCode}
                disabled={isLoading}
                className="text-[#00754A] hover:text-[#005A39]"
              >
                Resend Code
              </Button>
              <Button
                variant="ghost"
                onClick={() => setStep("email")}
                disabled={isLoading}
                className="text-[#00754A] hover:bg-green-50"
              >
                Change Email Address
              </Button>
            </CardFooter>
          )}

          {step === "email" && (
            <CardFooter className="text-center bg-green-50/30 rounded-b-lg">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-[#00754A] hover:text-[#005A39] hover:underline font-medium">
                  Sign in with password
                </Link>
              </p>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
