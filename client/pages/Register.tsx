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
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Eye,
  EyeOff,
  User,
  Building,
  TrendingUp,
  Shield,
  CheckCircle,
  Upload,
  Calendar,
  MapPin
} from "lucide-react";
import { RegistrationRequest, RegistrationResponse } from "@shared/api";

interface RegistrationFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  ssn: string;
  
  // Address Information
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  
  // Account Selection
  accountType: "personal" | "business" | "investment" | "";
  initialDeposit: string;
  
  // Business Information (if applicable)
  businessName?: string;
  businessType?: string;
  ein?: string;
  businessAddress?: string;
  
  // Identity Verification
  documentType: "drivers_license" | "passport" | "state_id" | "";
  documentNumber: string;
  documentExpiry: string;
  
  // Security
  password: string;
  confirmPassword: string;
  
  // Legal
  agreeToTerms: boolean;
  agreeToPrivacy: boolean;
  optInMarketing: boolean;
}

const accountTypes = [
  {
    id: "personal" as const,
    title: "Personal Banking",
    description: "Individual checking and savings accounts with personal banking features",
    icon: User,
    features: ["Mobile banking", "Debit card", "Online transfers", "24/7 support"],
    minDeposit: "$25"
  },
  {
    id: "business" as const,
    title: "Business Banking",
    description: "Business accounts with commercial banking services and tools",
    icon: Building,
    features: ["Business checks", "Merchant services", "Payroll services", "Business loans"],
    minDeposit: "$100"
  },
  {
    id: "investment" as const,
    title: "Investment Account",
    description: "Investment and wealth management services with portfolio tools",
    icon: TrendingUp,
    features: ["Portfolio management", "Trading platform", "Investment advisory", "Research tools"],
    minDeposit: "$1,000"
  }
];

const states = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

