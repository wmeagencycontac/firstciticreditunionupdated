import { createServer } from "./index.js";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { getBankingDatabase } from "./banking-database.js";
import { getOTPDatabase } from "./database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create and start the server
const { app, httpServer } = createServer();

// Serve static files in production
const staticPath = path.join(__dirname, "../spa");
console.log("📁 Static files path:", staticPath);

// Serve static files
app.use(
  express.static(staticPath, {
    maxAge: "1d", // Cache static assets for 1 day
    etag: true,
    lastModified: true,
  }),
);

// Handle SPA routing - serve index.html for non-API routes
app.get("*", (req, res, next) => {
  // Skip API routes
  if (req.path.startsWith("/api/")) {
    return next();
  }

  // Serve index.html for all other routes (SPA routing)
  res.sendFile(path.join(staticPath, "index.html"), (err) => {
    if (err) {
      console.error("Error serving index.html:", err);
      res.status(500).send("Server Error");
    }
  });
});

const PORT = process.env.PORT || 8080;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend: http://localhost:${PORT}`);
  console.log(`🔧 API: http://localhost:${PORT}/api`);
});

// Graceful shutdown logic
function gracefulShutdown() {
  console.log("SIGTERM signal received: closing HTTP server");
  httpServer.close(() => {
    console.log("HTTP server closed.");
    // Close database connections
    getBankingDatabase().close();
    getOTPDatabase().close();
    process.exit(0);
  });
}

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

// Global error handlers
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1); // Exit with failure
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Application specific logging, throwing an error, or other logic here
});

export default app;
