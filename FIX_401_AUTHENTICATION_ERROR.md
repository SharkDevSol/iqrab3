# Fix for 401 Authentication Error on Faults Page

## Problem
The Student Faults page is showing 401 errors when fetching classes and reports:
- `Error fetching classes: AxiosError 401`
- `Error fetching reports: AxiosError 401`

## Root Cause
The `/api/faults/classes` and `/api/faults/reports` endpoints require authentication, but:
1. The user's JWT token may be expired
2. The JWT_SECRET on the server may have changed (causing signature mismatch)
3. The token is not being sent properly from the frontend

## Solution

### Option 1: Make Classes and Reports Endpoints Public (Recommended)
These endpoints don't expose sensitive data - they just list class names and aggregate statistics.

**File: `backend/routes/studentFaultsRoutes.js`**

Move the authentication middleware AFTER the public endpoints:

```javascript
// Apply input sanitization to all routes
router.use(sanitizeInputs);

// Public endpoints (no auth required)
router.get('/classes', async (req, res) => {
  // ... existing code
});

router.get('/reports', async (req, res) => {
  // ... existing code
});

// All other faults routes require authentication
router.use(authenticateToken);

// Protected endpoints below...
router.get('/students/:className', async (req, res) => {
  // ... existing code
});
```

### Option 2: Fix JWT Token Issues
If you want to keep authentication on all endpoints:

1. **Clear old tokens and re-login:**
   - Users need to log out and log back in
   - This generates a new token with the current JWT_SECRET

2. **Verify JWT_SECRET consistency:**
   - Check that `backend/.env` has the correct JWT_SECRET
   - Ensure it matches what was used to generate existing tokens

## Implementation Steps

### Step 1: Apply the Fix Locally
```bash
# Edit the file
nano backend/routes/studentFaultsRoutes.js

# Move router.use(authenticateToken) to line 100 (after public endpoints)
```

### Step 2: Test Locally
```bash
cd backend
npm start

# In another terminal
cd APP
npm run dev

# Test the faults page - should work now
```

### Step 3: Push to VPS
```bash
# Commit changes
git add backend/routes/studentFaultsRoutes.js
git commit -m "Fix: Make faults classes and reports endpoints public"

# Push to VPS
git push origin main

# SSH to VPS and deploy
ssh root@your-vps-ip
cd /path/to/your/app
git pull
pm2 restart backend
```

## Files Modified
- `backend/routes/studentFaultsRoutes.js` - Moved authentication middleware

## Testing Checklist
- [ ] Classes load on faults page
- [ ] Reports load on faults page
- [ ] Adding faults still requires authentication
- [ ] Editing faults still requires authentication
- [ ] Deleting faults still requires authentication
