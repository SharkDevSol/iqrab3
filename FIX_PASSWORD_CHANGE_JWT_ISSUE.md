# Fix Password Change JWT Issue - Complete Guide

## Problem
You're getting "invalid signature" error when trying to change password. This happens because:
1. The JWT token in your browser was generated with a different JWT_SECRET
2. The backend is now using a different JWT_SECRET to verify tokens

## Solution Steps

### Step 1: Verify Database Connection
```bash
cd backend
node test-password-change.js
```

This will test:
- JWT_SECRET configuration
- Database connection
- Admin users existence
- Password hashing functionality

### Step 2: Generate a Fresh Token
```bash
node generate-fresh-token.js
```

This will:
- Connect to your database
- Find your admin user
- Generate a valid JWT token using the current JWT_SECRET
- Display the token for testing

### Step 3: Clear Browser Storage and Re-login

Option A: Clear localStorage manually
1. Open browser DevTools (F12)
2. Go to Application/Storage tab
3. Click "Local Storage"
4. Delete these keys:
   - `authToken`
   - `adminUser`
   - `isLoggedIn`
   - `userType`
5. Refresh the page and login again

Option B: Use the logout button
1. Click logout in your app
2. Login again with your credentials

### Step 4: Test Password Change

After logging in with fresh credentials:
1. Go to Settings page
2. Click on "Password" tab
3. Fill in:
   - Current Password: (your current password)
   - New Password: (your new password)
   - Confirm New Password: (repeat new password)
4. Click "Change Password"

## For VPS Deployment

### 1. Ensure JWT_SECRET is Set
```bash
# On your VPS, check the .env file
cat backend/.env | grep JWT_SECRET
```

The JWT_SECRET should be:
- At least 32 characters long
- Random and secure
- Same across all server restarts

### 2. Generate Secure JWT_SECRET for Production
```bash
# Run this on your VPS
node -e "console.log(require('crypto').randomBytes(48).toString('base64').replace(/[^a-zA-Z0-9]/g, ''))"
```

Copy the output and update your `backend/.env`:
```env
JWT_SECRET="<paste-the-generated-secret-here>"
```

### 3. Database Connection for VPS

Update your `backend/.env` with VPS database credentials:
```env
# Database Configuration
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_secure_password
DB_HOST=localhost
DB_PORT=5432

# JWT Configuration
JWT_SECRET="your-secure-random-secret-here"
JWT_EXPIRES_IN=24h
```

### 4. Test on VPS
```bash
# SSH into your VPS
cd /path/to/your/app/backend

# Test database and JWT
node test-password-change.js

# If successful, restart your backend
pm2 restart backend
# or
systemctl restart your-app-service
```

## Troubleshooting

### Issue: "No admin users found"
Run this SQL to create an admin:
```sql
INSERT INTO admin_users (username, password_hash, name, email, role) 
VALUES (
  'admin', 
  '$2b$10$YourHashedPasswordHere',
  'System Administrator',
  'admin@school.com',
  'admin'
);
```

Or use the test script which will create one automatically.

### Issue: "Database connection failed"
Check:
1. PostgreSQL is running: `systemctl status postgresql`
2. Database exists: `psql -U postgres -l`
3. Credentials in .env are correct
4. Port 5432 is accessible

### Issue: "Token still invalid after re-login"
1. Clear browser cache completely
2. Check backend logs for JWT_SECRET length
3. Ensure .env file is being loaded (check `require('dotenv').config()` in server.js)
4. Restart backend server

## Security Notes for Production

1. **Never commit .env to git**
   - Add `.env` to `.gitignore`
   - Use environment variables on VPS

2. **Use strong JWT_SECRET**
   - Minimum 48 characters
   - Random alphanumeric
   - Never share or expose

3. **Database Security**
   - Use strong database passwords
   - Restrict database access to localhost only
   - Use SSL for database connections if remote

4. **HTTPS**
   - Always use HTTPS in production
   - Set `NODE_ENV=production` in .env
   - Configure SSL certificates

## Quick Test Commands

```bash
# Test database connection
cd backend
node -e "require('dotenv').config(); const pool = require('./config/db'); pool.query('SELECT NOW()').then(r => console.log('✅ DB Connected:', r.rows[0])).catch(e => console.error('❌ DB Error:', e.message)).finally(() => pool.end())"

# Test JWT_SECRET
node -e "require('dotenv').config(); console.log('JWT_SECRET length:', process.env.JWT_SECRET?.length || 0)"

# Generate test token
node generate-fresh-token.js
```

## Files Created for Testing

1. `backend/test-password-change.js` - Complete system test
2. `backend/generate-fresh-token.js` - Generate valid JWT token
3. This guide - `FIX_PASSWORD_CHANGE_JWT_ISSUE.md`

## Next Steps

1. Run the test scripts locally first
2. Fix any issues found
3. Deploy to VPS with proper environment variables
4. Test on VPS
5. Clear browser storage and re-login
6. Test password change functionality

---

**Need Help?**
- Check backend logs: `pm2 logs backend` or `journalctl -u your-service`
- Check browser console for errors (F12)
- Verify API endpoint: `curl -X POST http://your-vps:5000/api/admin/change-password`
