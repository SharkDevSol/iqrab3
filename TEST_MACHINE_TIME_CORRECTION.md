# 🧪 Test Machine Time Correction

## Quick Test Steps

### 1. Clear Old Data (Optional)
If you want to start fresh:
```cmd
cd backend
node scripts/clear-student-attendance.js
```

### 2. Check Backend is Running
The backend should already be running with the time correction applied.

Look for this in the console:
```
✅ Device registered: AYTE16052143
Model: AiFace
Users: 128/5000
Logs: 49/500000
```

### 3. Test Check-in
1. **Note the current time** (e.g., 8:15 PM)
2. **Check in on the AI06 machine** using your fingerprint/face
3. **Wait 30 seconds** for auto-refresh (or click "🔄 Refresh" button)
4. **Check the Student Attendance page**

### 4. Verify Results
In the attendance table, you should see:

**Before Fix:**
```
⏰ 11:15 AM  ← Wrong! (9 hours behind)
```

**After Fix:**
```
⏰ 8:15 PM   ← Correct! (matches actual time)
```

### 5. Check Backend Logs
Look for these console messages:
```
⏰ Machine time (original): 2026-02-12 11:15:00
⏰ Corrected time (+9 hours): 20:15:00
✅ Student is ON TIME (checked in at 20:15, threshold: 08:15)
```

## Expected Behavior

### Time Display
- ✅ Shows in 12-hour format (8:15 PM, not 20:15)
- ✅ Includes AM/PM indicator
- ✅ Appears below PRESENT or LATE badge
- ✅ Matches the actual check-in time

### Status Determination
- If you check in **before 8:15 AM**: Status = **PRESENT** (Green ✓)
- If you check in **after 8:15 AM**: Status = **LATE** (Orange ⏰)

### Auto-Refresh
- Page refreshes every 30 seconds automatically
- Manual refresh available with "🔄 Refresh" button
- Summary cards update automatically

## Troubleshooting

### Time Still Wrong?
1. Check if backend restarted successfully
2. Look for error messages in backend console
3. Verify the correction code is in `ai06WebSocketService.js`

### No Attendance Record?
1. Check if student has `smachine_id` set in database
2. Verify machine is connected (check backend console)
3. Check if today is a configured school day

### Status Wrong (LATE instead of PRESENT)?
1. Check time settings in database
2. Verify late threshold (default: 08:15)
3. Remember: correction adds 9 hours to machine time

## Console Commands

### Check Recent Attendance
```cmd
cd backend
node scripts/check-student-attendance-data.js
```

### Clear All Attendance
```cmd
cd backend
node scripts/clear-student-attendance.js
```

### Restart Backend
```cmd
cd backend
taskkill /F /IM node.exe
node server.js
```

## Success Criteria
- ✅ Check-in time matches actual time (not 9 hours behind)
- ✅ Time displays in 12-hour format with AM/PM
- ✅ Status is correct (PRESENT or LATE based on threshold)
- ✅ Auto-refresh works every 30 seconds
- ✅ Summary cards show accurate counts

## Next Steps
Once you confirm the fix works:
1. Consider fixing the machine's clock settings (see MACHINE_TIME_CORRECTION_APPLIED.md)
2. Monitor for a few days to ensure consistency
3. Document any edge cases or issues

---

**Note:** This is a temporary workaround. The proper solution is to fix the AI06 machine's clock settings to use the correct timezone (UTC+3).
