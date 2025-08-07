import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useSearchParams, Link } from "react-router-dom";
import {
  Building2,
  CreditCard,
  DollarSign,
  User,
  MapPin,
  Briefcase,
  CheckCircle,
} from "lucide-react";

export default function ApplicationForm() {
  const [searchParams] = useSearchParams();
  const productType = searchParams.get("type") || "personal-loan";
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    ssn: "",

    // Address Information
    street: "",
    city: "",
    state: "",
    zipCode: "",

    // Employment Information
    employmentStatus: "",
    employer: "",
    jobTitle: "",
    workPhone: "",
    monthlyIncome: "",
    employmentLength: "",

    // Financial Information
    requestedAmount: "",
    loanPurpose: "",
    monthlyRent: "",
    otherDebts: "",

    // Agreement
    agreeToTerms: false,
    agreeToCredit: false,
  });

  const productTitles = {
    "personal-loan": "Personal Loan Application",
    "auto-loan": "Auto Loan Application",
    "home-loan": "Home Loan Application",
    "credit-card": "Credit Card Application",
    "cashback-card": "Cashback Credit Card Application",
    "premium-card": "Premium Credit Card Application",
    "secured-card": "Secured Credit Card Application",
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setLoading(false);
    setSubmitted(true);
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return (
          formData.firstName &&
          formData.lastName &&
          formData.email &&
          formData.phone &&
          formData.dateOfBirth
        );
      case 2:
        return (
          formData.street && formData.city && formData.state && formData.zipCode
        );
      case 3:
        return formData.employmentStatus && formData.monthlyIncome;
      case 4:
        return (
          formData.requestedAmount &&
          formData.agreeToTerms &&
          formData.agreeToCredit
        );
      default:
        return false;
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-green-50/20 to-emerald-50/30">
        <header className="container mx-auto px-4 py-6 border-b bg-white/80 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#00754A] to-[#005A39] rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div className="text-xl font-bold text-[#00754A]">
                First City Credit Union
              </div>
            </Link>
          </div>
        </header>

        <main className="container mx-auto px-4 py-20 max-w-2xl">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mb-6 mx-auto">
              <CheckCircle className="w-10 h-10 text-[#00754A]" />
            </div>
            <h1 className="text-3xl font-bold text-[#00754A] mb-4">
              Application Submitted Successfully!
            </h1>
            <p className="text-muted-foreground mb-8">
              Thank you for your{" "}
              {productTitles[
                productType as keyof typeof productTitles
              ]?.toLowerCase()}
              . We'll review your application and contact you within 1-2
              business days.
            </p>

            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h3 className="font-semibold text-[#00754A] mb-4">
                What happens next?
              </h3>
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-[#00754A]">
                      1
                    </span>
                  </div>
                  <span>Application review (1-2 business days)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-[#00754A]">
                      2
                    </span>
                  </div>
                  <span>Credit check and verification</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-[#00754A]">
                      3
                    </span>
                  </div>
                  <span>Decision notification</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard">
                <Button className="bg-gradient-to-r from-[#00754A] to-[#005A39] hover:from-[#005A39] hover:to-[#004830] text-white">
                  Go to Dashboard
                </Button>
              </Link>
              <Link to="/">
                <Button
                  variant="outline"
                  className="border-[#00754A] text-[#00754A] hover:bg-green-50"
                >
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50/20 to-emerald-50/30">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 border-b bg-white/80 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00754A] to-[#005A39] rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div className="text-xl font-bold text-[#00754A]">
              First City Credit Union
            </div>
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/help">
              <Button
                variant="ghost"
                className="text-[#00754A] hover:bg-green-50"
              >
                Need Help?
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#00754A] mb-2">
            {productTitles[productType as keyof typeof productTitles] ||
              "Loan Application"}
          </h1>
          <p className="text-muted-foreground">
            Complete your application in just a few easy steps
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step <= currentStep
                      ? "bg-[#00754A] text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step}
                </div>
                {step < 4 && (
                  <div
                    className={`w-12 h-1 ${
                      step < currentStep ? "bg-[#00754A]" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-[#00754A] flex items-center gap-2">
              {currentStep === 1 && (
                <>
                  <User className="w-5 h-5" /> Personal Information
                </>
              )}
              {currentStep === 2 && (
                <>
                  <MapPin className="w-5 h-5" /> Address Information
                </>
              )}
              {currentStep === 3 && (
                <>
                  <Briefcase className="w-5 h-5" /> Employment Information
                </>
              )}
              {currentStep === 4 && (
                <>
                  <DollarSign className="w-5 h-5" /> Financial Information
                </>
              )}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Let's start with your basic information"}
              {currentStep === 2 && "Please provide your current address"}
              {currentStep === 3 && "Tell us about your employment"}
              {currentStep === 4 && "Financial details and loan preferences"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    placeholder="John"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    placeholder="Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="john.doe@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      handleInputChange("dateOfBirth", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="ssn">Social Security Number</Label>
                  <Input
                    id="ssn"
                    value={formData.ssn}
                    onChange={(e) => handleInputChange("ssn", e.target.value)}
                    placeholder="***-**-****"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Address Information */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="street">Street Address *</Label>
                  <Input
                    id="street"
                    value={formData.street}
                    onChange={(e) =>
                      handleInputChange("street", e.target.value)
                    }
                    placeholder="123 Main Street"
                  />
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) =>
                        handleInputChange("city", e.target.value)
                      }
                      placeholder="New York"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Select
                      value={formData.state}
                      onValueChange={(value) =>
                        handleInputChange("state", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AL">Alabama</SelectItem>
                        <SelectItem value="CA">California</SelectItem>
                        <SelectItem value="NY">New York</SelectItem>
                        <SelectItem value="TX">Texas</SelectItem>
                        <SelectItem value="FL">Florida</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) =>
                        handleInputChange("zipCode", e.target.value)
                      }
                      placeholder="12345"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Employment Information */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="employmentStatus">Employment Status *</Label>
                  <Select
                    value={formData.employmentStatus}
                    onValueChange={(value) =>
                      handleInputChange("employmentStatus", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select employment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employed">
                        Employed Full-time
                      </SelectItem>
                      <SelectItem value="part-time">
                        Employed Part-time
                      </SelectItem>
                      <SelectItem value="self-employed">
                        Self-employed
                      </SelectItem>
                      <SelectItem value="retired">Retired</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="employer">Employer Name</Label>
                    <Input
                      id="employer"
                      value={formData.employer}
                      onChange={(e) =>
                        handleInputChange("employer", e.target.value)
                      }
                      placeholder="Company Name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input
                      id="jobTitle"
                      value={formData.jobTitle}
                      onChange={(e) =>
                        handleInputChange("jobTitle", e.target.value)
                      }
                      placeholder="Software Engineer"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="monthlyIncome">Monthly Income *</Label>
                    <Input
                      id="monthlyIncome"
                      value={formData.monthlyIncome}
                      onChange={(e) =>
                        handleInputChange("monthlyIncome", e.target.value)
                      }
                      placeholder="5000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="employmentLength">
                      Years at Current Job
                    </Label>
                    <Input
                      id="employmentLength"
                      value={formData.employmentLength}
                      onChange={(e) =>
                        handleInputChange("employmentLength", e.target.value)
                      }
                      placeholder="2"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Financial Information */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="requestedAmount">
                      {productType.includes("credit-card")
                        ? "Requested Credit Limit *"
                        : "Requested Loan Amount *"}
                    </Label>
                    <Input
                      id="requestedAmount"
                      value={formData.requestedAmount}
                      onChange={(e) =>
                        handleInputChange("requestedAmount", e.target.value)
                      }
                      placeholder={
                        productType.includes("credit-card") ? "5000" : "25000"
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="loanPurpose">
                      {productType.includes("credit-card")
                        ? "Primary Use"
                        : "Loan Purpose"}
                    </Label>
                    <Select
                      value={formData.loanPurpose}
                      onValueChange={(value) =>
                        handleInputChange("loanPurpose", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select purpose" />
                      </SelectTrigger>
                      <SelectContent>
                        {productType.includes("credit-card") ? (
                          <>
                            <SelectItem value="daily-purchases">
                              Daily Purchases
                            </SelectItem>
                            <SelectItem value="travel">Travel</SelectItem>
                            <SelectItem value="business">
                              Business Expenses
                            </SelectItem>
                            <SelectItem value="rewards">
                              Cashback/Rewards
                            </SelectItem>
                          </>
                        ) : (
                          <>
                            <SelectItem value="debt-consolidation">
                              Debt Consolidation
                            </SelectItem>
                            <SelectItem value="home-improvement">
                              Home Improvement
                            </SelectItem>
                            <SelectItem value="auto-purchase">
                              Auto Purchase
                            </SelectItem>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) =>
                        handleInputChange("agreeToTerms", checked.toString())
                      }
                    />
                    <label htmlFor="agreeToTerms" className="text-sm">
                      I agree to the{" "}
                      <Link
                        to="/terms"
                        className="text-[#00754A] hover:underline"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        to="/privacy"
                        className="text-[#00754A] hover:underline"
                      >
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="agreeToCredit"
                      checked={formData.agreeToCredit}
                      onCheckedChange={(checked) =>
                        handleInputChange("agreeToCredit", checked.toString())
                      }
                    />
                    <label htmlFor="agreeToCredit" className="text-sm">
                      I authorize First City Credit Union to check my credit
                      report and verify my information
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
              >
                Previous
              </Button>

              {currentStep < 4 ? (
                <Button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!validateStep(currentStep)}
                  className="bg-gradient-to-r from-[#00754A] to-[#005A39] hover:from-[#005A39] hover:to-[#004830] text-white"
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!validateStep(currentStep) || loading}
                  className="bg-gradient-to-r from-[#00754A] to-[#005A39] hover:from-[#005A39] hover:to-[#004830] text-white"
                >
                  {loading ? "Submitting..." : "Submit Application"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
