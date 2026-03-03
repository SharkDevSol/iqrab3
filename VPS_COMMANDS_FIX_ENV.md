# VPS Commands to Fix Environment Configuration

## Problem
The `.env` file on the VPS was using old development settings instead of production settings for the Bilal system.

## Solution
Run these commands on your VPS to pull the corrected `.env.production` template and apply it:

```bash
# Navigate to the project directory
cd /var/www/bilal-school

# Pull the latest changes from GitHub
git pull origin main

# Copy the production environment template to .env
cp backend/.env.production backend/.env

# Restart PM2 with updated environment variables
pm2 restart bilal-backend --update-env

# View the logs to confirm it's working
pm2 logs bilal-backend --lines 20
```

## Test the API
After restarting, test the create-form endpoint:

```bash
curl -X POST http://localhost:5011/api/students/create-form \
  -H "Content-Type: application/json" \
  -d '{"classCount":1,"classes":["Grade_1"],"customFields":[]}'
```

You should see a success response like:
```json
{
  "message": "Form structure created successfully",
  "classes": ["Grade_1"],
  "customFields": []
}
```

## What Was Fixed in .env

1. **NODE_ENV**: Changed from `development` to `production`
2. **DB_NAME**: Changed from `school_management2` to `school_management10`
3. **DB_PASSWORD**: Changed from `12345678` to `Bilal2026SchoolSecurePass`
4. **PORT**: Added `5011`
5. **FRONTEND_URL**: Added `https://bilal.skoolific.com`
6. **AI06_WEBSOCKET_PORT**: Changed from `7788` to `7789` (to avoid conflict with iqrab3)
7. **JWT_SECRET**: Updated to new secure secret

## Verify Settings
After restart, you can verify the settings are loaded correctly:

```bash
# Check if the backend is listening on port 5011
netstat -tlnp | grep 5011

# Check PM2 environment variables
pm2 env 1
```

## Test in Browser
Once the backend is working, test creating classes in the browser:
1. Go to https://bilal.skoolific.com/tasks/2
2. Try creating a class
3. Check browser console for any errors
