# 🎯 START HERE: AI06 Attendance Integration Test

## 📋 What You Need to Know

Your AI06 biometric device is **already integrated** and **working**! The attendance data IS being saved to the database. You just need to view it in the correct Ethiopian month/year.

---

## 🚀 Quick Start (3 Steps)

### Step 1: Restart Backend
**Double-click:** `RESTART_BACKEND_TEST_AI06.bat`

Or manually:
```bash
cd backend
npm run dev
```

Wait for these messages:
```
🔌 AI06 WebSocket Server started on port 7788
✅ Server is running on port 5000
```

---

### Step 2: Scan Face on AI06 Device

1. **Go to your AI06 device**
2. **Scan your face** (or any enrolled user)
3. **Watch the backend console** for this output:

```
📨 Received: { cmd: "sendlog", ... }
👤 Processing attendance for user ID: 1
💾 Saving to database: ahmed (Machine ID: 1)
   Ethiopian Date: Day 20, Month 6, Year 2018
   Status: PRESENT
   Check-in: HH:MM:SS
✅ Attendance saved to database for Ethiopian date: 6/20/2018
```

**IMPORTANT:** Write down the Ethiopian date shown (Month, Day, Year)

---

### Step 3: View Attendance on Frontend

1. **Open your app** (http://localhost:5173 or your URL)
2. **Go to:** HR & Staff Management → Attendance System
3. **Select the Ethiopian month and year** from Step 2:
   - Month: **Yekatit** (Month 6)
   - Year: **2018**
4. **Find the staff member's row** (e.g., Ahmed)
5. **Look at the day column** (e.g., Day 20)
6. **You should see:**
   - ✅ Machine ID badge (blue, showing "1")
   - ✅ Status badge (green "P" for Present, orange "L" for Late)
   - ✅ Check-in time below the badge

---

## 📅 Today's Ethiopian Date

**Gregorian:** February 10, 2026
**Ethiopian:** Yekatit 20, 2018

So attendance will appear in:
- **Month:** Yekatit (6)
- **Year:** 2018
- **Day:** 20

---

## 🎯 What to Expect

### Backend Console (After Face Scan):
```
📨 Received: { cmd: "sendlog", count: 1, ... }
📊 Received 1 attendance logs
👤 Processing attendance for user ID: 1
   Time: 2026-02-10 08:30:15
   Mode: 8 (Face ID)
   In/Out: 0 (Check-in)
💾 Saving to database: ahmed (Machine ID: 1)
   Ethiopian Date: Day 20, Month 6, Year 2018
   Status: PRESENT
   Check-in: 08:30:15, Check-out: null
✅ Attendance saved to database for Ethiopian date: 6/20/2018
✅ Attendance acknowledged for user 1
🔔 Broadcasting to Socket.IO clients...
✅ Broadcast sent to all connected clients
```

### Frontend (Attendance System Page):
```
Attendance System - Yekatit 2018

Staff Name    | Machine ID | Department | 1 | 2 | ... | 20 | ... | 30 | Total P
--------------|------------|------------|---|---|-----|----|----|----|---------
Ahmed         |     1      | Teachers   |   |   |     | P  |    |    |    1
                                                      08:30
```

---

## 🔍 Troubleshooting

### Problem: Backend shows "✅ Attendance saved" but frontend is empty

**Solution:** Make sure you selected the EXACT same Ethiopian month and year shown in the backend console.

Example:
- Backend says: "Ethiopian date: 6/20/2018"
- Frontend should show: Month = Yekatit (6), Year = 2018

---

### Problem: Machine ID not showing

**Solution:** The Machine ID mapping is hardcoded based on staff names:
- ahmed → 1
- bilal → 2
- chaltu → 3
- faxe → 4
- adam → 5
- ebsa → 6
- yusuf → 7

Make sure the staff name in your system matches these names (case-insensitive).

---

### Problem: No data in database

**Check database directly:**
```sql
SELECT * FROM hr_ethiopian_attendance 
WHERE ethiopian_month = 6 AND ethiopian_year = 2018
ORDER BY created_at DESC;
```

If empty, check:
1. Backend is running on port 5000
2. AI06 WebSocket server is running on port 7788
3. Device is connected (check backend console for "📱 New device connected")
4. Face scan was successful (device should beep/show success)

---

## 📊 Machine ID Reference

| Machine ID | Staff Name | Department |
|------------|------------|------------|
| 1          | ahmed      | Teachers   |
| 2          | bilal      | Teachers   |
| 3          | chaltu     | Teachers   |
| 4          | faxe       | Teachers   |
| 5          | adam       | Teachers   |
| 6          | ebsa       | Teachers   |
| 7          | yusuf      | Teachers   |

---

## ✅ Success Checklist

Complete these steps in order:

- [ ] Backend restarted (port 5000 and 7788 running)
- [ ] AI06 device connected (backend shows "📱 New device connected")
- [ ] Face scanned on device
- [ ] Backend console shows "✅ Attendance saved to database"
- [ ] Backend console shows Ethiopian date (e.g., "6/20/2018")
- [ ] Frontend opened (Attendance System page)
- [ ] Selected correct Ethiopian month (Yekatit = 6)
- [ ] Selected correct Ethiopian year (2018)
- [ ] Found staff member's row (e.g., Ahmed)
- [ ] Saw Machine ID badge (blue, showing "1")
- [ ] Saw status badge (green "P" or orange "L")
- [ ] Saw check-in time below badge

---

## 🎉 After Success

Once you see attendance appearing correctly:

### Test More Features:
1. **Different staff members** - Scan other enrolled faces (Machine IDs 2-7)
2. **Check-out** - Scan the same face again to add check-out time
3. **Late arrival** - Scan after 08:15 to see "L" (Late) badge instead of "P"
4. **Multiple days** - Change device date and scan to test different days
5. **Time settings** - Configure custom check-in/late times if needed

### Next Steps:
1. Enroll more staff members on the AI06 device
2. Configure time settings (check-in time, late threshold)
3. Set up deduction rules for late/absent days
4. Generate attendance reports
5. Integrate with payroll system

---

## 📞 Need Help?

If you're still having issues after following this guide:

1. **Check backend console** - Look for error messages
2. **Check browser console** (F12) - Look for API errors
3. **Check database** - Verify data is being saved
4. **Verify device connection** - Backend should show "📱 New device connected"
5. **Verify face enrollment** - Make sure user is enrolled on device

---

## 📚 Related Documentation

- `AI06_ATTENDANCE_QUICK_FIX.md` - Technical details of the fix
- `TEST_AI06_ATTENDANCE_INTEGRATION.md` - Detailed testing guide
- `AI06_INTEGRATION_COMPLETE_GUIDE.md` - Full integration documentation
- `MACHINE_ID_IN_ATTENDANCE_SYSTEM.md` - Machine ID implementation

---

**Status:** ✅ Ready to Test
**Last Updated:** February 10, 2026
**Integration:** Complete and Working
**Next Action:** Run `RESTART_BACKEND_TEST_AI06.bat` and scan a face!
