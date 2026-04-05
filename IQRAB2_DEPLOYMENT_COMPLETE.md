# IQRAB2 Deployment Complete ✅

## Deployment Summary

**Date**: April 5, 2026  
**Domain**: https://iqrab2.skoolific.com  
**Status**: ✅ LIVE AND OPERATIONAL

---

## Deployment Details

### Server Information
- **VPS IP**: 76.13.48.245
- **Domain**: iqrab2.skoolific.com
- **SSL Certificate**: Let's Encrypt (Valid until July 4, 2026)
- **Web Server**: Nginx 1.24.0
- **Process Manager**: PM2

### Application Ports
| Service | Port | Status |
|---------|------|--------|
| Backend API | 5022 | ✅ Running |
| Frontend | 443 (HTTPS) | ✅ Running |
| WebSocket (AI06) | 7790 | ✅ Running |

### Directory Structure
```
/var/www/iqrab2-school/          # Application source
├── backend/                      # Backend Node.js application
│   ├── .env                      # Environment configuration
│   ├── server.js                 # Main server file
│   └── ...
└── APP/                          # Frontend React application
    ├── dist/                     # Built files
    └── ...

/var/www/iqrab2.skoolific.com/   # Nginx web root (frontend build)
```

### Configuration Files
- **Nginx Config**: `/etc/nginx/sites-available/iqrab2.skoolific.com`
- **Backend .env**: `/var/www/iqrab2-school/backend/.env`
- **PM2 Process**: `iqrab2-backend` (ID: 3)

---

## Verification Tests

### ✅ Frontend
```bash
curl -I https://iqrab2.skoolific.com
# Response: HTTP/2 200
```

### ✅ Backend API
```bash
curl https://iqrab2.skoolific.com/api/health
# Response: {"status":"OK","message":"Server is running"}
```

### ✅ SSL Certificate
- Certificate installed and valid
- Auto-renewal configured via certbot

---

## Database Configuration

**Database**: PostgreSQL  
**Database Name**: school_management2  
**User**: skoolific_user  
**Schema**: school_comms  
**Timezone**: Africa/Addis_Ababa

**Note**: Shares the same database as iqrab3.skoolific.com

---

## AI06 Biometric Device Configuration

**WebSocket Port**: 7790  
**Device IP**: 192.168.1.6  
**Device Port**: 80

To connect the AI06 device to iqrab2:
1. Access device admin panel
2. Set Server IP: 76.13.48.245 (or local network IP)
3. Set Server Port: 7790
4. Enable Server Registration: YES

---

## PM2 Process Management

### View Logs
```bash
pm2 logs iqrab2-backend
```

### Restart Backend
```bash
pm2 restart iqrab2-backend
```

### Stop Backend
```bash
pm2 stop iqrab2-backend
```

### Start Backend
```bash
pm2 start iqrab2-backend
```

### View Status
```bash
pm2 status
```

---

## Nginx Management

### Test Configuration
```bash
nginx -t
```

### Reload Configuration
```bash
nginx -s reload
```

### View Error Logs
```bash
tail -f /var/log/nginx/error.log
```

### View Access Logs
```bash
tail -f /var/log/nginx/access.log
```

---

## Update Procedure

### Backend Updates
```bash
cd /var/www/iqrab2-school
git pull origin main
cd backend
npm install
pm2 restart iqrab2-backend
```

### Frontend Updates
```bash
cd /var/www/iqrab2-school/APP
npm install
npm run build
cp -r dist/* /var/www/iqrab2.skoolific.com/
```

---

## Environment Variables

Key environment variables in `/var/www/iqrab2-school/backend/.env`:

```env
PORT=5022
FRONTEND_URL=https://iqrab2.skoolific.com
DATABASE_URL=postgresql://skoolific_user:Skoolific2024Pass@localhost:5432/school_management2
JWT_SECRET=Y6SwiTPDZFappSIKm3n8ePeu3xCUfCnyahpywYmWsupYmyyBSZmYPTSD8bWGDB
AI06_WEBSOCKET_ENABLED=true
AI06_WEBSOCKET_PORT=7790
AI06_DEVICE_IP=192.168.1.6
HTTPS_ENABLED=false
NODE_ENV=production
```

---

## Troubleshooting

### Backend Not Responding
```bash
# Check if backend is running
pm2 status

# Check backend logs
pm2 logs iqrab2-backend --lines 50

# Restart backend
pm2 restart iqrab2-backend
```

### 502 Bad Gateway
```bash
# Check if backend is listening on port 5022
netstat -tlnp | grep 5022

# Check Nginx error logs
tail -f /var/log/nginx/error.log

# Test backend directly
curl http://localhost:5022/api/health
```

### SSL Certificate Issues
```bash
# Renew certificate manually
certbot renew

# Check certificate expiry
certbot certificates
```

### Port Conflicts
```bash
# Check what's using a port
netstat -tlnp | grep <port>

# Kill process on port
kill -9 <pid>
```

---

## Security Notes

1. **Firewall**: Ensure ports 80, 443, 5022, and 7790 are open
2. **SSL**: Certificate auto-renews via certbot
3. **Database**: Uses strong password, accessible only from localhost
4. **JWT**: Strong secret key configured
5. **CORS**: Configured to allow only iqrab2.skoolific.com

---

## Monitoring

### Check System Resources
```bash
# CPU and Memory usage
pm2 monit

# Disk usage
df -h

# Check running processes
pm2 list
```

### Health Checks
- Frontend: https://iqrab2.skoolific.com
- Backend API: https://iqrab2.skoolific.com/api/health
- WebSocket: Port 7790 (check PM2 logs)

---

## GitHub Repository

**Repository**: https://github.com/SharkDevSol/iqrab2.git  
**Branch**: main  
**Latest Commit**: 0bc72f6

---

## Next Steps

1. ✅ Test login functionality
2. ✅ Verify all pages load correctly
3. ✅ Test API endpoints
4. ⏳ Connect AI06 biometric device (if needed)
5. ⏳ Configure staff/student data
6. ⏳ Test attendance system

---

## Support Contacts

For issues or questions:
- Check PM2 logs: `pm2 logs iqrab2-backend`
- Check Nginx logs: `tail -f /var/log/nginx/error.log`
- GitHub Issues: https://github.com/SharkDevSol/iqrab2/issues

---

**Deployment completed successfully on April 5, 2026 at 18:10 UTC**

🎉 **iqrab2.skoolific.com is now live!**
