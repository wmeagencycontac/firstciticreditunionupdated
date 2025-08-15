import { createClient } from "@supabase/supabase-js";
import { getEncryptionService, PIIMasking } from "./encryption";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "⚠️ Supabase credentials not found. Some features may not work.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Database Types
export interface BankingUser {
  id: string;
  email: string;
  name: string;
  bio?: string;
  picture?: string;
  phone_number_encrypted?: string;
  ssn_encrypted?: string;
  date_of_birth_encrypted?: string;
  street_encrypted?: string;
  city_encrypted?: string;
  state_encrypted?: string;
  zip_code_encrypted?: string;
  account_type: "personal" | "business";
  email_verified: boolean;
  kyc_status: "pending" | "in_review" | "approved" | "rejected";
  role: "user" | "admin";
  terms_accepted_at?: string;
  privacy_accepted_at?: string;
  marketing_opted_in: boolean;
  account_locked: boolean;
  locked_reason?: string;
  locked_at?: string;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
}

export interface Account {
  id: string;
  user_id: string;
  account_number: string;
  routing_number: string;
  account_type: "checking" | "savings" | "business_checking";
  nickname?: string;
  balance: number;
  available_balance: number;
  pending_balance: number;
  daily_withdrawal_limit: number;
  status: "active" | "suspended" | "closed" | "frozen";
  currency: string;
  opened_date: string;
  closed_date?: string;
  last_activity_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  account_id: string;
  type:
    | "credit"
    | "debit"
    | "transfer_in"
    | "transfer_out"
    | "fee"
    | "interest"
    | "deposit"
    | "withdrawal"
    | "mobile_deposit";
  amount: number;
  balance_after: number;
  description: string;
  category: string;
  merchant_name?: string;
  transfer_id?: string;
  counterparty_account_id?: string;
  counterparty_name?: string;
  external_transaction_id?: string;
  external_provider?: string;
  status:
    | "pending"
    | "processing"
    | "completed"
    | "failed"
    | "cancelled"
    | "reversed";
  pending_until?: string;
  processed_at?: string;
  transaction_location?: any;
  device_fingerprint?: string;
  ip_address?: string;
  timestamp: string;
  created_at: string;
  updated_at: string;
}

export interface Transfer {
  id: string;
  from_account_id: string;
  to_account_id: string;
  amount: number;
  external_account_number?: string;
  external_routing_number?: string;
  external_account_holder?: string;
  memo?: string;
  purpose?: string;
  status: "pending" | "processing" | "completed" | "failed" | "cancelled";
  initiated_by: string;
  approved_by?: string;
  external_reference_id?: string;
  created_at: string;
  updated_at: string;
  processed_at?: string;
}

export interface Card {
  id: string;
  user_id: string;
  account_id: string;
  card_number_encrypted: string;
  card_number_last_four: string;
  card_type: "debit" | "credit";
  card_brand: "visa" | "mastercard" | "amex" | "discover";
  nickname?: string;
  expiry_month: number;
  expiry_year: number;
  status: "active" | "suspended" | "expired" | "lost" | "stolen" | "cancelled";
  daily_limit: number;
  monthly_limit: number;
  pin_hash?: string;
  contactless_enabled: boolean;
  international_enabled: boolean;
  created_at: string;
  updated_at: string;
  activated_at?: string;
  last_used_at?: string;
}

export interface KYCDocument {
  id: string;
  user_id: string;
  document_type:
    | "drivers_license"
    | "passport"
    | "state_id"
    | "selfie"
    | "proof_of_address"
    | "ssn_card";
  file_path_encrypted: string;
  file_hash: string;
  file_size_bytes: number;
  mime_type: string;
  verification_status: "pending" | "verified" | "rejected" | "expired";
  verification_provider?: string;
  verification_reference_id?: string;
  verified_at?: string;
  verified_by?: string;
  rejection_reason?: string;
  rejection_notes?: string;
  expires_at?: string;
  uploaded_at: string;
  created_at: string;
  updated_at: string;
}

export interface MobileDeposit {
  id: string;
  user_id: string;
  account_id: string;
  check_amount: number;
  check_date?: string;
  check_number?: string;
  bank_name?: string;
  front_image_encrypted: string;
  back_image_encrypted: string;
  front_image_hash: string;
  back_image_hash: string;
  status:
    | "pending"
    | "processing"
    | "approved"
    | "rejected"
    | "funds_available";
  processed_by?: string;
  processed_at?: string;
  funds_available_at?: string;
  hold_amount: number;
  hold_release_date?: string;
  rejection_reason?: string;
  rejection_notes?: string;
  transaction_id?: string;
  deposited_at: string;
  created_at: string;
  updated_at: string;
}

// Enhanced service with encryption
export class FusionBankingService {
  private encryption = getEncryptionService();

