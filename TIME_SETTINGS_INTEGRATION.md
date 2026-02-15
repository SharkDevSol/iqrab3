# ⚙️ Time Settings Integration - COMPLETE

## ✅ What Was Fixed

The attendance system now properly fetches time settings from the **Time Settings page** in the database!

---

## 🔄 How It Works

### Priority Order:
```
1. Check for STAFF-SPECIFIC time settings
   ↓ (if not found)
2. Use GLOBAL time settings
   ↓ (if not found)
3. Use DEFAULT values (08:15 late, 4.0 hours half day)
```

---

## 📊 Settings Hierarchy

### Level 1: Staff-Specific Settings (Highest Priority)
```sql
Table: hr_staff_specific_times

Example:
staff_id: "100" (Khalid's Machine ID)
late_threshold: "09:00"
half_day_threshold: 5.0
```

**When used:** If a staff member has custom time settings

### Level 2: Global Settings (Default)
```sql
Table: hr_attendance_time_settings

Example:
late_threshold: "08:15"
half_day_threshold: 4.0
```

**When used:** For all staff without custom settings

### Level 3: Hardcoded Defaults (Fallback)
```javascript
{
  late_threshold: '08:15',
  half_day_threshold: 4.0
}
```

**When used:** Only if database tables are empty

---

## 🎯 Example Scenarios

### Scenario 1: Global Settings Only
```
Database:
├─ hr_attendance_time_settings
│  ├─ late_threshold: "08:15"
│  └─ half_day_threshold: 4.0
└─ hr_staff_specific_times (empty)

Result for Khalid (Machine ID 100):
✅ Uses global settings
   Late threshold: 08:15
   Half day threshold: 4.0 hours
```

### Scenario 2: Staff-Specific Settings
```
Database:
├─ hr_attendance_time_settings
│  ├─ late_threshold: "08:15"
│  └─ half_day_threshold: 4.0
└─ hr_staff_specific_times
   └─ staff_id: "100"
      ├─ late_threshold: "09:00"
      └─ half_day_threshold: 5.0

Result for Khalid (Machine ID 100):
✅ Uses staff-specific settings
   Late threshold: 09:00
   Half day threshold: 5.0 hours
```

### Scenario 3: Mixed Settings
```
Database:
├─ hr_attendance_time_settings
│  ├─ late_threshold: "08:15"
│  └─ half_day_threshold: 4.0
└─ hr_staff_specific_times
   ├─ staff_id: "100" (Khalid)
   │  ├─ late_threshold: "09:00"
   │  └─ half_day_threshold: 5.0
   └─ staff_id: "101" (Ahmed)
      ├─ late_threshold: "07:30"
      └─ half_day_threshold: 6.0

Result:
✅ Khalid (100): Uses 09:00 and 5.0h (staff-specific)
✅ Ahmed (101): Uses 07:30 and 6.0h (staff-specific)
✅ Others: Use 08:15 and 4.0h (global)
```

---

## 🔧 How to Configure

### Option 1: Global Settings (All Staff)
1. Go to: **HR → Attendance → Time Settings**
2. Set:
   - Late Threshold: `08:15`
   - Half Day Threshold: `4.0` hours
3. Click **Save**
4. All staff use these settings

### Option 2: Staff-Specific Settings (Individual)
1. Go to: **HR → Attendance → Staff-Specific Times**
2. Click **Add Staff**
3. Select staff member
4. Set custom times:
   - Late Threshold: `09:00`
   - Half Day Threshold: `5.0` hours
5. Click **Save**
6. Only this staff uses custom settings

---

## 📝 Database Queries

### Check Global Settings:
```sql
SELECT * FROM hr_attendance_time_settings;
```

**Expected Result:**
```
id | late_threshold | half_day_threshold
---+----------------+-------------------
1  | 08:15          | 4.0
```

### Check Staff-Specific Settings:
```sql
SELECT * FROM hr_staff_specific_times;
```

**Expected Result:**
```
id | staff_id | staff_name | late_threshold | half_day_threshold
---+----------+------------+----------------+-------------------
1  | 100      | khalid     | 09:00          | 5.0
2  | 101      | ahmed      | 07:30          | 6.0
```

### Check Which Settings Are Used:
```sql
-- For a specific staff member (Machine ID 100)
SELECT 
  COALESCE(
    (SELECT late_threshold FROM hr_staff_specific_times WHERE staff_id = '100'),
    (SELECT late_threshold FROM hr_attendance_time_settings LIMIT 1),
    '08:15'
  ) as late_threshold,
  COALESCE(
    (SELECT half_day_threshold FROM hr_staff_specific_times WHERE staff_id = '100'),
    (SELECT half_day_threshold FROM hr_attendance_time_settings LIMIT 1),
    4.0
  ) as half_day_threshold;
```

---

## 🔍 Backend Console Output

