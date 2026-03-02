# Rebuild Frontend on VPS

## Issue
The frontend `.env.production` was missing `/api` in the URL, causing 405 errors.

## Fix Applied
Updated `APP/.env.production` to include `/api` prefix:
```
VITE_API_URL=https://bilal.skoolific.com/api
```

## Commands to Run on VPS

```bash
# Pull latest changes from GitHub
cd /var/www/bilal-school
git pull origin main

# Navigate to frontend
cd APP

# Verify the .env.production file
cat .env.production
# Should show: VITE_API_URL=https://bilal.skoolific.com/api

# Rebuild the frontend with production environment
NODE_ENV=production npm run build

# Verify build completed
ls -la dist/

# No need to restart PM2 (frontend is static files served by Nginx)
# Just refresh browser
```

## Expected Result
After rebuild and browser refresh:
- ✅ No more 405 errors
- ✅ No more CORS errors
- ✅ All API calls go to https://bilal.skoolific.com/api/*
- ✅ Dashboard loads with data

## Test
Open https://bilal.skoolific.com in browser and check:
1. Login works
2. Dashboard loads
3. No console errors
4. All features work
