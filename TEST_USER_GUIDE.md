# Test User Setup Guide

This document provides instructions for setting up and using the test user account for the banking application.

## Quick Setup

### Option 1: Using the Web Interface (Recommended)

1. Navigate to `/test-setup` in your browser
2. Click "Create Test User"
3. Copy the credentials provided

### Option 2: Using the API

```bash
curl -X POST http://localhost:8080/api/test-setup/create
```

## Test User Credentials

Once created, you'll receive these credentials:

- **Email**: `test@bankingapp.com`
- **Password**: `TestPassword123!`
- **Name**: Test User

## What's Included

The test user comes pre-configured with:

### ✅ Account Features

- **Email Verified**: No email verification required
- **Role**: Standard user (not admin)
- **Profile**: Complete with bio and test data

### 💰 Banking Accounts

- **Checking Account**:

  - Balance: $2,500.00
  - Account Type: Checking
  - Routing Number: 322078972

- **Savings Account**:
  - Balance: $15,000.00
  - Account Type: Savings
  - Routing Number: 322078972

### 💳 Debit Card

- **Status**: Active
- **Card Number**: Randomly generated 16-digit number
- **Linked**: To checking account

### 📊 Sample Transaction History

Pre-loaded with realistic transactions including:

- Direct deposits
- Grocery purchases
- Gas station transactions
- Rent payments
- Utility bills
- Online shopping
- ATM transactions
- Interest payments
- Transfers between accounts

## Testing Features

With this test user, you can test:

1. **Authentication**

   - Login/logout functionality
   - Session management
   - Profile access

2. **Dashboard**

   - Account summaries
   - Balance displays
   - Recent transactions
   - Account overview

3. **Account Management**

   - View checking account details
   - View savings account details
   - Account balance tracking

4. **Transaction History**

   - Filter transactions by type
   - Search transaction history
   - View transaction details
   - Export functionality (if implemented)

5. **Money Transfers**

   - Transfer between checking and savings
   - Transfer validation
   - Balance updates
   - Transaction creation

6. **Card Management**
   - View debit card details
   - Card status monitoring

## API Endpoints Available

### Test Setup Endpoints

- `GET /api/test-setup/info` - Get test user information
- `POST /api/test-setup/create` - Create/reset test user

### Banking Endpoints (Requires Authentication)

- `GET /api/account-summary` - Get account overview
- `GET /api/all-transactions` - Get all user transactions
- `GET /api/cards` - Get user's cards
- `POST /api/send-transfer` - Send money between accounts

### Authentication Endpoints

- `POST /api/auth/login` - Login with test credentials
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/logout` - Logout

## Sample Transfer Request

To test money transfers:

```json
{
  "from_account_id": 1,
  "to_account_id": 2,
  "amount": 100.0,
  "description": "Test transfer"
}
```

## Security Notes

- The test user password meets all security requirements
- Email is pre-verified to skip verification flow
- All banking data is realistic but fictional
- Safe for development and testing environments

## Troubleshooting

### Test User Already Exists

If the test user already exists, the system will:

- Return existing user credentials
- Preserve existing account data
- Add any missing accounts or cards

### Database Issues

If you encounter database errors:

1. Ensure the dev server is running
2. Check database initialization logs
3. Try restarting the dev server

### API Errors

Common issues and solutions:

- **401 Unauthorized**: Login first to get a valid token
- **404 Not Found**: Check endpoint URLs
- **500 Server Error**: Check server logs for database connectivity

## Reset Test Data

To reset the test user with fresh data:

1. Delete the existing user from the database
2. Run the test setup again
3. Or use the API endpoint which handles updates automatically

## Integration with Frontend

The test user can be used with any of the banking pages:

- Login page: `/login`
- Dashboard: `/dashboard`
- Transactions: `/transactions`
- Admin features: Use admin credentials separately

Remember to login with the test credentials before accessing protected banking features!
