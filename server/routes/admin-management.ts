import { RequestHandler } from "express";
import { z } from "zod";
import { supabaseAdmin } from "../supabase-enhanced";
import { getSecureBankingService } from "../supabase-enhanced";

// Validation schemas
const lockUserSchema = z.object({
  reason: z.string().optional(),
});

const updateBalanceSchema = z.object({
  newBalance: z.number().min(0),
  reason: z.string().min(1, "Reason is required"),
});

const kycActionSchema = z.object({
  notes: z.string().optional(),
});

// Middleware to verify admin access
export const requireAdmin: RequestHandler = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No authorization header" });
    }

    const token = authHeader.split(" ")[1];
    
    // Verify admin user (you would implement your own admin auth)
    const adminId = req.user?.id; // Assuming you have user from middleware
    
    if (!adminId) {
      return res.status(401).json({ error: "Admin authentication required" });
    }

    const { data: adminUser, error } = await supabaseAdmin
      .from('banking_users')
      .select('role')
      .eq('id', adminId)
      .single();

    if (error || !adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ error: "Admin access required" });
    }

    next();
  } catch (error) {
    console.error("Admin auth middleware error:", error);
    res.status(500).json({ error: "Authentication error" });
  }
};

/**
 * Get dashboard statistics
 */
export const getDashboardStats: RequestHandler = async (req, res) => {
  try {
    const secureBankingService = getSecureBankingService();

    // Get user count
    const { count: totalUsers, error: usersError } = await supabaseAdmin
      .from('banking_users')
      .select('*', { count: 'exact', head: true });

    // Get pending KYC count
    const { count: pendingKyc, error: kycError } = await supabaseAdmin
      .from('banking_users')
      .select('*', { count: 'exact', head: true })
      .eq('kyc_status', 'pending');

    // Get locked accounts count
    const { count: lockedAccounts, error: lockedError } = await supabaseAdmin
      .from('banking_users')
      .select('*', { count: 'exact', head: true })
      .eq('account_locked', true);

    // Get total balance across all accounts
    const { data: balanceData, error: balanceError } = await supabaseAdmin
      .from('accounts')
      .select('balance')
      .eq('status', 'active');

    const totalBalance = balanceData?.reduce((sum, account) => sum + account.balance, 0) || 0;

    // Get today's transactions count
    const today = new Date().toISOString().split('T')[0];
    const { count: dailyTransactions, error: dailyError } = await supabaseAdmin
      .from('transactions')
      .select('*', { count: 'exact', head: true })
      .gte('timestamp', `${today}T00:00:00Z`)
      .lt('timestamp', `${today}T23:59:59Z`);

    // Get total transactions count
    const { count: totalTransactions, error: transactionsError } = await supabaseAdmin
      .from('transactions')
      .select('*', { count: 'exact', head: true });

    if (usersError || kycError || lockedError || balanceError || dailyError || transactionsError) {
      console.error("Stats query errors:", { usersError, kycError, lockedError, balanceError, dailyError, transactionsError });
      return res.status(500).json({ error: "Failed to load statistics" });
    }

    const stats = {
      totalUsers: totalUsers || 0,
      pendingKyc: pendingKyc || 0,
      totalTransactions: totalTransactions || 0,
      totalBalance: totalBalance,
      dailyTransactions: dailyTransactions || 0,
      lockedAccounts: lockedAccounts || 0,
    };

    res.json({ stats });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.status(500).json({ error: "Failed to load dashboard statistics" });
  }
};

/**
 * Get all users with basic info
 */
export const getAllUsers: RequestHandler = async (req, res) => {
  try {
    const { data: users, error } = await supabaseAdmin
      .from('banking_users')
      .select('id, email, name, kyc_status, account_locked, role, created_at, last_login_at')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: "Failed to load users" });
    }

    res.json({ users });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ error: "Failed to load users" });
  }
};

/**
 * Get detailed user info with decrypted PII (admin only)
 */
