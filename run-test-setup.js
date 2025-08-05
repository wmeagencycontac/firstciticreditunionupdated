import { createTestUser } from './server/setup-test-user.js';

async function run() {
  try {
    console.log('Creating test user...');
    const result = await createTestUser();
    console.log('✅ Success!');
    console.log('Email:', result.email);
    console.log('Password:', result.password);
    console.log('Checking:', result.accounts.checking.accountNumber);
    console.log('Savings:', result.accounts.savings.accountNumber);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

run();
