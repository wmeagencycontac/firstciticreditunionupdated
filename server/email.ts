import nodemailer from "nodemailer";

interface EmailConfig {
  service: string;
  auth: {
    user: string;
    pass: string;
  };
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    const config: EmailConfig = {
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    };

    this.transporter = nodemailer.createTransport(config);
  }

  public async sendOTP(to: string, otp: string): Promise<boolean> {
    try {
      const mailOptions = {
        from: `"Fusion Bank Secure Login" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Your Login Code",
        text: `Your one-time login code is: ${otp}\n\nIt will expire in 5 minutes.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Your Login Code</h2>
            <p style="font-size: 16px; color: #555;">
              Your one-time login code is:
            </p>
            <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 4px;">
                ${otp}
              </span>
            </div>
            <p style="font-size: 14px; color: #666;">
              This code will expire in 5 minutes. If you didn't request this code, please ignore this email.
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #999;">
              Fusion Bank - Secure Authentication
            </p>
          </div>
        `,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log("OTP email sent:", info.response);
      return true;
    } catch (error) {
      console.error("Email send error:", error);
      return false;
    }
  }

  public async sendTransactionNotification(
    to: string,
    transactionData: {
      type: "deposit" | "withdrawal" | "transfer_in" | "transfer_out";
      amount: number;
      description: string;
      accountNumber: string;
      balance: number;
      timestamp: string;
      merchantName?: string;
    },
  ): Promise<boolean> {
    try {
      // Validate email and required fields
      if (!to || !to.includes("@") || !transactionData) {
        console.error("Invalid email or transaction data for notification");
        return false;
      }

      const {
        type,
        amount,
        description,
        accountNumber,
        balance,
        timestamp,
        merchantName,
      } = transactionData;

      const formatCurrency = (amount: number) =>
        `$${Math.abs(amount).toFixed(2)}`;
      const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleString();

      let subject = "";
      let title = "";
      let color = "";
      let icon = "";

      switch (type) {
        case "deposit":
          subject = "Deposit Confirmation";
          title = "Money Deposited";
          color = "#10B981";
          icon = "💰";
          break;
        case "withdrawal":
          subject = "Withdrawal Confirmation";
          title = "Money Withdrawn";
          color = "#EF4444";
          icon = "💸";
          break;
        case "transfer_in":
          subject = "Transfer Received";
          title = "Money Received";
          color = "#10B981";
          icon = "📥";
          break;
        case "transfer_out":
          subject = "Transfer Sent";
          title = "Money Sent";
          color = "#EF4444";
          icon = "📤";
          break;
      }

      const mailOptions = {
        from: `"Fusion Bank Notifications" <${process.env.EMAIL_USER}>`,
        to,
        subject: `${subject} - ${formatCurrency(amount)}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
            <div style="background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="font-size: 48px; margin-bottom: 10px;">${icon}</div>
                <h1 style="color: ${color}; margin: 0; font-size: 24px;">${title}</h1>
              </div>

              <div style="background-color: #f8f9fa; border-radius: 6px; padding: 20px; margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <span style="font-weight: bold; color: #333;">Amount:</span>
                  <span style="font-size: 18px; font-weight: bold; color: ${color};">${formatCurrency(amount)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <span style="font-weight: bold; color: #333;">Account:</span>
                  <span>****${accountNumber.slice(-4)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <span style="font-weight: bold; color: #333;">Description:</span>
                  <span>${description}</span>
                </div>
                ${
                  merchantName
                    ? `
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <span style="font-weight: bold; color: #333;">Merchant:</span>
                  <span>${merchantName}</span>
                </div>
                `
                    : ""
                }
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <span style="font-weight: bold; color: #333;">Date:</span>
                  <span>${formatDate(timestamp)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; border-top: 1px solid #e9ecef; padding-top: 10px; margin-top: 10px;">
                  <span style="font-weight: bold; color: #333;">New Balance:</span>
                  <span style="font-weight: bold; font-size: 16px; color: #00754A;">${formatCurrency(balance)}</span>
                </div>
              </div>

              <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 4px; padding: 15px; margin-bottom: 20px;">
                <p style="margin: 0; color: #856404; font-size: 14px;">
                  <strong>Security Notice:</strong> If you did not authorize this transaction, please contact us immediately at (555) 123-4567 or login to your account to report suspicious activity.
                </p>
              </div>

              <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e9ecef;">
                <p style="margin: 0; color: #6c757d; font-size: 12px;">
                  Fusion Bank - Keeping your money safe and secure<br>
                  This is an automated message. Please do not reply to this email.
                </p>
              </div>
            </div>
          </div>
        `,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log(
        `Transaction notification email sent: ${type} - ${formatCurrency(amount)}`,
      );
      return true;
    } catch (error) {
      console.error("Transaction notification email error:", error);
      return false;
    }
  }

  public async sendProfileUpdateNotification(
    to: string,
    updateData: {
      userName: string;
      changedFields: string[];
      timestamp: string;
      ipAddress?: string;
    },
  ): Promise<boolean> {
    try {
      // Validate email and required fields
      if (
        !to ||
        !to.includes("@") ||
        !updateData ||
        !updateData.changedFields?.length
      ) {
        console.error("Invalid email or update data for profile notification");
        return false;
      }

      const { userName, changedFields, timestamp, ipAddress } = updateData;

      const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleString();

      const mailOptions = {
        from: `"Fusion Bank Security" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Profile Update Notification",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
            <div style="background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="font-size: 48px; margin-bottom: 10px;">🔒</div>
                <h1 style="color: #00754A; margin: 0; font-size: 24px;">Profile Updated</h1>
              </div>

              <div style="background-color: #f8f9fa; border-radius: 6px; padding: 20px; margin-bottom: 20px;">
                <p style="margin: 0 0 15px 0; color: #333;">Hi ${userName},</p>
                <p style="margin: 0 0 15px 0; color: #333;">Your profile information has been updated. Here are the details:</p>

                <div style="margin: 15px 0;">
                  <span style="font-weight: bold; color: #333;">Updated Fields:</span>
                  <ul style="margin: 10px 0; padding-left: 20px;">
                    ${changedFields.map((field) => `<li style="color: #555; margin: 5px 0;">${field}</li>`).join("")}
                  </ul>
                </div>

                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <span style="font-weight: bold; color: #333;">Date & Time:</span>
                  <span>${formatDate(timestamp)}</span>
                </div>

                ${
                  ipAddress
                    ? `
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <span style="font-weight: bold; color: #333;">IP Address:</span>
                  <span style="font-family: monospace; background-color: #e9ecef; padding: 2px 6px; border-radius: 3px;">${ipAddress}</span>
                </div>
                `
                    : ""
                }
              </div>

              <div style="background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 4px; padding: 15px; margin-bottom: 20px;">
                <p style="margin: 0; color: #721c24; font-size: 14px;">
                  <strong>Security Alert:</strong> If you did not make these changes, please contact us immediately at (555) 123-4567 or login to your account to secure your profile.
                </p>
              </div>

              <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e9ecef;">
                <p style="margin: 0; color: #6c757d; font-size: 12px;">
                  Fusion Bank Security Team - Protecting your account 24/7<br>
                  This is an automated security notification. Please do not reply to this email.
                </p>
              </div>
            </div>
          </div>
        `,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log("Profile update notification email sent");
      return true;
    } catch (error) {
      console.error("Profile update notification email error:", error);
      return false;
    }
  }

  public async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log("✅ Email service is ready");
      return true;
    } catch (error) {
      console.error("❌ Email service configuration error:", error);
      return false;
    }
  }
}

// Singleton instance
let emailService: EmailService | null = null;

export function getEmailService(): EmailService {
  if (!emailService) {
    emailService = new EmailService();
  }
  return emailService;
}
