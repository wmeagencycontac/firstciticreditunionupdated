import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { createServer as createHttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { getEmailService } from "./email";
import { getBankingDatabase } from "./banking-database";
import { configureRoutes } from "./routes";

// Global Socket.IO server instance
export let io: SocketIOServer;

export function createServer() {
  const app = express();
  const httpServer = createHttpServer(app);

  // Initialize Socket.IO
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // Socket.IO connection handling
  io.on("connection", async (socket) => {
    console.log("User connected:", socket.id);

    // Check authentication for admin connections
    const authToken = socket.handshake.auth?.token;
    let isAdmin = false;

    if (authToken) {
      try {
        const { getBankingDatabase } = await import("./banking-database");
        const db = getBankingDatabase();
        const session = await db.getSessionByToken(authToken);

        if (session && session.role === "admin") {
          isAdmin = true;
          console.log("Admin authenticated via Socket.IO:", session.email);
        }
      } catch (error) {
        console.error("Socket.IO auth error:", error);
      }
    }

    // Join user-specific room for personalized notifications
    socket.on("join-user-room", (userId: string) => {
      socket.join(`user:${userId}`);
      console.log(`User ${userId} joined their room`);
    });

    // Join admin room for admin notifications (only if authenticated)
    socket.on("join-admin-room", () => {
      if (isAdmin) {
        socket.join("admin");
        console.log("Authenticated admin joined admin room");
      } else {
        console.log("Unauthorized attempt to join admin room");
        socket.emit("error", "Admin authentication required");
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  // Initialize and verify email service
  const emailService = getEmailService();
  emailService.verifyConnection();

  // Initialize banking database
  const bankingDb = getBankingDatabase();
  console.log("Banking database initialized");

  // Security Middleware
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'", "ws:", "wss:"],
          fontSrc: ["'self'"],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'none'"],
        },
      },
      crossOriginEmbedderPolicy: false,
    }),
  );

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
      error: "Too many requests from this IP, please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // API rate limiting (more restrictive)
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // limit each IP to 50 API requests per windowMs
    message: {
      error: "Too many API requests from this IP, please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Auth rate limiting (very restrictive)
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 auth attempts per windowMs
    message: {
      error:
        "Too many authentication attempts from this IP, please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Apply general rate limiting to all requests
  app.use(limiter);

  // Apply API rate limiting to API routes
  app.use("/api/", apiLimiter);

  // CORS Middleware
  app.use(
    cors({
      origin: process.env.FRONTEND_URL || "http://localhost:8080",
      credentials: true,
    }),
  );

  // Body parsing middleware
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Configure all application routes
  configureRoutes(app);

  return { app, httpServer, io };
}
