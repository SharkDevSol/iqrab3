# Connect Your Mobile Phone to Localhost

## 🎯 Quick Guide

Follow these steps to test the mobile apps on your phone:

---

## Step 1: Find Your Computer's IP Address

### On Windows:

1. Open **Command Prompt** (Win + R, type `cmd`, press Enter)
2. Type: `ipconfig`
3. Look for **"IPv4 Address"** under your active network adapter
4. It looks like: `192.168.1.100` or `192.168.0.50`

Example output:
```
Wireless LAN adapter Wi-Fi:
   IPv4 Address. . . . . . . . . . . : 192.168.1.100
```

**Write down this IP address!**

---

## Step 2: Make Sure Both Devices Are on Same WiFi

- Your computer and phone must be on the **same WiFi network**
- Check your phone's WiFi settings
- Make sure it's connected to the same network as your computer

---

## Step 3: Check Windows Firewall

Your firewall might block connections. Let's allow them:

### Option A: Temporarily Disable Firewall (Easiest for Testing)

1. Open **Windows Security**
2. Go to **Firewall & network protection**
3. Click your active network (Private network)
4. Turn off **Windows Defender Firewall**
5. Test on phone
6. **Remember to turn it back on after testing!**

### Option B: Add Firewall Rule (Better for Security)

1. Open **Windows Defender Firewall with Advanced Security**
2. Click **Inbound Rules** → **New Rule**
3. Select **Port** → Next
4. Select **TCP** → Specific local ports: `5173,5000`
5. Select **Allow the connection** → Next
6. Check all profiles → Next
7. Name it "Skoolific Dev" → Finish

---

## Step 4: Access from Your Phone

1. Open **Chrome** on your phone
2. Type in the address bar: `http://YOUR-IP:5173`
   - Replace `YOUR-IP` with the IP from Step 1
   - Example: `http://192.168.1.100:5173`
3. Press Enter

**You should see your Skoolific app!**

---

## Step 5: Test the Mobile Apps

### Test Student App:
1. Go to: `http://YOUR-IP:5173/app/student-login`
2. Or navigate: Settings → Apps → Click "Install Student App"
3. Chrome will show "Add to Home Screen" banner
4. Tap "Add" or "Install"
5. App icon appears on home screen!

### Test Staff App:
1. Go to: `http://YOUR-IP:5173/app/staff-login`
2. Or from Settings → Apps → "Install Staff App"
3. Add to home screen

### Test Guardian App:
1. Go to: `http://YOUR-IP:5173/app/guardian-login`
2. Or from Settings → Apps → "Install Guardian App"
3. Add to home screen

### Test Admin App:
1. Go to: `http://YOUR-IP:5173/`
2. Or from Settings → Apps → "Install on Mobile"
3. Add to home screen

---

## 🎯 Quick Test Commands

Run this batch file to show your IP and start the server:

```batch
@echo off
echo ========================================
echo   Skoolific Mobile Testing
echo ========================================
echo.
echo Your computer's IP address:
ipconfig | findstr /i "IPv4"
echo.
echo On your phone, open Chrome and go to:
echo http://YOUR-IP-FROM-ABOVE:5173
echo.
echo Make sure:
echo 1. Phone and computer on same WiFi
echo 2. Firewall allows connections
echo.
echo Starting development server...
cd APP
npm run dev
```

Save this as `TEST_ON_MOBILE.bat` and run it!

---

## 📱 What You'll See on Mobile

### When Install Button Works:
1. Click "Install Student App" (or any app)
2. Chrome shows banner: "Add Skoolific to Home screen"
3. Tap "Add" or "Install"
4. App icon appears on home screen
5. Open it - works like native app!

### If Button Doesn't Show Prompt:
1. Tap the **3 dots menu** (⋮) in Chrome
2. Select **"Add to Home screen"**
3. Name it and tap "Add"
4. Icon appears on home screen

---

## 🆘 Troubleshooting

### "Can't connect" or "Site can't be reached"

**Check 1: Same WiFi?**
- Phone and computer must be on same network
- Check WiFi name on both devices

**Check 2: Correct IP?**
- Run `ipconfig` again
- Make sure you're using IPv4 address
- Should look like: 192.168.x.x

**Check 3: Firewall?**
- Temporarily disable Windows Firewall
- Or add firewall rule (see Step 3)

**Check 4: Server Running?**
- Make sure `npm run dev` is running
- Should show: "Local: http://localhost:5173"

**Check 5: Try Different Port**
- If 5173 doesn't work, check what port Vite is using
- Look at the terminal output

### "Install button doesn't work"

**This is normal on desktop!**
- Use address bar install icon instead
- Or Chrome menu → "Install Skoolific..."

**On mobile, if it doesn't work:**
- Use manual method: Chrome menu → "Add to Home screen"
- Make sure you're using Chrome (not Firefox/Safari)

### "Backend not working"

**Update backend to accept connections:**

Edit `backend/server.js` - make sure it listens on all interfaces:

```javascript
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
```

Then restart backend:
```bash
cd backend
npm start
```

---

## ✅ Success Checklist

- [ ] Found computer's IP address
- [ ] Phone and computer on same WiFi
- [ ] Firewall allows connections (or disabled for testing)
- [ ] Can access `http://YOUR-IP:5173` from phone
- [ ] Install buttons show "Add to Home Screen" prompt
- [ ] Apps install to home screen
- [ ] Apps open and work correctly

---

## 💡 Pro Tips

1. **Bookmark the IP**
   - Save `http://YOUR-IP:5173` in phone browser
   - Quick access for testing

2. **Use QR Code**
   - Generate QR code for the URL
   - Scan with phone camera
   - Opens directly in browser

3. **Keep Firewall Rule**
   - Don't disable firewall permanently
   - Add specific rule for ports 5173 and 5000
   - More secure

4. **Test on Multiple Devices**
   - Try on different phones
   - Test on tablet
   - Check on different Android versions

5. **Check Console**
   - Open Chrome DevTools on phone
   - chrome://inspect on desktop
   - See mobile console logs

---

## 🎉 Expected Results

After following these steps:

✅ Phone can access your localhost
✅ All 4 apps (Student, Staff, Guardian, Admin) are accessible
✅ Install buttons trigger "Add to Home Screen"
✅ Apps install to phone home screen
✅ Apps work like native mobile apps
✅ Can test login, navigation, all features

---

## 📞 Quick Reference

**Your IP**: _____________ (fill in from Step 1)

**URLs to test:**
- Main: `http://YOUR-IP:5173`
- Student: `http://YOUR-IP:5173/app/student-login`
- Staff: `http://YOUR-IP:5173/app/staff-login`
- Guardian: `http://YOUR-IP:5173/app/guardian-login`
- Settings: `http://YOUR-IP:5173/settings`

---

Good luck testing! 🚀
