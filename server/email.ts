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
        user: process.env.EMAIL_USER || "Baytagdkdv@gmail.com",
        pass: process.env.EMAIL_PASS || "cxva oshq iybh unfg",
      },
    };

    this.transporter = nodemailer.createTransport(config);
  }

  public async sendOTP(to: string, otp: string): Promise<boolean> {
    try {
      const mailOptions = {
        from: `"New Horizon Secure Login" <${process.env.EMAIL_USER || "Baytagdkdv@gmail.com"}>`,
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
              New Horizon Banking - Secure Authentication
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
