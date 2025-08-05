import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Building2, Shield, CheckCircle, ArrowLeft } from "lucide-react";
import { auth } from "@/lib/supabase";
import { toast } from "sonner";

interface SignupFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  
  // Address Information
  street: string;
  city: string;
  state: string;
  zipCode: string;
  
  // Account Selection
  accountType: "personal" | "business";
  
  // Security
  password: string;
  confirmPassword: string;
  
  // Legal
  agreeToTerms: boolean;
  agreeToPrivacy: boolean;
  optInMarketing: boolean;
}

export default function Signup() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    accountType: "personal",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    agreeToPrivacy: false,
    optInMarketing: false,
  });

  const updateFormData = (field: keyof SignupFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.firstName && formData.lastName && formData.email && formData.phoneNumber && formData.dateOfBirth);
      case 2:
        return !!(formData.street && formData.city && formData.state && formData.zipCode);
      case 3:
        return !!(formData.password && formData.confirmPassword && formData.password === formData.confirmPassword);
      case 4:
        return formData.agreeToTerms && formData.agreeToPrivacy;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
      setError("");
    } else {
      setError("Please fill in all required fields correctly.");
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setError("");
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) {
      setError("Please complete all required fields and agree to the terms.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Sign up with Supabase
      const { data, error: signupError } = await auth.signUp(
        formData.email,
        formData.password,
        `${formData.firstName} ${formData.lastName}`,
        `Member since ${new Date().getFullYear()}. ${formData.accountType === 'business' ? 'Business' : 'Personal'} banking.`
      );

      if (signupError) {
        throw new Error(signupError.message);
      }

      if (data.user) {
        // Create banking profile
        const response = await fetch('/api/supabase/auth/create-profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: data.user.id,
            email: formData.email,
            name: `${formData.firstName} ${formData.lastName}`,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phoneNumber: formData.phoneNumber,
            dateOfBirth: formData.dateOfBirth,
            address: {
              street: formData.street,
              city: formData.city,
              state: formData.state,
              zipCode: formData.zipCode,
            },
            accountType: formData.accountType,
            optInMarketing: formData.optInMarketing,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create banking profile');
        }

        toast.success("Account created successfully! Please check your email to verify your account.");
        
        // Redirect to a success page or login
        navigate('/login?message=Please check your email to verify your account before signing in.');
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during signup. Please try again.");
      toast.error("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => updateFormData('firstName', e.target.value)}
                  placeholder="John"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => updateFormData('lastName', e.target.value)}
                  placeholder="Doe"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                placeholder="john.doe@example.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="phoneNumber">Phone Number *</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => updateFormData('phoneNumber', e.target.value)}
                placeholder="(555) 123-4567"
                required
              />
            </div>
            <div>
              <Label htmlFor="dateOfBirth">Date of Birth *</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Address Information</h3>
            <div>
              <Label htmlFor="street">Street Address *</Label>
              <Input
                id="street"
                type="text"
                value={formData.street}
                onChange={(e) => updateFormData('street', e.target.value)}
                placeholder="123 Main Street"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  type="text"
                  value={formData.city}
                  onChange={(e) => updateFormData('city', e.target.value)}
                  placeholder="New York"
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">State *</Label>
                <Select value={formData.state} onValueChange={(value) => updateFormData('state', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NY">New York</SelectItem>
                    <SelectItem value="CA">California</SelectItem>
                    <SelectItem value="TX">Texas</SelectItem>
                    <SelectItem value="FL">Florida</SelectItem>
                    <SelectItem value="IL">Illinois</SelectItem>
                    {/* Add more states as needed */}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="zipCode">ZIP Code *</Label>
              <Input
                id="zipCode"
                type="text"
                value={formData.zipCode}
                onChange={(e) => updateFormData('zipCode', e.target.value)}
                placeholder="12345"
                required
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Account Security</h3>
            <div>
              <Label htmlFor="accountType">Account Type</Label>
              <Select value={formData.accountType} onValueChange={(value: "personal" | "business") => updateFormData('accountType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">Personal Banking</SelectItem>
                  <SelectItem value="business">Business Banking</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => updateFormData('password', e.target.value)}
                placeholder="Enter a strong password"
                required
              />
              <p className="text-sm text-muted-foreground mt-1">
                Password must be at least 8 characters long
              </p>
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                placeholder="Confirm your password"
                required
              />
            </div>
            
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Your initial account balance will be $0.00. You can fund your account after verification.
              </AlertDescription>
            </Alert>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Terms & Conditions</h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => updateFormData('agreeToTerms', checked)}
                />
                <Label htmlFor="agreeToTerms" className="text-sm leading-relaxed">
                  I agree to the <Link to="/terms" className="text-[#00754A] hover:underline">Terms of Service</Link> and 
                  understand my rights and responsibilities as a First City Credit Union member. *
                </Label>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agreeToPrivacy"
                  checked={formData.agreeToPrivacy}
                  onCheckedChange={(checked) => updateFormData('agreeToPrivacy', checked)}
                />
                <Label htmlFor="agreeToPrivacy" className="text-sm leading-relaxed">
                  I have read and agree to the <Link to="/privacy" className="text-[#00754A] hover:underline">Privacy Policy</Link> and 
                  consent to the collection and use of my personal information. *
                </Label>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="optInMarketing"
                  checked={formData.optInMarketing}
                  onCheckedChange={(checked) => updateFormData('optInMarketing', checked)}
                />
                <Label htmlFor="optInMarketing" className="text-sm leading-relaxed">
                  I would like to receive promotional emails and updates about First City Credit Union products and services.
                </Label>
              </div>
            </div>

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Your account will be created with $0.00 balance and will be NCUA insured up to $250,000.
                You'll receive email verification instructions to activate your account.
              </AlertDescription>
            </Alert>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-green-50/50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-[#00754A] rounded-lg flex items-center justify-center">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#00754A]">First City Credit Union</div>
              <div className="text-sm text-muted-foreground">Join today and start banking smarter</div>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Open Your Account</CardTitle>
                <CardDescription>Step {currentStep} of 4</CardDescription>
              </div>
              <div className="flex space-x-1">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`w-3 h-3 rounded-full ${
                      step <= currentStep 
                        ? 'bg-[#00754A]' 
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-4 border-destructive">
                <AlertDescription className="text-destructive">{error}</AlertDescription>
              </Alert>
            )}

            {renderStep()}

            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={currentStep === 1 ? () => navigate('/') : prevStep}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {currentStep === 1 ? 'Back to Home' : 'Previous'}
              </Button>
              
              {currentStep < 4 ? (
                <Button
                  onClick={nextStep}
                  disabled={!validateStep(currentStep)}
                  className="bg-[#00754A] hover:bg-[#005A39]"
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={loading || !validateStep(4)}
                  className="bg-[#00754A] hover:bg-[#005A39]"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              )}
            </div>

            <div className="text-center mt-6">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="text-[#00754A] hover:underline font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
