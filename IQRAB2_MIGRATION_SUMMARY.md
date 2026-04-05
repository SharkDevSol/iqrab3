# IQRAB2 Migration Summary

## Project Migration: Bilal → Iqrab2

**Date**: April 5, 2026  
**Repository**: https://github.com/SharkDevSol/iqrab2.git  
**Commit**: 93d2611 - "Update all URLs and port from bilal.skoolific.com:5011 to iqrab2.skoolific.com:5022"

---

## Changes Overview

### 1. Backend Configuration

#### Environment Files Updated:
- `backend/.env`
  - PORT: 5011 → 5022
  - FRONTEND_URL: bilal.skoolific.com → iqrab2.skoolific.com

- `backend/.env.production`
  - PORT: 5011 → 5022
  - FRONTEND_URL: bilal.skoolific.com → iqrab2.skoolific.com

- `backend/.env.vps`
  - PORT: 5011 → 5022
  - FRONTEND_URL: bilal.skoolific.com → iqrab2.skoolific.com
  - SSL paths updated to iqrab2.skoolific.com
  - Comment updated: "VPS PRODUCTION ENVIRONMENT - iqrab2.skoolific.com"

- `backend/.env.production.template`
  - PORT: 5011 → 5022
  - FRONTEND_URL: bilal.skoolific.com → iqrab2.skoolific.com
  - SSL paths updated to iqrab2.skoolific.com

#### Server Configuration:
- `backend/server.js`
  - Default PORT: 5011 → 5022
  - CORS allowed origins: bilal.skoolific.com → iqrab2.skoolific.com
  - localhost:5011 → localhost:5022

### 2. Frontend Configuration

#### Environment Files Updated:
- `APP/.env`
  - VITE_API_URL: bilal.skoolific.com/api → iqrab2.skoolific.com/api

- `APP/.env.production`
  - VITE_API_URL: bilal.skoolific.com/api → iqrab2.skoolific.com/api
  - Comment updated: "Production configuration for iqrab2 VPS"

- `APP/.env.development`
  - VITE_API_URL: localhost:5011/api → localhost:5022/api

#### Vite Configuration:
- `APP/vite.config.js`
  - Dev server port: 5011 → 5022
  - Proxy target: localhost:5011 → localhost:5022

### 3. Source Code Updates

All hardcoded URLs in 84+ files were updated from `bilal.skoolific.com` to `iqrab2.skoolific.com`:

#### Key Files Updated:
- `APP/src/utils/api.js`
- `APP/src/PAGE/Finance/MonthlyPaymentsNew.jsx`
- `APP/src/PAGE/TaskDetail.jsx`
- `APP/src/PAGE/StudentFaults/StudentFaultsS.jsx`
- `APP/src/PAGE/Setting/Setting.jsx`
- `APP/src/PAGE/Post/Post.jsx`
- `APP/src/PAGE/LiveAttendanceMonitor.jsx`
- `APP/src/PAGE/MarkListView/MarkListView.jsx`
- `APP/src/PAGE/Finance/ChartOfAccounts/*.jsx`
- `APP/src/PAGE/HR/*.jsx` (all HR components)
- `APP/src/PAGE/List/**/*.jsx` (all list components)
- `APP/src/PAGE/EvaluationBook/*.jsx`
- `APP/src/PAGE/Evaluation/*.jsx`
- `APP/src/COMPONENTS/**/*.jsx` (all components)
- And many more...

All localhost:5011 references updated to localhost:5022

---

## Port Configuration Summary

| Service | Old (Bilal) | New (Iqrab2) |
|---------|-------------|--------------|
| Backend API | 5011 | 5022 |
| Frontend Dev | 5011 | 5022 |
| WebSocket (AI06) | 7789 | 7789 (unchanged) |

---

## Deployment Instructions

### Prerequisites
1. VPS with Ubuntu/Debian
2. Node.js 18+ installed
3. PostgreSQL 14+ installed
4. Nginx installed
5. PM2 installed globally
6. Domain iqrab2.skoolific.com pointing to VPS IP

### Step 1: Clone Repository
```bash
cd /var/www
git clone https://github.com/SharkDevSol/iqrab2.git iqrab2-school
cd iqrab2-school
```

### Step 2: Backend Setup
```bash
cd backend
npm install

# Copy and configure environment
cp .env.production .env
nano .env  # Update database credentials, JWT secret, etc.

# Run database migrations
npx prisma generate
npx prisma migrate deploy

# Start with PM2
pm2 start server.js --name iqrab2-backend
pm2 save
```

### Step 3: Frontend Build
```bash
cd ../APP
npm install
npm run build

# Copy build to web directory
sudo mkdir -p /var/www/iqrab2.skoolific.com
sudo cp -r dist/* /var/www/iqrab2.skoolific.com/
```

### Step 4: Nginx Configuration
Create `/etc/nginx/sites-available/iqrab2.skoolific.com`:

```nginx
server {
    listen 80;
    server_name iqrab2.skoolific.com;
    
    root /var/www/iqrab2.skoolific.com;
    index index.html;
    
    # Frontend
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API
    location /api {
        proxy_pass http://localhost:5022;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/iqrab2.skoolific.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 5: SSL Certificate (Let's Encrypt)
```bash
sudo certbot --nginx -d iqrab2.skoolific.com
```

### Step 6: Verify Deployment
1. Visit https://iqrab2.skoolific.com
2. Check backend health: https://iqrab2.skoolific.com/api/health
3. Test login functionality
4. Verify AI06 device connection (if applicable)

---

## Testing Checklist

- [ ] Backend starts on port 5022
- [ ] Frontend loads at iqrab2.skoolific.com
- [ ] API calls work correctly
- [ ] Login/authentication works
- [ ] Database connections successful
- [ ] WebSocket connections work (if using AI06)
- [ ] SSL certificate valid
- [ ] All pages load without errors
- [ ] No console errors referencing old URLs

---

## Rollback Plan

If issues occur:
```bash
# Stop backend
pm2 stop iqrab2-backend

# Restore previous version
cd /var/www/iqrab2-school
git log  # Find previous commit
git checkout <previous-commit-hash>

# Rebuild and restart
cd APP && npm run build
sudo cp -r dist/* /var/www/iqrab2.skoolific.com/
cd ../backend && pm2 restart iqrab2-backend
```

---

## Important Notes

1. **Database**: Uses same database structure as bilal/iqrab3 systems
2. **AI06 Device**: WebSocket port remains 7788 (unchanged)
3. **Ethiopian Calendar**: Fixed date conversion issues included in this version
4. **Staff Attendance**: Uses corrected Ethiopian calendar utility function
5. **Port Conflicts**: Ensure port 5022 is not used by other services

---

## Files Modified Summary

### Backend (10 files)
- .env
- .env.production
- .env.production.template
- .env.vps
- server.js
- services/ai06WebSocketService.js
- utils/ethiopianCalendar.js
- routes/staffRoutes.js

### Frontend (94 files)
- Environment files (.env, .env.production, .env.development)
- vite.config.js
- All source files with hardcoded URLs (84 files)

---

## GitHub Repository

**Repository**: https://github.com/SharkDevSol/iqrab2.git  
**Branch**: main  
**Latest Commit**: 93d2611  
**Commit Message**: "Update all URLs and port from bilal.skoolific.com:5011 to iqrab2.skoolific.com:5022"

---

## Support

For issues or questions:
1. Check GitHub issues: https://github.com/SharkDevSol/iqrab2/issues
2. Review deployment logs: `pm2 logs iqrab2-backend`
3. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`

---

**Migration completed successfully on April 5, 2026**
