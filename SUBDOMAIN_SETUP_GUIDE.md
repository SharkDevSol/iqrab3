# How to Make Frontend Work on Subdomain

## Complete Step-by-Step Guide

Let's say you want to setup **school1.skoolific.com**

---

## STEP 1: Add Subdomain in Hostinger DNS (5 minutes)

1. Go to **hpanel.hostinger.com**
2. Click **"Domains"** → Click **"skoolific.com"**
3. Click **"DNS / Name Servers"**
4. Click **"Add Record"**
5. Fill in:
   - Type: **A**
   - Name: **school1**
   - Points to: **76.13.48.245**
   - TTL: **3600**
6. Click **"Add Record"**

✅ Wait 10-30 minutes for DNS to propagate

---

## STEP 2: Setup Files on VPS

**SSH into your VPS and run these commands:**

### Clone Your Project

```bash
cd /var/www
git clone https://github.com/SharkDevSol/iqra.git school1
cd school1
```

---

## STEP 3: Setup Database

```bash
sudo -u postgres psql
```

**In PostgreSQL, run:**

```sql
CREATE DATABASE school1_db;
CREATE USER school1_user WITH PASSWORD 'School1Pass@2024';
GRANT ALL PRIVILEGES ON DATABASE school1_db TO school1_user;
ALTER DATABASE school1_db OWNER TO school1_user;
\q
```

---

## STEP 4: Configure Backend

```bash
cd /var/www/school1/backend
nano .env
```

**Paste this:**

```env
PORT=6843
DATABASE_URL="postgresql://school1_user:School1Pass@2024@localhost:5432/school1_db"
JWT_SECRET=school1_random_secret_key_change_this
NODE_ENV=production
```

**Save:** Press `Ctrl+X`, then `Y`, then `Enter`

---

## STEP 5: Install Backend

```bash
npm install
npx prisma migrate deploy
npx prisma generate
pm2 start server.js --name school1-backend
pm2 save
```

---

## STEP 6: Build Frontend

```bash
cd /var/www/school1/APP
npm install
npm run build
```

**This creates a `dist` folder with your built frontend files.**

---

## STEP 7: Configure Nginx (This Makes Frontend Work!)

**Create Nginx configuration:**

```bash
nano /etc/nginx/sites-available/school1
```

**Paste this configuration:**

```nginx
server {
    listen 80;
    server_name school1.skoolific.com;

    # This serves your frontend
    location / {
        root /var/www/school1/APP/dist;
        try_files $uri $uri/ /index.html;
        
        # Add these headers for better performance
        add_header Cache-Control "public, max-age=3600";
    }

    # This forwards API calls to backend
    location /api {
        proxy_pass http://localhost:6843;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # This handles WebSocket connections
    location /socket.io {
        proxy_pass http://localhost:6843;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```

**Save:** Press `Ctrl+X`, then `Y`, then `Enter`

---

## STEP 8: Enable Nginx Configuration

```bash
ln -s /etc/nginx/sites-available/school1 /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

If `nginx -t` shows "syntax is ok", you're good!

---

## STEP 9: Test Your Site

**Open browser and go to:**

```
http://school1.skoolific.com
```

You should see your frontend! 🎉

---

## STEP 10: Add HTTPS (SSL Certificate)

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d school1.skoolific.com
```

Follow the prompts. Now your site will work with:

```
https://school1.skoolific.com
```

---

## How It Works:

```
User types: https://school1.skoolific.com
                    ↓
            DNS points to: 76.13.48.245
                    ↓
            Nginx receives request
                    ↓
    ┌───────────────┴───────────────┐
    ↓                               ↓
Is it /api?                    Everything else?
    ↓                               ↓
Forward to backend          Serve frontend files
(localhost:6843)           (from /var/www/school1/APP/dist)
```

---

## For Additional Schools:

Just repeat the process with different names:

**School 2:**
- Subdomain: **school2** (becomes school2.skoolific.com)
- Port: **6844**
- Database: **school2_db**
- Folder: **/var/www/school2**
- Nginx file: **/etc/nginx/sites-available/school2**

**School 3:**
- Subdomain: **school3**
- Port: **6845**
- Database: **school3_db**
- Folder: **/var/www/school3**
- Nginx file: **/etc/nginx/sites-available/school3**

---

## Troubleshooting:

### Frontend doesn't load:
```bash
# Check if files exist
ls -la /var/www/school1/APP/dist

# Check Nginx
systemctl status nginx
nginx -t
```

### API calls fail:
```bash
# Check if backend is running
pm2 list

# Check backend logs
pm2 logs school1-backend
```

### Subdomain doesn't work:
```bash
# Test DNS
ping school1.skoolific.com

# Should show: 76.13.48.245
```

---

## Quick Commands Reference:

**Restart backend:**
```bash
pm2 restart school1-backend
```

**Rebuild frontend:**
```bash
cd /var/www/school1/APP
npm run build
```

**Restart Nginx:**
```bash
systemctl restart nginx
```

**View backend logs:**
```bash
pm2 logs school1-backend
```

**View Nginx logs:**
```bash
tail -f /var/log/nginx/error.log
```

---

## Summary:

1. ✅ Add subdomain DNS record in Hostinger
2. ✅ Clone project to VPS
3. ✅ Create database
4. ✅ Configure backend (.env with port)
5. ✅ Install and start backend with PM2
6. ✅ Build frontend (npm run build)
7. ✅ Configure Nginx to serve frontend and proxy API
8. ✅ Enable Nginx config and restart
9. ✅ Add SSL certificate
10. ✅ Access your site at https://school1.skoolific.com

**The key is STEP 7 (Nginx configuration) - this is what makes your frontend work on the subdomain!**
