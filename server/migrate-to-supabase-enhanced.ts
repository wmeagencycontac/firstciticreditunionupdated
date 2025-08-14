import { getBankingDatabase } from "./banking-database";
import { supabaseAdmin } from "./supabase";
import { v4 as uuidv4 } from "uuid";

interface SQLiteUser {
  id: number;
  email: string;
  name: string;
  email_verified: boolean;
  role: "user" | "admin";
  created_at: string;
  updated_at: string;
}

interface SQLiteAccount {
  id: number;
  user_id: number;
  account_number: string;
  account_type: "savings" | "checking";
  balance: number;
  currency: string;
  routing_number: string;
  created_at: string;
  updated_at: string;
}

interface SQLiteTransaction {
  id: number;
  account_id: number;
  type: "credit" | "debit";
  amount: number;
  description: string;
  timestamp: string;
}

interface SQLiteCard {
  id: number;
  user_id: number;
  card_number: string;
  status: "active" | "inactive" | "blocked";
  created_at: string;
}

export async function migrateDataToSupabaseEnhanced() {
  console.log("🚀 Starting enhanced data migration from SQLite to Supabase...");
  
  try {
    const db = getBankingDatabase();
    
    // Create mapping for old IDs to new UUIDs
    const userIdMapping = new Map<number, string>();
    const accountIdMapping = new Map<number, number>();
    
    // 1. Migrate Users
    console.log("📋 Migrating users...");
    const users = await new Promise<SQLiteUser[]>((resolve, reject) => {
      db.getAllUsers((err, users) => {
        if (err) reject(err);
        else resolve(users);
      });
    });
    
    for (const user of users) {
      const uuid = uuidv4();
      userIdMapping.set(user.id, uuid);
      
      const { error } = await supabaseAdmin
        .from("banking_users")
        .insert({
          id: uuid,
          email: user.email,
          name: user.name,
          email_verified: user.email_verified,
          role: user.role,
          created_at: user.created_at,
          updated_at: user.updated_at,
        });
      
      if (error) {
        console.error(`Error migrating user ${user.email}:`, error);
      } else {
        console.log(`✅ Migrated user: ${user.email}`);
      }
    }
    
    // 2. Migrate Accounts
    console.log("💰 Migrating accounts...");
    const accounts = await new Promise<SQLiteAccount[]>((resolve, reject) => {
      db.getAllAccounts((err, accounts) => {
        if (err) reject(err);
        else resolve(accounts);
      });
    });
    
    for (const account of accounts) {
      const userUuid = userIdMapping.get(account.user_id);
      if (!userUuid) {
        console.error(`User UUID not found for account ${account.id}`);
        continue;
      }
      
      const { data, error } = await supabaseAdmin
        .from("accounts")
        .insert({
          user_id: userUuid,
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
      
      if (error) {
        console.error(`Error migrating account ${account.account_number}:`, error);
      } else {
        accountIdMapping.set(account.id, data.id);
        console.log(`✅ Migrated account: ${account.account_number}`);
      }
    }
    
    // 3. Migrate Transactions
    console.log("💳 Migrating transactions...");
    const transactions = await new Promise<SQLiteTransaction[]>((resolve, reject) => {
      db.getAllTransactions((err, transactions) => {
        if (err) reject(err);
        else resolve(transactions);
      });
    });
    
    for (const transaction of transactions) {
      const newAccountId = accountIdMapping.get(transaction.account_id);
      if (!newAccountId) {
        console.error(`Account ID not found for transaction ${transaction.id}`);
        continue;
      }
      
      const { error } = await supabaseAdmin
        .from("transactions")
        .insert({
          account_id: newAccountId,
          type: transaction.type,
          amount: transaction.amount,
          description: transaction.description,
          timestamp: transaction.timestamp,
          created_at: transaction.timestamp,
        });
      
      if (error) {
        console.error(`Error migrating transaction ${transaction.id}:`, error);
      } else {
        console.log(`✅ Migrated transaction: $${transaction.amount}`);
      }
    }
    
    // 4. Migrate Cards
    console.log("💎 Migrating cards...");
    const cards = await new Promise<SQLiteCard[]>((resolve, reject) => {
      db.getAllCards((err, cards) => {
        if (err) reject(err);
        else resolve(cards);
      });
    });
    
    for (const card of cards) {
      const userUuid = userIdMapping.get(card.user_id);
      if (!userUuid) {
        console.error(`User UUID not found for card ${card.id}`);
        continue;
      }
      
      const { error } = await supabaseAdmin
        .from("cards")
        .insert({
          user_id: userUuid,
          card_number: card.card_number,
          status: card.status,
          created_at: card.created_at,
        });
      
      if (error) {
        console.error(`Error migrating card ${card.card_number}:`, error);
      } else {
        console.log(`✅ Migrated card: ${card.card_number}`);
      }
    }
    
    // 5. Create audit log entry
    await supabaseAdmin
      .from("audit_logs")
      .insert({
        action: "data_migration",
        resource_type: "database",
        details: {
          users_migrated: users.length,
          accounts_migrated: accounts.length,
          transactions_migrated: transactions.length,
          cards_migrated: cards.length,
          migration_date: new Date().toISOString(),
        },
      });
    
    console.log("✨ Enhanced data migration completed successfully!");
    
    return {
      success: true,
      stats: {
        users: users.length,
        accounts: accounts.length,
        transactions: transactions.length,
        cards: cards.length,
      },
    };
    
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
}
