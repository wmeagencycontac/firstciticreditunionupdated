import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer as createHttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { getEmailService } from "./email";
import { handleDemo } from "./routes/demo";
import { handleLogin, handleProfile } from "./routes/auth";
import { handleRegistration } from "./routes/registration";
import {
  handleGetAccounts,
  handleGetAccountDetails,
  handleGetTransactions as handleGetAccountTransactions,
} from "./routes/accounts";
import { handleGetDashboard } from "./routes/dashboard";
import {
  handleGetTransactions,
  handleCreateTransaction,
} from "./routes/transactions";
import {
  handleRequestOTP,
  handleVerifyOTP,
  handleGetOTPUser,
} from "./routes/otp-auth";
import {
  uploadMiddleware,
  handleEnhancedRegistration,
  handleEmailVerification,
} from "./routes/enhanced-registration";
import {
  handleAccountSummary,
  handleGetAllTransactions,
  handleSendTransfer,
  handleGetCards,
  handleAdminVerifyUser,
  authenticateToken,
} from "./routes/banking";

// Global Socket.IO server instance
export let io: SocketIOServer;

export function createServer() {
  const app = express();
  const httpServer = createHttpServer(app);

  // Initialize Socket.IO
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Socket.IO connection handling
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join user-specific room for personalized notifications
    socket.on("join-user-room", (userId: string) => {
      socket.join(`user:${userId}`);
      console.log(`User ${userId} joined their room`);
    });

    // Join admin room for admin notifications
    socket.on("join-admin-room", () => {
      socket.join("admin");
      console.log("Admin joined admin room");
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  // Initialize and verify email service
  const emailService = getEmailService();
  emailService.verifyConnection();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Banking API routes
  app.post("/api/auth/login", handleLogin);
  app.post("/api/auth/register", handleRegistration);
  app.get("/api/auth/profile", handleProfile);
  app.get("/api/dashboard", handleGetDashboard);
  app.get("/api/accounts", handleGetAccounts);
  app.get("/api/accounts/:accountId", handleGetAccountDetails);
  app.get(
    "/api/accounts/:accountId/transactions",
    handleGetAccountTransactions,
  );

  // All transactions endpoints
  app.get("/api/transactions", handleGetTransactions);
  app.post("/api/transactions", handleCreateTransaction);

  // OTP Authentication endpoints
  app.post("/api/otp/request-code", handleRequestOTP);
  app.post("/api/otp/verify-code", handleVerifyOTP);
  app.get("/api/otp/user/:userId", handleGetOTPUser);

  // Enhanced Registration endpoints
  app.post(
    "/api/register-enhanced",
    uploadMiddleware,
    handleEnhancedRegistration,
  );
  app.get("/api/verify-email", handleEmailVerification);

  // Banking API endpoints (protected)
  app.get("/api/account-summary", authenticateToken, handleAccountSummary);
  app.get("/api/all-transactions", authenticateToken, handleGetAllTransactions);
  app.post("/api/send-transfer", authenticateToken, handleSendTransfer);
  app.get("/api/cards", authenticateToken, handleGetCards);

  // Admin banking endpoints
  app.post("/api/admin/verify-users", authenticateToken, handleAdminVerifyUser);

  return { app, httpServer, io };
}
