import { RequestHandler } from "express";
import { z } from "zod";
import multer from "multer";
import crypto from "crypto";
import path from "path";
import fs from "fs/promises";
import { getSecureBankingService } from "../supabase-enhanced";
import { supabase } from "../supabase";

// Validation schema
const mobileDepositSchema = z.object({
  amount: z
    .string()
    .transform((val) => parseFloat(val))
    .refine((val) => val > 0 && val <= 10000, {
      message: "Amount must be between $0.01 and $10,000",
    }),
  accountId: z.string().uuid("Invalid account ID"),
  checkNumber: z.string().optional(),
  checkDate: z.string().optional(),
  bankName: z.string().optional(),
});

// File upload configuration
const storage = multer.memoryStorage();
export const uploadImages = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit per file
    files: 2, // Front and back images
  },
  fileFilter: (req, file, cb) => {
    // Allow only image files
    const allowedMimes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/heic", // iPhone photos
      "image/webp",
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only image files are allowed."));
    }
  },
});

/**
 * Submit mobile deposit with check images
 */
export const submitMobileDeposit: RequestHandler = async (req, res) => {
  try {
    // Validate form data
    const validatedData = mobileDepositSchema.parse(req.body);

    // Check if images are uploaded
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    if (
      !files.frontImage ||
      !files.backImage ||
      !files.frontImage[0] ||
      !files.backImage[0]
    ) {
      return res.status(400).json({
        error: "Both front and back check images are required",
      });
    }

    const frontImage = files.frontImage[0];
    const backImage = files.backImage[0];

    // Get user from auth token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No authorization header" });
    }

    const token = authHeader.split(" ")[1];
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    // Verify user owns the account
    const { data: account, error: accountError } = await supabase
      .from("accounts")
      .select("*")
      .eq("id", validatedData.accountId)
      .eq("user_id", user.id)
      .single();

    if (accountError || !account) {
      return res
        .status(404)
        .json({ error: "Account not found or access denied" });
    }

    // Check if account is active
    if (account.status !== "active") {
      return res
        .status(400)
        .json({ error: "Account is not active for deposits" });
    }

    const secureBankingService = getSecureBankingService();

    // Generate secure file paths and store images
    const frontFileName = `${crypto.randomUUID()}-front.jpg`;
    const backFileName = `${crypto.randomUUID()}-back.jpg`;

    const frontPath = path.join("mobile-deposits", user.id, frontFileName);
    const backPath = path.join("mobile-deposits", user.id, backFileName);

    // Create directory if it doesn't exist
    const dirPath = path.dirname(path.join(process.cwd(), "data", frontPath));
    await fs.mkdir(dirPath, { recursive: true });

    // Save images to secure location
    const frontFullPath = path.join(process.cwd(), "data", frontPath);
    const backFullPath = path.join(process.cwd(), "data", backPath);

    await fs.writeFile(frontFullPath, frontImage.buffer);
    await fs.writeFile(backFullPath, backImage.buffer);

    // Generate file hashes for integrity verification
    const frontHash = crypto
      .createHash("sha256")
      .update(frontImage.buffer)
      .digest("hex");
    const backHash = crypto
      .createHash("sha256")
      .update(backImage.buffer)
      .digest("hex");

    // Store mobile deposit record with encrypted image paths
    const { data: deposit, error: depositError } = await supabase
      .from("mobile_deposits")
      .insert({
        user_id: user.id,
        account_id: validatedData.accountId,
        check_amount: validatedData.amount,
        check_date: validatedData.checkDate || null,
        check_number: validatedData.checkNumber || null,
        bank_name: validatedData.bankName || null,
        front_image_encrypted:
          secureBankingService.encryption.encrypt(frontPath),
        back_image_encrypted: secureBankingService.encryption.encrypt(backPath),
        front_image_hash: frontHash,
        back_image_hash: backHash,
        status: "pending",
        deposited_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (depositError) {
      // Clean up files if database storage failed
      try {
        await fs.unlink(frontFullPath);
        await fs.unlink(backFullPath);
      } catch (cleanupError) {
        console.error(
          "Failed to cleanup files after database error:",
          cleanupError,
        );
      }

      console.error("Mobile deposit database error:", depositError);
      return res.status(500).json({
        error: "Failed to store deposit record",
        details: "Unable to save deposit information",
      });
    }

    // Create a notification for the user
    await supabase.from("notifications").insert({
      user_id: user.id,
      type: "transaction",
      title: "Mobile Deposit Received",
      message: `Your mobile deposit of $${validatedData.amount.toFixed(2)} has been received and is being processed.`,
      related_account_id: validatedData.accountId,
    });

    // Log the deposit submission for audit
    await secureBankingService.logAdminAction({
      adminId: user.id, // User initiated action
      action: "mobile_deposit_submitted",
      resourceType: "mobile_deposit",
      resourceId: deposit.id,
      newValues: {
        amount: validatedData.amount,
        account_id: validatedData.accountId,
        status: "pending",
      },
      ipAddress: req.ip,
      userAgent: req.get("User-Agent"),
    });

    res.status(201).json({
      message: "Mobile deposit submitted successfully",
      deposit: {
        id: deposit.id,
        amount: validatedData.amount,
        status: "pending",
        submitted_at: deposit.deposited_at,
        estimated_availability: getEstimatedAvailability(),
      },
    });
  } catch (error) {
    console.error("Mobile deposit submission error:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Invalid deposit data",
        details: error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
    }

    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res
          .status(400)
          .json({
            error: "Image file too large. Maximum size is 10MB per image.",
          });
      }
      return res
        .status(400)
        .json({ error: "Image upload error", details: error.message });
    }

    res.status(500).json({
      error: "Mobile deposit failed",
      details: "An unexpected error occurred while processing your deposit",
    });
  }
};