  /**
   * Create a new banking user with encrypted PII
   */
  async createBankingUser(userData: {
    id: string;
    email: string;
    name: string;
    bio?: string;
    picture?: string;
    phoneNumber: string;
    ssn: string;
    dateOfBirth: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
    };
    accountType: "personal" | "business";
    marketingOptIn?: boolean;
  }): Promise<{ data?: BankingUser; error?: any }> {
    try {
      // Encrypt PII data
      const encryptedData = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        bio: userData.bio,
        picture: userData.picture,
        phone_number_encrypted: this.encryption.encrypt(userData.phoneNumber),
        ssn_encrypted: this.encryption.encrypt(userData.ssn),
        date_of_birth_encrypted: this.encryption.encrypt(userData.dateOfBirth),
        street_encrypted: this.encryption.encrypt(userData.address.street),
        city_encrypted: this.encryption.encrypt(userData.address.city),
        state_encrypted: this.encryption.encrypt(userData.address.state),
        zip_code_encrypted: this.encryption.encrypt(userData.address.zipCode),
        account_type: userData.accountType,
        email_verified: false,
        kyc_status: "pending" as const,
        role: "user" as const,
        terms_accepted_at: new Date().toISOString(),
        privacy_accepted_at: new Date().toISOString(),
        marketing_opted_in: userData.marketingOptIn || false,
        account_locked: false,
      };

      const { data, error } = await supabaseAdmin
        .from("banking_users")
        .insert(encryptedData)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { error };
    }
  }

  /**
   * Get banking user with decrypted PII (admin only)
   */
  async getBankingUserDecrypted(
    userId: string,
  ): Promise<{ data?: any; error?: any }> {
    try {
      const { data, error } = await supabaseAdmin
        .from("banking_users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error || !data) {
        return { error };
      }

      // Decrypt PII data for admin access
      const decryptedUser = {
        ...data,
        phoneNumber: data.phone_number_encrypted
          ? this.encryption.decrypt(data.phone_number_encrypted)
          : null,
        ssn: data.ssn_encrypted
          ? this.encryption.decrypt(data.ssn_encrypted)
          : null,
        dateOfBirth: data.date_of_birth_encrypted
          ? this.encryption.decrypt(data.date_of_birth_encrypted)
          : null,
        address: {
          street: data.street_encrypted
            ? this.encryption.decrypt(data.street_encrypted)
            : null,
          city: data.city_encrypted
            ? this.encryption.decrypt(data.city_encrypted)
            : null,
          state: data.state_encrypted
            ? this.encryption.decrypt(data.state_encrypted)
            : null,
          zipCode: data.zip_code_encrypted
            ? this.encryption.decrypt(data.zip_code_encrypted)
            : null,
        },
      };

      return { data: decryptedUser };
    } catch (error) {
      return { error };
    }
  }

  /**
   * Get banking user with masked PII (for regular user display)
   */
  async getBankingUserMasked(
    userId: string,
  ): Promise<{ data?: any; error?: any }> {
    try {
      const { data, error } = await supabaseAdmin
        .from("banking_users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error || !data) {
        return { error };
      }

      // Decrypt and then mask PII data for user display
      const phoneNumber = data.phone_number_encrypted
        ? this.encryption.decrypt(data.phone_number_encrypted)
        : "";
      const ssn = data.ssn_encrypted
        ? this.encryption.decrypt(data.ssn_encrypted)
        : "";
      const dateOfBirth = data.date_of_birth_encrypted
        ? this.encryption.decrypt(data.date_of_birth_encrypted)
        : "";
      const street = data.street_encrypted
        ? this.encryption.decrypt(data.street_encrypted)
        : "";
      const city = data.city_encrypted
        ? this.encryption.decrypt(data.city_encrypted)
        : "";
      const state = data.state_encrypted
        ? this.encryption.decrypt(data.state_encrypted)
        : "";
      const zipCode = data.zip_code_encrypted
        ? this.encryption.decrypt(data.zip_code_encrypted)
        : "";

      const maskedUser = {
        ...data,
        phoneNumber: PIIMasking.phoneNumber(phoneNumber),
        ssn: PIIMasking.ssn(ssn),
        dateOfBirth: PIIMasking.dateOfBirth(dateOfBirth),
        address: PIIMasking.address({ street, city, state, zipCode }),
      };

      return { data: maskedUser };
    } catch (error) {
      return { error };
    }
  }

  /**
   * Create initial checking account for new user
   */
  async createInitialAccount(
    userId: string,
    accountType: "checking" | "savings" = "checking",
  ): Promise<{ data?: Account; error?: any }> {
    try {
      // Generate unique account number
      const { data: accountNumber, error: accountNumberError } =
        await supabaseAdmin.rpc("generate_account_number", {
          user_id_input: userId,
          account_type_input: accountType,
        });

      if (accountNumberError || !accountNumber) {
        return {
          error: accountNumberError || "Failed to generate account number",
        };
      }

      const accountData = {
        user_id: userId,
        account_number: accountNumber,
        routing_number: "031100209", // Fusion Bank routing number
        account_type: accountType,
        nickname:
          accountType === "checking" ? "Primary Checking" : "Primary Savings",
        balance: 0.0,
        available_balance: 0.0,
        pending_balance: 0.0,
        daily_withdrawal_limit: accountType === "checking" ? 500.0 : 250.0,
        status: "active" as const,
        currency: "USD",
        opened_date: new Date().toISOString().split("T")[0],
      };

      const { data, error } = await supabaseAdmin
        .from("accounts")
        .insert(accountData)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { error };
    }
  }

  /**
   * Create a transaction with proper balance updates
   */
  async createTransaction(transactionData: {
    accountId: string;
    type: Transaction["type"];
    amount: number;
    description: string;
    category?: string;
    merchantName?: string;
    counterpartyName?: string;
    externalTransactionId?: string;
    externalProvider?: string;
    deviceFingerprint?: string;
    ipAddress?: string;
  }): Promise<{ data?: Transaction; error?: any }> {
    try {
      // Get current account balance
      const { data: account, error: accountError } = await supabaseAdmin
        .from("accounts")
        .select("balance")
        .eq("id", transactionData.accountId)
        .single();

      if (accountError || !account) {
        return { error: accountError || "Account not found" };
      }

      // Calculate new balance
      let newBalance = account.balance;
      if (
        ["credit", "deposit", "transfer_in", "interest"].includes(
          transactionData.type,
        )
      ) {
        newBalance += transactionData.amount;
      } else if (
        ["debit", "withdrawal", "transfer_out", "fee"].includes(
          transactionData.type,
        )
      ) {
        newBalance -= transactionData.amount;
      }

      const transaction = {
        account_id: transactionData.accountId,
        type: transactionData.type,
        amount: transactionData.amount,
        balance_after: newBalance,
        description: transactionData.description,
        category: transactionData.category || "other",
        merchant_name: transactionData.merchantName,
        counterparty_name: transactionData.counterpartyName,
        external_transaction_id: transactionData.externalTransactionId,
        external_provider: transactionData.externalProvider,
        status: "completed" as const,
        device_fingerprint: transactionData.deviceFingerprint,
        ip_address: transactionData.ipAddress,
        timestamp: new Date().toISOString(),
        processed_at: new Date().toISOString(),
      };

      const { data, error } = await supabaseAdmin
        .from("transactions")
        .insert(transaction)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { error };
    }
  }

  /**
   * Encrypt and store KYC document
   */
  async storeKYCDocument(documentData: {
    userId: string;
    documentType: KYCDocument["document_type"];
    filePath: string;
    fileHash: string;
    fileSizeBytes: number;
    mimeType: string;
  }): Promise<{ data?: KYCDocument; error?: any }> {
    try {
      const encryptedDocument = {
        user_id: documentData.userId,
        document_type: documentData.documentType,
        file_path_encrypted: this.encryption.encrypt(documentData.filePath),
        file_hash: documentData.fileHash,
        file_size_bytes: documentData.fileSizeBytes,
        mime_type: documentData.mimeType,
        verification_status: "pending" as const,
        uploaded_at: new Date().toISOString(),
      };

      const { data, error } = await supabaseAdmin
        .from("kyc_documents")
        .insert(encryptedDocument)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { error };
    }
  }

  /**
   * Admin function to verify KYC documents
   */
  async verifyKYCDocument(
    documentId: string,
    adminId: string,
    status: "verified" | "rejected",
    notes?: string,
  ): Promise<{ error?: any }> {
    try {
      const updateData: any = {
        verification_status: status,
        verified_at: new Date().toISOString(),
        verified_by: adminId,
        updated_at: new Date().toISOString(),
      };

      if (status === "rejected" && notes) {
        updateData.rejection_reason = notes;
        updateData.rejection_notes = notes;
      }

      const { error } = await supabaseAdmin
        .from("kyc_documents")
        .update(updateData)
        .eq("id", documentId);

      return { error };
    } catch (error) {
      return { error };
    }
  }

  /**
   * Log admin actions for audit trail
   */
  async logAdminAction(actionData: {
    adminId: string;
    action: string;
    resourceType: string;
    resourceId?: string;
    oldValues?: any;
    newValues?: any;
    targetUserId?: string;
    ipAddress?: string;
    userAgent?: string;
    sessionId?: string;
  }): Promise<{ error?: any }> {
    try {
      const auditLog = {
        admin_id: actionData.adminId,
        action: actionData.action,
        resource_type: actionData.resourceType,
        resource_id: actionData.resourceId,
        old_values: actionData.oldValues,
        new_values: actionData.newValues,
        target_user_id: actionData.targetUserId,
        ip_address: actionData.ipAddress,
        user_agent: actionData.userAgent,
        session_id: actionData.sessionId,
        timestamp: new Date().toISOString(),
      };

      const { error } = await supabaseAdmin
        .from("admin_audit_log")
        .insert(auditLog);

      return { error };
    } catch (error) {
      return { error };
    }
  }
}

// Singleton instance
let fusionBankingService: FusionBankingService | null = null;

export function getFusionBankingService(): FusionBankingService {
  if (!fusionBankingService) {
    fusionBankingService = new FusionBankingService();
  }
  return fusionBankingService;
}

// Simple health check function
export async function checkSupabaseConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("banking_users")
      .select("count");
    return !error;
  } catch (error) {
    console.error("Supabase connection error:", error);
    return false;
  }
}
