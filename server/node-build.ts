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

// Simulate realistic transactions for demo purposes
const demoMerchants = [
  "Starbucks Coffee", "Amazon.com", "Shell Gas Station", "Target", "Uber",
  "Netflix", "Spotify", "McDonald's", "Walmart", "CVS Pharmacy",
  "Apple Store", "Home Depot", "Best Buy", "Costco", "Chipotle"
];

const demoDescriptions = [
  "Coffee Purchase", "Online Shopping", "Gas Station", "Grocery Shopping", "Ride Share",
  "Streaming Service", "Music Subscription", "Fast Food", "Department Store", "Pharmacy",
  "Electronics Purchase", "Home Improvement", "Tech Purchase", "Warehouse Store", "Restaurant"
];

const demoCategories = [
  "Food & Dining", "Shopping", "Transportation", "Groceries", "Entertainment",
  "Subscriptions", "Health", "Electronics", "Home & Garden", "Travel"
];

function generateRandomTransaction() {
  const isCredit = Math.random() < 0.2; // 20% chance of credit
  const amount = isCredit
    ? Math.floor(Math.random() * 500) + 50 // Credit: $50-$550
    : -(Math.floor(Math.random() * 200) + 5); // Debit: $5-$205

  const merchantIndex = Math.floor(Math.random() * demoMerchants.length);

  return {
    id: `live-${Math.random().toString(36).slice(2)}`,
    accountId: "acc-1",
    type: isCredit ? "credit" : "debit",
    amount: amount,
    description: demoDescriptions[merchantIndex],
    category: demoCategories[Math.floor(Math.random() * demoCategories.length)],
    merchant: demoMerchants[merchantIndex],
    createdAt: new Date().toISOString(),
    status: Math.random() < 0.95 ? "completed" : "pending" // 95% completed, 5% pending
  };
}

// Simulate transactions every 15-30 seconds
setInterval(() => {
  const transaction = generateRandomTransaction();
  io.emit("transaction", transaction);
  console.log(`📡 Broadcasted transaction: ${transaction.description} - ${transaction.amount > 0 ? '+' : ''}$${Math.abs(transaction.amount)}`);
}, Math.random() * 15000 + 15000); // Random interval between 15-30 seconds

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