export default function Register() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<RegistrationFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    ssn: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    accountType: "",
    initialDeposit: "",
    documentType: "",
    documentNumber: "",
    documentExpiry: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    agreeToPrivacy: false,
    optInMarketing: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const totalSteps = 4;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const updateFormData = (updates: Partial<RegistrationFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      Object.keys(updates).forEach(key => {
        delete newErrors[key];
      });
      return newErrors;
    });
  };

  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};
    
    switch (step) {
      case 1: // Personal Information
        if (!formData.firstName.trim()) errors.firstName = "First name is required";
        if (!formData.lastName.trim()) errors.lastName = "Last name is required";
        if (!formData.email.trim()) errors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = "Invalid email format";
        if (!formData.phoneNumber.trim()) errors.phoneNumber = "Phone number is required";
        if (!formData.dateOfBirth) errors.dateOfBirth = "Date of birth is required";
        if (!formData.ssn.trim()) errors.ssn = "SSN is required";
        else if (!/^\d{3}-?\d{2}-?\d{4}$/.test(formData.ssn)) errors.ssn = "Invalid SSN format";
        break;
        
      case 2: // Address & Account Type
        if (!formData.street.trim()) errors.street = "Street address is required";
        if (!formData.city.trim()) errors.city = "City is required";
        if (!formData.state) errors.state = "State is required";
        if (!formData.zipCode.trim()) errors.zipCode = "ZIP code is required";
        else if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode)) errors.zipCode = "Invalid ZIP code format";
        if (!formData.accountType) errors.accountType = "Account type is required";
        if (!formData.initialDeposit.trim()) errors.initialDeposit = "Initial deposit is required";
        break;
        
      case 3: // Identity Verification
        if (!formData.documentType) errors.documentType = "Document type is required";
        if (!formData.documentNumber.trim()) errors.documentNumber = "Document number is required";
        if (!formData.documentExpiry) errors.documentExpiry = "Document expiry date is required";
        if (!formData.password) errors.password = "Password is required";
        else if (formData.password.length < 8) errors.password = "Password must be at least 8 characters";
        if (formData.password !== formData.confirmPassword) errors.confirmPassword = "Passwords do not match";
        break;
        
      case 4: // Review & Submit
        if (!formData.agreeToTerms) errors.agreeToTerms = "You must agree to the terms and conditions";
        if (!formData.agreeToPrivacy) errors.agreeToPrivacy = "You must agree to the privacy policy";
        break;
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setLoading(true);
    setError("");

    try {
      const registrationData: RegistrationRequest = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        dateOfBirth: formData.dateOfBirth,
        ssn: formData.ssn,
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
        accountType: formData.accountType as "personal" | "business" | "investment",
        initialDeposit: formData.initialDeposit,
        businessName: formData.businessName,
        businessType: formData.businessType,
        ein: formData.ein,
        businessAddress: formData.businessAddress,
        documentType: formData.documentType as "drivers_license" | "passport" | "state_id",
        documentNumber: formData.documentNumber,
        documentExpiry: formData.documentExpiry,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        agreeToTerms: formData.agreeToTerms,
        agreeToPrivacy: formData.agreeToPrivacy,
        optInMarketing: formData.optInMarketing
      };

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Registration failed");
      }

      const data: RegistrationResponse = await response.json();

      // Success - redirect to login with success message
      navigate("/login", {
        state: {
          message: data.message || "Registration successful! Please sign in to your account.",
          email: formData.email // Pre-fill email on login page
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Account Registration</h2>
        <Badge variant="outline">{currentStep} of {totalSteps}</Badge>
      </div>
      <Progress value={progressPercentage} className="h-2" />
      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
        <span>Personal Info</span>
        <span>Address & Account</span>
        <span>Verification</span>
        <span>Review</span>
      </div>
    </div>
  );

  const renderPersonalInfoStep = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => updateFormData({ firstName: e.target.value })}
            placeholder="Enter your first name"
            className={validationErrors.firstName ? "border-destructive" : ""}
          />
          {validationErrors.firstName && (
            <p className="text-sm text-destructive">{validationErrors.firstName}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => updateFormData({ lastName: e.target.value })}
            placeholder="Enter your last name"
            className={validationErrors.lastName ? "border-destructive" : ""}
          />
          {validationErrors.lastName && (
            <p className="text-sm text-destructive">{validationErrors.lastName}</p>
          )}
        </div>
      </div>

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
          <p className="text-sm text-destructive">{validationErrors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Phone Number *</Label>
        <Input
          id="phoneNumber"
          type="tel"
          value={formData.phoneNumber}
          onChange={(e) => updateFormData({ phoneNumber: e.target.value })}
          placeholder="(555) 123-4567"
          className={validationErrors.phoneNumber ? "border-destructive" : ""}
        />
        {validationErrors.phoneNumber && (
          <p className="text-sm text-destructive">{validationErrors.phoneNumber}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => updateFormData({ dateOfBirth: e.target.value })}
            className={validationErrors.dateOfBirth ? "border-destructive" : ""}
          />
          {validationErrors.dateOfBirth && (
            <p className="text-sm text-destructive">{validationErrors.dateOfBirth}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="ssn">Social Security Number *</Label>
          <Input
            id="ssn"
            value={formData.ssn}
            onChange={(e) => updateFormData({ ssn: e.target.value })}
            placeholder="123-45-6789"
            className={validationErrors.ssn ? "border-destructive" : ""}
          />
          {validationErrors.ssn && (
            <p className="text-sm text-destructive">{validationErrors.ssn}</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderAddressAndAccountStep = () => (
    <div className="space-y-6">
      {/* Address Information */}
      <div>
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <MapPin className="w-5 h-5 mr-2" />
          Address Information
        </h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="street">Street Address *</Label>
            <Input
              id="street"
              value={formData.street}
              onChange={(e) => updateFormData({ street: e.target.value })}
              placeholder="123 Main Street"
              className={validationErrors.street ? "border-destructive" : ""}
            />
            {validationErrors.street && (
              <p className="text-sm text-destructive">{validationErrors.street}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => updateFormData({ city: e.target.value })}
                placeholder="City"
                className={validationErrors.city ? "border-destructive" : ""}
              />
              {validationErrors.city && (
                <p className="text-sm text-destructive">{validationErrors.city}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Select value={formData.state} onValueChange={(value) => updateFormData({ state: value })}>
                <SelectTrigger className={validationErrors.state ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {states.map(state => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {validationErrors.state && (
                <p className="text-sm text-destructive">{validationErrors.state}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP Code *</Label>
              <Input
                id="zipCode"
                value={formData.zipCode}
                onChange={(e) => updateFormData({ zipCode: e.target.value })}
                placeholder="12345"
                className={validationErrors.zipCode ? "border-destructive" : ""}
              />
              {validationErrors.zipCode && (
                <p className="text-sm text-destructive">{validationErrors.zipCode}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => updateFormData({ country: e.target.value })}
                placeholder="United States"
                disabled
              />
            </div>
          </div>
        </div>
      </div>

      {/* Account Type Selection */}
      <div>
        <h3 className="text-lg font-medium mb-4">Choose Your Account Type *</h3>
        <RadioGroup
          value={formData.accountType}
          onValueChange={(value) => updateFormData({ accountType: value as RegistrationFormData["accountType"] })}
          className="space-y-4"
        >
          {accountTypes.map(account => {
            const Icon = account.icon;
            return (
              <div key={account.id} className="relative">
                <RadioGroupItem value={account.id} id={account.id} className="sr-only" />
                <Label
                  htmlFor={account.id}
                  className={`block p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-primary/50 ${
                    formData.accountType === account.id 
                      ? "border-primary bg-primary/5" 
                      : "border-border"
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <Icon className="w-6 h-6 mt-1 text-primary" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{account.title}</h4>
                        <Badge variant="secondary">Min: {account.minDeposit}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {account.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {account.features.map(feature => (
                          <Badge key={feature} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Label>
              </div>
            );
          })}
        </RadioGroup>
        {validationErrors.accountType && (
          <p className="text-sm text-destructive mt-2">{validationErrors.accountType}</p>
        )}

        <div className="mt-4 space-y-2">
          <Label htmlFor="initialDeposit">Initial Deposit Amount *</Label>
          <Input
            id="initialDeposit"
            type="number"
            min="0"
            step="0.01"
            value={formData.initialDeposit}
            onChange={(e) => updateFormData({ initialDeposit: e.target.value })}
            placeholder="0.00"
            className={validationErrors.initialDeposit ? "border-destructive" : ""}
          />
          {validationErrors.initialDeposit && (
            <p className="text-sm text-destructive">{validationErrors.initialDeposit}</p>
          )}
        </div>
      </div>

      {/* Business Information (if business account selected) */}
      {formData.accountType === "business" && (
        <div>
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <Building className="w-5 h-5 mr-2" />
            Business Information
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                value={formData.businessName || ""}
                onChange={(e) => updateFormData({ businessName: e.target.value })}
                placeholder="Your Business Name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="businessType">Business Type</Label>
                <Select value={formData.businessType || ""} onValueChange={(value) => updateFormData({ businessType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sole_proprietorship">Sole Proprietorship</SelectItem>
                    <SelectItem value="llc">LLC</SelectItem>
                    <SelectItem value="corporation">Corporation</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ein">EIN (Tax ID)</Label>
                <Input
                  id="ein"
                  value={formData.ein || ""}
                  onChange={(e) => updateFormData({ ein: e.target.value })}
                  placeholder="12-3456789"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderVerificationStep = () => (
    <div className="space-y-6">
      {/* Identity Verification */}
      <div>
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <Shield className="w-5 h-5 mr-2" />
          Identity Verification
        </h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="documentType">ID Document Type *</Label>
            <Select value={formData.documentType} onValueChange={(value) => updateFormData({ documentType: value as RegistrationFormData["documentType"] })}>
              <SelectTrigger className={validationErrors.documentType ? "border-destructive" : ""}>
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="drivers_license">Driver's License</SelectItem>
                <SelectItem value="passport">Passport</SelectItem>
                <SelectItem value="state_id">State ID</SelectItem>
              </SelectContent>
            </Select>
            {validationErrors.documentType && (
              <p className="text-sm text-destructive">{validationErrors.documentType}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="documentNumber">Document Number *</Label>
              <Input
                id="documentNumber"
                value={formData.documentNumber}
                onChange={(e) => updateFormData({ documentNumber: e.target.value })}
                placeholder="Document number"
                className={validationErrors.documentNumber ? "border-destructive" : ""}
              />
              {validationErrors.documentNumber && (
                <p className="text-sm text-destructive">{validationErrors.documentNumber}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="documentExpiry">Expiry Date *</Label>
              <Input
                id="documentExpiry"
                type="date"
                value={formData.documentExpiry}
                onChange={(e) => updateFormData({ documentExpiry: e.target.value })}
                className={validationErrors.documentExpiry ? "border-destructive" : ""}
              />
              {validationErrors.documentExpiry && (
                <p className="text-sm text-destructive">{validationErrors.documentExpiry}</p>
              )}
            </div>
          </div>

          <div className="p-4 border-2 border-dashed border-border rounded-lg text-center">
            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-2">
              Upload a clear photo of your ID document
            </p>
            <Button variant="outline" size="sm">
              Choose File
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Accepted formats: JPG, PNG, PDF (max 5MB)
            </p>
          </div>
        </div>
      </div>

      {/* Password Setup */}
      <div>
        <h3 className="text-lg font-medium mb-4">Create Your Password</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => updateFormData({ password: e.target.value })}
                placeholder="Create a strong password"
                className={validationErrors.password ? "border-destructive" : ""}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {validationErrors.password && (
              <p className="text-sm text-destructive">{validationErrors.password}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password *</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => updateFormData({ confirmPassword: e.target.value })}
                placeholder="Confirm your password"
                className={validationErrors.confirmPassword ? "border-destructive" : ""}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {validationErrors.confirmPassword && (
              <p className="text-sm text-destructive">{validationErrors.confirmPassword}</p>
            )}
          </div>

          <div className="text-sm text-muted-foreground space-y-1">
            <p>Password requirements:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>At least 8 characters long</li>
              <li>Contains uppercase and lowercase letters</li>
              <li>Contains at least one number</li>
              <li>Contains at least one special character</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReviewStep = () => {
    const selectedAccount = accountTypes.find(acc => acc.id === formData.accountType);
    
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            Review Your Information
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            Please review all the information you provided. Once submitted, some details cannot be changed.
          </p>
        </div>

        {/* Personal Information Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Name:</span> {formData.firstName} {formData.lastName}
              </div>
              <div>
                <span className="font-medium">Email:</span> {formData.email}
              </div>
              <div>
                <span className="font-medium">Phone:</span> {formData.phoneNumber}
              </div>
              <div>
                <span className="font-medium">Date of Birth:</span> {formData.dateOfBirth}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Address</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              {formData.street}<br />
              {formData.city}, {formData.state} {formData.zipCode}<br />
              {formData.country}
            </div>
          </CardContent>
        </Card>

        {/* Account Information Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Account Type:</span>
              <Badge>{selectedAccount?.title}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Initial Deposit:</span>
              <span className="text-sm">${formData.initialDeposit}</span>
            </div>
          </CardContent>
        </Card>

        {/* Legal Agreements */}
        <div className="space-y-4">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="agreeToTerms"
              checked={formData.agreeToTerms}
              onCheckedChange={(checked) => updateFormData({ agreeToTerms: !!checked })}
              className={validationErrors.agreeToTerms ? "border-destructive" : ""}
            />
            <Label htmlFor="agreeToTerms" className="text-sm leading-5">
              I agree to the{" "}
              <Link to="/terms" className="text-primary hover:underline" target="_blank">
                Terms and Conditions
              </Link>{" "}
              *
            </Label>
          </div>
          {validationErrors.agreeToTerms && (
            <p className="text-sm text-destructive ml-6">{validationErrors.agreeToTerms}</p>
          )}

          <div className="flex items-start space-x-2">
            <Checkbox
              id="agreeToPrivacy"
              checked={formData.agreeToPrivacy}
              onCheckedChange={(checked) => updateFormData({ agreeToPrivacy: !!checked })}
              className={validationErrors.agreeToPrivacy ? "border-destructive" : ""}
            />
            <Label htmlFor="agreeToPrivacy" className="text-sm leading-5">
              I agree to the{" "}
              <Link to="/privacy" className="text-primary hover:underline" target="_blank">
                Privacy Policy
              </Link>{" "}
              *
            </Label>
          </div>
          {validationErrors.agreeToPrivacy && (
            <p className="text-sm text-destructive ml-6">{validationErrors.agreeToPrivacy}</p>
          )}

          <div className="flex items-start space-x-2">
            <Checkbox
              id="optInMarketing"
              checked={formData.optInMarketing}
              onCheckedChange={(checked) => updateFormData({ optInMarketing: !!checked })}
            />
            <Label htmlFor="optInMarketing" className="text-sm leading-5">
              I would like to receive marketing communications and product updates (optional)
            </Label>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderPersonalInfoStep();
      case 2:
        return renderAddressAndAccountStep();
      case 3:
        return renderVerificationStep();
      case 4:
        return renderReviewStep();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
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
          <CardHeader>
            <CardTitle className="text-center text-2xl">Create Your Account</CardTitle>
            <CardDescription className="text-center">
              Join thousands of customers who trust SecureBank for their financial needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderStepIndicator()}
            
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              {renderStepContent()}
              
              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>
                
                {currentStep < totalSteps ? (
                  <Button type="button" onClick={nextStep}>
                    Next
                  </Button>
                ) : (
                  <Button 
                    type="button" 
                    onClick={handleSubmit} 
                    disabled={loading}
                    className="min-w-[120px]"
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </Button>
                )}
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Your information is protected with bank-level security and 256-bit SSL encryption
          </p>
        </div>
      </div>
    </div>
  );
}
