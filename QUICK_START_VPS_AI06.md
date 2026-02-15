# ⚡ QUICK START GUIDE - VPS + AI06

## 🛒 STEP 1: PURCHASE VPS (5 minutes)

Go to **Hostinger.com** and select:

```
✅ Plan: KVM 2 ($83.88/year)
✅ Location: United Kingdom
✅ OS: Plain OS → Ubuntu 22.04 LTS
✅ Panel: None
✅ Backups: Free Weekly
✅ Period: 12 months
```

**Click "Purchase" and complete payment.**

---

## ☁️ STEP 2: SETUP CLOUDFLARE (10 minutes)

1. Go to **cloudflare.com** → Sign up (FREE)
2. Click "Add Site" → Enter your domain
3. Copy the 2 nameservers Cloudflare gives you
4. Go to your domain registrar → Update nameservers
5. Wait 5-30 minutes for DNS propagation
6. Done! ✅

---

## 🔧 STEP 3: CONFIGURE AI06 DEVICE (2 minutes)

On the AI06 machine menu:

```
MENU → Comm set → Ethernet → DHCP: YES
MENU → Comm set → Server → server reg: YES
MENU → Comm set → Server → server IP: [YOUR_VPS_IP]
MENU → Comm set → Server → server Port: 7788
MENU → Comm set → Server → Server approval: NO
```

**Replace `[YOUR_VPS_IP]` with the IP from Hostinger email.**

---

## 🚀 STEP 4: DEPLOY TO VPS (30 minutes)

### **A. Connect to VPS:**
```bash
ssh root@YOUR_VPS_IP
# Enter password from Hostinger email
```

### **B. Install Software:**
```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install MySQL
apt install -y mysql-server

# Install Nginx
apt install -y nginx

# Install PM2
npm install -g pm2
```

### **C. Upload Your Code:**
```bash
# Clone or upload your school ERP
cd /var/www
# Upload your code here

# Install dependencies
cd school-erp/backend
npm install
npm install ws  # For AI06 integration

# Setup database
npx prisma generate
npx prisma migrate deploy
```

### **D. Configure Firewall:**
```bash
ufw allow 22/tcp   # SSH
ufw allow 80/tcp   # HTTP
ufw allow 443/tcp  # HTTPS
ufw allow 5000/tcp # Backend API
ufw allow 7788/tcp # AI06 device
ufw enable
```

### **E. Start Services:**
```bash
cd /var/www/school-erp/backend
pm2 start server.js --name school-erp-backend
pm2 startup
pm2 save
```

---

## ✅ STEP 5: TEST (5 minutes)

### **A. Check Backend:**
```bash
pm2 logs school-erp-backend
# Should see: "AI06 WebSocket Server started on port 7788"
```

### **B. Test AI06 Connection:**
1. Scan a fingerprint on AI06 machine
2. Check logs: `pm2 logs`
3. Should see: "Device registered: [SERIAL_NUMBER]"
4. Should see: "Attendance logged: [Name]"
5. Voice should play on AI06 speaker

### **C. Test Dashboard:**
1. Open browser: `http://YOUR_VPS_IP:5000`
2. Login to admin panel
3. Go to Attendance page
4. Scan fingerprint on AI06
5. Dashboard should update instantly

---

## 🔊 VOICE MESSAGES

### **Default Messages:**

| Payment Status | Voice Message |
|----------------|---------------|
| Paid | "Welcome [Name]. Thank you for your payment." |
| Small Balance | "Welcome [Name]. You have a small balance remaining." |
| Late | "[Name], please visit the finance office." |
| Overdue | "[Name], URGENT: Payment overdue." |

### **Customize:**

Edit `backend/services/ai06WebSocketService.js` line 180:

```javascript
getVoiceMessage(paymentStatus, name) {
  const messages = {
    'PAID': `Welcome ${name}!`,
    'LATE': `${name}, visit finance office`,
    // ... customize here
  };
  return messages[paymentStatus.status];
}
```

Restart: `pm2 restart school-erp-backend`

---

## ⚠️ TROUBLESHOOTING

### **AI06 Not Connecting?**
```bash
# Check firewall
ufw status | grep 7788
# Should show: 7788/tcp ALLOW

# Check service
pm2 logs school-erp-backend
# Should show: "AI06 WebSocket Server started"

# Check AI06 settings
# Verify: Server IP = Your VPS IP, Port = 7788
```

### **Voice Not Playing?**
```bash
# Check logs
pm2 logs school-erp-backend
# Should show: voice: "Welcome..."

# Check AI06 volume
# MENU → System → Volume → Increase
```

### **Attendance Not Saving?**
```bash
# Check database connection
cd /var/www/school-erp/backend
node scripts/check-students-db.js

# Check logs for errors
pm2 logs --err
```

---

## 📊 MONITORING

### **Check Status:**
```bash
# Backend status
pm2 status

# View logs
pm2 logs school-erp-backend

# Check connected devices
pm2 logs | grep "Device registered"

# Check attendance logs
pm2 logs | grep "Attendance logged"
```

### **Restart Services:**
```bash
# Restart backend
pm2 restart school-erp-backend

# Restart all
pm2 restart all

# View logs
pm2 logs
```

---

## 🎯 COMPLETE CHECKLIST

- [ ] VPS purchased from Hostinger (KVM 2, UK)
- [ ] Cloudflare account created and domain added
- [ ] AI06 device configured with VPS IP
- [ ] Software installed on VPS (Node.js, MySQL, Nginx)
- [ ] School ERP code uploaded
- [ ] Dependencies installed (`npm install ws`)
- [ ] Firewall configured (ports 22, 80, 443, 5000, 7788)
- [ ] Backend started with PM2
- [ ] AI06 device connected (check logs)
- [ ] Test fingerprint scan works
- [ ] Voice messages playing
- [ ] Dashboard updates in real-time
- [ ] SSL certificate installed (optional but recommended)

---

## 💰 TOTAL COST

- VPS: $83.88/year
- Cloudflare: FREE
- SSL: FREE
- Backups: FREE
- **Total: $83.88/year ($6.99/month)**

---

## 📞 NEED HELP?

1. Check logs: `pm2 logs school-erp-backend`
2. Read full guide: `AI06_INTEGRATION_COMPLETE_GUIDE.md`
3. Check device connection in logs
4. Verify firewall settings
5. Test with simple fingerprint scan

---

## 🎉 SUCCESS!

Your school ERP system is now live with:
- ✅ Real-time attendance
- ✅ Voice alerts for late payments
- ✅ Live dashboard updates
- ✅ AI06 biometric integration
- ✅ Fast performance (Cloudflare CDN)
- ✅ Secure (SSL + Firewall)

**Students will hear payment reminders every time they scan!** 🔊
