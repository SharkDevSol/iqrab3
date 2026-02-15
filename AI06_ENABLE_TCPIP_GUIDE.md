# 📱 How to Enable TCP/IP on AI06 Face Recognition Machine

## Step-by-Step Guide

### Step 1: Access the Menu
1. **Touch the screen** to wake up the machine
2. Look for the **Menu** button (usually at the bottom or top of screen)
3. **Tap Menu** - You may need to enter admin password if prompted
   - Default admin password is usually: **0** or **123456** or **888888**

### Step 2: Navigate to Communication Settings
Once in the menu, follow this path:

**Option A: If you see "Comm" or "Communication":**
```
Menu → Comm → TCP/IP
```

**Option B: If you see "System" or "Settings":**
```
Menu → System → Communication → TCP/IP
```

**Option C: Alternative path:**
```
Menu → Options → Communication → Network
```

### Step 3: Enable TCP/IP Service

You should now see a screen with network settings. Look for these options:

#### 3.1 Enable TCP/IP
- Find: **TCP/IP** or **TCP/IP Service**
- Current status might show: **Disabled** or **OFF**
- **Tap on it** to change to: **Enabled** or **ON**
- ✅ Make sure it shows **Enabled/ON**

#### 3.2 Enable Server Mode
- Find: **Server** or **Server Mode** or **RS232/485**
- Current status might show: **Disabled** or **OFF**
- **Tap on it** to change to: **Enabled** or **ON**
- ✅ Make sure it shows **Enabled/ON**

#### 3.3 Set Port Number
- Find: **Port** or **Port Number**
- Current value might be: **5005** or something else
- **Tap on it** to edit
- **Enter: 4370**
- ✅ Confirm port is set to **4370**

#### 3.4 Verify IP Address
- Find: **IP Address**
- Should show: **10.22.134.43**
- If different, note the actual IP (you'll need to update our database)

### Step 4: Save Settings
1. Look for **Save** or **OK** button
2. **Tap Save/OK**
3. You may see a confirmation message - tap **Yes** or **Confirm**

### Step 5: Restart the Machine
**IMPORTANT:** The machine must be restarted for changes to take effect!

**Method 1: Soft Restart (Recommended)**
```
Menu → System → Restart
or
Menu → Power → Restart
```

**Method 2: Hard Restart (If no restart option)**
1. Press and hold the power button for 3-5 seconds
2. Select **Restart** or **Reboot**
3. Wait for machine to fully restart (30-60 seconds)

### Step 6: Verify Settings After Restart
After the machine restarts:
1. Go back to: **Menu → Comm → TCP/IP**
2. Verify:
   - ✅ TCP/IP: **Enabled/ON**
   - ✅ Server: **Enabled/ON**
   - ✅ Port: **4370**
   - ✅ IP: **10.22.134.43**

---

## 🎯 Quick Reference Card

| Setting | Value |
|---------|-------|
| TCP/IP | **Enabled/ON** |
| Server | **Enabled/ON** |
| Port | **4370** |
| IP Address | **10.22.134.43** |

---

## 🔍 Troubleshooting

### Can't Find Menu Button?
- Try touching different areas of the screen
- Look for a gear icon ⚙️ or three lines ☰
- Try swiping from top or bottom of screen

### Menu Asks for Password?
Try these common admin passwords:
- **0**
- **123456**
- **888888**
- **666666**
- **111111**

If none work, check your machine's manual or contact your supplier.

### Can't Find TCP/IP Option?
Different firmware versions have different menu structures. Try:
- **Menu → Comm → Network**
- **Menu → System → Network**
- **Menu → Options → Communication**
- **Menu → Settings → Network**

### Settings Don't Save?
- Make sure you tap **Save** or **OK** before exiting
- Some machines require admin privileges - make sure you're logged in as admin
- Try restarting the machine and checking again

### Port 4370 Not Available?
- Some machines may use different ports
- Common alternatives: **4370**, **5005**, **8080**
- If 4370 doesn't work, note what port is available and let me know

---

## ✅ After Enabling TCP/IP

Once you've completed all steps and restarted the machine, run this command on your laptop:

```bash
cd backend
npm run diagnose:machine
```

You should see:
```
✅ Machine is reachable on network
✅ Socket created successfully!
✅ Device responded!

📱 Device Information:
   Serial Number: ABC123456
   Firmware Version: 6.60
```

If you see this, **congratulations!** Your machine is connected and ready to sync attendance! 🎉

---

## 📞 Still Need Help?

If you're stuck at any step:
1. Take a photo of the machine's menu screen
2. Note what options you see
3. Let me know and I'll guide you through your specific menu structure

---

## 🎬 Video Tutorial (If Available)

Search YouTube for: "ZKTeco enable TCP/IP" or "AI06 network settings"

Common video titles:
- "How to enable TCP/IP on ZKTeco device"
- "ZKTeco network configuration"
- "Connect ZKTeco to network"
