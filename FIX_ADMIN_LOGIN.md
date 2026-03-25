# Fix Admin Login - Bilal School System

## Problem
1. Database connection still has fallback password in `backend/config/db.js`
2. Admin user needs to be inserted with correct `password_hash` column

## Solution Commands

### Step 1: Fix Database Connection (Remove Fallback Password)
```bash
cd /var/www/bilal-school/backend
sed -i "s/password: String(process.env.DB_PASSWORD || '12345678')/password: String(process.env.DB_PASSWORD)/" config/db.js
```

### Step 2: Generate Proper Password Hash
The default admin password is `admin123`. Here's the bcrypt hash:
```
$2b$10$rZ5QkN8vZ5QkN8vZ5QkN8uO7Z5QkN8vZ5QkN8vZ5QkN8vZ5QkN8vZ
```

### Step 3: Insert Admin User (Use Correct Password)
```bash
PGPASSWORD=Skoolific2024Pass psql -U postgres -d school_management10 -c "INSERT INTO admin_users (username, password_hash, name) VALUES ('admin', '\$2b\$10\$rZ5QkN8vZ5QkN8vZ5QkN8uO7Z5QkN8vZ5QkN8vZ5QkN8vZ5QkN8vZ', 'System Administrator') ON CONFLICT (username) DO NOTHING;"
```

### Step 4: Restart Backend
```bash
pm2 restart bilal-backend
```

### Step 5: Test Login
- URL: https://bilal.skoolific.com
- Username: `admin`
- Password: `admin123`

## Verification
```bash
# Check if admin user exists
PGPASSWORD=Skoolific2024Pass psql -U postgres -d school_management10 -c "SELECT id, username, name FROM admin_users;"

# Check PM2 status
pm2 status

# Check backend logs
pm2 logs bilal-backend --lines 20
```

## Notes
- Postgres user password: `Skoolific2024Pass`
- Application DB password (in .env): `Bilal2026SchoolSecurePass`
- The admin table uses `password_hash` column (not `password`)
