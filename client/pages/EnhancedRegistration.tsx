import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Upload, CheckCircle, AlertCircle } from "lucide-react";

interface RegistrationForm {
  name: string;
  email: string;
  bio: string;
  password: string;
  confirmPassword: string;
  profilePicture: File | null;
}

export default function EnhancedRegistration() {
  const [form, setForm] = useState<RegistrationForm>({
    name: "",
    email: "",
    bio: "",
    password: "",
    confirmPassword: "",
    profilePicture: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const handleInputChange = (field: keyof RegistrationForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setMessage(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
        setMessage({
          type: "error",
          text: "Only JPG and PNG files are allowed",
        });
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: "error", text: "File size must be less than 5MB" });
        return;
      }

      setForm((prev) => ({ ...prev, profilePicture: file }));

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const validateForm = (): string | null => {
    if (!form.name.trim()) return "Name is required";
    if (!form.email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return "Invalid email format";

    if (form.password) {
      if (form.password.length < 8)
        return "Password must be at least 8 characters long";
      if (form.password !== form.confirmPassword)
        return "Passwords do not match";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setMessage({ type: "error", text: validationError });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("bio", form.bio);

      if (form.password) {
        formData.append("password", form.password);
        formData.append("confirmPassword", form.confirmPassword);
      }

      if (form.profilePicture) {
        formData.append("profile_picture", form.profilePicture);
      }

      const response = await fetch("/api/register-enhanced", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text:
            data.message ||
            "Registration successful! Please check your email to verify your account.",
        });

        // Reset form
        setForm({
          name: "",
          email: "",
          bio: "",
          password: "",
          confirmPassword: "",
          profilePicture: null,
        });
        setPreviewUrl("");

        // Reset file input
        const fileInput = document.getElementById(
          "profile-picture",
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      } else {
        setMessage({
          type: "error",
          text: data.error || "Registration failed",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Create Account
          </CardTitle>
          <CardDescription className="text-center">
            Register with profile picture and email verification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Profile Picture Upload */}
            <div className="space-y-2">
              <Label htmlFor="profile-picture">
                Profile Picture (Optional)
              </Label>
              <div className="flex flex-col items-center space-y-3">
                {previewUrl && (
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200">
                    <img
                      src={previewUrl}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="relative">
                  <Input
                    id="profile-picture"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                  <Label
                    htmlFor="profile-picture"
                    className="flex items-center space-x-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    <span>
                      {form.profilePicture
                        ? "Change Picture"
                        : "Upload Picture"}
                    </span>
                  </Label>
                </div>
                <p className="text-xs text-gray-500">JPG or PNG, max 5MB</p>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                type="text"
                value={form.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Bio (Optional)</Label>
              <Textarea
                id="bio"
                value={form.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder="Tell us a bit about yourself"
                rows={3}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password (Optional)</Label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="Create a password (optional)"
              />
            </div>

            {/* Confirm Password */}
            {form.password && (
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password *</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  placeholder="Confirm your password"
                  required
                />
              </div>
            )}

            {/* Message */}
            {message && (
              <Alert
                className={
                  message.type === "error"
                    ? "border-red-200 bg-red-50"
                    : "border-green-200 bg-green-50"
                }
              >
                {message.type === "error" ? (
                  <AlertCircle className="w-4 h-4 text-red-600" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                )}
                <AlertDescription
                  className={
                    message.type === "error" ? "text-red-800" : "text-green-800"
                  }
                >
                  {message.text}
                </AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              Already have an account?{" "}
              <a href="/login" className="text-blue-600 hover:underline">
                Sign in
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