export const getUserDetailed: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const secureBankingService = getSecureBankingService();

    const { data: user, error } = await secureBankingService.getBankingUserDecrypted(userId);

    if (error) {
      return res.status(404).json({ error: "User not found" });
    }

    // Log admin access for audit
    const adminId = req.user?.id;
    if (adminId) {
      await secureBankingService.logAdminAction({
        adminId,
        action: 'view_user_details',
        resourceType: 'user',
        resourceId: userId,
        targetUserId: userId,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      });
    }

    res.json({ user });
  } catch (error) {
    console.error("Get user detailed error:", error);
    res.status(500).json({ error: "Failed to load user details" });
  }
};

/**
 * Lock or unlock user account
 */
export const lockUnlockUser: RequestHandler = async (req, res) => {
  try {
    const { userId, action } = req.params;
    const { reason } = lockUserSchema.parse(req.body);
    const adminId = req.user?.id;

    if (!['lock', 'unlock'].includes(action)) {
      return res.status(400).json({ error: "Invalid action" });
    }

    const isLocking = action === 'lock';
    
    const updateData: any = {
      account_locked: isLocking,
      updated_at: new Date().toISOString(),
    };

    if (isLocking) {
      updateData.locked_reason = reason || 'Locked by administrator';
      updateData.locked_at = new Date().toISOString();
    } else {
      updateData.locked_reason = null;
      updateData.locked_at = null;
    }

    const { error } = await supabaseAdmin
      .from('banking_users')
      .update(updateData)
      .eq('id', userId);

    if (error) {
      return res.status(500).json({ error: `Failed to ${action} user` });
    }

    // Log admin action
    if (adminId) {
      const secureBankingService = getSecureBankingService();
      await secureBankingService.logAdminAction({
        adminId,
        action: `${action}_user`,
        resourceType: 'user',
        resourceId: userId,
        newValues: { account_locked: isLocking, reason },
        targetUserId: userId,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      });
    }

    res.json({ message: `User ${action}ed successfully` });
  } catch (error) {
    console.error("Lock/unlock user error:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input", details: error.errors });
    }
    res.status(500).json({ error: "Failed to update user status" });
  }
};

/**
 * Get all accounts
 */
