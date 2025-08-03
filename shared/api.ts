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

export interface RegistrationRequest {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  ssn: string;

  // Address Information
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;

  // Account Selection
  accountType: "personal" | "business" | "investment";
  initialDeposit: string;

  // Business Information (optional)
  businessName?: string;
  businessType?: string;
  ein?: string;
  businessAddress?: string;

  // Identity Verification
  documentType: "drivers_license" | "passport" | "state_id";
  documentNumber: string;
  documentExpiry: string;

  // Security
  password: string;
  confirmPassword: string;

  // Legal
  agreeToTerms: boolean;
  agreeToPrivacy: boolean;
  optInMarketing: boolean;
}

export interface RegistrationResponse {
  user: User;
  message: string;
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

/**
 * OTP Authentication Types
 */

export interface OTPRequestRequest {
  email: string;
}

export interface OTPRequestResponse {
  message: string;
}

export interface OTPVerifyRequest {
  email: string;
  code: string;
}

export interface OTPVerifyResponse {
  success: boolean;
  user_id: number;
  message?: string;
}

export interface OTPUser {
  id: number;
  email: string;
}

export interface OTPRecord {
  id: string;
  user_id: number;
  otp_hash: string;
  expires_at: number;
  failed_attempts: number;
  used: number;
}

/**
 * Enhanced Registration with Profile Upload Types
 */

export interface EnhancedRegistrationRequest {
  name: string;
  email: string;
  bio?: string;
  password?: string;
  confirmPassword?: string;
}

export interface EnhancedRegistrationResponse {
  message: string;
  userId?: number;
}

export interface EmailVerificationRequest {
  token: string;
}

export interface EmailVerificationResponse {
  message: string;
  success: boolean;
}

export interface NetlifyWebhookPayload {
  name: string;
  email: string;
  bio?: string;
  picture?: string;
  registered_at: string;
}

export interface EnhancedUser {
  id: number;
  email: string;
  name: string;
  bio?: string;
  picture?: string;
  email_verified: boolean;
  role: string;
  created_at: string;
  updated_at: string;
}
