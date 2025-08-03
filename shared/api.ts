/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Banking API Types
 */

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

export interface Account {
  id: string;
  userId: string;
  accountNumber: string;
  accountType: "checking" | "savings" | "credit";
  balance: number;
  currency: string;
  isActive: boolean;
  createdAt: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  type: "debit" | "credit" | "transfer";
  amount: number;
  description: string;
  category: string;
  merchant?: string;
  createdAt: string;
  status: "pending" | "completed" | "failed";
}

export interface TransferRequest {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  description: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface AccountSummary {
  account: Account;
  recentTransactions: Transaction[];
  monthlySpending: number;
  monthlyIncome: number;
}

export interface DashboardData {
  user: User;
  accounts: AccountSummary[];
  totalBalance: number;
  recentActivity: Transaction[];
}

export interface TransactionFilters {
  search?: string;
  type?: "all" | "debit" | "credit" | "transfer";
  status?: "all" | "pending" | "completed" | "failed";
  category?: string;
  amountRange?: "all" | "under-50" | "50-200" | "200-1000" | "over-1000";
  dateFrom?: string;
  dateTo?: string;
  sortBy?: "date" | "amount";
  sortOrder?: "asc" | "desc";
}

export interface TransactionResponse {
  transactions: Transaction[];
  total: number;
  page: number;
  limit: number;
}