export const getAllAccounts: RequestHandler = async (req, res) => {
  try {
    const { data: accounts, error } = await supabaseAdmin
      .from('accounts')
      .select(`
        id,
        user_id,
        account_number,
        account_type,
        balance,
        status,
        created_at,
        banking_users!inner(name)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: "Failed to load accounts" });
    }

    res.json({ accounts });
  } catch (error) {
    console.error("Get all accounts error:", error);
    res.status(500).json({ error: "Failed to load accounts" });
  }
};

/**
 * Update account balance
 */
export const updateAccountBalance: RequestHandler = async (req, res) => {
  try {
    const { accountId } = req.params;
    const { newBalance, reason } = updateBalanceSchema.parse(req.body);
    const adminId = req.user?.id;

    // Get current account data
    const { data: currentAccount, error: accountError } = await supabaseAdmin
      .from('accounts')
      .select('balance, user_id')
      .eq('id', accountId)
      .single();

    if (accountError || !currentAccount) {
      return res.status(404).json({ error: "Account not found" });
    }

    const oldBalance = currentAccount.balance;
    const difference = newBalance - oldBalance;

    // Update account balance
    const { error: updateError } = await supabaseAdmin
      .from('accounts')
      .update({ 
        balance: newBalance,
        available_balance: newBalance,
        updated_at: new Date().toISOString()
      })
      .eq('id', accountId);

    if (updateError) {
      return res.status(500).json({ error: "Failed to update balance" });
    }

    // Create transaction record for audit trail
    const secureBankingService = getSecureBankingService();
    await secureBankingService.createTransaction({
      accountId,
      type: difference > 0 ? 'credit' : 'debit',
      amount: Math.abs(difference),
      description: `Admin balance adjustment: ${reason}`,
      category: 'admin_adjustment',
      merchantName: 'First City Credit Union',
    });

    // Log admin action
    if (adminId) {
      await secureBankingService.logAdminAction({
        adminId,
        action: 'update_account_balance',
        resourceType: 'account',
        resourceId: accountId,
        oldValues: { balance: oldBalance },
        newValues: { balance: newBalance, reason },
        targetUserId: currentAccount.user_id,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      });
    }

    res.json({ message: "Balance updated successfully" });
  } catch (error) {
    console.error("Update account balance error:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input", details: error.errors });
    }
    res.status(500).json({ error: "Failed to update account balance" });
  }
};

/**
 * Get recent transactions
 */
export const getAllTransactions: RequestHandler = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;
    
    const { data: transactions, error } = await supabaseAdmin
      .from('transactions')
      .select(`
        id,
        account_id,
        type,
        amount,
        description,
        status,
        timestamp,
        accounts!inner(account_number, user_id, banking_users!inner(name))
      `)
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) {
      return res.status(500).json({ error: "Failed to load transactions" });
    }

    res.json({ transactions });
  } catch (error) {
    console.error("Get all transactions error:", error);
    res.status(500).json({ error: "Failed to load transactions" });
  }
};

/**
 * Get KYC documents for review
 */
export const getKYCDocuments: RequestHandler = async (req, res) => {
  try {
    const status = req.query.status as string || 'pending';
    
    const { data: documents, error } = await supabaseAdmin
      .from('kyc_documents')
      .select(`
        id,
        user_id,
        document_type,
        verification_status,
        uploaded_at,
        verified_at,
        rejection_reason,
        banking_users!inner(name)
      `)
      .eq('verification_status', status)
      .order('uploaded_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: "Failed to load KYC documents" });
    }

    res.json({ documents });
  } catch (error) {
    console.error("Get KYC documents error:", error);
    res.status(500).json({ error: "Failed to load KYC documents" });
  }
};

/**
 * Approve or reject KYC document
 */
export const handleKYCAction: RequestHandler = async (req, res) => {
  try {
    const { documentId, action } = req.params;
    const { notes } = kycActionSchema.parse(req.body);
    const adminId = req.user?.id;

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ error: "Invalid action" });
    }

    const status = action === 'approve' ? 'verified' : 'rejected';
    const secureBankingService = getSecureBankingService();

    // Update document status
    const { error } = await secureBankingService.verifyKYCDocument(
      documentId,
      adminId!,
      status,
      notes
    );

    if (error) {
      return res.status(500).json({ error: `Failed to ${action} document` });
    }

    // Check if user has all required documents verified
    if (action === 'approve') {
      const { data: document } = await supabaseAdmin
        .from('kyc_documents')
        .select('user_id')
        .eq('id', documentId)
        .single();

      if (document) {
        const { data: userDocs } = await supabaseAdmin
          .from('kyc_documents')
          .select('document_type, verification_status')
          .eq('user_id', document.user_id);

        const requiredDocs = ['drivers_license', 'selfie', 'proof_of_address'];
        const verifiedDocs = userDocs?.filter(doc => doc.verification_status === 'verified') || [];
        const hasAllRequired = requiredDocs.every(reqDoc => 
          verifiedDocs.some(verDoc => verDoc.document_type === reqDoc)
        );

        if (hasAllRequired) {
          // Update user KYC status to approved
          await supabaseAdmin
            .from('banking_users')
            .update({ kyc_status: 'approved' })
            .eq('id', document.user_id);
        }
      }
    }

    // Log admin action
    if (adminId) {
      await secureBankingService.logAdminAction({
        adminId,
        action: `${action}_kyc_document`,
        resourceType: 'kyc_document',
        resourceId: documentId,
        newValues: { status, notes },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      });
    }

    res.json({ message: `Document ${action}ed successfully` });
  } catch (error) {
    console.error("KYC action error:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input", details: error.errors });
    }
    res.status(500).json({ error: "Failed to process KYC action" });
  }
};

/**
 * Get admin audit log
 */
export const getAdminAuditLog: RequestHandler = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;
    
    const { data: auditLog, error } = await supabaseAdmin
      .from('admin_audit_log')
      .select(`
        id,
        action,
        resource_type,
        resource_id,
        timestamp,
        ip_address,
        banking_users!inner(name)
      `)
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) {
      return res.status(500).json({ error: "Failed to load audit log" });
    }

    res.json({ auditLog });
  } catch (error) {
    console.error("Get audit log error:", error);
    res.status(500).json({ error: "Failed to load audit log" });
  }
};
