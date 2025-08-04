import { RequestHandler } from "express";
import { getBankingDatabase } from "../banking-database";
import { emitTransactionAdded, emitBalanceUpdated } from "../socket-events";

// Middleware to authenticate JWT token
const authenticateToken: RequestHandler = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  try {
    const db = getBankingDatabase();
    const session = await db.getSessionByToken(token);

    if (!session) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }

    // Add user info to request
    req.user = {
      id: session.user_id,
      email: session.email,
      name: session.name,
      email_verified: session.email_verified,
      role: session.role,
    };

    next();
  } catch (error) {
    console.error("Token authentication error:", error);
    return res.status(500).json({ error: "Authentication failed" });
  }
};

// GET /api/account-summary - Get user's account balance & details
export const handleAccountSummary: RequestHandler = async (req, res) => {
  try {
    const db = getBankingDatabase();
    const userId = req.user.id;

    // Get user's accounts
    const accounts = await db.getAccountsByUserId(userId);

    if (accounts.length === 0) {
      return res.status(404).json({ error: "No accounts found" });
    }

    // Get recent transactions for each account
    const accountSummaries = await Promise.all(
      accounts.map(async (account) => {
        const recentTransactions = await db.getTransactionsByAccountId(
          account.id,
          10,
        );
        return {
          ...account,
          recent_transactions: recentTransactions,
        };
      }),
    );

    res.json({
      accounts: accountSummaries,
      total_balance: accounts.reduce(
        (sum, acc) => sum + parseFloat(acc.balance.toString()),
        0,
      ),
    });
  } catch (error) {
    console.error("Account summary error:", error);
    res.status(500).json({ error: "Failed to get account summary" });
  }
};

// GET /api/transactions - Get user's transaction history
export const handleGetAllTransactions: RequestHandler = async (req, res) => {
  try {
    const db = getBankingDatabase();
    const userId = req.user.id;
    const limit = parseInt(req.query.limit as string) || 50;

    const transactions = await db.getTransactionsByUserId(userId, limit);

    res.json({
      transactions,
      total: transactions.length,
    });
  } catch (error) {
    console.error("Get transactions error:", error);
    res.status(500).json({ error: "Failed to get transactions" });
  }
};

// POST /api/send-transfer - Transfer money between accounts
export const handleSendTransfer: RequestHandler = async (req, res) => {
  try {
    const db = getBankingDatabase();
    const userId = req.user.id;
    const { from_account_id, to_account_id, amount, description } = req.body;

    // Validate inputs
    if (!from_account_id || !to_account_id || !amount || !description) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: "Amount must be positive" });
    }

    // Get source account and verify ownership
    const fromAccount = await db.getAccountById(from_account_id);
    if (!fromAccount || fromAccount.user_id !== userId) {
      return res
        .status(403)
        .json({ error: "Source account not found or not owned by user" });
    }

    // Check sufficient balance
    if (parseFloat(fromAccount.balance.toString()) < amount) {
      return res.status(400).json({ error: "Insufficient funds" });
    }

    // Get destination account
    const toAccount = await db.getAccountById(to_account_id);
    if (!toAccount) {
      return res.status(404).json({ error: "Destination account not found" });
    }

    // Perform transfer
    await db.transfer(from_account_id, to_account_id, amount, description);

    // Get updated balances
    const updatedFromAccount = await db.getAccountById(from_account_id);
    const updatedToAccount = await db.getAccountById(to_account_id);

    // Emit real-time events
    emitTransactionAdded({
      transactionId: 0, // Will be set by actual transaction creation
      accountId: from_account_id,
      userId: fromAccount.user_id,
      type: "debit",
      amount,
      description,
      timestamp: new Date().toISOString(),
    });

    emitTransactionAdded({
      transactionId: 0,
      accountId: to_account_id,
      userId: toAccount.user_id,
      type: "credit",
      amount,
      description,
      timestamp: new Date().toISOString(),
    });

    emitBalanceUpdated({
      accountId: from_account_id,
      userId: fromAccount.user_id,
      newBalance: parseFloat(updatedFromAccount!.balance.toString()),
      accountType: fromAccount.account_type as "savings" | "checking",
    });

    emitBalanceUpdated({
      accountId: to_account_id,
      userId: toAccount.user_id,
      newBalance: parseFloat(updatedToAccount!.balance.toString()),
      accountType: toAccount.account_type as "savings" | "checking",
    });

    res.json({
      message: "Transfer completed successfully",
      from_account: updatedFromAccount,
      to_account: updatedToAccount,
    });
  } catch (error) {
    console.error("Transfer error:", error);
    res.status(500).json({ error: "Transfer failed" });
  }
};

