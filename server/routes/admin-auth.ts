import { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { getBankingDatabase } from "../banking-database";

// Admin login endpoint
export const handleAdminLogin: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const db = getBankingDatabase();

    // Get admin user by email
    const user = await db.getUserByEmail(email.toLowerCase());
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Check if user is admin
    if (user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    // Check password
    if (!user.password_hash) {
      return res.status(401).json({ error: "Account setup incomplete" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Create session token
    const sessionId = uuidv4();
    const token = uuidv4();
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    await db.createSession({
      id: sessionId,
      userId: user.id,
      token,
      expiresAt,
    });

    // Return success response
    res.json({
      message: "Admin login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};

// Admin logout endpoint
export const handleAdminLogout: RequestHandler = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token) {
      const db = getBankingDatabase();
      await db.deleteSession(token);
    }

    res.json({ message: "Logout successful" });
  } catch (error) {
    console.error("Admin logout error:", error);
    res.status(500).json({ error: "Logout failed" });
  }
};

// Admin profile endpoint
export const handleAdminProfile: RequestHandler = async (req, res) => {
  try {
    // User info is already added by authenticateToken middleware
    res.json({
      user: {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
      },
    });
  } catch (error) {
    console.error("Admin profile error:", error);
    res.status(500).json({ error: "Failed to get profile" });
  }
};
