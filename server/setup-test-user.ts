import bcrypt from "bcryptjs";
import { getBankingDatabase } from "./banking-database";

export interface TestUserData {
  email: string;
  password: string;
  name: string;
  accounts: {
    checking: {
      accountNumber: string;
      balance: number;
    };
    savings: {
      accountNumber: string;
      balance: number;
    };
  };
  card: {
    cardNumber: string;
  };
}

export async function createTestUser(): Promise<TestUserData> {
  const db = getBankingDatabase();
  
  // Test user credentials
  const testUserData = {
    email: "test@bankingapp.com",
    password: "TestPassword123!",
    name: "Test User",
  };

  try {
    // Check if test user already exists
    const existingUser = await db.getUserByEmail(testUserData.email);
    if (existingUser) {
      console.log("Test user already exists, updating with fresh data...");
      
      // Get existing accounts and return the data
      const accounts = await db.getAccountsByUserId(existingUser.id);
      const cards = await db.getCardsByUserId(existingUser.id);
      
      if (accounts.length >= 2 && cards.length >= 1) {
        return {
          email: testUserData.email,
          password: testUserData.password,
          name: testUserData.name,
          accounts: {
            checking: {
              accountNumber: accounts.find(a => a.account_type === "checking")?.account_number || "",
              balance: accounts.find(a => a.account_type === "checking")?.balance || 0,
            },
            savings: {
              accountNumber: accounts.find(a => a.account_type === "savings")?.account_number || "",
              balance: accounts.find(a => a.account_type === "savings")?.balance || 0,
            },
          },
          card: {
            cardNumber: cards[0]?.card_number || "",
          },
        };
      }
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(testUserData.password, 12);

    // Create the test user if doesn't exist
    let userId: number;
    if (!existingUser) {
      userId = await db.createUser({
        email: testUserData.email,
        name: testUserData.name,
        bio: "Test user for banking application development and testing",
        passwordHash,
      });

      // Mark email as verified immediately for test user
      await db.markEmailAsVerified(userId);
      console.log(`✅ Test user created with ID: ${userId}`);
    } else {
      userId = existingUser.id;
    }

    // Generate account numbers
    const checkingAccountNumber = db.generateAccountNumber(userId, "checking");
    const savingsAccountNumber = db.generateAccountNumber(userId, "savings");

    // Create checking account with initial balance
    const checkingAccountId = await db.createAccount({
      userId,
      accountNumber: checkingAccountNumber,
      accountType: "checking",
      initialBalance: 2500.00,
    });

    // Create savings account with initial balance
    const savingsAccountId = await db.createAccount({
      userId,
      accountNumber: savingsAccountNumber,
      accountType: "savings",
      initialBalance: 15000.00,
    });

    console.log(`✅ Created checking account: ${checkingAccountNumber} (Balance: $2,500.00)`);
    console.log(`✅ Created savings account: ${savingsAccountNumber} (Balance: $15,000.00)`);

    // Generate a unique card number
    const cardNumber = await db.generateUniqueCardNumber();
    const cardId = await db.createCard({
      userId,
      cardNumber,
    });

    console.log(`✅ Created debit card: ${cardNumber}`);

    // Add some sample transactions for testing
    const sampleTransactions = [
      // Checking account transactions
      {
        accountId: checkingAccountId,
        type: "credit" as const,
        amount: 3000.00,
        description: "Initial Deposit - Direct Deposit",
      },
      {
        accountId: checkingAccountId,
        type: "debit" as const,
        amount: 85.50,
        description: "Grocery Store Purchase",
      },
      {
        accountId: checkingAccountId,
        type: "debit" as const,
        amount: 45.00,
        description: "Gas Station Purchase",
      },
      {
        accountId: checkingAccountId,
        type: "credit" as const,
        amount: 25.00,
        description: "Cashback Reward",
      },
      {
        accountId: checkingAccountId,
        type: "debit" as const,
        amount: 1200.00,
        description: "Rent Payment",
      },
      {
        accountId: checkingAccountId,
        type: "debit" as const,
        amount: 150.00,
        description: "Utility Bill Payment",
      },
      {
        accountId: checkingAccountId,
        type: "debit" as const,
        amount: 89.99,
        description: "Online Shopping - Amazon",
      },
      {
        accountId: checkingAccountId,
        type: "credit" as const,
        amount: 50.00,
        description: "ATM Deposit",
      },

      // Savings account transactions
      {
        accountId: savingsAccountId,
        type: "credit" as const,
        amount: 15000.00,
        description: "Initial Savings Deposit",
      },
      {
        accountId: savingsAccountId,
        type: "credit" as const,
        amount: 75.25,
        description: "Monthly Interest Payment",
      },
      {
        accountId: savingsAccountId,
        type: "debit" as const,
        amount: 500.00,
        description: "Transfer to Checking",
      },
      {
        accountId: savingsAccountId,
        type: "credit" as const,
        amount: 1000.00,
        description: "Monthly Savings Transfer",
      },
    ];

    // Insert sample transactions
    for (const transaction of sampleTransactions) {
      await db.createTransaction(transaction);
    }

    console.log(`✅ Added ${sampleTransactions.length} sample transactions`);

    // Return the test user data
    const result: TestUserData = {
      email: testUserData.email,
      password: testUserData.password,
      name: testUserData.name,
      accounts: {
        checking: {
          accountNumber: checkingAccountNumber,
          balance: 2500.00,
        },
        savings: {
          accountNumber: savingsAccountNumber,
          balance: 15000.00,
        },
      },
      card: {
        cardNumber,
      },
    };

    console.log("\n🎉 Test user setup completed successfully!");
    console.log("📧 Email:", result.email);
    console.log("🔑 Password:", result.password);
    console.log("💳 Checking Account:", result.accounts.checking.accountNumber);
    console.log("💰 Savings Account:", result.accounts.savings.accountNumber);
    console.log("💳 Debit Card:", result.card.cardNumber);

    return result;

  } catch (error) {
    console.error("❌ Error setting up test user:", error);
    throw error;
  }
}

// Function to run the test user setup
export async function runTestUserSetup(): Promise<void> {
  try {
    console.log("🚀 Setting up test user for banking application...\n");
    await createTestUser();
    console.log("\n✅ Test user setup completed! You can now use these credentials to test the banking functionality.");
  } catch (error) {
    console.error("❌ Failed to setup test user:", error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  runTestUserSetup().then(() => {
    console.log("\n👍 Setup complete! Use the credentials above to login and test the banking features.");
    process.exit(0);
  });
}
