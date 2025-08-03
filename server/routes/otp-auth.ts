import { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { getOTPDatabase } from "../database";
import {
  OTPRequestRequest,
  OTPRequestResponse,
  OTPVerifyRequest,
  OTPVerifyResponse,
} from "@shared/api";

const db = getOTPDatabase().getDatabase();

// Endpoint to request login code (OTP)
export const handleRequestOTP: RequestHandler = (req, res) => {
  const { email }: OTPRequestRequest = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email required" });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  // Check if user exists
  db.get(
    `SELECT id FROM otp_users WHERE email = ?`,
    [email],
    (err, row: any) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      const userId = row ? row.id : null;

      const createOTP = (uid: number) => {
        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpHash = bcrypt.hashSync(otp, 10);
        const expiresAt = Date.now() + 5 * 60 * 1000; // 5-minute TTL
        const otpId = uuidv4();

        // Insert OTP record
        db.run(
          `INSERT INTO otps (id, user_id, otp_hash, expires_at) VALUES (?, ?, ?, ?)`,
          [otpId, uid, otpHash, expiresAt],
          (err) => {
            if (err) {
              console.error("OTP insert failed:", err);
              return res.status(500).json({ error: "Failed to generate OTP" });
            }

            // 🚨 In production, send OTP via email service (SendGrid, Mailgun, etc.)
            // For now, log to console for development
            console.log(`🔐 OTP for ${email}: ${otp} (expires in 5 minutes)`);

            const response: OTPRequestResponse = {
              message: "OTP sent successfully (check console in development)",
            };
            return res.json(response);
          },
        );
      };

      if (userId) {
        // User exists, create OTP
        createOTP(userId);
      } else {
        // Create new user, then create OTP
        db.run(
          `INSERT INTO otp_users (email) VALUES (?)`,
          [email],
          function (err) {
            if (err) {
              console.error("User creation failed:", err);
              return res.status(500).json({ error: "User creation failed" });
            }
            createOTP(this.lastID);
          },
        );
      }
    },
  );
};

// Endpoint to verify the OTP
export const handleVerifyOTP: RequestHandler = (req, res) => {
  const { email, code }: OTPVerifyRequest = req.body;

  if (!email || !code) {
    return res.status(400).json({ error: "Email and code are required" });
  }

  // Find the most recent OTP for the user
  db.get(
    `SELECT u.id AS userId, o.id AS otpId, o.otp_hash, o.expires_at, o.failed_attempts, o.used
     FROM otp_users u 
     JOIN otps o ON u.id = o.user_id
     WHERE u.email = ? 
     ORDER BY o.expires_at DESC 
     LIMIT 1`,
    [email],
    (err, row: any) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (!row) {
        return res.status(400).json({ error: "No code found for this user" });
      }

      // Check if OTP is already used
      if (row.used) {
        return res.status(403).json({ error: "Code already used" });
      }

      // Check if OTP is expired
      if (row.expires_at < Date.now()) {
        return res.status(403).json({ error: "Code expired" });
      }

      // Check for too many failed attempts
      if (row.failed_attempts >= 5) {
        return res
          .status(403)
          .json({ error: "Too many failed attempts. Request a new code." });
      }

      // Verify the OTP
      const isMatch = bcrypt.compareSync(code, row.otp_hash);

      if (isMatch) {
        // Mark OTP as used
        db.run(`UPDATE otps SET used = 1 WHERE id = ?`, [row.otpId], (err) => {
          if (err) {
            console.error("Failed to mark OTP as used:", err);
            return res.status(500).json({ error: "Database error" });
          }

          const response: OTPVerifyResponse = {
            success: true,
            user_id: row.userId,
            message: "Authentication successful",
          };

          console.log(`✅ Successful OTP verification for ${email}`);
          return res.json(response);
        });
      } else {
        // Increment failed attempts
        const updatedFails = row.failed_attempts + 1;
        db.run(
          `UPDATE otps SET failed_attempts = ? WHERE id = ?`,
          [updatedFails, row.otpId],
          (err) => {
            if (err) {
              console.error("Failed to update failed attempts:", err);
            }
          },
        );

        if (updatedFails >= 5) {
          return res.status(403).json({
            error: "Too many failed attempts. Request a new code.",
          });
        }

        console.log(
          `❌ Failed OTP verification attempt for ${email} (${updatedFails}/5)`,
        );
        return res.status(401).json({
          error: `Invalid code. ${5 - updatedFails} attempts remaining.`,
        });
      }
    },
  );
};

// Helper endpoint to get user info after successful OTP verification
export const handleGetOTPUser: RequestHandler = (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ error: "User ID required" });
  }

  db.get(
    `SELECT id, email, created_at FROM otp_users WHERE id = ?`,
    [userId],
    (err, row: any) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (!row) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.json({
        id: row.id,
        email: row.email,
        created_at: row.created_at,
      });
    },
  );
};
