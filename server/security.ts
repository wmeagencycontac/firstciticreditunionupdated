import { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";

// Rate limiting configurations
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs for auth endpoints
  message: {
    error: "Too many authentication attempts, please try again later.",
    retryAfter: "15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many authentication attempts",
      retryAfter: Math.ceil(req.rateLimit.resetTime! / 1000),
    });
  },
});

export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests, please try again later.",
    retryAfter: "15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const apiRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // limit each IP to 60 API requests per minute
  message: {
    error: "API rate limit exceeded, please slow down.",
    retryAfter: "1 minute",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const uploadRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 file uploads per hour
  message: {
    error: "Upload limit exceeded, please try again later.",
    retryAfter: "1 hour",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Security headers configuration
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
      connectSrc: [
        "'self'",
        "https://api.supabase.co",
        "wss://realtime.supabase.co",
      ],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false, // Allow iframe embedding if needed
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  noSniff: true,
  frameguard: { action: "deny" },
  xssFilter: true,
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
});

// CORS configuration for production
export const corsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) {
    // In production, only allow specific domains
    const allowedOrigins = [
      "https://your-domain.com",
      "https://www.your-domain.com",
      "https://app.your-domain.com",
    ];

    // Allow requests with no origin (mobile apps, postman, etc.)
    if (!origin) return callback(null, true);

    // In development, allow localhost
    if (process.env.NODE_ENV === "development") {
      if (origin.includes("localhost") || origin.includes("127.0.0.1")) {
        return callback(null, true);
      }
    }

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS policy"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: [
    "X-RateLimit-Limit",
    "X-RateLimit-Remaining",
    "X-RateLimit-Reset",
  ],
};

// Request logging middleware
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get("User-Agent"),
      timestamp: new Date().toISOString(),
    };

    // Don't log sensitive endpoints or successful requests in production
    if (process.env.NODE_ENV === "development" || res.statusCode >= 400) {
      console.log("Request:", JSON.stringify(logData));
    }
  });

  next();
};

// IP whitelisting for admin endpoints
export const adminIPWhitelist = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (process.env.NODE_ENV === "production") {
    const allowedIPs = process.env.ADMIN_ALLOWED_IPS?.split(",") || [];
    const clientIP = req.ip;

    if (allowedIPs.length > 0 && !allowedIPs.includes(clientIP)) {
      console.warn(`Blocked admin access attempt from IP: ${clientIP}`);
      return res.status(403).json({
        error: "Access denied from this IP address",
      });
    }
  }

  next();
};

// Request sanitization middleware
export const sanitizeRequest = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Basic input sanitization
  const sanitizeString = (str: string): string => {
    return str
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/javascript:/gi, "")
      .replace(/on\w+\s*=/gi, "");
  };

  const sanitizeObject = (obj: any): any => {
    if (typeof obj === "string") {
      return sanitizeString(obj);
    } else if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    } else if (obj && typeof obj === "object") {
      const sanitized: any = {};
      for (const key in obj) {
        sanitized[key] = sanitizeObject(obj[key]);
      }
      return sanitized;
    }
    return obj;
  };

  if (req.body) {
    req.body = sanitizeObject(req.body);
  }

  if (req.query) {
    req.query = sanitizeObject(req.query);
  }

  next();
};

// Database connection security
export const validateDatabaseConnection = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Check if required environment variables are set
  const requiredEnvVars = [
    "SUPABASE_URL",
    "SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
  ];

  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName],
  );

  if (missingVars.length > 0) {
    console.error("Missing required environment variables:", missingVars);
    return res.status(500).json({
      error: "Service configuration error",
    });
  }

  next();
};

// API key validation for external integrations
export const validateAPIKey = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const apiKey = req.headers["x-api-key"] as string;
  const validAPIKey = process.env.API_KEY;

  if (!validAPIKey) {
    return res.status(500).json({ error: "API key not configured" });
  }

  if (!apiKey || apiKey !== validAPIKey) {
    return res.status(401).json({ error: "Invalid API key" });
  }

  next();
};

// Session security middleware
export const secureSession = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Set secure session headers
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  // Add security headers for sensitive endpoints
  if (req.path.includes("/admin") || req.path.includes("/api/auth")) {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-XSS-Protection", "1; mode=block");
  }

  next();
};

// Error handling middleware
export const securityErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error("Security error:", err);

  // Don't expose sensitive error information in production
  if (process.env.NODE_ENV === "production") {
    return res.status(500).json({
      error: "An internal server error occurred",
      timestamp: new Date().toISOString(),
      requestId: req.headers["x-request-id"] || "unknown",
    });
  }

  // In development, show more details
  res.status(500).json({
    error: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString(),
  });
};

// Environment validation
export const validateEnvironment = () => {
  const requiredEnvVars = [
    "NODE_ENV",
    "SUPABASE_URL",
    "SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
  ];

  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName],
  );

  if (missingVars.length > 0) {
    console.error("❌ Missing required environment variables:");
    missingVars.forEach((varName) => console.error(`   - ${varName}`));
    process.exit(1);
  }

  // Warn about development settings in production
  if (process.env.NODE_ENV === "production") {
    if (!process.env.ENCRYPTION_MASTER_KEY) {
      console.error("❌ ENCRYPTION_MASTER_KEY must be set in production");
      process.exit(1);
    }

    console.log("✅ Production environment validated");
  } else {
    console.log("⚠️  Development mode - additional security checks disabled");
  }
};

// Content type validation
export const validateContentType = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.method === "POST" || req.method === "PUT" || req.method === "PATCH") {
    const contentType = req.headers["content-type"];

    // Allow multipart for file uploads
    if (
      req.path.includes("/upload") ||
      req.path.includes("/kyc") ||
      req.path.includes("/mobile-deposit")
    ) {
      if (
        !contentType ||
        (!contentType.includes("multipart/form-data") &&
          !contentType.includes("application/json"))
      ) {
        return res.status(400).json({
          error: "Invalid content type for upload endpoint",
        });
      }
    } else {
      // Require JSON for other endpoints
      if (!contentType || !contentType.includes("application/json")) {
        return res.status(400).json({
          error: "Content-Type must be application/json",
        });
      }
    }
  }

  next();
};

// Export middleware configuration function
export const configureSecurityMiddleware = (app: any) => {
  // Environment validation
  validateEnvironment();

  // Basic security headers
  app.use(securityHeaders);

  // CORS configuration
  app.use(cors(corsOptions));

  // Request logging
  app.use(requestLogger);

  // Request sanitization
  app.use(sanitizeRequest);

  // Content type validation
  app.use(validateContentType);

  // Session security
  app.use(secureSession);

  // Database connection validation
  app.use(validateDatabaseConnection);

  // General rate limiting
  app.use("/api/", apiRateLimit);

  // Auth-specific rate limiting
  app.use("/api/auth/", authRateLimit);
  app.use("/api/admin/", authRateLimit);

  // Upload rate limiting
  app.use("/api/kyc/upload", uploadRateLimit);
  app.use("/api/mobile-deposit", uploadRateLimit);

  // Admin IP whitelisting
  app.use("/api/admin/", adminIPWhitelist);

  console.log("🔒 Security middleware configured");
};
