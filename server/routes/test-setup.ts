import { RequestHandler } from "express";
import { createTestUser, TestUserData } from "../setup-test-user";

export const handleCreateTestUser: RequestHandler = async (req, res) => {
  try {
    console.log("🚀 Creating test user via API...");

    const testUserData: TestUserData = await createTestUser();

    res.json({
      success: true,
      message: "Test user created successfully!",
      credentials: {
        email: testUserData.email,
        password: testUserData.password,
        name: testUserData.name,
      },
      accounts: testUserData.accounts,
      card: testUserData.card,
      loginInstructions: {
        step1: "Use the email and password above to login",
        step2: "Navigate to the dashboard to see accounts and transactions",
        step3:
          "Test transfers, view transactions, and explore banking features",
      },
    });
  } catch (error) {
    console.error("❌ Error creating test user:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create test user",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const handleGetTestUserInfo: RequestHandler = async (req, res) => {
  res.json({
    testUser: {
      email: "test@bankingapp.com",
      password: "TestPassword123!",
      description:
        "Pre-configured test user with checking/savings accounts, debit card, and sample transactions",
    },
    features: [
      "✅ Verified email (no verification required)",
      "💰 Checking account with $2,500 balance",
      "🏦 Savings account with $15,000 balance",
      "💳 Active debit card",
      "📊 Sample transaction history",
      "🔄 Transfer capabilities",
      "📱 Full dashboard access",
    ],
    endpoints: {
      createTestUser:
        "POST /api/test-setup/create - Creates/updates the test user",
      getUserInfo: "GET /api/test-setup/info - Shows this information",
    },
  });
};
