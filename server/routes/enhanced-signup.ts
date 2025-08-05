import { RequestHandler } from "express";
import { z } from "zod";
import multer from "multer";
import crypto from "crypto";
import path from "path";
import fs from "fs/promises";
import { supabase } from "../supabase";
import { getSecureBankingService } from "../supabase-enhanced";
import { PIISchemas } from "../encryption";

// Enhanced validation schemas with PII validation
const enhancedSignupSchema = z
  .object({
    // Personal Information
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Valid email is required"),
    phoneNumber: PIISchemas.phoneNumber,
    dateOfBirth: PIISchemas.dateOfBirth,
    ssn: PIISchemas.ssn,

    // Address Information
    address: PIISchemas.address,

    // Account Type
    accountType: z.enum(["personal", "business"]),

    // Security
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),

    // Legal
    agreeToTerms: z
      .boolean()
      .refine((val) => val === true, "Must agree to terms"),
    agreeToPrivacy: z
      .boolean()
      .refine((val) => val === true, "Must agree to privacy policy"),
    optInMarketing: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// KYC document upload schema
const kycDocumentSchema = z.object({
  documentType: z.enum([
    "drivers_license",
    "passport",
    "state_id",
    "selfie",
    "proof_of_address",
    "ssn_card",
  ]),
  userId: z.string().uuid(),
});

// File upload configuration for KYC documents
const storage = multer.memoryStorage();
const uploadKYC = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    // Allow only image files and PDFs
    const allowedMimes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "application/pdf",
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only JPEG, PNG, and PDF files are allowed.",
        ),
      );
    }
  },
});

/**
 * Enhanced signup with PII encryption and initial account creation
 */
export const enhancedSignup: RequestHandler = async (req, res) => {
  try {
    // Validate input data
    const validatedData = enhancedSignupSchema.parse(req.body);

    const secureBankingService = getSecureBankingService();

    // Create Supabase auth user first
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
      options: {
        data: {
          name: `${validatedData.firstName} ${validatedData.lastName}`,
          bio: `Member since ${new Date().getFullYear()}. ${validatedData.accountType === "business" ? "Business" : "Personal"} banking.`,
        },
      },
    });

    if (authError) {
      return res.status(400).json({
        error: "Authentication setup failed",
        details: authError.message,
      });
    }

    if (!authData.user) {
      return res.status(400).json({ error: "Failed to create user account" });
    }

    // Create encrypted banking profile
    const { data: bankingUser, error: bankingError } =
      await secureBankingService.createBankingUser({
        id: authData.user.id,
        email: validatedData.email,
        name: `${validatedData.firstName} ${validatedData.lastName}`,
        phoneNumber: validatedData.phoneNumber,
        ssn: validatedData.ssn,
        dateOfBirth: validatedData.dateOfBirth,
        address: validatedData.address,
        accountType: validatedData.accountType,
        marketingOptIn: validatedData.optInMarketing || false,
      });

    if (bankingError) {
      console.error("Banking profile creation failed:", bankingError);
      return res.status(500).json({
        error: "Profile creation failed",
        details: "Unable to create secure banking profile",
      });
    }

    // Create initial checking account
    const { data: account, error: accountError } =
      await secureBankingService.createInitialAccount(
        authData.user.id,
        "checking",
      );

    if (accountError) {
      console.error("Initial account creation failed:", accountError);
      // Don't fail the signup, but log the error
    }

    // Create welcome transaction
    if (account) {
      await secureBankingService.createTransaction({
        accountId: account.id,
        type: "credit",
        amount: 0.0,
        description:
          "Welcome to First City Credit Union! Your account is ready.",
        category: "welcome",
        merchantName: "First City Credit Union",
      });
    }

    res.status(201).json({
      message:
        "Account created successfully! Please check your email to verify your account before signing in.",
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name: `${validatedData.firstName} ${validatedData.lastName}`,
        email_confirmed: authData.user.email_confirmed_at !== null,
        kyc_status: "pending",
        account_type: validatedData.accountType,
      },
      account: account
        ? {
            id: account.id,
            account_number: account.account_number,
            account_type: account.account_type,
            balance: account.balance,
          }
        : null,
      next_steps: [
        "Verify your email address",
        "Upload KYC documents for account verification",
        "Fund your account to start banking",
      ],
    });
  } catch (error) {
    console.error("Enhanced signup error:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Invalid input data",
        details: error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
    }

    res.status(500).json({
      error: "Account creation failed",
      details: "An unexpected error occurred during signup",
    });
  }
};

