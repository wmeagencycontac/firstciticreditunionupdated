import sqlite3 from "sqlite3";
import path from "path";
import fs from "fs";

export class OTPDatabase {
  private db: sqlite3.Database;

  constructor(dbPath: string = ":memory:") {
    // Use persistent database in production, in-memory for development
    const finalPath =
      process.env.NODE_ENV === "production"
        ? path.join(process.cwd(), "data", "otp.db")
        : dbPath;

    this.db = new sqlite3.Database(finalPath, (err) => {
      if (err) {
        console.error("Error opening database:", err);
      } else {
        console.log("Connected to SQLite database for OTP system");
        this.initializeTables();
      }
    });
  }

  private initializeTables(): void {
    this.db.serialize(() => {
      // Create users table for OTP system
      this.db.run(`CREATE TABLE IF NOT EXISTS otp_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Create OTPs table
      this.db.run(`CREATE TABLE IF NOT EXISTS otps (
        id TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL,
        otp_hash TEXT NOT NULL,
        expires_at INTEGER NOT NULL,
        failed_attempts INTEGER DEFAULT 0,
        used INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES otp_users(id)
      )`);

      // Create index for faster lookups
      this.db.run(`CREATE INDEX IF NOT EXISTS idx_otps_user_expires 
                   ON otps(user_id, expires_at DESC)`);

      this.db.run(`CREATE INDEX IF NOT EXISTS idx_otp_users_email 
                   ON otp_users(email)`);
    });
  }

  public getDatabase(): sqlite3.Database {
    return this.db;
  }

  public close(): void {
    this.db.close((err) => {
      if (err) {
        console.error("Error closing database:", err);
      } else {
        console.log("Database connection closed");
      }
    });
  }
}

// Singleton instance
let dbInstance: OTPDatabase | null = null;

export function getOTPDatabase(): OTPDatabase {
  if (!dbInstance) {
    dbInstance = new OTPDatabase();
  }
  return dbInstance;
}
