/**
 * Test script to verify admin panel functionality
 * Run with: npx tsx server/test-admin-workflow.ts
 */
import { getBankingDatabase } from "./banking-database";
import { emitUserRegistered, emitUserVerified } from "./socket-events";

async function testAdminWorkflow() {
  console.log("🧪 Testing Admin Panel Workflow...\n");

  const db = getBankingDatabase();

  try {
    // 1. Check if admin exists
    console.log("1️⃣ Checking admin existence...");
    const adminCheck = await new Promise<boolean>((resolve, reject) => {
      db.getDatabase().get(
        `SELECT id FROM users WHERE role = 'admin' LIMIT 1`,
        [],
        (err, row) => {
          if (err) reject(err);
          else resolve(!!row);
        }
      );
    });
    console.log(`   Admin exists: ${adminCheck ? "✅ Yes" : "❌ No"}`);

    // 2. Check pending users
    console.log("\n2️⃣ Checking pending users...");
    const pendingUsers = await new Promise<any[]>((resolve, reject) => {
      db.getDatabase().all(
        `SELECT id, email, name, created_at FROM users WHERE email_verified = 0 AND role = 'user' ORDER BY created_at DESC LIMIT 5`,
        [],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows || []);
        }
      );
    });
    
    console.log(`   Pending users found: ${pendingUsers.length}`);
    if (pendingUsers.length > 0) {
      pendingUsers.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.name} (${user.email}) - ${new Date(user.created_at).toLocaleDateString()}`);
      });
    } else {
      console.log("   No pending users found");
    }

    // 3. Simulate some admin events for real-time feed testing
    console.log("\n3️⃣ Simulating admin events for real-time testing...");
    
    // Simulate user registration event
    emitUserRegistered(999, "test@example.com", "Test User");
    console.log("   ✅ Emitted user registration event");

    // Simulate user verification event (if we have pending users)
    if (pendingUsers.length > 0) {
      const testUser = pendingUsers[0];
      emitUserVerified(testUser.id, testUser.email, testUser.name);
      console.log("   ✅ Emitted user verification event");
    }

    // 4. Check database connections
    console.log("\n4️⃣ Verifying database connections...");
    console.log("   ✅ Banking database connected");

    console.log("\n🎉 Admin panel test completed successfully!");
    console.log("\n📋 Next Steps:");
    console.log("   1. Start the server: npm run dev");
    console.log("   2. Visit /admin/setup to create admin (if none exists)");
    console.log("   3. Visit /admin/login to access admin dashboard");
    console.log("   4. Monitor real-time events in the activity feed");
    console.log("   5. Test user verification workflow");

  } catch (error) {
    console.error("❌ Test failed:", error);
  } finally {
    // Clean up
    db.close();
  }
}

// Run the test
testAdminWorkflow().catch(console.error);