// GET /api/cards - Get user's cards
export const handleGetCards: RequestHandler = async (req, res) => {
  try {
    const db = getBankingDatabase();
    const userId = req.user.id;

    const cards = await db.getCardsByUserId(userId);

    // Mask card numbers for security (show only last 4 digits)
    const maskedCards = cards.map((card) => ({
      ...card,
      card_number: `****-****-****-${card.card_number.slice(-4)}`,
    }));

    res.json({ cards: maskedCards });
  } catch (error) {
    console.error("Get cards error:", error);
    res.status(500).json({ error: "Failed to get cards" });
  }
};

// GET /api/admin/users-pending - Get all unverified users for admin review
export const handleGetPendingUsers: RequestHandler = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const db = getBankingDatabase();

    // Get all unverified users
    const pendingUsers = await new Promise<any[]>((resolve, reject) => {
      db.getDatabase().all(
        `SELECT id, email, name, bio, picture, created_at, updated_at
         FROM users
         WHERE email_verified = 0 AND role = 'user'
         ORDER BY created_at DESC`,
        [],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows || []);
          }
        }
      );
    });

    res.json({
      users: pendingUsers,
      total: pendingUsers.length
    });
  } catch (error) {
    console.error("Get pending users error:", error);
    res.status(500).json({ error: "Failed to get pending users" });
  }
};

// POST /api/admin/verify-users - Admin endpoint to verify users and create banking data
export const handleAdminVerifyUser: RequestHandler = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const db = getBankingDatabase();
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: "User ID required" });
    }

    // Get user to verify
    const user = await db.getUserById(user_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Mark user as verified
    await db.markEmailAsVerified(user_id);

    // Create banking accounts for user
    const savingsAccountNumber = db.generateAccountNumber(user_id, "savings");
    const checkingAccountNumber = db.generateAccountNumber(user_id, "checking");

    // Create accounts with initial $5,000 deposit
    const savingsAccountId = await db.createAccount({
      userId: user_id,
      accountNumber: savingsAccountNumber,
      accountType: "savings",
      initialBalance: 5000,
    });

    const checkingAccountId = await db.createAccount({
      userId: user_id,
      accountNumber: checkingAccountNumber,
      accountType: "checking",
      initialBalance: 5000,
    });

    // Create initial deposit transactions
    await db.createTransaction({
      accountId: savingsAccountId,
      type: "credit",
      amount: 5000,
      description: "Initial deposit - Account opening",
    });

    await db.createTransaction({
      accountId: checkingAccountId,
      type: "credit",
      amount: 5000,
      description: "Initial deposit - Account opening",
    });

    // Generate and create user card
    const cardNumber = await db.generateUniqueCardNumber();
    const cardId = await db.createCard({
      userId: user_id,
      cardNumber,
    });

    // Emit real-time events
    const { emitAccountCreated, emitUserVerified } = await import(
      "../socket-events"
    );

    emitAccountCreated({
      userId: user_id,
      accounts: [
        {
          accountId: savingsAccountId,
          accountNumber: savingsAccountNumber,
          accountType: "savings",
          balance: 5000,
        },
        {
          accountId: checkingAccountId,
          accountNumber: checkingAccountNumber,
          accountType: "checking",
          balance: 5000,
        },
      ],
      cards: [
        {
          cardId,
          cardNumber: `****-****-****-${cardNumber.slice(-4)}`,
        },
      ],
    });

    emitUserVerified(user_id, user.email);

    res.json({
      message: "User verified and banking accounts created successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        email_verified: true,
      },
      accounts: [
        {
          id: savingsAccountId,
          account_number: savingsAccountNumber,
          account_type: "savings",
          balance: 5000,
        },
        {
          id: checkingAccountId,
          account_number: checkingAccountNumber,
          account_type: "checking",
          balance: 5000,
        },
      ],
      card: {
        id: cardId,
        card_number: `****-****-****-${cardNumber.slice(-4)}`,
      },
    });
  } catch (error) {
    console.error("Admin verify user error:", error);
    res
      .status(500)
      .json({ error: "Failed to verify user and create accounts" });
  }
};

// Middleware export for authentication
export { authenticateToken };
