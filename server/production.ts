import { createServer } from './index.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create and start the server
const { app } = createServer();

// Serve static files in production
const staticPath = path.join(__dirname, '../spa');
app.use('/', (req, res, next) => {
  // Skip API routes
  if (req.path.startsWith('/api/')) {
    return next();
  }
  
  // Serve static files for non-API routes
  const express = require('express');
  const staticHandler = express.static(staticPath, {
    index: 'index.html',
    fallthrough: true
  });
  
  staticHandler(req, res, (err) => {
    if (err) return next(err);
    
    // If no static file found, serve index.html for SPA routing
    if (req.method === 'GET' && !req.path.startsWith('/api/')) {
      res.sendFile(path.join(staticPath, 'index.html'));
    } else {
      next();
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
