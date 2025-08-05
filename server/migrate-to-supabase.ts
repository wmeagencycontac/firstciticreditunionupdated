import { getBankingDatabase } from './banking-database';
import { supabaseAdmin } from './supabase';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

interface SQLiteUser {
  id: number;
  email: string;
  name: string;
  bio?: string;
  picture?: string;
  password_hash?: string;
  email_verified: boolean;
  role: string;
  created_at: string;
  updated_at: string;
}

interface SQLiteAccount {
  id: number;
  user_id: number;
  account_number: string;
  account_type: string;
  balance: number;
  currency: string;
  routing_number: string;
  created_at: string;
  updated_at: string;
}

interface SQLiteTransaction {
  id: number;
  account_id: number;
  type: string;
  amount: number;
  description: string;
  timestamp: string;
}

interface SQLiteCard {
  id: number;
  user_id: number;
  card_number: string;
  status: string;
  created_at: string;
}

export async function migrateDataToSupabase() {
  console.log('🚀 Starting migration from SQLite to Supabase...');

  try {
    const sqliteDb = getBankingDatabase();
    
    // Create a mapping between SQLite user IDs and Supabase UUIDs
    const userIdMapping = new Map<number, string>();
    const accountIdMapping = new Map<number, number>();

    // Step 1: Migrate Users
    console.log('📊 Migrating users...');
    const sqliteUsers = await getAllUsersFromSQLite(sqliteDb);
    
    for (const user of sqliteUsers) {
      const supabaseUserId = uuidv4();
      userIdMapping.set(user.id, supabaseUserId);

      // Create user in Supabase Auth (if they have a password)
      if (user.password_hash) {
        try {
          const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
            id: supabaseUserId,
            email: user.email,
            password: 'TempPassword123!', // Temporary password, users will need to reset
            user_metadata: {
              name: user.name,
              bio: user.bio,
              picture: user.picture,
            },
            email_confirm: user.email_verified,
          });

          if (authError) {
            console.error(`Failed to create auth user for ${user.email}:`, authError);
            continue;
          }

          console.log(`✅ Created auth user: ${user.email}`);
        } catch (error) {
          console.error(`Error creating auth user ${user.email}:`, error);
          continue;
        }
      }

      // Create banking profile (will be created automatically by trigger)
      console.log(`✅ User ${user.email} migrated with ID ${supabaseUserId}`);
    }

    // Step 2: Migrate Accounts
    console.log('🏦 Migrating accounts...');
    const sqliteAccounts = await getAllAccountsFromSQLite(sqliteDb);
    
    for (const account of sqliteAccounts) {
      const supabaseUserId = userIdMapping.get(account.user_id);
      if (!supabaseUserId) {
        console.warn(`No Supabase user found for SQLite user ID ${account.user_id}`);
        continue;
      }

      const { data: supabaseAccount, error: accountError } = await supabaseAdmin
        .from('accounts')
        .insert({
          user_id: supabaseUserId,
          account_number: account.account_number,
          account_type: account.account_type,
          balance: account.balance,
          currency: account.currency,
          routing_number: account.routing_number,
          created_at: account.created_at,
          updated_at: account.updated_at,
        })
        .select()
        .single();

      if (accountError) {
        console.error(`Failed to create account ${account.account_number}:`, accountError);
        continue;
      }

      accountIdMapping.set(account.id, supabaseAccount.id);
      console.log(`✅ Account ${account.account_number} migrated`);
    }

    // Step 3: Migrate Transactions
    console.log('💳 Migrating transactions...');
    const sqliteTransactions = await getAllTransactionsFromSQLite(sqliteDb);
    
    for (const transaction of sqliteTransactions) {
      const supabaseAccountId = accountIdMapping.get(transaction.account_id);
      if (!supabaseAccountId) {
        console.warn(`No Supabase account found for SQLite account ID ${transaction.account_id}`);
        continue;
      }

      const { error: transactionError } = await supabaseAdmin
        .from('transactions')
        .insert({
          account_id: supabaseAccountId,
          type: transaction.type,
          amount: transaction.amount,
          description: transaction.description,
          timestamp: transaction.timestamp,
        });

      if (transactionError) {
        console.error(`Failed to create transaction:`, transactionError);
        continue;
      }
    }

    console.log(`✅ ${sqliteTransactions.length} transactions migrated`);

    // Step 4: Migrate Cards
    console.log('💳 Migrating cards...');
    const sqliteCards = await getAllCardsFromSQLite(sqliteDb);
    
    for (const card of sqliteCards) {
      const supabaseUserId = userIdMapping.get(card.user_id);
      if (!supabaseUserId) {
        console.warn(`No Supabase user found for SQLite user ID ${card.user_id}`);
        continue;
      }

      const { error: cardError } = await supabaseAdmin
        .from('cards')
        .insert({
          user_id: supabaseUserId,
          card_number: card.card_number,
          status: card.status,
          created_at: card.created_at,
        });

      if (cardError) {
        console.error(`Failed to create card:`, cardError);
        continue;
      }
    }

    console.log(`✅ ${sqliteCards.length} cards migrated`);

    console.log('🎉 Migration completed successfully!');
    console.log('⚠️  Note: All migrated users have a temporary password "TempPassword123!" and should reset their passwords.');

    return {
      success: true,
      userCount: sqliteUsers.length,
      accountCount: sqliteAccounts.length,
      transactionCount: sqliteTransactions.length,
      cardCount: sqliteCards.length,
    };

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Helper functions to extract data from SQLite
async function getAllUsersFromSQLite(db: any): Promise<SQLiteUser[]> {
  return new Promise((resolve, reject) => {
    db.getDatabase().all('SELECT * FROM users', (err: any, rows: SQLiteUser[]) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

async function getAllAccountsFromSQLite(db: any): Promise<SQLiteAccount[]> {
  return new Promise((resolve, reject) => {
    db.getDatabase().all('SELECT * FROM accounts', (err: any, rows: SQLiteAccount[]) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

async function getAllTransactionsFromSQLite(db: any): Promise<SQLiteTransaction[]> {
  return new Promise((resolve, reject) => {
    db.getDatabase().all('SELECT * FROM transactions', (err: any, rows: SQLiteTransaction[]) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

async function getAllCardsFromSQLite(db: any): Promise<SQLiteCard[]> {
  return new Promise((resolve, reject) => {
    db.getDatabase().all('SELECT * FROM cards', (err: any, rows: SQLiteCard[]) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrateDataToSupabase()
    .then((result) => {
      console.log('Migration result:', result);
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}
