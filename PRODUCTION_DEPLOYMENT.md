# 🏦 First City Credit Union - Production Deployment Guide

This guide covers the complete production deployment of the upgraded First City Credit Union banking platform with enterprise-grade security, compliance, and scalability.

## 🎯 Platform Overview

**Upgraded Features:**
- ✅ **Secure PII Encryption**: AES-256-GCM encryption with key rotation
- ✅ **KYC Document Verification**: Automated identity verification workflow
- ✅ **Mobile Check Deposits**: Real-time check processing with image analysis
- ✅ **Admin Dashboard**: Comprehensive user and transaction management
- ✅ **Row-Level Security**: Supabase RLS with role-based access control
- ✅ **Real-time Banking**: Live transaction feeds and notifications
- ✅ **Production Security**: OWASP compliance with security headers
- ⏳ **Payment Rails**: Ready for Moov.io/GoCardless integration

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React SPA     │    │  Express Server  │    │   Supabase DB   │
│  (Frontend)     │◄──►│   (Backend)      │◄──►│  (PostgreSQL)   │
│                 │    │                  │    │                 │
│ • User Dashboard│    │ • API Routes     │    │ • Banking Users │
│ • KYC Upload    │    │ • PII Encryption │    │ • Accounts      │
│ • Mobile Deposit│    │ • File Storage   │    │ • Transactions  │
│ • Admin Panel   │    │ • Rate Limiting  │    │ • KYC Documents │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌────────▼────────┐             │
         │              │  Security Layer │             │
         │              │                 │             │
         │              │ • Helmet.js     │             │
         └──────────────┤ • CORS Policy   │─────────────┘
                        │ • Rate Limiting │
                        │ • Input Sanitize│
                        └─────────────────┘
```

## 🚀 Quick Production Setup

### 1. Prerequisites

```bash
# Server Requirements
- Node.js 18+ LTS
- PostgreSQL 14+ (via Supabase)
- SSL Certificate
- Domain with HTTPS
- Minimum 2GB RAM, 20GB Storage

# Services Setup
- Supabase project (database)
- Email SMTP provider (SendGrid/Mailgun)
- File storage (local or AWS S3)
- Optional: Moov.io/GoCardless accounts
```

### 2. Clone and Install

```bash
# Clone the repository
git clone https://github.com/your-org/first-city-credit-union.git
cd first-city-credit-union

# Install dependencies
npm install

# Copy production environment template
cp .env.production.example .env.production
```

### 3. Environment Configuration

Edit `.env.production` with your actual values:

```bash
# Critical Production Settings
NODE_ENV=production
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-key
ENCRYPTION_MASTER_KEY=your-64-char-hex-key
```

**🔐 Generate Encryption Key:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Database Setup

```bash
# Run the database schema setup
psql -h your-supabase-host -U postgres -d postgres -f database/schema.sql

# Or via Supabase SQL Editor - copy/paste schema.sql
```

### 5. Build and Deploy

```bash
# Build the application
npm run build

# Start production server
npm start

# Or with PM2 for process management
npm install -g pm2
pm2 start ecosystem.config.js
```

## 🔒 Security Configuration

### 1. SSL/HTTPS Setup

**Option A: Reverse Proxy (Recommended)**
```nginx
# /etc/nginx/sites-available/banking-app
server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Option B: Direct SSL**
```bash
# Set in .env.production
SSL_CERT_PATH=/etc/ssl/certs/banking-app.crt
SSL_KEY_PATH=/etc/ssl/private/banking-app.key
FORCE_HTTPS=true
```

### 2. Firewall Configuration

```bash
# Ubuntu/Debian UFW
sudo ufw enable
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw deny 3000/tcp  # Block direct access to app port

# CentOS/RHEL Firewalld
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### 3. Admin Access Security

```bash
# Restrict admin access by IP (recommended)
ADMIN_ALLOWED_IPS=192.168.1.100,10.0.0.50

