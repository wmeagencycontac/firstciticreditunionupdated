import { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import { getBankingDatabase } from "../banking-database";

export const handleCreateAdmin: RequestHandler = async (req, res) => {
  try {
    const { email, name, password, setup_key } = req.body;

    // Check setup key for security
    const expectedSetupKey = process.env.ADMIN_SETUP_KEY || "admin123";
    if (setup_key !== expectedSetupKey) {
      return res.status(403).json({ error: "Invalid setup key" });
    }

    if (!email || !name || !password) {
      return res
        .status(400)
        .json({ error: "Email, name, and password are required" });
    }

    const db = getBankingDatabase();

    // Check if admin already exists
    const existingUser = await db.getUserByEmail(email.toLowerCase());
    if (existingUser) {
      return res
        .status(409)
        .json({ error: "User with this email already exists" });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create admin user directly in database
    const userId = await new Promise<number>((resolve, reject) => {
      db.getDatabase().run(
        `INSERT INTO users (email, name, password_hash, email_verified, role)
         VALUES (?, ?, ?, 1, 'admin')`,
        [email.toLowerCase(), name, passwordHash],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(this.lastID);
          }
        },
      );
    });

    res.json({
      message: "Admin user created successfully",
      userId,
      email: email.toLowerCase(),
      name,
      role: "admin",
    });
  } catch (error) {
    console.error("Admin creation error:", error);
    res.status(500).json({ error: "Failed to create admin user" });
  }
};

export const handleCheckAdminExists: RequestHandler = async (req, res) => {
  try {
    const db = getBankingDatabase();

    const adminExists = await new Promise<boolean>((resolve, reject) => {
      db.getDatabase().get(
        `SELECT id FROM users WHERE role = 'admin' LIMIT 1`,
        [],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(!!row);
          }
        },
      );
    });

    res.json({ adminExists });
  } catch (error) {
    console.error("Check admin error:", error);
    res.status(500).json({ error: "Failed to check admin existence" });
  }
};
