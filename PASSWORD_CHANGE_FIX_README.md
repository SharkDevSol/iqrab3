# Password Change JWT Fix - Quick Start

## The Problem
You're seeing "invalid signature" error because the JWT token in your browser was created with a different JWT_SECRET than what's currently in your backend.

## Quick Fix (Choose One)

### Option 1: Easiest - Just Re-login
1. Logout from your app
2. Login again
3. Try changing password

This will generate a new token with the correct JWT_SECRET.

### Option 2: Run the Fix Tool (Windows)
```bash
# Double-click this file:
FIX_JWT_TOKEN.bat
```

This will:
- Check your JWT configuration
- Test database connection
- Generate a fresh token
- Show you how to use it

### Option 3: Manual Fix
```bash
cd backend

# Test everything
node test-complete-flow.js

# Generate fresh token
node generate-fresh-token.js
```

## For VPS Deployment

### Before Deploying:

1. **Check your .env file has these:**
```env
# Database
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_secure_password
DB_HOST=localhost
DB_PORT=5432

# JWT - MUST be at least 32 characters
JWT_SECRET="Y6SwiTPDZFappSIKm3n8ePeu3xCUfCnyahpywYmWsupYmyyBSZmYPTSD8bWGDB"
JWT_EXPIRES_IN=24h
```

2. **Test locally first:**
```bash
cd backend
node test-complete-flow.js
```

3. **If all tests pass, deploy to VPS**

### On VPS:

1. **Upload your code**
2. **Set environment variables** (copy from local .env)
3. **Test on VPS:**
```bash
cd /path/to/your/app/backend
node test-complete-flow.js
```

4. **Start/Restart your server:**
```bash
pm2 restart backend
# or
systemctl restart your-app-service
```

5. **Clear browser storage and login again**

## Files Created

| File | Purpose |
|------|---------|
| `FIX_JWT_TOKEN.bat` | Windows batch file - easiest way to run fix |
| `backend/quick-fix-jwt.js` | Interactive fix tool |
| `backend/test-complete-flow.js` | Test entire password change flow |
| `backend/test-password-change.js` | Test JWT and database setup |
| `backend/generate-fresh-token.js` | Generate valid token for testing |
| `FIX_PASSWORD_CHANGE_JWT_ISSUE.md` | Detailed troubleshooting guide |

## Common Issues

### "No admin users found"
The test scripts will create one for you automatically.

### "Database connection failed"
Check:
- PostgreSQL is running
- Database credentials in .env are correct
- Database exists

### "Token still invalid after re-login"
1. Check backend logs for errors
2. Verify JWT_SECRET in .env is at least 32 characters
3. Restart backend server
4. Clear ALL browser storage (not just cookies)

## Testing the Fix

After fixing, test with:
```bash
cd backend
node test-complete-flow.js
```

If you see "✅ COMPLETE FLOW TEST PASSED!" - you're good to go!

## Need More Help?

See the detailed guide: `FIX_PASSWORD_CHANGE_JWT_ISSUE.md`

---

## Quick Commands Reference

```bash
# Test everything
cd backend && node test-complete-flow.js

# Generate token
cd backend && node generate-fresh-token.js

# Interactive fix
cd backend && node quick-fix-jwt.js

# Check JWT_SECRET
cd backend && node -e "require('dotenv').config(); console.log('JWT_SECRET length:', process.env.JWT_SECRET?.length)"

# Test database
cd backend && node -e "require('dotenv').config(); const pool = require('./config/db'); pool.query('SELECT NOW()').then(r => console.log('✅ Connected')).catch(e => console.error('❌ Error:', e.message)).finally(() => pool.end())"
```