# Or use VPN/bastion host for admin access
```

## 📊 Supabase Configuration

### 1. Database Setup

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Note down URL and keys

2. **Run Schema Migration**
   ```sql
   -- Copy contents of database/schema.sql
   -- Paste in Supabase SQL Editor
   -- Execute to create all tables and RLS policies
   ```

3. **Configure Row-Level Security**
   ```sql
   -- Verify RLS is enabled on all tables
   SELECT schemaname, tablename, rowsecurity 
   FROM pg_tables 
   WHERE schemaname = 'public';
   ```

### 2. API Key Security

```bash
# In Supabase Dashboard:
# 1. Go to Settings > API
# 2. Generate new service role key if needed
# 3. Restrict anon key permissions
# 4. Enable RLS on all tables
```

### 3. Backup Configuration

```sql
-- Set up automated backups
-- Supabase Pro: Daily automated backups
-- Manual backup via pg_dump:
pg_dump postgresql://[user]:[password]@[host]:[port]/[database] > backup.sql
```

## 💳 Payment Integration Setup

### Moov.io Integration (US Banking)

```bash
# 1. Create Moov.io account at https://moov.io
# 2. Get API credentials
MOOV_API_KEY=your-api-key
MOOV_ACCOUNT_ID=your-account-id
MOOV_ENVIRONMENT=production

# 3. Set up webhooks
MOOV_WEBHOOK_SECRET=your-webhook-secret
```

### GoCardless Integration (EU/UK Banking)

```bash
# 1. Create GoCardless account
# 2. Get API credentials
GOCARDLESS_ACCESS_TOKEN=your-access-token
GOCARDLESS_ENVIRONMENT=live
GOCARDLESS_WEBHOOK_SECRET=your-webhook-secret
```

## 📧 Email Configuration

### SMTP Setup (SendGrid Example)

```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
FROM_EMAIL=noreply@yourdomain.com
```

### Email Templates

The system automatically sends:
- ✅ Account verification emails
- ✅ KYC status updates
- ✅ Transaction notifications
- ✅ Mobile deposit confirmations
- ✅ Security alerts

## 🔐 Encryption and Data Security

### PII Encryption

```typescript
// All sensitive data is automatically encrypted:
- Phone numbers
- Social Security Numbers
- Date of birth
- Home addresses
- KYC documents
- Mobile deposit images
```

### Key Management

```bash
# Production encryption key (64 hex characters)
ENCRYPTION_MASTER_KEY=your-secure-key-here

# Key rotation (update in production)
# 1. Generate new key
# 2. Update environment variable
# 3. Restart application
# 4. Old keys remain available for decryption
```

### File Security

```bash
# Secure file storage permissions
chmod 700 /secure/banking-data
chown app-user:app-group /secure/banking-data

# Or use AWS S3 with encryption
AWS_S3_BUCKET=your-encrypted-bucket
```

## 👨‍💼 Admin Dashboard Access

### Initial Admin Setup

```bash
# 1. Create first admin user via API
POST /api/admin/setup
{
  "email": "admin@yourdomain.com",
  "password": "SecurePassword123!",
  "name": "System Administrator"
}

# 2. Access admin dashboard
https://yourdomain.com/admin/dashboard
```

### Admin Features

- ✅ **User Management**: View, lock/unlock accounts
- ✅ **KYC Verification**: Approve/reject identity documents  
- ✅ **Transaction Monitoring**: Real-time transaction oversight
- ✅ **Balance Management**: Adjust account balances with audit trail
- ✅ **Audit Logging**: Complete admin action history
- ✅ **System Statistics**: Platform metrics and health

## 📱 Mobile Deposit Setup

### Image Processing

```bash
# File upload limits
MAX_FILE_SIZE=10485760  # 10MB per image
SUPPORTED_FORMATS=jpg,jpeg,png,heic,webp

# Storage location
SECURE_STORAGE_PATH=/secure/banking-data/mobile-deposits
```

### Processing Workflow

1. **User uploads** front/back check images
2. **System encrypts** images with unique keys
3. **Admin reviews** deposits in dashboard
4. **Approval creates** credit transaction
5. **User receives** notification of status

## 🚨 Monitoring and Alerts

### Health Checks

```bash
# Application health endpoint
GET /api/health

# Database connectivity
GET /api/health/database

# File system access
GET /api/health/storage
```

### Error Monitoring

```bash
# Sentry integration
SENTRY_DSN=your-sentry-dsn

