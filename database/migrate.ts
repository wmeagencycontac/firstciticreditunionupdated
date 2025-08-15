/**
 * Database Migration Runner
 * Handles applying migrations to both Supabase and SQLite databases
 */

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

interface Migration {
  id: string;
  filename: string;
  content: string;
  timestamp: Date;
}

interface MigrationRecord {
  id: string;
  filename: string;
  applied_at: string;
  checksum?: string;
}

class MigrationRunner {
  private supabaseUrl: string;
  private supabaseKey: string;
  private supabase: any;

  constructor(supabaseUrl?: string, supabaseKey?: string) {
    this.supabaseUrl = supabaseUrl || process.env.SUPABASE_URL || '';
    this.supabaseKey = supabaseKey || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    
    if (this.supabaseUrl && this.supabaseKey) {
      this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
    }
  }

  /**
   * Get all migration files from the migrations directory
   */
  private async getMigrationFiles(): Promise<Migration[]> {
    const files = fs.readdirSync(MIGRATIONS_DIR)
      .filter(file => file.endsWith('.sql'))
      .sort();

    const migrations: Migration[] = [];

    for (const filename of files) {
      const filepath = path.join(MIGRATIONS_DIR, filename);
      const content = fs.readFileSync(filepath, 'utf-8');
      
      // Extract timestamp from filename (assuming YYYYMMDDHHMMSS format)
      const timestampMatch = filename.match(/^(\d{14})/);
      const timestamp = timestampMatch 
        ? new Date(
            parseInt(timestampMatch[1].substr(0, 4)), // year
            parseInt(timestampMatch[1].substr(4, 2)) - 1, // month (0-based)
            parseInt(timestampMatch[1].substr(6, 2)), // day
            parseInt(timestampMatch[1].substr(8, 2)), // hour
            parseInt(timestampMatch[1].substr(10, 2)), // minute
            parseInt(timestampMatch[1].substr(12, 2)) // second
          )
        : new Date();

      migrations.push({
        id: filename.replace('.sql', ''),
        filename,
        content,
        timestamp
      });
    }

    return migrations;
  }

  /**
   * Create migrations table if it doesn't exist
   */
  private async ensureMigrationsTable(): Promise<void> {
    if (!this.supabase) {
      throw new Error('Supabase client not configured');
    }

    const { error } = await this.supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS _migrations (
          id VARCHAR(255) PRIMARY KEY,
          filename VARCHAR(255) NOT NULL,
          applied_at TIMESTAMPTZ DEFAULT NOW(),
          checksum VARCHAR(64)
        );
      `
    });

    if (error) {
      console.error('Error creating migrations table:', error);
      throw error;
    }
  }

  /**
   * Get applied migrations from the database
   */
  private async getAppliedMigrations(): Promise<MigrationRecord[]> {
    if (!this.supabase) {
      return [];
    }

    const { data, error } = await this.supabase
      .from('_migrations')
      .select('*')
      .order('applied_at');

    if (error) {
      console.error('Error fetching applied migrations:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Record a migration as applied
   */
  private async recordMigration(migration: Migration): Promise<void> {
    if (!this.supabase) {
      return;
    }

    const { error } = await this.supabase
      .from('_migrations')
      .insert({
        id: migration.id,
        filename: migration.filename,
        applied_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error recording migration:', error);
      throw error;
    }
  }

  /**
   * Apply a single migration
   */
  private async applyMigration(migration: Migration): Promise<void> {
    if (!this.supabase) {
      console.log(`Skipping migration ${migration.filename} - Supabase not configured`);
      return;
    }

    console.log(`Applying migration: ${migration.filename}`);

    try {
      // Execute the migration SQL
      const { error } = await this.supabase.rpc('exec_sql', {
        sql: migration.content
      });

      if (error) {
        console.error(`Error applying migration ${migration.filename}:`, error);
        throw error;
      }

      // Record the migration as applied
      await this.recordMigration(migration);
      
      console.log(`✅ Migration ${migration.filename} applied successfully`);
    } catch (error) {
      console.error(`❌ Failed to apply migration ${migration.filename}:`, error);
      throw error;
    }
  }

  /**
   * Run all pending migrations
   */
  async runMigrations(): Promise<void> {
    if (!this.supabase) {
      console.warn('⚠️  Supabase not configured - skipping migrations');
      return;
    }

    console.log('🔄 Starting database migrations...');

    try {
      // Ensure migrations table exists
      await this.ensureMigrationsTable();

      // Get all migrations and applied migrations
      const allMigrations = await this.getMigrationFiles();
      const appliedMigrations = await this.getAppliedMigrations();
      const appliedIds = new Set(appliedMigrations.map(m => m.id));

      // Find pending migrations
      const pendingMigrations = allMigrations.filter(m => !appliedIds.has(m.id));

      if (pendingMigrations.length === 0) {
        console.log('✅ No pending migrations');
        return;
      }

      console.log(`📋 Found ${pendingMigrations.length} pending migration(s)`);

      // Apply each pending migration
      for (const migration of pendingMigrations) {
        await this.applyMigration(migration);
      }

      console.log('🎉 All migrations completed successfully');
    } catch (error) {
      console.error('💥 Migration failed:', error);
      throw error;
    }
  }

  /**
   * Check migration status
   */
  async checkStatus(): Promise<void> {
    if (!this.supabase) {
      console.log('Supabase not configured');
      return;
    }

    const allMigrations = await this.getMigrationFiles();
    const appliedMigrations = await this.getAppliedMigrations();
    const appliedIds = new Set(appliedMigrations.map(m => m.id));

    console.log('\n📊 Migration Status:');
    console.log('==================');

    for (const migration of allMigrations) {
      const status = appliedIds.has(migration.id) ? '✅ Applied' : '⏳ Pending';
      console.log(`${status} - ${migration.filename}`);
    }
    
    console.log(`\nTotal: ${allMigrations.length} migrations`);
    console.log(`Applied: ${appliedMigrations.length}`);
    console.log(`Pending: ${allMigrations.length - appliedMigrations.length}`);
  }
}

// CLI interface
async function main() {
  const command = process.argv[2];
  const runner = new MigrationRunner();

  try {
    switch (command) {
      case 'run':
        await runner.runMigrations();
        break;
      case 'status':
        await runner.checkStatus();
        break;
      default:
        console.log('Usage:');
        console.log('  npm run migrate run    - Apply pending migrations');
        console.log('  npm run migrate status - Check migration status');
        break;
    }
  } catch (error) {
    console.error('Migration command failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { MigrationRunner };