/**
 * Upload KYC document for verification
 */
export const uploadKYCDocument: RequestHandler = async (req, res) => {
  try {
    // Validate the document metadata
    const { documentType, userId } = kycDocumentSchema.parse(req.body);

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const secureBankingService = getSecureBankingService();

    // Generate secure file path
    const fileExtension = path.extname(req.file.originalname);
    const fileName = `${crypto.randomUUID()}${fileExtension}`;
    const filePath = path.join("kyc-documents", userId, fileName);

    // Create directory if it doesn't exist
    const dirPath = path.dirname(path.join(process.cwd(), "data", filePath));
    await fs.mkdir(dirPath, { recursive: true });

    // Save file to secure location
    const fullFilePath = path.join(process.cwd(), "data", filePath);
    await fs.writeFile(fullFilePath, req.file.buffer);

    // Generate file hash for integrity verification
    const fileHash = crypto
      .createHash("sha256")
      .update(req.file.buffer)
      .digest("hex");

    // Store encrypted document metadata
    const { data: document, error: documentError } =
      await secureBankingService.storeKYCDocument({
        userId,
        documentType,
        filePath,
        fileHash,
        fileSizeBytes: req.file.size,
        mimeType: req.file.mimetype,
      });

    if (documentError) {
      // Clean up file if database storage failed
      try {
        await fs.unlink(fullFilePath);
      } catch (cleanupError) {
        console.error(
          "Failed to cleanup file after database error:",
          cleanupError,
        );
      }

      return res.status(500).json({
        error: "Document storage failed",
        details: "Unable to securely store document",
      });
    }

    res.status(201).json({
      message: "KYC document uploaded successfully",
      document: {
        id: document?.id,
        document_type: documentType,
        verification_status: "pending",
        uploaded_at: document?.uploaded_at,
      },
    });
  } catch (error) {
    console.error("KYC document upload error:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Invalid document data",
        details: error.errors,
      });
    }

    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res
          .status(400)
          .json({ error: "File too large. Maximum size is 10MB." });
      }
      return res
        .status(400)
        .json({ error: "File upload error", details: error.message });
    }

    res.status(500).json({
      error: "Document upload failed",
      details: "An unexpected error occurred",
    });
  }
};

/**
 * Get user's KYC documents and status
 */
export const getKYCStatus: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;

    // Verify user authorization (you should add proper auth middleware)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No authorization header" });
    }

    const token = authHeader.split(" ")[1];
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user || user.id !== userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Get KYC documents (without decrypted file paths)
    const { data: documents, error: documentsError } = await supabase
      .from("kyc_documents")
      .select(
        "id, document_type, verification_status, uploaded_at, verified_at, rejection_reason",
      )
      .eq("user_id", userId)
      .order("uploaded_at", { ascending: false });

    if (documentsError) {
      return res.status(500).json({ error: "Failed to fetch KYC status" });
    }

    // Get overall KYC status from banking_users
    const { data: bankingUser, error: userError } = await supabase
      .from("banking_users")
      .select("kyc_status, account_locked, locked_reason")
      .eq("id", userId)
      .single();

    if (userError) {
      return res.status(500).json({ error: "Failed to fetch user status" });
    }

    res.json({
      kyc_status: bankingUser?.kyc_status || "pending",
      account_locked: bankingUser?.account_locked || false,
      locked_reason: bankingUser?.locked_reason,
      documents: documents || [],
      required_documents: ["drivers_license", "selfie", "proof_of_address"],
      completed_documents:
        documents
          ?.filter((doc) => doc.verification_status === "verified")
          .map((doc) => doc.document_type) || [],
    });
  } catch (error) {
    console.error("Get KYC status error:", error);
    res.status(500).json({ error: "Failed to get KYC status" });
  }
};

export { uploadKYC };
