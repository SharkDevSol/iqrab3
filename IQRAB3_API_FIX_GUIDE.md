# IQRAB3 API Connection Fix

## Problem
Frontend was connecting to `localhost:5000` instead of VPS backend at `76.13.48.245:5000`

## Solution Applied

### Files Updated
1. ✅ `APP/.env` - Updated to VPS IP
2. ✅ `APP/.env.production` - Updated to VPS IP

### Changes Made
```env
# Before
VITE_API_URL=http://localhost:5000/api

# After
VITE_API_URL=http://76.13.48.245:5000/api
```

## Deployment Steps

### Step 1: Build Frontend
```bash
cd APP
npm run build
```

Or simply run:
```bash
DEPLOY_IQRAB3_FRONTEND.bat
```

### Step 2: Upload to VPS

**Option A - Using SCP (Recommended):**
```bash
scp -r APP/dist/* root@76.13.48.245:/var/www/skoolific/iqrab3/APP/dist/
```

**Option B - Using SSH + Manual Upload:**
```bash
# 1. Connect to VPS
ssh root@76.13.48.245

# 2. Backup old dist
cd /var/www/skoolific/iqrab3/APP
mv dist dist.backup.$(date +%Y%m%d_%H%M%S)

# 3. Create new dist folder
mkdir dist

# 4. Exit SSH and upload from local machine
exit

# 5. Upload files (use FileZilla/WinSCP)
# Connect to: 76.13.48.245
# Upload: APP/dist/* to /var/www/skoolific/iqrab3/APP/dist/
```

**Option C - Using Git (If repo is set up):**
```bash
# On local machine
git add APP/.env APP/.env.production
git commit -m "Fix: Update API URL to VPS IP"
git push

# On VPS
ssh root@76.13.48.245
cd /var/www/skoolific/iqrab3
git pull
cd APP
npm run build
```

### Step 3: Verify Backend is Running
```bash
ssh root@76.13.48.245

# Check PM2 status
pm2 status

# Should see backend running on port 5000
# If not running:
cd /var/www/skoolific/iqrab3/backend
pm2 start server.js --name iqrab3-backend
pm2 save
```

### Step 4: Test Connection
1. Open browser: `http://76.13.48.245` or your domain
2. Open DevTools Console (F12)
3. Check for API calls - should now connect to `76.13.48.245:5000`
4. No more `ERR_CONNECTION_REFUSED` errors

## Verification Checklist

- [ ] Frontend built successfully
- [ ] dist folder uploaded to VPS
- [ ] Backend running on VPS (pm2 status)
- [ ] Port 5000 accessible (firewall rules)
- [ ] Browser console shows no connection errors
- [ ] API calls reaching VPS backend
- [ ] Data loading correctly

## Troubleshooting

### Still seeing localhost:5000?
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh (Ctrl+F5)
- Check if old dist files are cached

### Connection refused to VPS?
```bash
# Check if backend is running
ssh root@76.13.48.245
pm2 logs iqrab3-backend

# Check if port 5000 is open
sudo ufw status
sudo ufw allow 5000
```

### CORS errors?
Check backend `server.js` has correct CORS settings:
```javascript
app.use(cors({
  origin: '*', // Or specific domain
  credentials: true
}));
```

## Next Steps (Optional)

### Use Domain Instead of IP
Update to use domain name:
```env
VITE_API_URL=https://iqrab3.skoolific.com/api
```

Then configure Nginx reverse proxy on VPS.

### Enable HTTPS
```bash
ssh root@76.13.48.245
sudo certbot --nginx -d iqrab3.skoolific.com
```

## Quick Reference

**VPS Details:**
- IP: 76.13.48.245
- SSH: `ssh root@76.13.48.245`
- Backend Path: `/var/www/skoolific/iqrab3/backend`
- Frontend Path: `/var/www/skoolific/iqrab3/APP`
- Backend Port: 5000
- Database: iqrab3

**Useful Commands:**
```bash
# Check backend logs
ssh root@76.13.48.245 "pm2 logs iqrab3-backend --lines 50"

# Restart backend
ssh root@76.13.48.245 "pm2 restart iqrab3-backend"

# Check backend status
ssh root@76.13.48.245 "pm2 status"
```
