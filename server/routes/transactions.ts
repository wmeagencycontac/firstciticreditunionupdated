import { RequestHandler } from "express";
import { Transaction } from "@shared/api";

// Extended mock transaction data for comprehensive testing
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
  {
    id: "txn-5",
    accountId: "acc-1",
    type: "debit",
    amount: -85.50,
    description: "Gas Station",
    category: "Transportation",
    merchant: "Shell Gas Station",
    createdAt: "2024-12-26T11:15:00Z",
    status: "completed",
  },
  {
    id: "txn-6",
    accountId: "acc-1",
    type: "debit",
    amount: -25.00,
    description: "Streaming Service",
    category: "Entertainment",
    merchant: "Netflix",
    createdAt: "2024-12-25T00:00:00Z",
    status: "completed",
  },
  {
    id: "txn-7",
    accountId: "acc-2",
    type: "credit",
    amount: 1200.0,
    description: "Investment Dividend",
    category: "Investment",
    merchant: "Vanguard",
    createdAt: "2024-12-24T12:00:00Z",
    status: "completed",
  },
  {
    id: "txn-8",
    accountId: "acc-1",
    type: "debit",
    amount: -150.75,
    description: "Electric Bill",
    category: "Utilities",
    merchant: "Edison Electric",
    createdAt: "2024-12-23T16:30:00Z",
    status: "completed",
  },
  {
    id: "txn-9",
    accountId: "acc-1",
    type: "debit",
    amount: -89.99,
    description: "Online Shopping",
    category: "Shopping",
    merchant: "Amazon",
    createdAt: "2024-12-22T20:15:00Z",
    status: "completed",
  },
  {
    id: "txn-10",
    accountId: "acc-1",
    type: "debit",
    amount: -35.00,
    description: "ATM Withdrawal",
    category: "ATM",
    merchant: "Chase ATM",
    createdAt: "2024-12-21T14:45:00Z",
    status: "completed",
  },
  {
    id: "txn-11",
    accountId: "acc-1",
    type: "credit",
    amount: 75.00,
    description: "Cashback Reward",
    category: "Rewards",
    merchant: "Credit Card Rewards",
    createdAt: "2024-12-20T10:00:00Z",
    status: "completed",
  },
  {
    id: "txn-12",
    accountId: "acc-1",
    type: "debit",
    amount: -220.00,
    description: "Medical Appointment",
    category: "Healthcare",
    merchant: "Dr. Smith Clinic",
    createdAt: "2024-12-19T09:30:00Z",
    status: "completed",
  },
  {
    id: "txn-13",
    accountId: "acc-1",
    type: "debit",
    amount: -12.50,
    description: "Food Delivery",
    category: "Food & Dining",
    merchant: "DoorDash",
    createdAt: "2024-12-18T19:20:00Z",
    status: "completed",
  },
  {
    id: "txn-14",
    accountId: "acc-2",
    type: "transfer",
    amount: -300.0,
    description: "Transfer to Checking",
    category: "Transfer",
    createdAt: "2024-12-17T11:00:00Z",
    status: "completed",
  },
  {
    id: "txn-15",
    accountId: "acc-1",
    type: "transfer",
    amount: 300.0,
    description: "Transfer from Savings",
    category: "Transfer",
    createdAt: "2024-12-17T11:00:00Z",
    status: "completed",
  },
  {
    id: "txn-16",
    accountId: "acc-1",
    type: "debit",
    amount: -55.00,
    description: "Phone Bill",
    category: "Utilities",
    merchant: "Verizon",
    createdAt: "2024-12-16T15:00:00Z",
    status: "completed",
  },
  {
    id: "txn-17",
    accountId: "acc-1",
    type: "debit",
    amount: -180.00,
    description: "Car Insurance",
    category: "Insurance",
    merchant: "State Farm",
    createdAt: "2024-12-15T08:00:00Z",
    status: "completed",
  },
  {
    id: "txn-18",
    accountId: "acc-1",
    type: "debit",
    amount: -45.99,
    description: "Gym Membership",
    category: "Health & Fitness",
    merchant: "Planet Fitness",
    createdAt: "2024-12-14T06:00:00Z",
    status: "completed",
  },
  {
    id: "txn-19",
    accountId: "acc-1",
    type: "credit",
    amount: 50.00,
    description: "Refund",
    category: "Refund",
    merchant: "Best Buy",
    createdAt: "2024-12-13T13:30:00Z",
    status: "completed",
  },
  {
    id: "txn-20",
    accountId: "acc-1",
    type: "debit",
    amount: -15.99,
    description: "Subscription",
    category: "Entertainment",
    merchant: "Spotify",
    createdAt: "2024-12-12T12:00:00Z",
    status: "completed",
  },
  // Add some pending transactions
  {
    id: "txn-21",
    accountId: "acc-1",
    type: "debit",
    amount: -99.99,
    description: "Pending Online Purchase",
    category: "Shopping",
    merchant: "Best Buy",
    createdAt: "2024-12-30T20:00:00Z",
    status: "pending",
  },
  {
    id: "txn-22",
    accountId: "acc-1",
    type: "credit",
    amount: 1500.0,
    description: "Pending Deposit",
    category: "Income",
    merchant: "Freelance Client",
    createdAt: "2024-12-30T19:30:00Z",
    status: "pending",
  },
  // Add a failed transaction
  {
    id: "txn-23",
    accountId: "acc-1",
    type: "debit",
    amount: -250.0,
    description: "Failed Payment",
    category: "Shopping",
    merchant: "Online Store",
    createdAt: "2024-12-30T18:00:00Z",
    status: "failed",
  },
];

function getUserIdFromToken(authHeader: string | undefined): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.split(" ")[1];
  return token.replace("mock-jwt-token-", "");
}

export const handleGetTransactions: RequestHandler = (req, res) => {
  const userId = getUserIdFromToken(req.headers.authorization);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // In a real app, you would filter by user's accounts
  // For demo purposes, return all mock transactions
  const userTransactions = mockTransactions.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  res.json(userTransactions);
};

export const handleCreateTransaction: RequestHandler = (req, res) => {
  const userId = getUserIdFromToken(req.headers.authorization);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { accountId, type, amount, description, category, merchant } = req.body;

  if (!accountId || !type || !amount || !description || !category) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const newTransaction: Transaction = {
    id: `txn-${Date.now()}`,
    accountId,
    type,
    amount,
    description,
    category,
    merchant,
    createdAt: new Date().toISOString(),
    status: "completed",
  };

  mockTransactions.unshift(newTransaction);

  res.status(201).json(newTransaction);
};
