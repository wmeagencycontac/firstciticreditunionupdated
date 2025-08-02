import { RequestHandler } from "express";
import {
  DashboardData,
  Account,
  Transaction,
  User,
  AccountSummary,
} from "@shared/api";

// Import mock data (in real app, this would come from database)
const mockUsers: User[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@email.com",
    createdAt: "2024-01-15T09:00:00Z",
  },
];

const mockAccounts: Account[] = [
  {
    id: "acc-1",
    userId: "1",
    accountNumber: "****1234",
    accountType: "checking",
    balance: 5240.5,
    currency: "USD",
    isActive: true,
    createdAt: "2024-01-15T09:00:00Z",
  },
  {
    id: "acc-2",
    userId: "1",
    accountNumber: "****5678",
    accountType: "savings",
    balance: 12890.75,
    currency: "USD",
    isActive: true,
    createdAt: "2024-01-15T09:00:00Z",
  },
];

const mockTransactions: Transaction[] = [
  {
    id: "txn-1",
    accountId: "acc-1",
    type: "debit",
    amount: -45.99,
    description: "Coffee Shop Purchase",
    category: "Food & Dining",
    merchant: "Central Perk Coffee",
    createdAt: "2024-12-30T14:30:00Z",
    status: "completed",
  },
  {
    id: "txn-2",
    accountId: "acc-1",
    type: "credit",
    amount: 2500.0,
    description: "Salary Deposit",
    category: "Income",
    merchant: "ABC Company Inc",
    createdAt: "2024-12-29T09:00:00Z",
    status: "completed",
  },
  {
    id: "txn-3",
    accountId: "acc-1",
    type: "debit",
    amount: -120.0,
    description: "Grocery Shopping",
    category: "Groceries",
    merchant: "Fresh Market",
    createdAt: "2024-12-28T18:45:00Z",
    status: "completed",
  },
  {
    id: "txn-4",
    accountId: "acc-2",
    type: "credit",
    amount: 500.0,
    description: "Transfer from Checking",
    category: "Transfer",
    createdAt: "2024-12-27T16:20:00Z",
    status: "completed",
  },
];

function getUserIdFromToken(authHeader: string | undefined): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.split(" ")[1];
  return token.replace("mock-jwt-token-", "");
}

export const handleGetDashboard: RequestHandler = (req, res) => {
  const userId = getUserIdFromToken(req.headers.authorization);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const user = mockUsers.find((u) => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const userAccounts = mockAccounts.filter((acc) => acc.userId === userId);
  const totalBalance = userAccounts.reduce((sum, acc) => sum + acc.balance, 0);

  // Get recent transactions across all accounts
  const recentActivity = mockTransactions
    .filter((txn) => userAccounts.some((acc) => acc.id === txn.accountId))
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  // Build account summaries
  const accountSummaries: AccountSummary[] = userAccounts.map((account) => {
    const accountTransactions = mockTransactions.filter(
      (txn) => txn.accountId === account.id,
    );
    const recentTransactions = accountTransactions
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 5);

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyTransactions = accountTransactions.filter((txn) => {
      const txnDate = new Date(txn.createdAt);
      return (
        txnDate.getMonth() === currentMonth &&
        txnDate.getFullYear() === currentYear
      );
    });

    const monthlySpending = monthlyTransactions
      .filter((txn) => txn.amount < 0)
      .reduce((sum, txn) => sum + Math.abs(txn.amount), 0);

    const monthlyIncome = monthlyTransactions
      .filter((txn) => txn.amount > 0)
      .reduce((sum, txn) => sum + txn.amount, 0);

    return {
      account,
      recentTransactions,
      monthlySpending,
      monthlyIncome,
    };
  });

  const dashboardData: DashboardData = {
    user,
    accounts: accountSummaries,
    totalBalance,
    recentActivity,
  };

  res.json(dashboardData);
};