/**
 * Get user's mobile deposits history
 */
export const getMobileDeposits: RequestHandler = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No authorization header" });
    }

    const token = authHeader.split(" ")[1];
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    const { data: deposits, error } = await supabase
      .from("mobile_deposits")
      .select(
        `
        id,
        check_amount,
        status,
        deposited_at,
        processed_at,
        funds_available_at,
        hold_amount,
        hold_release_date,
        rejection_reason,
        check_number,
        bank_name,
        accounts!inner(account_number, account_type)
      `,
      )
      .eq("user_id", user.id)
      .order("deposited_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return res.status(500).json({ error: "Failed to load mobile deposits" });
    }

    res.json({
      deposits:
        deposits?.map((deposit) => ({
          ...deposit,
          // Don't expose encrypted image paths to frontend
          front_image_encrypted: undefined,
          back_image_encrypted: undefined,
          front_image_hash: undefined,
          back_image_hash: undefined,
        })) || [],
    });
  } catch (error) {
    console.error("Get mobile deposits error:", error);
    res.status(500).json({ error: "Failed to load mobile deposits" });
  }
};

/**
 * Get mobile deposit details (admin only)
 */
export const getMobileDepositDetails: RequestHandler = async (req, res) => {
  try {
    const { depositId } = req.params;

    // This would require admin authentication middleware
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No authorization header" });
    }

    // TODO: Verify admin access

    const { data: deposit, error } = await supabase
      .from("mobile_deposits")
      .select(
        `
        *,
        banking_users!inner(name, email),
        accounts!inner(account_number, account_type)
      `,
      )
      .eq("id", depositId)
      .single();

    if (error || !deposit) {
      return res.status(404).json({ error: "Mobile deposit not found" });
    }

    // For admin view, decrypt image paths (but don't send actual images)
    const secureBankingService = getSecureBankingService();
    const decryptedDeposit = {
      ...deposit,
      front_image_path: deposit.front_image_encrypted
        ? secureBankingService.encryption.decrypt(deposit.front_image_encrypted)
        : null,
      back_image_path: deposit.back_image_encrypted
        ? secureBankingService.encryption.decrypt(deposit.back_image_encrypted)
        : null,
    };

    res.json({ deposit: decryptedDeposit });
  } catch (error) {
    console.error("Get mobile deposit details error:", error);
    res.status(500).json({ error: "Failed to load deposit details" });
  }
};

