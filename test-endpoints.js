import fetch from 'node-fetch';

async function testEndpoints() {
  try {
    console.log('Testing test setup endpoint...');
    const setupResponse = await fetch('http://localhost:8080/api/test-setup/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (setupResponse.ok) {
      const setupData = await setupResponse.json();
      console.log('✅ Test user created successfully');
      console.log('Credentials:', setupData.credentials);
      
      // Test login with the credentials
      console.log('\nTesting login...');
      const loginResponse = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: setupData.credentials.email,
          password: setupData.credentials.password,
        }),
      });
      
      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        console.log('✅ Login successful');
        console.log('Token:', loginData.token.substring(0, 20) + '...');
        
        // Test dashboard with the token
        console.log('\nTesting dashboard...');
        const dashboardResponse = await fetch('http://localhost:8080/api/dashboard', {
          headers: {
            'Authorization': `Bearer ${loginData.token}`,
          },
        });
        
        if (dashboardResponse.ok) {
          const dashboardData = await dashboardResponse.json();
          console.log('✅ Dashboard data fetched successfully');
          console.log('User:', dashboardData.user.firstName, dashboardData.user.lastName);
          console.log('Accounts:', dashboardData.accounts.length);
          console.log('Total Balance:', dashboardData.totalBalance);
        } else {
          console.log('❌ Dashboard failed:', dashboardResponse.status, await dashboardResponse.text());
        }
      } else {
        console.log('❌ Login failed:', loginResponse.status, await loginResponse.text());
      }
    } else {
      console.log('❌ Test setup failed:', setupResponse.status, await setupResponse.text());
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testEndpoints();
