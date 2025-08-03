import { getBankingDatabase } from "./banking-database";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

async function setupTestBankingData() {
  const db = getBankingDatabase();
  
  try {
    // Check if admin user already exists
    const existingAdmin = await db.getUserByEmail("admin@bank.com");
    if (existingAdmin) {
      console.log("✅ Admin user already exists");
    } else {
      // Create admin user
      const adminPasswordHash = await bcrypt.hash("admin123", 10);
      const adminId = await db.createUser({
        email: "admin@bank.com",
        name: "Bank Administrator",
        bio: "System Administrator",
        passwordHash: adminPasswordHash
      });
      
      // Mark admin as verified and set role
      await db.markEmailAsVerified(adminId);
      await db.getDatabase().run(
        "UPDATE users SET role = 'admin' WHERE id = ?",
        [adminId]
      );
      
      console.log("✅ Created admin user: admin@bank.com / admin123");
    }
    
    // Check if test user exists
    const existingUser = await db.getUserByEmail("test@user.com");
    if (existingUser) {
      console.log("✅ Test user already exists");
    } else {
      // Create test user
      const userPasswordHash = await bcrypt.hash("user123", 10);
      const userId = await db.createUser({
        email: "test@user.com",
        name: "Test User",
        bio: "Test account for banking demo",
        passwordHash: userPasswordHash
      });
      
      console.log("✅ Created test user: test@user.com / user123");
      console.log("📝 Use admin account to verify this user and create banking accounts");
    }
    
    console.log("\n🚀 Banking system setup complete!");
    console.log("🔑 Admin login: admin@bank.com / admin123");
    console.log("👤 Test user login: test@user.com / user123");
    console.log("📋 Use admin to verify test user and create banking accounts");
    
  } catch (error) {
    console.error("❌ Setup error:", error);
  }
}

// Run setup if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupTestBankingData();
}

export { setupTestBankingData };
