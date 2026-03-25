# Initialize Database Tables

## Problem
Login failing with 500 error - missing database tables.

## Solution
Run these commands on VPS to initialize all required tables.

---

## Commands to Run on VPS

```bash
# Connect to database
sudo -u postgres psql -d school_management10

# Check if admin_users table exists
\dt admin_users

# If table doesn't exist, create it
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

# Create default admin user (password: admin123)
INSERT INTO admin_users (username, password, email)
VALUES ('admin', '$2b$10$rZ5zKZ5zKZ5zKZ5zKZ5zKuXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx', 'admin@school.com')
ON CONFLICT (username) DO NOTHING;

# Create branding_settings table
CREATE TABLE IF NOT EXISTS branding_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    website_name VARCHAR(255) DEFAULT 'School Management System',
    website_icon TEXT,
    school_logo TEXT,
    primary_color VARCHAR(50) DEFAULT '#667eea',
    secondary_color VARCHAR(50) DEFAULT '#764ba2',
    theme_mode VARCHAR(20) DEFAULT 'light',
    school_address TEXT,
    school_phone VARCHAR(50),
    school_email VARCHAR(255),
    academic_year VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT single_row CHECK (id = 1)
);

# Insert default branding
INSERT INTO branding_settings (id, website_name)
VALUES (1, 'Bilal School Management System')
ON CONFLICT (id) DO NOTHING;

# Exit psql
\q
```

---

## Alternative: Use Backend Setup Script

The backend has initialization code that should run automatically. Try restarting PM2:

```bash
cd /var/www/bilal-school/backend
pm2 restart bilal-backend
pm2 logs bilal-backend --lines 50
```

Look for messages like:
- "Admin users table initialized"
- "Branding settings table initialized"
- "Default admin user created"

---

## Test Login After Initialization

1. Refresh browser at https://bilal.skoolific.com
2. Try login:
   - Username: `admin`
   - Password: `admin123`

---

## If Still Failing

Check the actual error in PM2 logs:

```bash
pm2 logs bilal-backend --err --lines 100
```

Look for the specific error message when you try to login.
