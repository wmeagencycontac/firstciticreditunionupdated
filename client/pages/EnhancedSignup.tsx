import { useState, useCallback } from "react";
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
import { Progress } from "@/components/ui/progress";
import { 
  Building2, 
  Shield, 
  CheckCircle, 
  ArrowLeft, 
  Upload, 
  FileText, 
  Camera,
  AlertTriangle,
  Lock
} from "lucide-react";
import { toast } from "sonner";

interface SignupFormData {
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

interface KYCDocument {
  type: 'drivers_license' | 'passport' | 'state_id' | 'selfie' | 'proof_of_address' | 'ssn_card';
  name: string;
  description: string;
  required: boolean;
  file?: File;
  uploaded?: boolean;
  status?: 'pending' | 'verified' | 'rejected';
}

export default function EnhancedSignup() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<SignupFormData>({
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
    accountType: "personal",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    agreeToPrivacy: false,
    optInMarketing: false,
  });

  const [kycDocuments, setKycDocuments] = useState<KYCDocument[]>([
    {
      type: 'drivers_license',
      name: 'Driver\'s License',
      description: 'Front and back of your driver\'s license or state ID',
      required: true,
    },
    {
      type: 'selfie',
      name: 'Selfie Photo',
      description: 'A clear photo of yourself holding your ID',
      required: true,
    },
    {
      type: 'proof_of_address',
      name: 'Proof of Address',
      description: 'Utility bill, bank statement, or lease agreement (last 3 months)',
      required: true,
    },
    {
      type: 'ssn_card',
      name: 'Social Security Card',
      description: 'Your Social Security card (optional but recommended)',
      required: false,
    },
  ]);

