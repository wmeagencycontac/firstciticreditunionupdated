const fs = require('fs');
const path = require('path');

// Simple script to trigger migration
console.log('🚀 Starting data migration...');

// Check if SQLite database exists
const sqliteDbPath = path.join(__dirname, 'data', 'auth.db');
if (fs.existsSync(sqliteDbPath)) {
  console.log('✅ SQLite database found - migration needed');
  console.log('📋 You can run the migration by:');
  console.log('   1. Visiting /supabase-test and creating test data');
  console.log('   2. Or calling the migration endpoint if you have existing data');
} else {
  console.log('ℹ️  No existing SQLite database found - starting fresh with Supabase');
}

console.log('✨ Ready to update frontend to use Supabase!');
