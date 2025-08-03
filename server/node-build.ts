
import path from "path";
import { createServer } from "./index";
import * as express from "express";
import { createServer as createHttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";


const app = createServer();
const port = process.env.PORT || 3000;
const httpServer = createHttpServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Example: Broadcast a fake transaction every 10s (for demo)
setInterval(() => {
  io.emit("transaction", {
    id: Math.random().toString(36).slice(2),
    type: "credit",
    amount: (Math.random() * 100).toFixed(2),
    timestamp: new Date().toISOString(),
    description: "Live demo transaction"
  });
}, 10000);

// In production, serve the built SPA files
const __dirname = import.meta.dirname;
const distPath = path.join(__dirname, "../spa");

// Serve static files
app.use(express.static(distPath));

// Handle React Router - serve index.html for all non-API routes
app.get("*", (req, res) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith("/api/") || req.path.startsWith("/health")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }

  res.sendFile(path.join(distPath, "index.html"));
});


httpServer.listen(port, () => {
  console.log(`🚀 Fusion Starter server running on port ${port}`);
  console.log(`📱 Frontend: http://localhost:${port}`);
  console.log(`🔧 API: http://localhost:${port}/api`);
  console.log(`🟢 Socket.IO: ws://localhost:${port}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 Received SIGTERM, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("🛑 Received SIGINT, shutting down gracefully");
  process.exit(0);
});
