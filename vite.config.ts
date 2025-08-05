import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createServer } from "./server";
import { createServer as createHttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    fs: {
      allow: ["./client", "./shared"],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"],
    },
  },
  build: {
    outDir: "dist/spa",
  },
  plugins: [react(), expressPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve", // Only apply during development (serve mode)
    configureServer(server) {
      const { app } = createServer();

      // Add Express app as middleware to Vite dev server
      server.middlewares.use(app);

      // Add Socket.IO support for development
      if (server.httpServer) {
        const io = new SocketIOServer(server.httpServer, {
          cors: {
            origin: "*",
            methods: ["GET", "POST"],
          },
        });

        // Simulate realistic transactions for demo purposes
        const demoMerchants = [
          "Starbucks Coffee",
          "Amazon.com",
          "Shell Gas Station",
          "Target",
          "Uber",
          "Netflix",
          "Spotify",
          "McDonald's",
          "Walmart",
          "CVS Pharmacy",
          "Apple Store",
          "Home Depot",
          "Best Buy",
          "Costco",
          "Chipotle",
        ];

        const demoDescriptions = [
          "Coffee Purchase",
          "Online Shopping",
          "Gas Station",
          "Grocery Shopping",
          "Ride Share",
          "Streaming Service",
          "Music Subscription",
          "Fast Food",
          "Department Store",
          "Pharmacy",
          "Electronics Purchase",
          "Home Improvement",
          "Tech Purchase",
          "Warehouse Store",
          "Restaurant",
        ];

        const demoCategories = [
          "Food & Dining",
          "Shopping",
          "Transportation",
          "Groceries",
          "Entertainment",
          "Subscriptions",
          "Health",
          "Electronics",
          "Home & Garden",
          "Travel",
        ];

        function generateRandomTransaction() {
          const isCredit = Math.random() < 0.2; // 20% chance of credit
          const amount = isCredit
            ? Math.floor(Math.random() * 500) + 50 // Credit: $50-$550
            : -(Math.floor(Math.random() * 200) + 5); // Debit: $5-$205

          const merchantIndex = Math.floor(
            Math.random() * demoMerchants.length,
          );

          return {
            id: `live-${Math.random().toString(36).slice(2)}`,
            accountId: "acc-1",
            type: isCredit ? "credit" : "debit",
            amount: amount,
            description: demoDescriptions[merchantIndex],
            category:
              demoCategories[Math.floor(Math.random() * demoCategories.length)],
            merchant: demoMerchants[merchantIndex],
            createdAt: new Date().toISOString(),
            status: Math.random() < 0.95 ? "completed" : "pending", // 95% completed, 5% pending
          };
        }

        // Simulate transactions every 20-40 seconds in development
        setInterval(
          () => {
            const transaction = generateRandomTransaction();
            io.emit("transaction", transaction);
            console.log(
              `📡 [DEV] Broadcasted transaction: ${transaction.description} - ${transaction.amount > 0 ? "+" : ""}$${Math.abs(transaction.amount)}`,
            );
          },
          Math.random() * 20000 + 20000,
        ); // Random interval between 20-40 seconds

        io.on("connection", (socket) => {
          console.log("🔌 Client connected to Socket.IO");

          socket.on("disconnect", () => {
            console.log("🔌 Client disconnected from Socket.IO");
          });
        });
      }
    },
  };
}
