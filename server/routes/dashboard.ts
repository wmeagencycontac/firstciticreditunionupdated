import { RequestHandler } from "express";
import { getBankingDatabase } from "../banking-database";
import {
  DashboardData,
  AccountSummary,
} from "@shared/api";

export const handleGetDashboard: RequestHandler = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const db = getBankingDatabase();

    // Get session and user info
    const session = await db.getSessionByToken(token);
    if (!session) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    // Get user accounts
    const accounts = await db.getAccountsByUserId(session.user_id);
    if (accounts.length === 0) {
      return res.status(404).json({ error: "No accounts found for user" });
    }

    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

    // Get recent transactions across all accounts
    const allTransactions = await db.getTransactionsByUserId(session.user_id, 20);
    const recentActivity = allTransactions.slice(0, 5);

    // Build account summaries
    const accountSummaries: AccountSummary[] = [];

    for (const account of accounts) {
      const accountTransactions = await db.getTransactionsByAccountId(account.id, 10);

      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      const monthlyTransactions = accountTransactions.filter((txn) => {
        const txnDate = new Date(txn.timestamp);
        return (
          txnDate.getMonth() === currentMonth &&
          txnDate.getFullYear() === currentYear
        );
      });

      const monthlySpending = monthlyTransactions
        .filter((txn) => txn.type === "debit")
        .reduce((sum, txn) => sum + txn.amount, 0);

      const monthlyIncome = monthlyTransactions
        .filter((txn) => txn.type === "credit")
        .reduce((sum, txn) => sum + txn.amount, 0);

      // Transform account to match frontend expectations
      const transformedAccount = {
        id: account.id.toString(),
        userId: account.user_id.toString(),
        accountNumber: `****${account.account_number.slice(-4)}`,
        accountType: account.account_type as "checking" | "savings",
        balance: account.balance,
        currency: account.currency,
        isActive: true,
        createdAt: account.created_at,
      };

      // Transform transactions to match frontend expectations
      const transformedTransactions = accountTransactions.map(txn => ({
        id: txn.id.toString(),
        accountId: txn.account_id.toString(),
        type: txn.type,
        amount: txn.type === "debit" ? -txn.amount : txn.amount,
        description: txn.description,
        category: "General",
        merchant: txn.description.split(" ")[0],
        createdAt: txn.timestamp,
        status: "completed" as const,
      }));

      accountSummaries.push({
        account: transformedAccount,
        recentTransactions: transformedTransactions,
        monthlySpending,
        monthlyIncome,
      });
    }

    // Transform user data to match frontend expectations
    const user = {
      id: session.user_id.toString(),
      firstName: session.name.split(" ")[0] || session.name,
      lastName: session.name.split(" ")[1] || "",
      email: session.email,
      createdAt: session.created_at || new Date().toISOString(),
    };

    // Transform recent activity to match frontend expectations
    const transformedRecentActivity = recentActivity.map(txn => ({
      id: txn.id.toString(),
      accountId: txn.account_id.toString(),
      type: txn.type,
      amount: txn.type === "debit" ? -txn.amount : txn.amount,
      description: txn.description,
      category: "General",
      merchant: txn.description.split(" ")[0],
      createdAt: txn.timestamp,
      status: "completed" as const,
    }));

    const dashboardData: DashboardData = {
      user,
      accounts: accountSummaries,
      totalBalance,
      recentActivity: transformedRecentActivity,
    };

    res.json(dashboardData);
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
};
