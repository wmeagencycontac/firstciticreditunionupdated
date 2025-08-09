import sqlite3 from "sqlite3";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { getEmailService } from "./email";

export interface BankingUser {
  id: number;
  email: string;
  name: string;
  email_verified: boolean;
  role: "user" | "admin";
  created_at: string;
  updated_at: string;
}

export interface Account {
  id: number;
  user_id: number;
  account_number: string;
  account_type: "savings" | "checking";
  balance: number;
  currency: string;
  routing_number: string;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: number;
  account_id: number;
  type: "credit" | "debit";
  amount: number;
  description: string;
  timestamp: string;
}

export interface Card {
  id: number;
  user_id: number;
  card_number: string;
  status: "active" | "inactive" | "blocked";
  created_at: string;
}

export class BankingDatabase {
  private db: sqlite3.Database;

  constructor() {
    // Create data directory if it doesn't exist
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const dbPath = path.join(dataDir, "auth.db");

    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error("Error opening banking database:", err);
      } else {
        console.log("Connected to banking SQLite database");
        this.initializeTables();
      }
    });

    // Enable WAL mode and optimizations
    this.db.run("PRAGMA journal_mode = WAL;");
    this.db.run("PRAGMA synchronous = NORMAL;");
    this.db.run("PRAGMA foreign_keys = ON;");
  }

  private initializeTables(): void {
    this.db.serialize(() => {
      // Enhanced users table for banking
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

      // Banking accounts table
      this.db.run(`CREATE TABLE IF NOT EXISTS accounts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        account_number TEXT UNIQUE NOT NULL,
        account_type TEXT NOT NULL CHECK (account_type IN ('savings', 'checking')),
        balance DECIMAL(10,2) DEFAULT 0.00,
        currency TEXT DEFAULT 'USD',
        routing_number TEXT DEFAULT '322078972',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      )`);

      // Transactions table
      this.db.run(`CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        account_id INTEGER NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('credit', 'debit')),
        amount DECIMAL(10,2) NOT NULL,
        description TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(account_id) REFERENCES accounts(id) ON DELETE CASCADE
      )`);

      // Cards table
      this.db.run(`CREATE TABLE IF NOT EXISTS cards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        card_number TEXT UNIQUE NOT NULL,
        status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'blocked')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
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

      // User sessions table
      this.db.run(`CREATE TABLE IF NOT EXISTS user_sessions (
        id TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL,
        token TEXT UNIQUE NOT NULL,
        expires_at INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      )`);

      // Create indexes for performance
      this.db.run(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
      this.db.run(
        `CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id)`,
      );
      this.db.run(
        `CREATE INDEX IF NOT EXISTS idx_accounts_number ON accounts(account_number)`,
      );
      this.db.run(
        `CREATE INDEX IF NOT EXISTS idx_transactions_account_id ON transactions(account_id)`,
      );
      this.db.run(
        `CREATE INDEX IF NOT EXISTS idx_transactions_timestamp ON transactions(timestamp DESC)`,
      );
      this.db.run(
        `CREATE INDEX IF NOT EXISTS idx_cards_user_id ON cards(user_id)`,
      );
      this.db.run(
        `CREATE INDEX IF NOT EXISTS idx_cards_number ON cards(card_number)`,
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

  public async getUserByEmail(email: string): Promise<BankingUser | null> {
    return new Promise((resolve, reject) => {
      this.db.get(
        `SELECT * FROM users WHERE email = ?`,
        [email],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row || null);
          }
        },
      );
    });
  }

  public async getUserById(userId: number): Promise<BankingUser | null> {
    return new Promise((resolve, reject) => {
      this.db.get(`SELECT * FROM users WHERE id = ?`, [userId], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row || null);
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

  // Account management methods
  public async createAccount(accountData: {
    userId: number;
    accountNumber: string;
    accountType: "savings" | "checking";
    initialBalance?: number;
  }): Promise<number> {
    return new Promise((resolve, reject) => {
      const {
        userId,
        accountNumber,
        accountType,
        initialBalance = 0,
      } = accountData;
      this.db.run(
        `INSERT INTO accounts (user_id, account_number, account_type, balance, routing_number)
         VALUES (?, ?, ?, ?, '322078972')`,
        [userId, accountNumber, accountType, initialBalance],
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

  public async getAccountsByUserId(userId: number): Promise<Account[]> {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT * FROM accounts WHERE user_id = ? ORDER BY created_at ASC`,
        [userId],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows || []);
          }
        },
      );
    });
  }

  public async getAccountById(accountId: number): Promise<Account | null> {
    return new Promise((resolve, reject) => {
      this.db.get(
        `SELECT * FROM accounts WHERE id = ?`,
        [accountId],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row || null);
          }
        },
      );
    });
  }

  public async updateAccountBalance(
    accountId: number,
    newBalance: number,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        `UPDATE accounts SET balance = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [newBalance, accountId],
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

  // Transaction methods
  public async createTransaction(transactionData: {
    accountId: number;
    type: "credit" | "debit";
    amount: number;
    description: string;
    merchantName?: string;
  }): Promise<number> {
    const { accountId, type, amount, description, merchantName } =
      transactionData;
    const db = this.db;

    return new Promise((resolve, reject) => {
      // Insert transaction
      db.run(
        `INSERT INTO transactions (account_id, type, amount, description)
         VALUES (?, ?, ?, ?)`,
        [accountId, type, amount, description],
        async function (err) {
          if (err) {
            reject(err);
            return;
          }

          const transactionId = this.lastID;

          try {
            // Get account and user information for email notification
            const accountInfo = await new Promise<any>(
              (resolveAccount, rejectAccount) => {
                db.get(
                  `SELECT a.*, u.email, u.name, a.account_number
                 FROM accounts a
                 JOIN users u ON a.user_id = u.id
                 WHERE a.id = ?`,
                  [accountId],
                  (err, row) => {
                    if (err) rejectAccount(err);
                    else resolveAccount(row);
                  },
                );
              },
            );

            if (accountInfo && accountInfo.email) {
              // Determine transaction type for email
              let emailType:
                | "deposit"
                | "withdrawal"
                | "transfer_in"
                | "transfer_out";
              if (type === "credit") {
                emailType = description.toLowerCase().includes("transfer")
                  ? "transfer_in"
                  : "deposit";
              } else {
                emailType = description.toLowerCase().includes("transfer")
                  ? "transfer_out"
                  : "withdrawal";
              }

              // Get updated balance
              const updatedBalance = await new Promise<number>(
                (resolveBalance, rejectBalance) => {
                  db.get(
                    `SELECT balance FROM accounts WHERE id = ?`,
                    [accountId],
                    (err, row: any) => {
                      if (err) rejectBalance(err);
                      else resolveBalance(row?.balance || 0);
                    },
                  );
                },
              );

              // Send email notification
              const emailService = getEmailService();
              await emailService.sendTransactionNotification(
                accountInfo.email,
                {
                  type: emailType,
                  amount: amount,
                  description,
                  accountNumber: accountInfo.account_number,
                  balance: updatedBalance,
                  timestamp: new Date().toISOString(),
                  merchantName,
                },
              );
            }
          } catch (emailError) {
            console.error(
              "Failed to send transaction email notification:",
              emailError,
            );
            // Don't fail the transaction for email errors
          }

          resolve(transactionId);
        },
      );
    });
  }

  public async getTransactionsByAccountId(
    accountId: number,
    limit: number = 50,
  ): Promise<Transaction[]> {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT * FROM transactions WHERE account_id = ? ORDER BY timestamp DESC LIMIT ?`,
        [accountId, limit],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows || []);
          }
        },
      );
    });
  }

  public async getTransactionsByUserId(
    userId: number,
    limit: number = 50,
  ): Promise<Transaction[]> {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT t.* FROM transactions t 
         JOIN accounts a ON t.account_id = a.id 
         WHERE a.user_id = ? 
         ORDER BY t.timestamp DESC LIMIT ?`,
        [userId, limit],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows || []);
          }
        },
      );
    });
  }

  // Card management methods
  public async createCard(cardData: {
    userId: number;
    cardNumber: string;
  }): Promise<number> {
    return new Promise((resolve, reject) => {
      const { userId, cardNumber } = cardData;
      this.db.run(
        `INSERT INTO cards (user_id, card_number, status)
         VALUES (?, ?, 'active')`,
        [userId, cardNumber],
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

  public async getCardsByUserId(userId: number): Promise<Card[]> {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT * FROM cards WHERE user_id = ? ORDER BY created_at ASC`,
        [userId],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows || []);
          }
        },
      );
    });
  }

  // Account number generation methods
  public generateAccountNumber(
    userId: number,
    accountType: "savings" | "checking",
  ): string {
    const memberId = userId.toString().padStart(5, "0");

    if (accountType === "savings") {
      // Savings: [memberID][00][shareNumber] → e.g. `1234560001`
      const shareNumber = "0001";
      return `${memberId}00${shareNumber}`;
    } else {
      // Checking: Derived from MICR logic: combine member number with type code
      return `${memberId}10`;
    }
  }

  public generateCardNumber(): string {
    // Generate a unique 16-digit card number
    // Start with BIN (Bank Identification Number) - using 4111 as example
    const bin = "4111";

    // Generate random middle digits
    const middle = Math.random().toString().slice(2, 14).padEnd(12, "0");

    // Simple checksum (Luhn algorithm would be better for production)
    const checkDigit = Math.floor(Math.random() * 10);

    return `${bin}${middle}${checkDigit}`;
  }

  public async isCardNumberUnique(cardNumber: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.get(
        `SELECT id FROM cards WHERE card_number = ?`,
        [cardNumber],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(!row);
          }
        },
      );
    });
  }

  public async generateUniqueCardNumber(): Promise<string> {
    let cardNumber: string;
    let isUnique = false;

    do {
      cardNumber = this.generateCardNumber();
      isUnique = await this.isCardNumberUnique(cardNumber);
    } while (!isUnique);

    return cardNumber;
  }

  // Transfer methods
  public async transfer(
    fromAccountId: number,
    toAccountId: number,
    amount: number,
    description: string,
  ): Promise<void> {
    const db = this.db;

    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run("BEGIN TRANSACTION");

        // Debit from source account
        db.run(
          `UPDATE accounts SET balance = balance - ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
          [amount, fromAccountId],
        );

        // Credit to destination account
        db.run(
          `UPDATE accounts SET balance = balance + ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
          [amount, toAccountId],
        );

        // Create debit transaction
        db.run(
          `INSERT INTO transactions (account_id, type, amount, description)
           VALUES (?, 'debit', ?, ?)`,
          [fromAccountId, amount, description],
        );

        // Create credit transaction
        db.run(
          `INSERT INTO transactions (account_id, type, amount, description)
           VALUES (?, 'credit', ?, ?)`,
          [toAccountId, amount, description],
          async (err) => {
            if (err) {
              db.run("ROLLBACK");
              reject(err);
            } else {
              db.run("COMMIT", async (commitErr) => {
                if (commitErr) {
                  reject(commitErr);
                } else {
                  // Send email notifications for both accounts after successful transfer
                  try {
                    await this.sendTransferEmailNotifications(
                      fromAccountId,
                      toAccountId,
                      amount,
                      description,
                    );
                  } catch (emailError) {
                    console.error(
                      "Failed to send transfer email notifications:",
                      emailError,
                    );
                    // Don't fail the transfer for email errors
                  }
                  resolve();
                }
              });
            }
          },
        );
      });
    });
  }

  private async sendTransferEmailNotifications(
    fromAccountId: number,
    toAccountId: number,
    amount: number,
    description: string,
  ): Promise<void> {
    const emailService = getEmailService();

    try {
      // Get both account information
      const [fromAccountInfo, toAccountInfo] = await Promise.all([
        new Promise<any>((resolve, reject) => {
          this.db.get(
            `SELECT a.*, u.email, u.name, a.account_number, a.balance
             FROM accounts a
             JOIN users u ON a.user_id = u.id
             WHERE a.id = ?`,
            [fromAccountId],
            (err, row) => {
              if (err) reject(err);
              else resolve(row);
            },
          );
        }),
        new Promise<any>((resolve, reject) => {
          this.db.get(
            `SELECT a.*, u.email, u.name, a.account_number, a.balance
             FROM accounts a
             JOIN users u ON a.user_id = u.id
             WHERE a.id = ?`,
            [toAccountId],
            (err, row) => {
              if (err) reject(err);
              else resolve(row);
            },
          );
        }),
      ]);

      const timestamp = new Date().toISOString();

      // Send email to sender (transfer out)
      if (fromAccountInfo && fromAccountInfo.email) {
        await emailService.sendTransactionNotification(fromAccountInfo.email, {
          type: "transfer_out",
          amount: amount,
          description,
          accountNumber: fromAccountInfo.account_number,
          balance: fromAccountInfo.balance,
          timestamp,
        });
      }

      // Send email to receiver (transfer in)
      if (toAccountInfo && toAccountInfo.email) {
        await emailService.sendTransactionNotification(toAccountInfo.email, {
          type: "transfer_in",
          amount: amount,
          description,
          accountNumber: toAccountInfo.account_number,
          balance: toAccountInfo.balance,
          timestamp,
        });
      }
    } catch (error) {
      console.error("Error sending transfer email notifications:", error);
      throw error;
    }
  }

  // Verification token methods (reuse from enhanced database)
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

  public close(): void {
    this.db.close((err) => {
      if (err) {
        console.error("Error closing banking database:", err);
      } else {
        console.log("Banking database connection closed");
      }
    });
  }
}

// Singleton instance
let dbInstance: BankingDatabase | null = null;

export function getBankingDatabase(): BankingDatabase {
  if (!dbInstance) {
    dbInstance = new BankingDatabase();
  }
  return dbInstance;
}
