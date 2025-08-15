/**
 * Zod schemas for data validation across the application
 * These schemas serve as the single source of truth for data models
 */

import { z } from "zod";

// Base user schema
export const UserSchema = z.object({
  id: z.union([z.string(), z.number()]),
  email: z.string().email("Invalid email address"),
  name: z.string().min(1, "Name is required"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email_verified: z.boolean(),
  role: z.enum(["user", "admin"]),
  created_at: z.string(),
  updated_at: z.string(),
  password_hash: z.string().optional(),
});

// Banking user schema (extended)
export const BankingUserSchema = UserSchema.extend({
  bio: z.string().optional(),
  picture: z.string().url().optional(),
  phone_number_encrypted: z.string().optional(),
  ssn_encrypted: z.string().optional(),
  date_of_birth_encrypted: z.string().optional(),
  street_encrypted: z.string().optional(),
  city_encrypted: z.string().optional(),
  state_encrypted: z.string().optional(),
  zip_code_encrypted: z.string().optional(),
  account_type: z.enum(["personal", "business"]),
  kyc_status: z.enum(["pending", "in_review", "approved", "rejected"]),
  terms_accepted_at: z.string().optional(),
  privacy_accepted_at: z.string().optional(),
  marketing_opted_in: z.boolean(),
  account_locked: z.boolean(),
  locked_reason: z.string().optional(),
  locked_at: z.string().optional(),
  last_login_at: z.string().optional(),
});

// Account schema
export const AccountSchema = z.object({
  id: z.union([z.string(), z.number()]),
  user_id: z.union([z.string(), z.number()]),
  account_number: z.string().min(1, "Account number is required"),
  account_type: z.enum(["checking", "savings", "business_checking"]),
  balance: z.number().min(0, "Balance cannot be negative"),
  currency: z.string().default("USD"),
  routing_number: z.string().min(9, "Invalid routing number"),
  created_at: z.string(),
  updated_at: z.string(),
  nickname: z.string().optional(),
  available_balance: z.number().optional(),
  pending_balance: z.number().optional(),
  daily_withdrawal_limit: z.number().optional(),
  status: z.enum(["active", "inactive", "suspended", "closed", "frozen"]).default("active"),
  opened_date: z.string().optional(),
  closed_date: z.string().optional(),
  last_activity_date: z.string().optional(),
});

// Transaction schema
export const TransactionSchema = z.object({
  id: z.union([z.string(), z.number()]),
  account_id: z.union([z.string(), z.number()]),
  type: z.enum([
    "debit",
    "credit",
    "transfer",
    "transfer_in",
    "transfer_out",
    "fee",
    "interest",
    "deposit",
    "withdrawal",
    "mobile_deposit"
  ]),
  amount: z.number().positive("Amount must be positive"),
  description: z.string().min(1, "Description is required"),
  timestamp: z.string(),
  category: z.string().optional(),
  merchant: z.string().optional(),
  status: z.enum(["pending", "processing", "completed", "failed", "cancelled", "reversed"]).default("completed"),
  createdAt: z.string().optional(),
  balance_after: z.number().optional(),
  merchant_name: z.string().optional(),
  counterparty_name: z.string().optional(),
  external_transaction_id: z.string().optional(),
  external_provider: z.string().optional(),
  device_fingerprint: z.string().optional(),
  ip_address: z.string().optional(),
  processed_at: z.string().optional(),
});

// Card schema (CVV removed for security)
export const CardSchema = z.object({
  id: z.union([z.string(), z.number()]),
  user_id: z.union([z.string(), z.number()]),
  account_id: z.union([z.string(), z.number()]).optional(),
  card_number: z.string().min(13, "Invalid card number"),
  card_number_last_four: z.string().length(4, "Last four digits required"),
  card_type: z.enum(["debit", "credit"]),
  card_brand: z.enum(["visa", "mastercard", "amex", "discover"]).optional(),
  status: z.enum(["active", "inactive", "blocked", "expired", "lost", "stolen", "cancelled"]),
  expiry_month: z.number().min(1).max(12),
  expiry_year: z.number().min(new Date().getFullYear()),
  created_at: z.string(),
  nickname: z.string().optional(),
  daily_limit: z.number().positive().optional(),
  monthly_limit: z.number().positive().optional(),
  contactless_enabled: z.boolean().optional(),
  international_enabled: z.boolean().optional(),
  activated_at: z.string().optional(),
  last_used_at: z.string().optional(),
});

// Transfer schema
export const TransferSchema = z.object({
  from_account_id: z.union([z.string(), z.number()]),
  to_account_id: z.union([z.string(), z.number()]),
  amount: z.number().positive("Amount must be positive"),
  description: z.string().min(1, "Description is required"),
  external_account_number: z.string().optional(),
  external_routing_number: z.string().optional(),
  external_account_holder: z.string().optional(),
  memo: z.string().optional(),
  purpose: z.string().optional(),
});

// Authentication schemas
export const LoginRequestSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const LoginResponseSchema = z.object({
  user: UserSchema,
  token: z.string(),
});

// Registration schema
export const RegistrationRequestSchema = z.object({
  // Personal Information
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Invalid phone number"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  ssn: z.string().min(9, "Invalid SSN"),

  // Address Information
  street: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(5, "Invalid ZIP code"),
  country: z.string().default("US"),

  // Account Selection
  accountType: z.enum(["personal", "business", "investment"]),
  initialDeposit: z.string().min(1, "Initial deposit is required"),

  // Business Information (optional)
  businessName: z.string().optional(),
  businessType: z.string().optional(),
  ein: z.string().optional(),
  businessAddress: z.string().optional(),

  // Identity Verification
  documentType: z.enum(["drivers_license", "passport", "state_id"]),
  documentNumber: z.string().min(1, "Document number is required"),
  documentExpiry: z.string().min(1, "Document expiry is required"),

  // Security
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password confirmation is required"),

  // Legal
  agreeToTerms: z.boolean().refine(val => val === true, "You must agree to the terms"),
  agreeToPrivacy: z.boolean().refine(val => val === true, "You must agree to the privacy policy"),
  optInMarketing: z.boolean(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// OTP schemas
export const OTPRequestSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const OTPVerifySchema = z.object({
  email: z.string().email("Invalid email address"),
  code: z.string().length(6, "OTP code must be 6 digits"),
});

// Transaction filters
export const TransactionFiltersSchema = z.object({
  search: z.string().optional(),
  type: z.enum(["all", "debit", "credit", "transfer"]).optional(),
  status: z.enum(["all", "pending", "completed", "failed"]).optional(),
  category: z.string().optional(),
  amountRange: z.enum(["all", "under-50", "50-200", "200-1000", "over-1000"]).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  sortBy: z.enum(["date", "amount"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

// Dashboard schemas
export const DashboardDataSchema = z.object({
  user: BankingUserSchema,
  accounts: z.array(AccountSchema.extend({
    recent_transactions: z.array(TransactionSchema),
  })),
  totalBalance: z.number(),
  recentActivity: z.array(TransactionSchema),
});

// Admin schemas
export const AdminVerifyUserRequestSchema = z.object({
  user_id: z.union([z.string(), z.number()]),
});

export const AdminDashboardStatsSchema = z.object({
  totalUsers: z.number(),
  pendingUsers: z.number(),
  totalAccounts: z.number(),
  totalBalance: z.number(),
  dailyTransactions: z.number(),
  activeCards: z.number(),
});

// Response schemas
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  error: z.string().optional(),
  data: z.any().optional(),
});

export const PaginatedResponseSchema = z.object({
  items: z.array(z.any()),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

// Email verification
export const EmailVerificationSchema = z.object({
  token: z.string().min(1, "Verification token is required"),
});

// Enhanced registration for Supabase
export const EnhancedRegistrationRequestSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  bio: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
  confirmPassword: z.string().min(8, "Password confirmation is required").optional(),
}).refine(data => !data.password || data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Type exports for use in TypeScript
export type User = z.infer<typeof UserSchema>;
export type BankingUser = z.infer<typeof BankingUserSchema>;
export type Account = z.infer<typeof AccountSchema>;
export type Transaction = z.infer<typeof TransactionSchema>;
export type Card = z.infer<typeof CardSchema>;
export type TransferRequest = z.infer<typeof TransferSchema>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type RegistrationRequest = z.infer<typeof RegistrationRequestSchema>;
export type OTPRequest = z.infer<typeof OTPRequestSchema>;
export type OTPVerify = z.infer<typeof OTPVerifySchema>;
export type TransactionFilters = z.infer<typeof TransactionFiltersSchema>;
export type DashboardData = z.infer<typeof DashboardDataSchema>;
export type AdminVerifyUserRequest = z.infer<typeof AdminVerifyUserRequestSchema>;
export type AdminDashboardStats = z.infer<typeof AdminDashboardStatsSchema>;
export type ApiResponse = z.infer<typeof ApiResponseSchema>;
export type PaginatedResponse = z.infer<typeof PaginatedResponseSchema>;
export type EmailVerification = z.infer<typeof EmailVerificationSchema>;
export type EnhancedRegistrationRequest = z.infer<typeof EnhancedRegistrationRequestSchema>;

// Validation helper functions
export const validateSchema = <T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } => {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      return { success: false, error: firstError.message };
    }
    return { success: false, error: "Validation failed" };
  }
};

export const safeParseSchema = <T>(schema: z.ZodSchema<T>, data: unknown) => {
  return schema.safeParse(data);
};
