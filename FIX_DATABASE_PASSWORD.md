# Fix Database Password Authentication

## Problem
PostgreSQL is rejecting the password `Bilal2026SchoolSecurePass` - authentication failing on all queries.

## Solution
Reset the PostgreSQL password and verify connection.

---

## Commands to Run on VPS

```bash
# 1. Stop the backend temporarily
pm2 stop bilal-backend

# 2. Reset PostgreSQL password
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'Bilal2026SchoolSecurePass';"

# 3. Test the connection
sudo -u postgres psql -d school_management10 -c "SELECT 1;"

# If step 3 fails, try connecting with the password:
PGPASSWORD='Bilal2026SchoolSecurePass' psql -U postgres -d school_management10 -c "SELECT 1;"

# 4. If still failing, check pg_hba.conf
cat /etc/postgresql/16/main/pg_hba.conf | grep "local.*postgres"

# Should show:
# local   all             postgres                                md5

# If it shows "peer", change it:
sudo nano /etc/postgresql/16/main/pg_hba.conf

# Find this line:
# local   all             postgres                                peer

# Change to:
# local   all             postgres                                md5

# Save and restart PostgreSQL:
sudo systemctl restart postgresql

# 5. Test connection again
PGPASSWORD='Bilal2026SchoolSecurePass' psql -U postgres -d school_management10 -c "SELECT 1;"

# 6. Restart backend
pm2 restart bilal-backend

# 7. Check logs
pm2 logs bilal-backend --lines 50
```

---

## Expected Result

After fixing, you should see in PM2 logs:
- ✅ Admin users table initialized
- ✅ Branding settings table initialized  
- ✅ All tables initialized successfully
- NO "password authentication failed" errors

---

## If Still Failing

The password might have special characters causing issues. Let's use a simpler password:

```bash
# Use a simpler password
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'BilalSchool2026';"

# Update .env file
cd /var/www/bilal-school/backend
nano .env

# Change this line:
# DB_PASSWORD=Bilal2026SchoolSecurePass

# To:
# DB_PASSWORD=BilalSchool2026

# Also update DATABASE_URL:
# DATABASE_URL="postgresql://postgres:BilalSchool2026@localhost:5432/school_management10?schema=public"

# Save and restart
pm2 restart bilal-backend
pm2 logs bilal-backend --lines 50
```
