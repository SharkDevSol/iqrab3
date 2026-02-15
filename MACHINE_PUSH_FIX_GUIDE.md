# 🔧 Fix Machine Push to Server

## ❌ CURRENT PROBLEM

Your AI06 machine is configured with the **WRONG SERVER IP**:
- **Current (Wrong)**: `010.022.134.155`
- **Correct**: `010.022.134.159` (your laptop IP)

This is why face check-ins are NOT appearing in your server console.

---

## ✅ SOLUTION: Update Machine Server IP

### Step 1: Access Machine Settings

1. Go to the AI06 machine
2. Press **Menu** (or touch the screen)
3. Enter admin password if prompted

### Step 2: Navigate to Server Settings

1. Go to: **Comm set** → **Server**
2. You should see these settings:
   - Server Req: Yes
   - Use domainNm: No
   - Server IP: `010.022.134.155` ← **THIS IS WRONG**
   - SerPortNo: 5000

### Step 3: Update Server IP

1. Select **Server IP**
2. Change from `010.022.134.155` to `010.022.134.159`
3. **Save** the settings
4. **Restart** the machine (optional but recommended)

### Step 4: Test the Connection

After updating the IP, do a face check-in on the machine and watch your server console.

---

## 🧪 HOW TO VERIFY IT'S WORKING

### Method 1: Watch Server Console

1. Make sure your server is running:
   ```bash
   cd backend
   npm start
   ```

2. Do a face check-in on the AI06 machine

3. You should see in the console:
   ```
   📥 Received data from AI06 machine
   Headers: {...}
   Body: {...}
   ```

### Method 2: Check Log File

After check-in, check the log file:
```bash
cd backend
type machine-webhook-log.txt
```

You should see the data that was received from the machine.

---

## 📊 CURRENT SYSTEM STATUS

### ✅ What's Working:

1. **AAS Database Sync** (every 2 minutes)
   - Reads from: `C:\AttendanceF\tmkq.mdb`
   - Current records: 120
   - Status: ✅ Working
   - Limitation: Requires manual "Download Record" in AAS

2. **CSV Import** (manual)
   - Upload CSV from AAS export
   - Status: ✅ Working
   - Good for VPS deployment

3. **Webhook Endpoints** (real-time)
   - Server ready at: `http://10.22.134.159:5000`
   - Status: ⚠️ Ready but machine IP is wrong
   - Once fixed: Will be fully automatic!

### ⚠️ What Needs Fixing:

- Machine Server IP: Change `.155` → `.159`

---

## 🎯 AFTER THE FIX

Once you update the machine IP, you'll have **THREE working methods**:

### 1. Real-Time Push (BEST - Fully Automatic)
- Machine pushes data instantly to your server
- No manual steps required
- Works as long as server is running

### 2. AAS Database Sync (Automatic but requires AAS)
- Syncs every 2 minutes
- Requires AAS "Download Record" first
- Good backup method

### 3. CSV Import (Manual but works on VPS)
- Export CSV from AAS
- Upload to system
- Works even on remote VPS

---

## 🚀 NEXT STEPS

1. **Update machine Server IP** (`.155` → `.159`)
2. **Do a face check-in** on the machine
3. **Watch server console** for incoming data
4. **Once data is received**, we'll parse it and save to database
5. **Map machine User IDs** to database person_ids
6. **Test automatic sync** end-to-end

---

## 💡 IMPORTANT NOTES

### About AAS Database Sync

The AAS database now has **120 records** (was 90 before), which means:
- ✅ Your check-ins ARE being recorded
- ✅ They ARE going to AAS database
- ⚠️ But they're not showing as "new" because you did them before the sync started

To see them in your system:
1. In AAS 6.0: Click **Download Record** → **Data Analysis** → **Start Analysis**
2. Wait 2 minutes for auto-sync, OR
3. Run manual sync: `npm run test:realtime-sync`

### About Machine Push

The machine push is **independent** of AAS:
- Machine → Your Server (direct, real-time)
- Machine → AAS Database (requires "Download Record")

Both can work simultaneously!

---

## 🔍 TROUBLESHOOTING

### If still no data after IP fix:

1. **Check firewall**:
   ```bash
   # Allow port 5000
   netsh advfirewall firewall add rule name="Node Server" dir=in action=allow protocol=TCP localport=5000
   ```

2. **Verify server is accessible**:
   ```bash
   npm run test:connection
   ```

3. **Check machine settings**:
   - Server Req: Must be **Yes**
   - Server IP: Must be `010.022.134.159`
   - SerPortNo: Must be `5000`

4. **Try different endpoint**:
   - Machine might use `/api/machine-webhook/push` instead of `/attendance`
   - Our server listens to ALL endpoints, so it should work

---

## 📞 NEED HELP?

If you update the IP and still don't see data:
1. Share what appears in the server console
2. Share the machine-webhook-log.txt file
3. Share any error messages from the machine

We'll debug the data format and parse it correctly!
