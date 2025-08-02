import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleLogin, handleProfile } from "./routes/auth";
import {
  handleGetAccounts,
  handleGetAccountDetails,
  handleGetTransactions,
} from "./routes/accounts";
import { handleGetDashboard } from "./routes/dashboard";

export function createServer() {
  const app = express();

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
  app.get("/api/auth/profile", handleProfile);
  app.get("/api/dashboard", handleGetDashboard);
  app.get("/api/accounts", handleGetAccounts);
  app.get("/api/accounts/:accountId", handleGetAccountDetails);
  app.get("/api/accounts/:accountId/transactions", handleGetTransactions);

  return app;
}
