import { createServer } from "./index.js";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create and start the server
const { app } = createServer();

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

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend: http://localhost:${PORT}`);
  console.log(`🔧 API: http://localhost:${PORT}/api`);
});

export default app;
