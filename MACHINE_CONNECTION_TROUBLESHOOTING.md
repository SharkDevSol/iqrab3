# 🔧 Machine Connection Troubleshooting Guide

## Current Issue
**Machine at IP 192.168.43.50 is not reachable**

The diagnostic shows:
- ❌ Ping failed - machine not reachable
- ❌ Connection to device failed

## ✅ Solution Steps

### Step 1: Connect Machine to Network

**Option A: Phone Hotspot (Easiest for Testing)**

1. **Turn on your phone hotspot**
   - Go to phone settings → Hotspot
   - Turn it ON
   - Note the network name and password

2. **Connect your laptop to the hotspot**
   - Connect to the hotspot WiFi
   - Verify you're connected

3. **Connect AI06 machine to the hotspot**
   - On the machine, go to: **Menu → Comm → Wireless**
   - Select your hotspot network
   - Enter password
   - Wait for connection
   - **Write down the IP address shown on screen** (e.g., 192.168.43.50)

**Option B: Same WiFi Network**

1. Connect both laptop and machine to the same WiFi
2. Check machine's IP address on its display

### Step 2: Update IP Address in Database

Once you have the correct IP address from the machine's display:

**Method 1: Using Script (Recommended)**
```bash
cd backend
npm run update:machine-ip
```
Then enter the IP address when prompted.

**Method 2: Direct SQL**
```sql
UPDATE machine_config 
SET ip_address = 'YOUR_MACHINE_IP_HERE' 
WHERE id = 'machine-001';
```

### Step 3: Test Connection Again

```bash
npm run diagnose:machine
```

You should see:
```
✅ Machine is reachable on network
✅ Socket created successfully!
✅ Device responded!
```

## 🎯 Quick Commands Reference

```bash
# 1. Diagnose connection issues
npm run diagnose:machine

# 2. Update machine IP address
npm run update:machine-ip

# 3. Test connection (after fixing IP)
npm run test:machine

# 4. View current machine config
# Run in PostgreSQL:
SELECT * FROM machine_config;
```

## 📋 Checklist

Before testing connection, verify:

- [ ] Machine is powered ON
- [ ] Machine display shows an IP address
- [ ] Laptop and machine are on SAME network
- [ ] IP address in database matches machine's IP
- [ ] No firewall blocking port 4370

## 🔍 Common Issues & Solutions

### Issue 1: "Ping failed - machine not reachable"
**Cause:** Machine and laptop on different networks

**Solution:**
- Connect both to same WiFi/hotspot
- Verify by checking IP ranges (should be similar, e.g., both 192.168.43.x)

### Issue 2: "Connection timeout"
**Cause:** Firewall blocking port 4370

**Solution:**
- Temporarily disable firewall for testing
- Add exception for port 4370
- Check Windows Firewall settings

### Issue 3: "Wrong IP address"
**Cause:** Machine IP changed (DHCP)

**Solution:**
- Check machine's display for current IP
- Update database with correct IP
- Consider setting static IP on machine

### Issue 4: "Machine in sleep mode"
**Cause:** Machine went to standby

**Solution:**
- Wake up machine by touching screen
- Disable sleep mode in machine settings

## 📱 How to Check Machine IP

On the AI06 machine:
1. Press **Menu** button
2. Go to **Comm** → **Network** or **Wireless**
3. Look for **IP Address** field
4. Write it down (e.g., 192.168.43.50)

## 🌐 Network Configuration Tips

### For Testing (Phone Hotspot)
- **Pros:** Easy, quick, isolated network
- **Cons:** Need phone nearby, limited range
- **Best for:** Initial testing and development

### For Production (WiFi/LAN)
- **Pros:** Stable, always available
- **Cons:** Need network access, may need IT help
- **Best for:** Production deployment

### Static IP (Recommended for Production)
Set a static IP on the machine to prevent IP changes:
1. Go to machine: **Menu → Comm → Network**
2. Change from DHCP to Static
3. Set IP, Gateway, Subnet Mask
4. Save and restart

## 🧪 Testing Workflow

```bash
# 1. First time setup
npm run setup:machine-attendance

# 2. Connect machine to network
# (Follow steps above)

# 3. Update IP if needed
npm run update:machine-ip

# 4. Run full diagnostic
npm run diagnose:machine

# 5. If successful, test connection
npm run test:machine

# 6. Start syncing attendance!
# Use API: POST /api/machine-attendance/sync
```

## ✨ Expected Success Output

When everything works, you'll see:

```
🔍 AI06 Machine Connection Diagnostics
==================================================

1️⃣  Checking database connection...
   ✅ Database connected

2️⃣  Checking machine configuration...
   ✅ Machine configuration found

3️⃣  Validating IP address format...
   ✅ IP format is valid

4️⃣  Testing network connectivity (ping)...
   ✅ Machine is reachable on network

5️⃣  Checking node-zklib installation...
   ✅ node-zklib is installed

6️⃣  Attempting ZKTeco device connection...
   ✅ Socket created successfully!
   ✅ Device responded!

   📱 Device Information:
   ----------------------------------------
   Serial Number: ABC123456
   Firmware Version: 6.60
   Platform: ZEM560
   Device Name: AI06

   ✅ Disconnected cleanly

==================================================
✨ SUCCESS! Machine is ready to use!
==================================================
```

## 🆘 Still Not Working?

If you've tried everything and it still doesn't work:

1. **Check machine manual** - Verify connection settings
2. **Try machine's web interface** - Access via browser: `http://MACHINE_IP`
3. **Contact machine vendor** - May need firmware update
4. **Check machine logs** - Look for connection errors
5. **Try different port** - Some models use different ports

## 📞 Need More Help?

Share the output of:
```bash
npm run diagnose:machine
```

And provide:
- Machine model (AI06)
- Network setup (hotspot/WiFi)
- IP address shown on machine
- Any error messages

---

**Current Status:** ⏳ Waiting for machine network connection

**Next Step:** Connect machine to network and update IP address
