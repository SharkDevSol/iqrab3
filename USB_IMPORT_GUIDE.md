# 📁 USB Import Method - Simple & Reliable!

## ✅ **Why This Method is Better:**

- ✅ No network configuration needed
- ✅ Works with ANY machine
- ✅ Simple 3-step process
- ✅ Can import historical data
- ✅ Works on VPS/remote server

---

## 📋 **How It Works:**

```
1. Export attendance from machine to USB
2. Upload file to your system
3. System processes and saves automatically
```

---

## 🚀 **Step-by-Step Guide:**

### Step 1: Export from Machine (2 minutes)

On the AI06 machine:

1. Insert USB drive into machine
2. Go to: **Menu → USB Manager → Download Attendance**
3. Select date range (or "All")
4. Press **OK** to export
5. Wait for "Success" message
6. Remove USB drive

The file will be saved as `att.dat` or `attendance.txt` on the USB.

---

### Step 2: Upload to System (30 seconds)

**Option A: Using Postman or Thunder Client**

```
POST http://localhost:5000/api/usb-attendance/upload
Body: form-data
Key: file
Value: [Select your att.dat file]
```

**Option B: Using curl**

```bash
curl -X POST http://localhost:5000/api/usb-attendance/upload \
  -F "file=@/path/to/att.dat"
```

**Option C: Using PowerShell**

```powershell
$file = "E:\att.dat"  # Change to your USB drive path
$uri = "http://localhost:5000/api/usb-attendance/upload"

$form = @{
    file = Get-Item -Path $file
}

Invoke-RestMethod -Uri $uri -Method Post -Form $form
```

---

### Step 3: Check Results

The system will automatically:
1. Parse the file
2. Map machine User IDs to person_ids
3. Save attendance to database
4. Show you the results

**Example Response:**
```json
{
  "success": true,
  "message": "Attendance imported successfully",
  "stats": {
    "totalRecords": 50,
    "saved": 48,
    "skipped": 2,
    "unmappedUsers": [5, 7]
  }
}
```

---

## 📊 **What the System Does:**

```
USB File → Parse Records → Map User IDs → Save to Database
```

For each record:
- ✅ Finds the person by machine User ID
- ✅ Extracts date and time
- ✅ Saves to `dual_mode_attendance` table
- ✅ Marks source as `usb_import`
- ✅ Logs everything for audit

---

## 🔍 **File Formats Supported:**

The system can read:
- `.dat` files (ZKTeco format)
- `.txt` files (text export)
- `.csv` files (comma-separated)

**Common formats:**
```
# Tab-separated
1	2026-01-30 14:30:00	0	1
2	2026-01-30 14:31:15	0	1

# Comma-separated
1,2026-01-30 14:30:00,0,1
2,2026-01-30 14:31:15,0,1

# Space-separated
1 2026-01-30 14:30:00 0 1
2 2026-01-30 14:31:15 0 1
```

---

## 💡 **Quick Test:**

Let's test it right now!

### 1. Create a test file:

Create a file called `test-attendance.txt` with this content:

```
1	2026-01-30 14:30:00	0	1
1	2026-01-30 17:00:00	0	1
```

This represents:
- User ID 1 (khalid) checked in at 2:30 PM
- User ID 1 (khalid) checked out at 5:00 PM

### 2. Upload it:

```powershell
$file = "test-attendance.txt"
$uri = "http://localhost:5000/api/usb-attendance/upload"

$form = @{
    file = Get-Item -Path $file
}

Invoke-RestMethod -Uri $uri -Method Post -Form $form
```

### 3. Check the database:

```bash
npm run status
```

You should see the attendance records!

---

## 📋 **View Import History:**

```
GET http://localhost:5000/api/usb-attendance/history
```

This shows all previous imports with stats.

---

## 🎯 **Advantages:**

### vs Machine Push:
- ✅ No network configuration
- ✅ No "Server Req" settings
- ✅ Works even if machine is offline
- ✅ Can import historical data

### vs AAS Software:
- ✅ No AAS software needed
- ✅ Works on VPS/remote server
- ✅ Simpler process
- ✅ Direct to your database

---

## 🔄 **Daily Workflow:**

### Option 1: Manual (Once per day)
1. End of day: Export from machine to USB
2. Upload file to system
3. Done!

### Option 2: Scheduled (Automatic)
1. Keep USB drive in machine
2. Schedule export on machine (if supported)
3. Use a script to auto-upload when USB is inserted

---

## 🐛 **Troubleshooting:**

### "No valid records found"
- Check file format
- Make sure it's the attendance export file
- Try opening the file in Notepad to see the format

### "Unmapped users"
- These are machine User IDs without mappings
- Add mappings:
  ```bash
  node scripts/add-mapping.js <userId> <type> <personId>
  ```

### "File upload failed"
- Check file size (should be < 10MB)
- Check file extension (.dat, .txt, or .csv)
- Make sure server is running

---

## 📖 **Quick Commands:**

```bash
# Check status
npm run status

# Add user mapping
node scripts/add-mapping.js 1 staff khalid

# List mappings
node scripts/list-mappings.js

# Start server
npm start
```

---

## 🎉 **Summary:**

This method is **simpler and more reliable** than machine push!

**Steps:**
1. Export from machine to USB (2 min)
2. Upload file to system (30 sec)
3. Done! ✅

**No network configuration, no troubleshooting, just works!**

---

Would you like to try this method now? It's much easier! 🚀
