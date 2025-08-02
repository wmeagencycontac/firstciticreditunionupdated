import { RequestHandler } from "express";
import { Account, Transaction, AccountSummary } from "@shared/api";

// Mock account data
const mockAccounts: Account[] = [
  {
    id: "acc-1",
    userId: "1",
    accountNumber: "****1234",
    accountType: "checking",
    balance: 5240.50,
    currency: "USD",
    isActive: true,
    createdAt: "2024-01-15T09:00:00Z"
  },
  {
    id: "acc-2",
    userId: "1", 
    accountNumber: "****5678",
    accountType: "savings",
    balance: 12890.75,
    currency: "USD",
    isActive: true,
    createdAt: "2024-01-15T09:00:00Z"
  },
  {
    id: "acc-3",
    userId: "2",
    accountNumber: "****9876",
    accountType: "checking", 
    balance: 3456.80,
    currency: "USD",
    isActive: true,
    createdAt: "2024-02-20T10:30:00Z"
  }
];

// Mock transaction data
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
    status: "completed"
  },
  {
    id: "txn-2", 
    accountId: "acc-1",
    type: "credit",
    amount: 2500.00,
    description: "Salary Deposit",
    category: "Income",
    merchant: "ABC Company Inc",
    createdAt: "2024-12-29T09:00:00Z",
    status: "completed"
  },
  {
    id: "txn-3",
    accountId: "acc-1", 
    type: "debit",
    amount: -120.00,
    description: "Grocery Shopping",
    category: "Groceries",
    merchant: "Fresh Market",
    createdAt: "2024-12-28T18:45:00Z",
    status: "completed"
  },
  {
    id: "txn-4",
    accountId: "acc-2",
    type: "credit", 
    amount: 500.00,
    description: "Transfer from Checking",
    category: "Transfer",
    createdAt: "2024-12-27T16:20:00Z",
    status: "completed"
  },
  {
    id: "txn-5",
    accountId: "acc-1",
    type: "debit",
    amount: -89.50,
    description: "Utility Bill",
    category: "Bills & Utilities", 
    merchant: "City Electric",
    createdAt: "2024-12-26T12:00:00Z",
    status: "completed"
  }
];

function getUserIdFromToken(authHeader: string | undefined): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  return token.replace('mock-jwt-token-', '');
}

export const handleGetAccounts: RequestHandler = (req, res) => {
  const userId = getUserIdFromToken(req.headers.authorization);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userAccounts = mockAccounts.filter(acc => acc.userId === userId);
  res.json(userAccounts);
};

export const handleGetAccountDetails: RequestHandler = (req, res) => {
  const userId = getUserIdFromToken(req.headers.authorization);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { accountId } = req.params;
  const account = mockAccounts.find(acc => acc.id === accountId && acc.userId === userId);
  
  if (!account) {
    return res.status(404).json({ error: "Account not found" });
  }

  const transactions = mockTransactions
    .filter(txn => txn.accountId === accountId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyTransactions = transactions.filter(txn => {
    const txnDate = new Date(txn.createdAt);
    return txnDate.getMonth() === currentMonth && txnDate.getFullYear() === currentYear;
  });

  const monthlySpending = monthlyTransactions
    .filter(txn => txn.amount < 0)
    .reduce((sum, txn) => sum + Math.abs(txn.amount), 0);

  const monthlyIncome = monthlyTransactions
    .filter(txn => txn.amount > 0)
    .reduce((sum, txn) => sum + txn.amount, 0);

  const accountSummary: AccountSummary = {
    account,
    recentTransactions: transactions.slice(0, 10),
    monthlySpending,
    monthlyIncome
  };

  res.json(accountSummary);
};

export const handleGetTransactions: RequestHandler = (req, res) => {
  const userId = getUserIdFromToken(req.headers.authorization);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { accountId } = req.params;
  const account = mockAccounts.find(acc => acc.id === accountId && acc.userId === userId);
  
  if (!account) {
    return res.status(404).json({ error: "Account not found" });
  }

  const transactions = mockTransactions
    .filter(txn => txn.accountId === accountId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  res.json(transactions);
};