/**
 * Process mobile deposit (admin only)
 */
export const processMobileDeposit: RequestHandler = async (req, res) => {
  try {
    const { depositId } = req.params;
    const { action, notes } = req.body; // 'approve' or 'reject'

    if (!["approve", "reject"].includes(action)) {
      return res
        .status(400)
        .json({ error: "Invalid action. Must be 'approve' or 'reject'" });
    }

    // TODO: Verify admin access
    const adminId = req.user?.id;
    if (!adminId) {
      return res.status(401).json({ error: "Admin authentication required" });
    }

    const { data: deposit, error: depositError } = await supabase
      .from("mobile_deposits")
      .select("*")
      .eq("id", depositId)
      .single();

    if (depositError || !deposit) {
      return res.status(404).json({ error: "Mobile deposit not found" });
    }

    if (deposit.status !== "pending") {
      return res
        .status(400)
        .json({ error: "Deposit has already been processed" });
    }

    const secureBankingService = getSecureBankingService();
    const now = new Date().toISOString();

    if (action === "approve") {
      // Create credit transaction
      const { error: transactionError } =
        await secureBankingService.createTransaction({
          accountId: deposit.account_id,
          type: "mobile_deposit",
          amount: deposit.check_amount,
          description: `Mobile deposit - Check ${deposit.check_number || "N/A"}`,
          category: "mobile_deposit",
          merchantName: deposit.bank_name || "Mobile Deposit",
        });

      if (transactionError) {
        return res.status(500).json({ error: "Failed to create transaction" });
      }

      // Update deposit status to approved
      const fundsAvailableAt = new Date(
        Date.now() + 24 * 60 * 60 * 1000,
      ).toISOString(); // 24 hours

      await supabase
        .from("mobile_deposits")
        .update({
          status: "approved",
          processed_at: now,
          processed_by: adminId,
          funds_available_at: fundsAvailableAt,
        })
        .eq("id", depositId);

      // Send notification to user
      await supabase.from("notifications").insert({
        user_id: deposit.user_id,
        type: "transaction",
        title: "Mobile Deposit Approved",
        message: `Your mobile deposit of $${deposit.check_amount.toFixed(2)} has been approved. Funds will be available on ${new Date(fundsAvailableAt).toLocaleDateString()}.`,
        related_account_id: deposit.account_id,
      });
    } else {
      // reject
      await supabase
        .from("mobile_deposits")
        .update({
          status: "rejected",
          processed_at: now,
          processed_by: adminId,
          rejection_reason: notes || "Deposit rejected by administrator",
          rejection_notes: notes,
        })
        .eq("id", depositId);

      // Send notification to user
      await supabase.from("notifications").insert({
        user_id: deposit.user_id,
        type: "transaction",
        title: "Mobile Deposit Rejected",
        message: `Your mobile deposit of $${deposit.check_amount.toFixed(2)} has been rejected. ${notes ? `Reason: ${notes}` : "Please contact customer service for more information."}`,
        related_account_id: deposit.account_id,
      });
    }

    // Log admin action
    await secureBankingService.logAdminAction({
      adminId,
      action: `mobile_deposit_${action}`,
      resourceType: "mobile_deposit",
      resourceId: depositId,
      newValues: {
        status: action === "approve" ? "approved" : "rejected",
        notes,
      },
      targetUserId: deposit.user_id,
      ipAddress: req.ip,
      userAgent: req.get("User-Agent"),
    });

    res.json({ message: `Mobile deposit ${action}ed successfully` });
  } catch (error) {
    console.error("Process mobile deposit error:", error);
    res.status(500).json({ error: "Failed to process mobile deposit" });
  }
};

/**
 * Calculate estimated funds availability
 */
function getEstimatedAvailability(): string {
  // For demo purposes, funds available next business day
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  // If tomorrow is weekend, move to Monday
  if (tomorrow.getDay() === 0) {
    // Sunday
    tomorrow.setDate(tomorrow.getDate() + 1);
  } else if (tomorrow.getDay() === 6) {
    // Saturday
    tomorrow.setDate(tomorrow.getDate() + 2);
  }

  return tomorrow.toISOString();
}
