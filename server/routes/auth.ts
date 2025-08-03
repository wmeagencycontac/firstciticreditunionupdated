import { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { getBankingDatabase } from "../banking-database";
import { LoginRequest, LoginResponse, User } from "@shared/api";

export const handleLogin: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body as LoginRequest;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const db = getBankingDatabase();
    
    // Get user from database
    const user = await db.getUserByEmail(email.toLowerCase());
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check if user has a password hash (for legacy users without passwords)
    if (!user.password_hash) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Verify password
    const passwordValid = await bcrypt.compare(password, user.password_hash);
    if (!passwordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check if email is verified
    if (!user.email_verified) {
      return res.status(403).json({ error: "Please verify your email before logging in" });
    }

    // Create session token
    const sessionToken = uuidv4();
    const sessionId = uuidv4();
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days

    await db.createSession({
      id: sessionId,
      userId: user.id,
      token: sessionToken,
      expiresAt,
    });

    // Format user response to match shared interface
    const userResponse: User = {
      id: user.id,
      email: user.email,
      name: user.name,
      email_verified: Boolean(user.email_verified),
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    const response: LoginResponse = {
      user: userResponse,
      token: sessionToken,
    };

    res.json(response);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};

export const handleProfile: RequestHandler = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const db = getBankingDatabase();
    
    const session = await db.getSessionByToken(token);
    if (!session) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    // Format user response
    const userResponse: User = {
      id: session.user_id,
      email: session.email,
      name: session.name,
      email_verified: Boolean(session.email_verified),
      role: session.role,
      created_at: session.created_at || new Date().toISOString(),
      updated_at: session.updated_at || new Date().toISOString(),
    };

    res.json(userResponse);
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ error: "Failed to get profile" });
  }
};

export const handleLogout: RequestHandler = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const db = getBankingDatabase();
    
    await db.deleteSession(token);
    
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Logout failed" });
  }
};
