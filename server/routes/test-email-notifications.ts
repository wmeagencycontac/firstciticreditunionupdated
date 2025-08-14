import { RequestHandler } from "express";
import { getEmailService } from "../email";

export const testTransactionEmail: RequestHandler = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const emailService = getEmailService();

    // Test transaction notification
    const success = await emailService.sendTransactionNotification(email, {
      type: "deposit",
      amount: 100.0,
      description: "Test Deposit - Email Notification System",
      accountNumber: "1234567890",
      balance: 1500.0,
      timestamp: new Date().toISOString(),
      merchantName: "Fusion Bank Test",
    });

    if (success) {
      res.json({
        success: true,
        message: "Test transaction email sent successfully",
        email: email,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to send test email",
      });
    }
  } catch (error) {
    console.error("Test email error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const testProfileUpdateEmail: RequestHandler = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const emailService = getEmailService();

    // Test profile update notification
    const success = await emailService.sendProfileUpdateNotification(email, {
      userName: "Test User",
      changedFields: ["Full Name", "Phone Number", "Address"],
      timestamp: new Date().toISOString(),
      ipAddress: req.ip,
    });

    if (success) {
      res.json({
        success: true,
        message: "Test profile update email sent successfully",
        email: email,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to send test email",
      });
    }
  } catch (error) {
    console.error("Test email error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const testAllNotifications: RequestHandler = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const emailService = getEmailService();
    const results = [];

    // Test different transaction types
    const transactionTypes: Array<{
      type: "deposit" | "withdrawal" | "transfer_in" | "transfer_out";
      amount: number;
      description: string;
    }> = [
      { type: "deposit", amount: 500.0, description: "Test Direct Deposit" },
      { type: "withdrawal", amount: 50.0, description: "Test ATM Withdrawal" },
      {
        type: "transfer_in",
        amount: 200.0,
        description: "Test Transfer Received",
      },
      { type: "transfer_out", amount: 75.0, description: "Test Transfer Sent" },
    ];

    for (const transaction of transactionTypes) {
      try {
        const success = await emailService.sendTransactionNotification(email, {
          ...transaction,
          accountNumber: "1234567890",
          balance: 1500.0,
          timestamp: new Date().toISOString(),
        });
        results.push({ type: transaction.type, success });
      } catch (error) {
        results.push({
          type: transaction.type,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    // Test profile update notification
    try {
      const profileSuccess = await emailService.sendProfileUpdateNotification(
        email,
        {
          userName: "Test User",
          changedFields: ["Email Address", "Phone Number"],
          timestamp: new Date().toISOString(),
          ipAddress: req.ip,
        },
      );
      results.push({ type: "profile_update", success: profileSuccess });
    } catch (error) {
      results.push({
        type: "profile_update",
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }

    res.json({
      success: true,
      message: "All test emails sent",
      email: email,
      results,
    });
  } catch (error) {
    console.error("Test email error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
