# 🚀 Deploy to iqrab3 VPS - Step by Step

## VPS Information
- **IP Address:** `76.13.48.245`
- **Domain:** `https://iqrab3.skoolific.com`
- **SSH User:** `root`

---

## ✅ EASIEST METHOD: Run the Deployment Script

### From Your Windows Machine:

1. **Open PowerShell or Command Prompt** in your project folder:
   ```
   C:\Users\USER\Desktop\For Now\iqrab3
   ```

2. **Run the deployment script:**
   ```batch
   DEPLOY_TO_IQRAB3_VPS.bat
   ```

3. **Enter your VPS password** when prompted

4. **Wait for deployment to complete** (about 30 seconds)

5. **Test the fix:**
   - Open https://iqrab3.skoolific.com
   - Go to Student Faults page
   - Classes and reports should load without 401 errors ✅

---

## 🔧 ALTERNATIVE: Manual SSH Deployment

If the script doesn't work, follow these manual steps:

### Step 1: Connect to VPS
```bash
ssh root@76.13.48.245
```
Enter your password when prompted.

### Step 2: Navigate to Project
```bash
cd /root/iqrab3
```

### Step 3: Pull Latest Changes
```bash
git pull origin main
```
You should see: "Fix: Make faults classes and reports endpoints public"

### Step 4: Install Dependencies (if needed)
```bash
cd backend
npm install
```

### Step 5: Restart Backend
```bash
pm2 restart backend
```

### Step 6: Check Status
```bash
pm2 status
```
Backend should show "online" ✅

### Step 7: View Logs (optional)
```bash
pm2 logs backend --lines 20
```

---

## 🧪 Testing After Deployment

1. Open your browser
2. Go to: https://iqrab3.skoolific.com
3. Navigate to **Student Faults** page
4. **Expected Results:**
   - ✅ Classes load without 401 errors
   - ✅ Reports load without 401 errors
   - ✅ You can select a class and view faults

---

## ❓ Troubleshooting

### Problem: Cannot connect to VPS
**Solution:**
- Check your internet connection
- Verify VPS IP: `76.13.48.245`
- Try pinging: `ping 76.13.48.245`

### Problem: SSH authentication failed
**Solution:**
- Make sure you have the correct password
- Or check if you need to use SSH key authentication

### Problem: PM2 not found
**Solution:**
```bash
ssh root@76.13.48.245
cd /root/iqrab3/backend
npm install -g pm2
pm2 start server.js --name backend
pm2 save
```

### Problem: Backend not starting
**Solution:**
```bash
ssh root@76.13.48.245
cd /root/iqrab3/backend

# Check for errors
npm start

# If it works, stop it (Ctrl+C) and start with PM2
pm2 start server.js --name backend
pm2 save
```

### Problem: Still getting 401 errors
**Solution:**
1. Check backend logs:
   ```bash
   ssh root@76.13.48.245
   pm2 logs backend --lines 50
   ```

2. Verify the code was updated:
   ```bash
   ssh root@76.13.48.245
   cd /root/iqrab3
   git log -1
   ```
   Should show: "Fix: Make faults classes and reports endpoints public"

3. Clear browser cache:
   - Press `Ctrl + Shift + Delete`
   - Clear cached files
   - Reload the page

4. Check if backend is running:
   ```bash
   ssh root@76.13.48.245
   pm2 status
   ```

---

## 📊 What Was Fixed

### Before:
```javascript
router.use(authenticateToken);  // ALL endpoints required auth
router.get('/classes', ...)     // ❌ Required auth
router.get('/reports', ...)     // ❌ Required auth
```

### After:
```javascript
// Public endpoints
router.get('/classes', ...)     // ✅ No auth required
router.get('/reports', ...)     // ✅ No auth required

router.use(authenticateToken);  // Only protected endpoints require auth
router.get('/students/:className', ...)  // 🔒 Still requires auth
router.post('/add-fault', ...)           // 🔒 Still requires auth
```

---

## 🎉 Success Checklist

After deployment, verify:
- [ ] SSH connection successful
- [ ] Git pull completed
- [ ] PM2 restart successful
- [ ] Backend shows "online" in PM2 status
- [ ] Website loads: https://iqrab3.skoolific.com
- [ ] Student Faults page loads
- [ ] Classes load without 401 errors
- [ ] Reports load without 401 errors

---

## 📞 Need Help?

If you encounter any issues:
1. Check the PM2 logs: `pm2 logs backend`
2. Verify backend is running: `pm2 status`
3. Check browser console for errors (F12)
4. Review the error messages carefully

---

**Ready to deploy? Run:** `DEPLOY_TO_IQRAB3_VPS.bat`
