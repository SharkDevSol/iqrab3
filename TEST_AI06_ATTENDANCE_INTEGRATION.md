# ✅ AI06 Attendance Integration - Testing Guide

## Current Status
The AI06 device is successfully:
- ✅ Connecting to backend WebSocket server
- ✅ Sending face scan logs
- ✅ Broadcasting to Socket.IO clients
- ✅ **SAVING TO DATABASE** (hr_ethiopian_attendance table)

## The Issue
The attendance IS being saved, but you need to **select the correct Ethiopian month/year** on the frontend to see it!

---

## 🔍 How to Test

### Step 1: Check What Date is Being Saved

1. **Restart the backend** to apply the latest code:
   ```bash
   cd backend
   npm run dev
   ```

2. **Scan your face** on the AI06 device (Machine ID 1 = Ahmed)

3. **Look at the backend console** for this log:
   ```
   💾 Saving to database: ahmed (Machine ID: 1)
      Ethiopian Date: Day X, Month Y, Year ZZZZ
      Status: PRESENT/LATE
      Check-in: HH:MM:SS, Check-out: null
   ✅ Attendance saved to database for Ethiopian date: Y/X/ZZZZ
   ```

4. **Write down the Ethiopian date** shown in the console (Month and Year)

---

### Step 2: View the Attendance on Frontend

1. Go to **HR & Staff Management → Attendance System**

2. **Select the SAME Ethiopian month and year** that you saw in the backend console

3. **Look for Ahmed's row** (Machine ID: 1)

4. **Check the day column** that matches the Ethiopian day from the console

5. You should see:
   - ✅ Green badge with "P" (Present) or Orange "L" (Late)
   - ✅ Check-in time displayed
   - ✅ Machine ID showing as "1"

---

## 📅 Ethiopian Calendar Conversion

The system converts today's Gregorian date to Ethiopian date automatically:

**Today (Gregorian):** February 10, 2026
**Ethiopian Date:** Yekatit 2, 2018

So the attendance should appear in:
- **Month:** Yekatit (Month 6)
- **Year:** 2018
- **Day:** 2

---

## 🐛 If Still Not Showing

### Check 1: Verify Database Save
Run this in your database:
```sql
SELECT * FROM hr_ethiopian_attendance 
WHERE staff_id = '1' 
ORDER BY created_at DESC 
LIMIT 5;
```

You should see records with:
- `staff_id`: "1"
- `staff_name`: "ahmed"
- `ethiopian_month`: 6
- `ethiopian_year`: 2018
- `ethiopian_day`: 2
- `check_in`: Time of scan
- `status`: "PRESENT" or "LATE"

### Check 2: Verify Frontend API Call
Open browser console (F12) and look for:
```
📡 Fetching attendance for: { ethMonth: 6, ethYear: 2018 }
✅ Fetched attendance records: X records
📄 Sample record: { staff_id: "1", ... }
```

### Check 3: Verify Machine ID Mapping
The frontend should show Machine ID for Ahmed. Check browser console for:
```
👥 Loaded staff: X members
📄 Sample staff with Machine ID: { id: "...", name: "Ahmed", machineId: 1 }
```

---

## 🎯 Expected Result

After scanning face on AI06 device:

1. **Backend Console:**
   ```
   📨 Received: { cmd: "sendlog", ... }
   👤 Processing attendance for user ID: 1
   💾 Saving to database: ahmed (Machine ID: 1)
      Ethiopian Date: Day 2, Month 6, Year 2018
   ✅ Attendance saved to database
   🔔 Broadcasting to Socket.IO clients...
   ```

2. **Frontend (Attendance System Page):**
   - Select: Yekatit (Month 6), Year 2018
   - Ahmed's row shows:
     - Machine ID: **1** (blue badge)
     - Day 2 column: **P** (green badge) with check-in time

---

## 🔄 Testing Multiple Scans

1. **Scan face again** (same day) → Should UPDATE existing record with new time
2. **Scan different staff** (e.g., Bilal = Machine ID 2) → Should create new row
3. **Check-out** (if device supports) → Should add check-out time to same record

---

## 📝 Notes

- **Machine ID Mapping:**
  - 1 = ahmed
  - 2 = bilal
  - 3 = chaltu
  - 4 = faxe
  - 5 = adam
  - 6 = ebsa
  - 7 = yusuf

- **Status Logic:**
  - Check-in before 08:15 → PRESENT
  - Check-in after 08:15 → LATE

- **Ethiopian Calendar:**
  - 13 months (12 months of 30 days + Pagume 5-6 days)
  - Currently in Year 2018 (Gregorian 2026)

---

## ✅ Success Criteria

- [ ] Backend logs show "✅ Attendance saved to database"
- [ ] Database has record in `hr_ethiopian_attendance` table
- [ ] Frontend shows attendance when correct month/year selected
- [ ] Machine ID displays correctly (blue badge)
- [ ] Status badge shows (P for Present, L for Late)
- [ ] Check-in time displays under badge

---

## 🚀 Next Steps After Success

1. **Test all staff members** (Machine IDs 1-7)
2. **Test check-out** functionality
3. **Test late arrival** (scan after 08:15)
4. **Test multiple days** (change date and scan again)
5. **Configure time settings** (if needed)

---

**Last Updated:** February 10, 2026
**Status:** Ready for Testing
