# Hostinger VPS Deployment Guide - Step by Step

## Your VPS Details
- **IP Address**: 76.13.48.245
- **VPS Name**: srv1357596.hstgr.cloud (KVM 2)
- **GitHub Repository**: https://github.com/SharkDevSol/iqra.git
- **Database**: PostgreSQL

---

## STEP 1: Connect to Your VPS

**On Windows, open PowerShell or Command Prompt and type:**

```bash
ssh root@76.13.48.245
```

- Press Enter
- Type your VPS password (you won't see it while typing - this is normal)
- Press Enter again

✅ **You're now inside your VPS!**

---

## STEP 2: Update Your System

**Copy and paste this command:**

```bash
apt update && apt upgrade -y
```

- Wait for it to finish (may take 2-5 minutes)
- If asked any questions, just press Enter to accept defaults

✅ **System updated!**

---

## STEP 3: Install Node.js

**Copy and paste these commands one by one:**

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
```

Wait for it to finish, then:

```bash
apt install -y nodejs
```

**Check if Node.js is installed:**

```bash
node --version
npm --version
```

You should see version numbers like v18.x.x and 9.x.x

✅ **Node.js installed!**

---

## STEP 4: Install PostgreSQL

**Copy and paste this command:**

```bash
apt install -y postgresql postgresql-contrib
```

Wait for installation to complete.

**Start PostgreSQL:**

```bash
systemctl start postgresql
systemctl enable postgresql
```

✅ **PostgreSQL installed and running!**

---

## STEP 5: Create Database and User

**Switch to PostgreSQL user:**

```bash
sudo -u postgres psql
```

You'll see a prompt like `postgres=#`

**Now copy and paste these commands one by one:**

```sql
CREATE DATABASE school_management;
```

```sql
CREATE USER school_user WITH PASSWORD 'School@2024#Strong';
```

```sql
GRANT ALL PRIVILEGES ON DATABASE school_management TO school_user;
```

```sql
\q
```

The last command `\q` exits PostgreSQL.

✅ **Database created!**

---

## STEP 6: Install Other Required Software

**Install Nginx (web server):**

```bash
apt install -y nginx
```

**Install Git:**

```bash
apt install -y git
```

**Install PM2 (keeps your app running):**

```bash
npm install -g pm2
```

✅ **All software installed!**

---

## STEP 7: Download Your Project from GitHub

**Go to the web directory:**

```bash
cd /var/www
```

**Clone your project:**

```bash
git clone https://github.com/SharkDevSol/iqra.git
```

**Go into your project folder:**

```bash
cd iqra
```

✅ **Project downloaded!**

---

## STEP 8: Setup Backend (Server Side)

**Go to backend folder:**

```bash
cd /var/www/iqra/backend
```

**Install all dependencies:**

```bash
npm install
```

This will take 2-5 minutes. Wait for it to complete.

**Create environment file:**

```bash
nano .env
```

This opens a text editor. **Copy and paste this:**

```env
PORT=5000
DATABASE_URL="postgresql://school_user:School@2024#Strong@localhost:5432/school_management"
JWT_SECRET=your_super_secret_jwt_key_change_this_to_something_random_and_long
NODE_ENV=production
```

**To save and exit:**
- Press `Ctrl + X`
- Press `Y`
- Press `Enter`

**Setup database tables:**

```bash
npx prisma migrate deploy
npx prisma generate
```

**Start the backend with PM2:**

```bash
pm2 start server.js --name school-backend
pm2 save
pm2 startup
```

Copy the command it shows you and run it (it will look like `sudo env PATH=...`)

✅ **Backend is running!**

---

## STEP 9: Setup Frontend (User Interface)

**Go to frontend folder:**

```bash
cd /var/www/iqra/APP
```

**Install dependencies:**

```bash
npm install
```

This will take 2-5 minutes.

**Build the frontend:**

```bash
npm run build
```

✅ **Frontend built!**

---

## STEP 10: Configure Nginx (Web Server)

**Create Nginx configuration file:**

```bash
nano /etc/nginx/sites-available/school-management
```

**Copy and paste this entire configuration:**

```nginx
server {
    listen 80;
    server_name 76.13.48.245;

    # Frontend - serve the built React app
    location / {
        root /var/www/iqra/APP/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # WebSocket for real-time features
    location /socket.io {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Save and exit:**
- Press `Ctrl + X`
- Press `Y`
- Press `Enter`

**Enable the configuration:**

```bash
ln -s /etc/nginx/sites-available/school-management /etc/nginx/sites-enabled/
```

**Remove default site:**

```bash
rm /etc/nginx/sites-enabled/default
```

**Test Nginx configuration:**

```bash
nginx -t
```

You should see "syntax is ok" and "test is successful"

**Restart Nginx:**

```bash
systemctl restart nginx
```

✅ **Nginx configured!**

---

## STEP 11: Configure Firewall

**Allow web traffic:**

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

Press `Y` when asked to proceed.

✅ **Firewall configured!**

---

## STEP 12: Test Your Application

**Open your web browser and go to:**

```
http://76.13.48.245
```

🎉 **Your school management system should be live!**

---

## Useful Commands for Later

### Check if backend is running:
```bash
pm2 list
```

### View backend logs:
```bash
pm2 logs school-backend
```

### Restart backend:
```bash
pm2 restart school-backend
```

### Stop backend:
```bash
pm2 stop school-backend
```

### Check Nginx status:
```bash
systemctl status nginx
```

### Restart Nginx:
```bash
systemctl restart nginx
```

---

## When You Update Your Code on GitHub

**SSH into your VPS and run:**

```bash
cd /var/www/iqra
git pull origin main

# Update backend
cd backend
npm install
npx prisma migrate deploy
pm2 restart school-backend

# Update frontend
cd ../APP
npm install
npm run build
```

---

## Backup Your Database

**Create a backup:**

```bash
sudo -u postgres pg_dump school_management > backup_$(date +%Y%m%d).sql
```

**Restore a backup:**

```bash
sudo -u postgres psql school_management < backup_20240215.sql
```

---

## Troubleshooting

### If website doesn't load:

**Check backend:**
```bash
pm2 logs school-backend
```

**Check Nginx:**
```bash
systemctl status nginx
tail -f /var/log/nginx/error.log
```

**Check PostgreSQL:**
```bash
systemctl status postgresql
```

### If you see "502 Bad Gateway":
- Backend is not running. Check with `pm2 list`
- Restart it with `pm2 restart school-backend`

### If you see "404 Not Found":
- Frontend build might be missing
- Go to `/var/www/iqra/APP` and run `npm run build`

---

## Important Notes

1. **Database Password**: We used `School@2024#Strong` - change this to something more secure
2. **JWT Secret**: Change the JWT_SECRET in your .env file to a random long string
3. **Keep your VPS updated**: Run `apt update && apt upgrade` monthly
4. **Monitor your app**: Use `pm2 monit` to see resource usage

---

## Need Help?

- Check backend logs: `pm2 logs school-backend`
- Check Nginx logs: `tail -f /var/log/nginx/error.log`
- Check if services are running: `pm2 list` and `systemctl status nginx`


