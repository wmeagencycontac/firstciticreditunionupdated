import { RequestHandler } from "express";
import multer from "multer";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";
import axios from "axios";
import path from "path";
import { getBankingDatabase } from "../banking-database";
import { getEmailService } from "../email";
import {
  EnhancedRegistrationRequest,
  EnhancedRegistrationResponse,
  NetlifyWebhookPayload,
} from "@shared/api";

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (![".jpg", ".jpeg", ".png"].includes(ext)) {
      return cb(new Error("Only JPG/PNG files are allowed"));
    }
    cb(null, true);
  },
});

// Netlify webhook URL (configurable via environment variable)
const NETLIFY_WEBHOOK_URL =
  process.env.NETLIFY_WEBHOOK_URL ||
  "https://your-site.netlify.app/.netlify/functions/register-hook";

export const uploadMiddleware = upload.single("profile_picture");

export const handleEnhancedRegistration: RequestHandler = async (req, res) => {
  try {
    const {
      name,
      email,
      bio,
      password,
      confirmPassword,
    }: EnhancedRegistrationRequest = req.body;
    const file = req.file;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({
        error: "Name and email are required",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Invalid email format",
      });
    }

    // Validate password if provided
    if (password) {
      if (!confirmPassword) {
        return res.status(400).json({
          error: "Password confirmation is required",
        });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({
          error: "Passwords do not match",
        });
      }

      if (password.length < 8) {
        return res.status(400).json({
          error: "Password must be at least 8 characters long",
        });
      }
    }

    const db = getBankingDatabase();
    const emailService = getEmailService();

    // Check if user already exists
    const existingUser = await db.getUserByEmail(email.toLowerCase());
    if (existingUser) {
      return res.status(409).json({
        error: "User with this email already exists",
      });
    }

    // Hash password if provided
    let passwordHash: string | undefined;
    if (password) {
      passwordHash = await bcrypt.hash(password, 12);
    }

    // Create user in database
    const userId = await db.createUser({
      email: email.toLowerCase(),
      name,
      bio,
      picture: file ? file.filename : undefined,
      passwordHash,
    });

    // Create email verification token
    const verificationToken = uuid();
    const verificationId = uuid();
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    await db.createVerificationToken({
      id: verificationId,
      userId,
      token: verificationToken,
      expiresAt,
    });

    // Send verification email
    const verifyUrl = `${req.protocol}://${req.get("host")}/api/verify-email?token=${verificationToken}`;

    try {
      // Create a custom verification email
      const mailOptions = {
        from: `"Secure Registration" <${process.env.EMAIL_USER || "Baytagdkdv@gmail.com"}>`,
        to: email,
        subject: "Please verify your email address",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333; text-align: center;">Welcome ${name}!</h2>
            <p style="font-size: 16px; color: #555;">
              Thank you for registering with us. Please verify your email address to complete your registration.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verifyUrl}" 
                 style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Verify Email Address
              </a>
            </div>
            <p style="font-size: 14px; color: #666;">
              This verification link will expire in 24 hours. If you didn't create this account, please ignore this email.
            </p>
            <p style="font-size: 14px; color: #666;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${verifyUrl}" style="color: #2563eb;">${verifyUrl}</a>
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #999; text-align: center;">
              Secure Registration System
            </p>
          </div>
        `,
      };

      // Use the existing email service transporter
      const transporter = (emailService as any).transporter;
      await transporter.sendMail(mailOptions);
      console.log("Verification email sent to:", email);
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      // Don't fail the registration if email fails
    }

    // Send data to Netlify webhook
    try {
      const webhookPayload: NetlifyWebhookPayload = {
        name,
        email: email.toLowerCase(),
        bio,
        picture: file ? file.filename : undefined,
        registered_at: new Date().toISOString(),
      };

      await axios.post(NETLIFY_WEBHOOK_URL, webhookPayload, {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 5000, // 5 second timeout
      });
      console.log("User data sent to Netlify webhook successfully");
    } catch (webhookError) {
      console.error("Failed to send data to Netlify webhook:", webhookError);
      // Don't fail the registration if webhook fails
    }

    const response: EnhancedRegistrationResponse = {
      message:
        "Registration successful! Please check your email to verify your account.",
      userId,
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("Enhanced registration error:", error);
    res.status(500).json({
      error: "Internal server error during registration",
    });
  }
};

// Email verification handler
export const handleEmailVerification: RequestHandler = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token || typeof token !== "string") {
      return res.status(400).send(`
        <html>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h2 style="color: #dc2626;">❌ Verification Failed</h2>
            <p>Missing or invalid verification token.</p>
          </body>
        </html>
      `);
    }

    const db = getBankingDatabase();

    // Get verification token
    const verification = await db.getVerificationToken(token);
    if (!verification) {
      return res.status(400).send(`
        <html>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h2 style="color: #dc2626;">❌ Verification Failed</h2>
            <p>Invalid or expired verification token.</p>
          </body>
        </html>
      `);
    }

    // Check if token is expired
    if (verification.expires_at < Date.now()) {
      return res.status(400).send(`
        <html>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h2 style="color: #dc2626;">❌ Verification Failed</h2>
            <p>Verification token has expired. Please request a new verification email.</p>
          </body>
        </html>
      `);
    }

    // Mark email as verified
    await db.markEmailAsVerified(verification.user_id);

    // Mark token as used
    await db.markTokenAsUsed(verification.id);

    // Get user details for success message
    const user = await db.getUserById(verification.user_id);

    res.status(200).send(`
      <html>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h2 style="color: #16a34a;">✅ Email Verified Successfully!</h2>
          <p>Welcome ${user?.name || "User"}! Your email has been verified and your account is now active.</p>
          <p>You can now log in to your account.</p>
          <div style="margin-top: 30px;">
            <a href="/" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              Go to Login
            </a>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).send(`
      <html>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h2 style="color: #dc2626;">❌ Verification Error</h2>
          <p>An error occurred during email verification. Please try again later.</p>
        </body>
      </html>
    `);
  }
};
