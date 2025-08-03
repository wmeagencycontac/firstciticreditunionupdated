import { RequestHandler } from "express";
import { RegistrationRequest, RegistrationResponse, User } from "@shared/api";

export const handleRegistration: RequestHandler = async (req, res) => {
  try {
    const registrationData: RegistrationRequest = req.body;

    // Validate required fields
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phoneNumber",
      "dateOfBirth",
      "ssn",
      "street",
      "city",
      "state",
      "zipCode",
      "country",
      "accountType",
      "initialDeposit",
      "documentType",
      "documentNumber",
      "documentExpiry",
      "password",
      "confirmPassword",
    ];

    for (const field of requiredFields) {
      if (!registrationData[field as keyof RegistrationRequest]) {
        return res.status(400).json({
          error: `Missing required field: ${field}`,
        });
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registrationData.email)) {
      return res.status(400).json({
        error: "Invalid email format",
      });
    }

    // Validate password match
    if (registrationData.password !== registrationData.confirmPassword) {
      return res.status(400).json({
        error: "Passwords do not match",
      });
    }

    // Validate password strength
    if (registrationData.password.length < 8) {
      return res.status(400).json({
        error: "Password must be at least 8 characters long",
      });
    }

    // Validate SSN format (basic)
    const ssnRegex = /^\d{3}-?\d{2}-?\d{4}$/;
    if (!ssnRegex.test(registrationData.ssn)) {
      return res.status(400).json({
        error: "Invalid SSN format",
      });
    }

    // Validate ZIP code format
    const zipRegex = /^\d{5}(-\d{4})?$/;
    if (!zipRegex.test(registrationData.zipCode)) {
      return res.status(400).json({
        error: "Invalid ZIP code format",
      });
    }

    // Validate initial deposit amount
    const depositAmount = parseFloat(registrationData.initialDeposit);
    if (isNaN(depositAmount) || depositAmount < 0) {
      return res.status(400).json({
        error: "Invalid initial deposit amount",
      });
    }

    // Validate minimum deposit based on account type
    const minDeposits = {
      personal: 25,
      business: 100,
      investment: 1000,
    };

    const minRequired = minDeposits[registrationData.accountType];
    if (depositAmount < minRequired) {
      return res.status(400).json({
        error: `Minimum deposit for ${registrationData.accountType} account is $${minRequired}`,
      });
    }

    // Validate legal agreements
    if (!registrationData.agreeToTerms || !registrationData.agreeToPrivacy) {
      return res.status(400).json({
        error: "You must agree to the terms and conditions and privacy policy",
      });
    }

    // Validate date of birth (must be at least 18 years old)
    const birthDate = new Date(registrationData.dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      // Birthday hasn't occurred this year yet
    }

    if (age < 18) {
      return res.status(400).json({
        error: "You must be at least 18 years old to open an account",
      });
    }

    // Validate document expiry date (must be in the future)
    const expiryDate = new Date(registrationData.documentExpiry);
    if (expiryDate <= today) {
      return res.status(400).json({
        error: "Identity document has expired or expires today",
      });
    }

    // For business accounts, validate business information
    if (registrationData.accountType === "business") {
      if (!registrationData.businessName || !registrationData.businessType) {
        return res.status(400).json({
          error: "Business name and type are required for business accounts",
        });
      }
    }

    // Simulate database check for existing email
    // In a real application, you would check your database here
    const existingUsers = [
      "john.doe@email.com",
      "jane.smith@email.com",
      "admin@securebank.com",
    ];

    if (existingUsers.includes(registrationData.email.toLowerCase())) {
      return res.status(409).json({
        error: "An account with this email address already exists",
      });
    }

    // Create user object (in a real app, you'd save to database)
    const newUser: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      firstName: registrationData.firstName,
      lastName: registrationData.lastName,
      email: registrationData.email.toLowerCase(),
      createdAt: new Date().toISOString(),
    };

    // In a real application, you would:
    // 1. Hash the password before storing
    // 2. Store user data in database
    // 3. Create initial bank account(s)
    // 4. Send welcome email
    // 5. Generate verification tokens
    // 6. Process initial deposit
    // 7. Submit identity verification to third-party service

    console.log(
      `New user registration: ${newUser.firstName} ${newUser.lastName} (${newUser.email})`,
    );
    console.log(`Account type: ${registrationData.accountType}`);
    console.log(`Initial deposit: $${registrationData.initialDeposit}`);
    console.log(
      `Address: ${registrationData.street}, ${registrationData.city}, ${registrationData.state} ${registrationData.zipCode}`,
    );

    if (registrationData.accountType === "business") {
      console.log(
        `Business: ${registrationData.businessName} (${registrationData.businessType})`,
      );
    }

    // Simulate successful registration
    const response: RegistrationResponse = {
      user: newUser,
      message:
        "Registration successful! Your account has been created and is pending verification.",
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      error: "Internal server error during registration",
    });
  }
};
