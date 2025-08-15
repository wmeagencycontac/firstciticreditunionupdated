# Database Migration System

This directory contains all database migrations for the Fusion Banking application. Migrations are executed in order and should be immutable once deployed to production.

## Migration Workflow

### 1. Migration File Naming Convention
```
<timestamp>_<description>.sql
```

Example: `20240115120000_remove_cvv_column.sql`

### 2. Migration Structure
Each migration file should contain:
- Up migration (changes to apply)
- Down migration (changes to rollback) - optional but recommended
- Clear comments explaining the changes

### 3. Creating New Migrations

#### For Supabase (Production):
```bash
# Create a new migration file
touch database/migrations/$(date +%Y%m%d%H%M%S)_your_migration_name.sql
```

#### For Local SQLite (Development):
```bash
# Create a new migration file
touch database/migrations/$(date +%Y%m%d%H%M%S)_your_migration_name_sqlite.sql
```

### 4. Migration Best Practices

1. **Always use transactions** for multi-statement migrations
2. **Test migrations** on a copy of production data first
3. **Make migrations reversible** when possible
4. **Document breaking changes** clearly
5. **Never modify existing migrations** once they're deployed

### 5. Example Migration Template

```sql
-- Migration: Description of what this migration does
-- Created: YYYY-MM-DD
-- Author: Your Name

-- ================================
-- UP MIGRATION
-- ================================

BEGIN;

-- Your migration code here
-- Example:
-- ALTER TABLE users ADD COLUMN new_field VARCHAR(255);

COMMIT;

-- ================================
-- DOWN MIGRATION (Optional)
-- ================================

-- To rollback this migration:
-- BEGIN;
-- ALTER TABLE users DROP COLUMN new_field;
-- COMMIT;
```

## Current Migration Files

- `001_initial_schema.sql` - Initial database schema (baseline)
- `002_remove_cvv_column.sql` - Security update to remove CVV storage
- (Add new migrations here)

## Running Migrations

### Supabase
Migrations are automatically applied when pushed to Supabase via the dashboard or CLI.

### Local Development
For local SQLite databases, migrations should be applied through the application's migration runner.

## Migration History

| Migration | Date | Description | Author |
|-----------|------|-------------|---------|
| 001 | 2024-01-15 | Initial schema | System |
| 002 | 2024-01-15 | Remove CVV column | Security Team |

## Important Notes

1. **Never store sensitive data** like CVV, full SSN, or passwords in plain text
2. **Use encryption** for PII data (SSN, phone numbers, addresses)
3. **Follow data retention policies** for financial data
4. **Ensure ACID compliance** for financial transactions
5. **Test migrations thoroughly** before applying to production

## Emergency Procedures

In case of migration failures:

1. **Stop the application** to prevent data corruption
2. **Assess the damage** - check what was partially applied
3. **Rollback if possible** using the down migration
4. **Restore from backup** if rollback is not possible
5. **Fix the migration** and test before reapplying
6. **Document the incident** for future reference
