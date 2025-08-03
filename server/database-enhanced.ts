import sqlite3 from "sqlite3";
import path from "path";
import fs from "fs";

export class EnhancedDatabase {
  private db: sqlite3.Database;

  constructor() {
    // Create data and uploads directories
    const dataDir = path.join(process.cwd(), "data");
    const uploadsDir = path.join(process.cwd(), "uploads");

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const dbPath = path.join(dataDir, "auth.db");

    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error("Error opening enhanced database:", err);
      } else {
        console.log("Connected to enhanced SQLite database");
        this.initializeTables();
      }
    });

    // Enable WAL mode and other optimizations
    this.db.run("PRAGMA journal_mode = WAL;");
    this.db.run("PRAGMA synchronous = NORMAL;");
  }

  private initializeTables(): void {
    this.db.serialize(() => {
      // Enhanced users table with profile information
      this.db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        bio TEXT,
        picture TEXT,
        password_hash TEXT,
        email_verified INTEGER DEFAULT 0,
        role TEXT DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Email verification tokens table
      this.db.run(`CREATE TABLE IF NOT EXISTS verifications (
        id TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL,
        token TEXT UNIQUE NOT NULL,
        expires_at INTEGER NOT NULL,
        used INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      )`);

      // User sessions table (for authenticated sessions)
      this.db.run(`CREATE TABLE IF NOT EXISTS user_sessions (
        id TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL,
        token TEXT UNIQUE NOT NULL,
        expires_at INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      )`);

      // Create indexes for better performance
      this.db.run(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
      this.db.run(
        `CREATE INDEX IF NOT EXISTS idx_verifications_token ON verifications(token)`,
      );
      this.db.run(
        `CREATE INDEX IF NOT EXISTS idx_verifications_user_expires ON verifications(user_id, expires_at DESC)`,
      );
      this.db.run(
        `CREATE INDEX IF NOT EXISTS idx_sessions_token ON user_sessions(token)`,
      );
      this.db.run(
        `CREATE INDEX IF NOT EXISTS idx_sessions_user_expires ON user_sessions(user_id, expires_at DESC)`,
      );
    });
  }

  public getDatabase(): sqlite3.Database {
    return this.db;
  }

  // User management methods
  public async createUser(userData: {
    email: string;
    name: string;
    bio?: string;
    picture?: string;
    passwordHash?: string;
  }): Promise<number> {
    return new Promise((resolve, reject) => {
      const { email, name, bio, picture, passwordHash } = userData;
      this.db.run(
        `INSERT INTO users (email, name, bio, picture, password_hash, email_verified, role)
         VALUES (?, ?, ?, ?, ?, 0, 'user')`,
        [email, name, bio || null, picture || null, passwordHash || null],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(this.lastID);
          }
        },
      );
    });
  }

  public async getUserByEmail(email: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.get(
        `SELECT * FROM users WHERE email = ?`,
        [email],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        },
      );
    });
  }

  public async getUserById(userId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.get(`SELECT * FROM users WHERE id = ?`, [userId], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  public async markEmailAsVerified(userId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        `UPDATE users SET email_verified = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [userId],
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        },
      );
    });
  }

  // Verification token methods
  public async createVerificationToken(tokenData: {
    id: string;
    userId: number;
    token: string;
    expiresAt: number;
  }): Promise<void> {
    return new Promise((resolve, reject) => {
      const { id, userId, token, expiresAt } = tokenData;
      this.db.run(
        `INSERT INTO verifications (id, user_id, token, expires_at)
         VALUES (?, ?, ?, ?)`,
        [id, userId, token, expiresAt],
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        },
      );
    });
  }

  public async getVerificationToken(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.get(
        `SELECT * FROM verifications WHERE token = ? AND used = 0`,
        [token],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        },
      );
    });
  }

  public async markTokenAsUsed(tokenId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        `UPDATE verifications SET used = 1 WHERE id = ?`,
        [tokenId],
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        },
      );
    });
  }

  // Session management methods
  public async createSession(sessionData: {
    id: string;
    userId: number;
    token: string;
    expiresAt: number;
  }): Promise<void> {
    return new Promise((resolve, reject) => {
      const { id, userId, token, expiresAt } = sessionData;
      this.db.run(
        `INSERT INTO user_sessions (id, user_id, token, expires_at)
         VALUES (?, ?, ?, ?)`,
        [id, userId, token, expiresAt],
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        },
      );
    });
  }

  public async getSessionByToken(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.get(
        `SELECT s.*, u.email, u.name, u.email_verified, u.role
         FROM user_sessions s
         JOIN users u ON s.user_id = u.id
         WHERE s.token = ? AND s.expires_at > ?`,
        [token, Date.now()],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        },
      );
    });
  }

  public async deleteSession(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        `DELETE FROM user_sessions WHERE token = ?`,
        [token],
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        },
      );
    });
  }

  // Cleanup expired tokens and sessions
  public async cleanupExpired(): Promise<void> {
    const now = Date.now();
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run(
          `DELETE FROM verifications WHERE expires_at < ? AND used = 0`,
          [now],
        );
        this.db.run(
          `DELETE FROM user_sessions WHERE expires_at < ?`,
          [now],
          (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          },
        );
      });
    });
  }

  public close(): void {
    this.db.close((err) => {
      if (err) {
        console.error("Error closing enhanced database:", err);
      } else {
        console.log("Enhanced database connection closed");
      }
    });
  }
}

// Singleton instance
let dbInstance: EnhancedDatabase | null = null;

export function getEnhancedDatabase(): EnhancedDatabase {
  if (!dbInstance) {
    dbInstance = new EnhancedDatabase();
  }
  return dbInstance;
}