# Log levels
LOG_LEVEL=info  # error, warn, info, debug
```

### System Monitoring

```bash
# PM2 monitoring
pm2 monit

# System resources
htop
df -h
free -m
```

## 🔄 Backup and Recovery

### Database Backups

```bash
# Daily automated Supabase backups (Pro plan)
# Manual backup
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Restore
psql $DATABASE_URL < backup-20240101.sql
```

### File Backups

```bash
# Encrypt and backup secure files
tar -czf secure-files-$(date +%Y%m%d).tar.gz /secure/banking-data
gpg --cipher-algo AES256 --compress-algo 1 --s2k-mode 3 \
    --s2k-digest-algo SHA512 --s2k-count 65536 --symmetric \
    --output secure-files-$(date +%Y%m%d).tar.gz.gpg \
    secure-files-$(date +%Y%m%d).tar.gz
```

## 📊 Performance Optimization

### Database Optimization

```sql
-- Create indexes for performance
CREATE INDEX CONCURRENTLY idx_transactions_user_date 
ON transactions(user_id, timestamp DESC);

-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM transactions 
WHERE user_id = $1 ORDER BY timestamp DESC LIMIT 50;
```

### Caching Strategy

```bash
# Redis for session caching (optional)
REDIS_URL=redis://localhost:6379

# Static asset caching
CDN_BASE_URL=https://cdn.yourdomain.com
```

## 🔒 Compliance and Audit

### Audit Requirements

- ✅ **Admin Actions**: All admin operations logged
- ✅ **Transaction History**: Immutable transaction records
- ✅ **File Access**: KYC document access tracking
- ✅ **Login Events**: Authentication audit trail
- ✅ **Data Encryption**: PII protection compliance

### Compliance Features

```bash
# Enable compliance mode
PCI_COMPLIANCE_MODE=true
AUDIT_LOG_RETENTION=2555  # 7 years
DETAILED_TRANSACTION_LOGGING=true
```

## 🚀 Production Checklist

### Pre-Launch

- [ ] SSL certificate installed and verified
- [ ] Database schema applied successfully
- [ ] Environment variables configured
- [ ] Admin user created and tested
- [ ] Email service configured and tested
- [ ] File storage permissions set correctly
- [ ] Backup strategy implemented
- [ ] Security headers verified
- [ ] Rate limiting tested
- [ ] KYC workflow tested end-to-end
- [ ] Mobile deposit functionality verified
- [ ] Payment integration tested (if applicable)

### Post-Launch

- [ ] Monitor error rates and performance
- [ ] Verify automated backups working
- [ ] Test admin dashboard functionality
- [ ] Confirm email notifications working
- [ ] Monitor transaction processing
- [ ] Review security logs
- [ ] Performance optimization if needed

## 🆘 Troubleshooting

### Common Issues

**Database Connection Errors**
```bash
# Check Supabase connection
curl -I https://your-project.supabase.co
# Verify environment variables
echo $SUPABASE_URL
```

**File Upload Issues**
```bash
# Check directory permissions
ls -la /secure/banking-data
# Verify disk space
df -h
```

**Authentication Problems**
```bash
# Verify JWT tokens
# Check Supabase auth logs
# Review rate limiting
```

### Support Contacts

- **Technical Issues**: tech-support@yourdomain.com
- **Security Concerns**: security@yourdomain.com
- **Emergency**: +1-800-BANKING

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Banking Security Best Practices](https://www.ffiec.gov/cybersecurity.htm)
- [PCI DSS Compliance Guide](https://www.pcisecuritystandards.org/)
- [OWASP Security Guidelines](https://owasp.org/www-project-top-ten/)

---

## 🎉 Success!

Your First City Credit Union banking platform is now production-ready with:

- 🔒 **Bank-grade security** with encryption and compliance
- 📱 **Modern user experience** with mobile-first design  
- 👨‍💼 **Powerful admin tools** for complete platform management
- 🏦 **Real banking features** including mobile deposits and KYC
- 📊 **Production monitoring** and audit capabilities
- 🚀 **Scalable architecture** ready for growth

**The platform is ready to serve real banking customers with confidence!**