  const updateFormData = (field: keyof SignupFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const formatSSN = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,3})(\d{0,2})(\d{0,4})$/);
    if (match) {
      return [match[1], match[2], match[3]].filter(Boolean).join('-');
    }
    return cleaned;
  };

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (match) {
      const formatted = [match[1], match[2], match[3]].filter(Boolean).join('-');
      return formatted.length > 0 ? `(${match[1]}) ${match[2]}-${match[3]}`.replace(/[^\d\(\)\-\s]/g, '') : '';
    }
    return cleaned;
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          formData.firstName &&
          formData.lastName &&
          formData.email &&
          formData.phoneNumber &&
          formData.dateOfBirth &&
          formData.ssn.replace(/\D/g, '').length === 9
        );
      case 2:
        return !!(
          formData.street &&
          formData.city &&
          formData.state &&
          formData.zipCode
        );
      case 3:
        return !!(
          formData.password &&
          formData.confirmPassword &&
          formData.password === formData.confirmPassword &&
          formData.password.length >= 8
        );
      case 4:
        return formData.agreeToTerms && formData.agreeToPrivacy;
      case 5:
        const requiredDocs = kycDocuments.filter(doc => doc.required);
        return requiredDocs.every(doc => doc.file);
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 6));
      setError("");
    } else {
      setError("Please fill in all required fields correctly.");
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setError("");
  };

  const handleCreateAccount = async () => {
    if (!validateStep(4)) {
      setError("Please complete all required fields and agree to the terms.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/enhanced-signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          dateOfBirth: formData.dateOfBirth,
          ssn: formData.ssn,
          address: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
          },
          accountType: formData.accountType,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          agreeToTerms: formData.agreeToTerms,
          agreeToPrivacy: formData.agreeToPrivacy,
          optInMarketing: formData.optInMarketing,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || "Account creation failed");
      }

      setUserId(data.user.id);
      toast.success("Account created successfully!");
      setCurrentStep(5); // Move to KYC document upload

    } catch (err: any) {
      setError(err.message || "An error occurred during signup. Please try again.");
      toast.error("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = useCallback((documentType: KYCDocument['type'], file: File) => {
    setKycDocuments(prev => 
      prev.map(doc => 
        doc.type === documentType 
          ? { ...doc, file }
          : doc
      )
    );
  }, []);

  const uploadKYCDocument = async (document: KYCDocument) => {
    if (!document.file || !userId) return;

    const formData = new FormData();
    formData.append('file', document.file);
    formData.append('documentType', document.type);
    formData.append('userId', userId);

    try {
      const response = await fetch("/api/kyc/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || "Upload failed");
      }

      setKycDocuments(prev => 
        prev.map(doc => 
          doc.type === document.type 
            ? { ...doc, uploaded: true, status: 'pending' }
            : doc
        )
      );

      toast.success(`${document.name} uploaded successfully`);
      return true;
    } catch (error: any) {
      toast.error(`Failed to upload ${document.name}: ${error.message}`);
      return false;
    }
  };

  const handleUploadAllDocuments = async () => {
    setLoading(true);
    
    const documentsToUpload = kycDocuments.filter(doc => doc.file && !doc.uploaded);
    const uploadPromises = documentsToUpload.map(doc => uploadKYCDocument(doc));
    
    const results = await Promise.all(uploadPromises);
    const allUploaded = results.every(result => result);
    
    setLoading(false);
    
    if (allUploaded) {
      setCurrentStep(6); // Move to completion step
      toast.success("All documents uploaded successfully!");
    }
  };

  const getStepProgress = () => {
    return (currentStep / 6) * 100;
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Lock className="w-5 h-5 text-green-600" />
              Personal Information
            </h3>
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Your personal information is encrypted and securely stored. We use bank-level security to protect your data.
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => updateFormData("firstName", e.target.value)}
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
                  onChange={(e) => updateFormData("lastName", e.target.value)}
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
                onChange={(e) => updateFormData("email", e.target.value)}
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
                onChange={(e) => updateFormData("phoneNumber", formatPhoneNumber(e.target.value))}
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
                onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
                max={new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="ssn">Social Security Number *</Label>
              <Input
                id="ssn"
                type="text"
                value={formData.ssn}
                onChange={(e) => updateFormData("ssn", formatSSN(e.target.value))}
                placeholder="123-45-6789"
                maxLength={11}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                🔒 Encrypted and securely stored for identity verification
              </p>
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
                onChange={(e) => updateFormData("street", e.target.value)}
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
                  onChange={(e) => updateFormData("city", e.target.value)}
                  placeholder="New York"
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">State *</Label>
                <Select
                  value={formData.state}
                  onValueChange={(value) => updateFormData("state", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NY">New York</SelectItem>
                    <SelectItem value="CA">California</SelectItem>
                    <SelectItem value="TX">Texas</SelectItem>
                    <SelectItem value="FL">Florida</SelectItem>
                    <SelectItem value="IL">Illinois</SelectItem>
                    <SelectItem value="PA">Pennsylvania</SelectItem>
                    <SelectItem value="OH">Ohio</SelectItem>
                    <SelectItem value="GA">Georgia</SelectItem>
                    <SelectItem value="NC">North Carolina</SelectItem>
                    <SelectItem value="MI">Michigan</SelectItem>
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
                onChange={(e) => updateFormData("zipCode", e.target.value)}
                placeholder="12345"
                maxLength={10}
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
              <Select
                value={formData.accountType}
                onValueChange={(value: "personal" | "business") =>
                  updateFormData("accountType", value)
                }
              >
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
                onChange={(e) => updateFormData("password", e.target.value)}
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
                onChange={(e) =>
                  updateFormData("confirmPassword", e.target.value)
                }
                placeholder="Confirm your password"
                required
              />
            </div>
            
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Your account will be created with $0.00 balance and protected by industry-standard encryption.
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
                  onCheckedChange={(checked) =>
                    updateFormData("agreeToTerms", checked)
                  }
                />
                <Label
                  htmlFor="agreeToTerms"
                  className="text-sm leading-relaxed"
                >
                  I agree to the{" "}
                  <Link to="/terms" className="text-[#00754A] hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and understand my rights and responsibilities as a First City
                  Credit Union member. *
                </Label>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agreeToPrivacy"
                  checked={formData.agreeToPrivacy}
                  onCheckedChange={(checked) =>
                    updateFormData("agreeToPrivacy", checked)
                  }
                />
                <Label
                  htmlFor="agreeToPrivacy"
                  className="text-sm leading-relaxed"
                >
                  I have read and agree to the{" "}
                  <Link
                    to="/privacy"
                    className="text-[#00754A] hover:underline"
                  >
                    Privacy Policy
                  </Link>{" "}
                  and consent to the encrypted storage and use of my personal
                  information. *
                </Label>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="optInMarketing"
                  checked={formData.optInMarketing}
                  onCheckedChange={(checked) =>
                    updateFormData("optInMarketing", checked)
                  }
                />
                <Label
                  htmlFor="optInMarketing"
                  className="text-sm leading-relaxed"
                >
                  I would like to receive promotional emails and updates about
                  First City Credit Union products and services.
                </Label>
              </div>
            </div>

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Your account will be NCUA insured up to $250,000. Email verification
                and document verification are required to activate your account.
              </AlertDescription>
            </Alert>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Identity Verification</h3>
              <p className="text-muted-foreground">
                Upload the required documents to verify your identity and activate your account.
              </p>
            </div>

            <div className="space-y-4">
              {kycDocuments.map((document) => (
                <div
                  key={document.type}
                  className={`border rounded-lg p-4 ${
                    document.uploaded ? 'bg-green-50 border-green-200' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{document.name}</h4>
                        {document.required && (
                          <span className="text-red-500 text-xs">Required</span>
                        )}
                        {document.uploaded && (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {document.description}
                      </p>
                      {document.file && (
                        <p className="text-xs text-blue-600 mt-1">
                          Selected: {document.file.name}
                        </p>
                      )}
                    </div>
                    <div className="ml-4">
                      <Input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(document.type, file);
                          }
                        }}
                        className="hidden"
                        id={`file-${document.type}`}
                      />
                      <Label
                        htmlFor={`file-${document.type}`}
                        className="cursor-pointer"
                      >
                        <Button
                          type="button"
                          variant={document.file ? "secondary" : "outline"}
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          {document.type === 'selfie' ? (
                            <Camera className="w-4 h-4" />
                          ) : (
                            <Upload className="w-4 h-4" />
                          )}
                          {document.file ? 'Change' : 'Upload'}
                        </Button>
                      </Label>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Documents are encrypted and securely stored. Processing typically takes 1-2 business days.
              </AlertDescription>
            </Alert>
          </div>
        );

      case 6:
        return (
          <div className="text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Account Created Successfully!</h3>
              <p className="text-muted-foreground">
                Your First City Credit Union account has been created and your documents have been submitted for verification.
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg text-left">
              <h4 className="font-semibold mb-2">Next Steps:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✅ Check your email and verify your email address</li>
                <li>⏳ Wait for document verification (1-2 business days)</li>
                <li>📱 Download our mobile app for easy account access</li>
                <li>💰 Fund your account to start banking</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => navigate("/login")}
                className="flex-1 bg-[#00754A] hover:bg-[#005A39]"
              >
                Go to Login
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="flex-1"
              >
                Back to Home
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-green-50/50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-[#00754A] rounded-lg flex items-center justify-center">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#00754A]">
                First City Credit Union
              </div>
              <div className="text-sm text-muted-foreground">
                Secure banking with industry-leading protection
              </div>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Open Your Secure Account</CardTitle>
                <CardDescription>Step {currentStep} of 6</CardDescription>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground mb-1">
                  {Math.round(getStepProgress())}% Complete
                </div>
                <Progress value={getStepProgress()} className="w-24" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-4 border-destructive">
                <AlertDescription className="text-destructive">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {renderStep()}

            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={currentStep === 1 ? () => navigate("/") : prevStep}
                className="flex items-center gap-2"
                disabled={loading}
              >
                <ArrowLeft className="w-4 h-4" />
                {currentStep === 1 ? "Back to Home" : "Previous"}
              </Button>

              {currentStep < 4 ? (
                <Button
                  onClick={nextStep}
                  disabled={!validateStep(currentStep) || loading}
                  className="bg-[#00754A] hover:bg-[#005A39]"
                >
                  Next
                </Button>
              ) : currentStep === 4 ? (
                <Button
                  onClick={handleCreateAccount}
                  disabled={loading || !validateStep(4)}
                  className="bg-[#00754A] hover:bg-[#005A39]"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              ) : currentStep === 5 ? (
                <Button
                  onClick={handleUploadAllDocuments}
                  disabled={loading || !validateStep(5)}
                  className="bg-[#00754A] hover:bg-[#005A39]"
                >
                  {loading ? "Uploading..." : "Upload Documents"}
                </Button>
              ) : null}
            </div>

            {currentStep <= 4 && (
              <div className="text-center mt-6">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-[#00754A] hover:underline font-medium"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
