import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Camera,
  Upload,
  CheckCircle,
  ArrowLeft,
  DollarSign,
  FileImage,
  AlertTriangle,
  Eye,
  RotateCcw,
  Building2,
  Clock,
  Shield,
} from "lucide-react";
import { toast } from "sonner";

interface DepositData {
  amount: string;
  accountId: string;
  checkNumber?: string;
  checkDate?: string;
  bankName?: string;
  frontImage: File | null;
  backImage: File | null;
}

interface Account {
  id: string;
  account_number: string;
  account_type: string;
  balance: number;
  nickname?: string;
}

export default function MobileDeposit() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState("");
  const [accounts, setAccounts] = useState<Account[]>([]);

  const [depositData, setDepositData] = useState<DepositData>({
    amount: "",
    accountId: "",
    checkNumber: "",
    checkDate: "",
    bankName: "",
    frontImage: null,
    backImage: null,
  });

  const [frontImagePreview, setFrontImagePreview] = useState<string | null>(
    null,
  );
  const [backImagePreview, setBackImagePreview] = useState<string | null>(null);
  const [depositId, setDepositId] = useState<string | null>(null);

  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  // Load user accounts on component mount
  useState(() => {
    loadAccounts();
  });

  const loadAccounts = async () => {
    try {
      const response = await fetch("/api/supabase/accounts", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAccounts(data.accounts || []);

        // Auto-select first checking account if available
        const checkingAccount = data.accounts?.find(
          (acc: Account) => acc.account_type === "checking",
        );
        if (checkingAccount) {
          setDepositData((prev) => ({
            ...prev,
            accountId: checkingAccount.id,
          }));
        }
      }
    } catch (error) {
      console.error("Failed to load accounts:", error);
    }
  };

  const updateDepositData = (field: keyof DepositData, value: any) => {
    setDepositData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = useCallback(
    (type: "front" | "back", file: File) => {
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        toast.error("Image file too large. Maximum size is 10MB.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (type === "front") {
          setFrontImagePreview(result);
          updateDepositData("frontImage", file);
        } else {
          setBackImagePreview(result);
          updateDepositData("backImage", file);
        }
      };
      reader.readAsDataURL(file);
    },
    [],
  );

  const clearImage = (type: "front" | "back") => {
    if (type === "front") {
      setFrontImagePreview(null);
      updateDepositData("frontImage", null);
      if (frontInputRef.current) {
        frontInputRef.current.value = "";
      }
    } else {
      setBackImagePreview(null);
      updateDepositData("backImage", null);
      if (backInputRef.current) {
        backInputRef.current.value = "";
      }
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          depositData.amount &&
          parseFloat(depositData.amount) > 0 &&
          parseFloat(depositData.amount) <= 10000 &&
          depositData.accountId
        );
      case 2:
        return !!(depositData.frontImage && depositData.backImage);
      case 3:
        return true; // Review step
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
      setError("");
    } else {
      if (currentStep === 1) {
        setError(
          "Please enter a valid amount between $0.01 and $10,000 and select an account.",
        );
      } else if (currentStep === 2) {
        setError("Please upload both front and back images of the check.");
      }
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setError("");
  };

  const submitDeposit = async () => {
    if (!validateStep(1) || !validateStep(2)) {
      setError("Please complete all required fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("amount", depositData.amount);
      formData.append("accountId", depositData.accountId);
      formData.append("checkNumber", depositData.checkNumber || "");
      formData.append("checkDate", depositData.checkDate || "");
      formData.append("bankName", depositData.bankName || "");
      formData.append("frontImage", depositData.frontImage!);
      formData.append("backImage", depositData.backImage!);

      const response = await fetch("/api/mobile-deposit", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Mobile deposit failed");
      }

      setDepositId(data.deposit.id);
      toast.success("Mobile deposit submitted successfully!");
      setCurrentStep(4); // Move to success step
    } catch (err: any) {
      setError(
        err.message || "Failed to submit mobile deposit. Please try again.",
      );
      toast.error("Mobile deposit failed");
    } finally {
      setLoading(false);
    }
  };

  const getStepProgress = () => {
    return (currentStep / 4) * 100;
  };

  const formatAmount = (value: string) => {
    const number = parseFloat(value.replace(/[^0-9.]/g, ""));
    if (isNaN(number)) return "";
    return number.toFixed(2);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Deposit Details</h3>
              <p className="text-muted-foreground">
                Enter the check amount and select your deposit account
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="amount">Check Amount *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    max="10000"
                    value={depositData.amount}
                    onChange={(e) =>
                      updateDepositData("amount", e.target.value)
                    }
                    placeholder="0.00"
                    className="pl-10"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Maximum deposit amount: $10,000 per check
                </p>
              </div>

              <div>
                <Label htmlFor="accountId">Deposit To Account *</Label>
                <Select
                  value={depositData.accountId}
                  onValueChange={(value) =>
                    updateDepositData("accountId", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        <div className="flex justify-between items-center w-full">
                          <span>
                            {account.nickname || account.account_type}
                            (***{account.account_number.slice(-4)})
                          </span>
                          <span className="text-muted-foreground ml-2">
                            $
                            {account.balance.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="checkNumber">Check Number</Label>
                  <Input
                    id="checkNumber"
                    type="text"
                    value={depositData.checkNumber}
                    onChange={(e) =>
                      updateDepositData("checkNumber", e.target.value)
                    }
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <Label htmlFor="checkDate">Check Date</Label>
                  <Input
                    id="checkDate"
                    type="date"
                    value={depositData.checkDate}
                    onChange={(e) =>
                      updateDepositData("checkDate", e.target.value)
                    }
                    max={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bankName">Bank Name</Label>
                <Input
                  id="bankName"
                  type="text"
                  value={depositData.bankName}
                  onChange={(e) =>
                    updateDepositData("bankName", e.target.value)
                  }
                  placeholder="Bank that issued the check (optional)"
                />
              </div>
            </div>

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Your deposit will be reviewed and funds typically become
                available within 1-2 business days. Some deposits may be subject
                to a hold period for security.
              </AlertDescription>
            </Alert>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">
                Capture Check Images
              </h3>
              <p className="text-muted-foreground">
                Take clear photos of both sides of your endorsed check
              </p>
            </div>

            <div className="space-y-6">
              {/* Front Image */}
              <div className="space-y-3">
                <Label>Front of Check *</Label>
                {frontImagePreview ? (
                  <div className="relative">
                    <img
                      src={frontImagePreview}
                      alt="Front of check"
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => clearImage("front")}
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Camera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-sm text-gray-600 mb-4">
                      Take a photo of the front of your check
                    </p>
                    <Input
                      ref={frontInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload("front", file);
                      }}
                      className="hidden"
                      id="front-image"
                    />
                    <Label htmlFor="front-image" className="cursor-pointer">
                      <Button type="button" variant="outline" asChild>
                        <span>
                          <Camera className="w-4 h-4 mr-2" />
                          Take Photo
                        </span>
                      </Button>
                    </Label>
                  </div>
                )}
              </div>

              {/* Back Image */}
              <div className="space-y-3">
                <Label>Back of Check (Endorsed) *</Label>
                {backImagePreview ? (
                  <div className="relative">
                    <img
                      src={backImagePreview}
                      alt="Back of check"
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => clearImage("back")}
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <FileImage className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-sm text-gray-600 mb-4">
                      Take a photo of the endorsed back of your check
                    </p>
                    <Input
                      ref={backInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload("back", file);
                      }}
                      className="hidden"
                      id="back-image"
                    />
                    <Label htmlFor="back-image" className="cursor-pointer">
                      <Button type="button" variant="outline" asChild>
                        <span>
                          <Camera className="w-4 h-4 mr-2" />
                          Take Photo
                        </span>
                      </Button>
                    </Label>
                  </div>
                )}
              </div>
            </div>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Important:</strong> Make sure to endorse the back of
                your check by signing it and writing "For Mobile Deposit Only"
                below your signature.
              </AlertDescription>
            </Alert>
          </div>
        );

      case 3:
        const selectedAccount = accounts.find(
          (acc) => acc.id === depositData.accountId,
        );
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">
                Review Your Deposit
              </h3>
              <p className="text-muted-foreground">
                Please review the details before submitting your deposit
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Deposit Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span className="font-semibold text-green-600">
                      $
                      {parseFloat(depositData.amount).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Deposit to:</span>
                    <span>
                      {selectedAccount?.nickname ||
                        selectedAccount?.account_type}
                      (***{selectedAccount?.account_number.slice(-4)})
                    </span>
                  </div>
                  {depositData.checkNumber && (
                    <div className="flex justify-between">
                      <span>Check Number:</span>
                      <span>{depositData.checkNumber}</span>
                    </div>
                  )}
                  {depositData.checkDate && (
                    <div className="flex justify-between">
                      <span>Check Date:</span>
                      <span>
                        {new Date(depositData.checkDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {depositData.bankName && (
                    <div className="flex justify-between">
                      <span>Bank Name:</span>
                      <span>{depositData.bankName}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Check Images</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Front</p>
                    {frontImagePreview && (
                      <img
                        src={frontImagePreview}
                        alt="Front of check"
                        className="w-full h-24 object-cover rounded border"
                      />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Back</p>
                    {backImagePreview && (
                      <img
                        src={backImagePreview}
                        alt="Back of check"
                        className="w-full h-24 object-cover rounded border"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                <strong>Processing Time:</strong> Deposits are typically
                processed within 1-2 business days. You'll receive a
                notification when funds are available.
              </AlertDescription>
            </Alert>
          </div>
        );

      case 4:
        return (
          <div className="text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                Deposit Submitted Successfully!
              </h3>
              <p className="text-muted-foreground">
                Your mobile deposit has been received and is being processed.
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg text-left">
              <h4 className="font-semibold mb-2">What's Next?</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✅ Your deposit is being reviewed for approval</li>
                <li>⏳ Processing typically takes 1-2 business days</li>
                <li>📧 You'll receive email notifications on status updates</li>
                <li>
                  💰 Funds will be available according to our funds availability
                  policy
                </li>
              </ul>
            </div>

            {depositId && (
              <div className="bg-gray-50 p-3 rounded text-sm">
                <span className="text-muted-foreground">Deposit ID: </span>
                <span className="font-mono">{depositId}</span>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={() => navigate("/dashboard")}
                className="flex-1 bg-[#00754A] hover:bg-[#005A39]"
              >
                View Dashboard
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  // Reset form for new deposit
                  setDepositData({
                    amount: "",
                    accountId: depositData.accountId, // Keep account selected
                    checkNumber: "",
                    checkDate: "",
                    bankName: "",
                    frontImage: null,
                    backImage: null,
                  });
                  setFrontImagePreview(null);
                  setBackImagePreview(null);
                  setCurrentStep(1);
                  setDepositId(null);
                }}
                className="flex-1"
              >
                Make Another Deposit
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
                Mobile Deposit
              </div>
              <div className="text-sm text-muted-foreground">
                Deposit checks instantly with your camera
              </div>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Deposit Your Check</CardTitle>
                <CardDescription>Step {currentStep} of 4</CardDescription>
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
                onClick={
                  currentStep === 1 ? () => navigate("/dashboard") : prevStep
                }
                className="flex items-center gap-2"
                disabled={loading}
              >
                <ArrowLeft className="w-4 h-4" />
                {currentStep === 1 ? "Back to Dashboard" : "Previous"}
              </Button>

              {currentStep < 3 ? (
                <Button
                  onClick={nextStep}
                  disabled={!validateStep(currentStep) || loading}
                  className="bg-[#00754A] hover:bg-[#005A39]"
                >
                  Next
                </Button>
              ) : currentStep === 3 ? (
                <Button
                  onClick={submitDeposit}
                  disabled={loading || !validateStep(1) || !validateStep(2)}
                  className="bg-[#00754A] hover:bg-[#005A39]"
                >
                  {loading ? "Submitting..." : "Submit Deposit"}
                </Button>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