### When Using Global Settings:
```
📨 Received: { "enrollid": "100", "time": "2026-02-10 08:30:24" }
👤 Processing attendance for user ID: 100
⚙️ Using global time settings (Late: 08:15, Half Day: 4.0h)
✅ First scan of the day → CHECK-IN: 08:30:24
Status: LATE (Late threshold: 08:15)
✅ Attendance saved to database
```

### When Using Staff-Specific Settings:
```
📨 Received: { "enrollid": "100", "time": "2026-02-10 08:30:24" }
👤 Processing attendance for user ID: 100
⚙️ Using staff-specific time settings for Machine ID 100
✅ First scan of the day → CHECK-IN: 08:30:24
Status: PRESENT (Late threshold: 09:00)
✅ Attendance saved to database
```

---

## 🧪 How to Test

### Test 1: Verify Global Settings Are Used
```bash
1. Clear staff-specific settings:
   DELETE FROM hr_staff_specific_times WHERE staff_id = '100';

2. Set global settings:
   UPDATE hr_attendance_time_settings 
   SET late_threshold = '08:15', half_day_threshold = 4.0;

3. Restart backend:
   cd backend
   npm run dev

4. Scan at 08:30:
   Expected: Status = LATE (because 08:30 > 08:15)
   Console: "Using global time settings (Late: 08:15, Half Day: 4.0h)"
```

### Test 2: Verify Staff-Specific Settings Override
```bash
1. Add staff-specific settings:
   INSERT INTO hr_staff_specific_times 
   (staff_id, staff_name, late_threshold, half_day_threshold)
   VALUES ('100', 'khalid', '09:00', 5.0);

2. Restart backend:
   cd backend
   npm run dev

3. Scan at 08:30:
   Expected: Status = PRESENT (because 08:30 < 09:00)
   Console: "Using staff-specific time settings for Machine ID 100"
```

### Test 3: Verify Half Day Threshold
```bash
1. Set global half day threshold to 4.0 hours

2. Scan at 08:00 (check-in)

3. Scan at 11:30 (check-out - 3.5 hours later)
   Expected: Status = HALF_DAY (because 3.5 < 4.0)

4. Clear data and scan at 08:00 again

5. Scan at 13:00 (check-out - 5 hours later)
   Expected: Status = PRESENT (because 5.0 >= 4.0)
```

---

## 📁 Files Modified

### Backend:
**`backend/services/ai06WebSocketService.js`**
- Lines 260-290: Added staff-specific settings check
- Fetches from `hr_staff_specific_times` first
- Falls back to `hr_attendance_time_settings`
- Uses hardcoded defaults as last resort

---

## ✅ What This Fixes

### Before:
- ❌ Used hardcoded default values (07:15, 1.0h)
- ❌ Ignored Time Settings page
- ❌ No staff-specific settings support

### After:
- ✅ Fetches from database (Time Settings page)
- ✅ Supports staff-specific settings
- ✅ Falls back to global settings
- ✅ Uses defaults only if database is empty

---

## 🎯 Benefits

1. **Flexible:** Different settings for different staff
2. **Configurable:** Change settings without code changes
3. **Hierarchical:** Staff-specific overrides global
4. **Safe:** Defaults prevent errors if database is empty
5. **Transparent:** Console logs show which settings are used

---

## 📊 Settings Flow Diagram

```
Machine Scan
     │
     ▼
Check Database for Staff-Specific Settings
     │
     ├─ Found? → Use Staff-Specific
     │              │
     │              ▼
     │         Calculate Status
     │              │
     └─ Not Found? → Check Global Settings
                       │
                       ├─ Found? → Use Global
                       │              │
                       │              ▼
                       │         Calculate Status
                       │              │
                       └─ Not Found? → Use Defaults
                                         │
                                         ▼
                                    Calculate Status
```

---

## 🚀 Quick Commands

### View Global Settings:
```sql
SELECT * FROM hr_attendance_time_settings;
```

### View Staff-Specific Settings:
```sql
SELECT * FROM hr_staff_specific_times;
```

### Update Global Settings:
```sql
UPDATE hr_attendance_time_settings 
SET late_threshold = '08:15', 
    half_day_threshold = 4.0;
```

### Add Staff-Specific Settings:
```sql
INSERT INTO hr_staff_specific_times 
(staff_id, staff_name, late_threshold, half_day_threshold)
VALUES ('100', 'khalid', '09:00', 5.0);
```

### Remove Staff-Specific Settings:
```sql
DELETE FROM hr_staff_specific_times 
WHERE staff_id = '100';
```

---

## 🎉 Complete!

The attendance system now:
- ✅ Fetches settings from Time Settings page
- ✅ Supports staff-specific custom times
- ✅ Falls back to global settings
- ✅ Uses safe defaults if needed
- ✅ Logs which settings are used

**All settings are now database-driven!** 🚀

---

## 📞 Support

If settings aren't working:
1. Check database tables exist
2. Verify settings are saved
3. Check backend console for logs
4. Restart backend server
5. Test with known values

**Settings are now fully integrated!** ✅
