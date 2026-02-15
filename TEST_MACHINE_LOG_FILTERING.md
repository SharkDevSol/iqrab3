# 🧪 Test Machine Log Filtering (STRICT MODE)

## What Changed

The machine webhook now has **STRICT VALIDATION** with detailed logging:

### Validation Rules:
1. ✅ **ONLY** accepts logs where machine user ID matches `machine_id` in staff tables
2. ❌ **REJECTS** all logs from unregistered staff
3. ❌ **NO** name-based matching
4. ❌ **NO** attendance system ID matching

### What Gets Logged:
- List of ALL registered staff with machine IDs
- Each staff's name, global_staff_id, machine_id, and staff type
- Whether the incoming machine user ID matches
- Clear ACCEPTED or REJECTED message

---

## How to Test

### Step 1: Check Your Registered Staff

First, let's see which staff have machine IDs in your system:

```sql
-- Run this query to see all staff with machine IDs
SELECT machine_id, full_name, global_staff_id, 'Teachers' as staff_type
FROM staff_teachers WHERE machine_id IS NOT NULL
UNION
SELECT machine_id, full_name, global_staff_id, 'Administrative Staff' as staff_type
FROM staff_administrative_staff WHERE machine_id IS NOT NULL
UNION
SELECT machine_id, full_name, global_staff_id, 'Supportive Staff' as staff_type
FROM staff_supportive_staff WHERE machine_id IS NOT NULL
ORDER BY machine_id;
```

**Expected Result**: You should see staff like Ahmed (101), khalid (100), mustafe (105), etc.

---

### Step 2: Test with Unregistered Staff (Should REJECT)

1. Have someone who is **NOT** in your staff list check-in on the AI06 machine
2. Watch the backend console logs
3. You should see:

```
🔍 ========================================
🔍 STRICT VALIDATION: Machine User ID 999
🔍 ========================================

📋 Found 3 registered staff with machine IDs:
   - Ahmed (ID: 101, Machine ID: 101, Type: Teachers)
   - khalid (ID: 100, Machine ID: 100, Type: Teachers)
   - mustafe (ID: 105, Machine ID: 105, Type: Teachers)

📊 Registered Machine IDs: [101, 100, 105]

🔍 Checking: Does Machine User ID "999" match any registered machine_id?
   Result: ❌ NO

❌ ========================================
❌ REJECTED: Machine User ID 999
❌ ========================================
   Reason: This machine user ID is NOT in the staff tables
   Registered Machine IDs: [101, 100, 105]
   This log will be IGNORED.
❌ ========================================
```

4. ✅ **Verify**: Log should NOT be saved to database
5. ✅ **Verify**: Count in `dual_mode_attendance` should NOT increase

---

### Step 3: Test with Registered Staff (Should ACCEPT)

1. Have a registered staff member (like Ahmed with machine ID 101) check-in
2. Watch the backend console logs
3. You should see:

```
🔍 ========================================
🔍 STRICT VALIDATION: Machine User ID 101
🔍 ========================================

📋 Found 3 registered staff with machine IDs:
   - Ahmed (ID: 101, Machine ID: 101, Type: Teachers)
   - khalid (ID: 100, Machine ID: 100, Type: Teachers)
   - mustafe (ID: 105, Machine ID: 105, Type: Teachers)

📊 Registered Machine IDs: [101, 100, 105]

🔍 Checking: Does Machine User ID "101" match any registered machine_id?
   Result: ✅ YES

✅ ========================================
✅ VALIDATED: Machine User ID 101
✅ ========================================
   Staff Name: Ahmed
   Global Staff ID: 101
   Staff Type: Teachers
   Person ID (from mapping): 101
✅ ========================================

✅ Attendance saved: 101 at 2/5/2018, 7:45:00 AM
```

4. ✅ **Verify**: Log should be saved to database
5. ✅ **Verify**: Count in `dual_mode_attendance` should increase by 1

---

## Verification Queries

### Check how many logs are in the database:
```sql
SELECT COUNT(*) as total_logs, source_type 
FROM dual_mode_attendance 
GROUP BY source_type;
```

### See all machine logs:
```sql
SELECT person_id, person_type, date, timestamp, source_machine_ip
FROM dual_mode_attendance 
WHERE source_type = 'machine'
ORDER BY timestamp DESC
LIMIT 20;
```

### Check if unregistered staff logs exist:
```sql
-- This should return ONLY registered staff
SELECT DISTINCT d.person_id, d.person_type
FROM dual_mode_attendance d
WHERE d.source_type = 'machine'
AND NOT EXISTS (
  SELECT 1 FROM staff_teachers WHERE machine_id = d.person_id
  UNION
  SELECT 1 FROM staff_administrative_staff WHERE machine_id = d.person_id
  UNION
  SELECT 1 FROM staff_supportive_staff WHERE machine_id = d.person_id
);
```

If the last query returns any rows, those are unregistered staff logs that shouldn't be there.

---

## Expected Results

### Before Fix:
- Machine was accepting logs from anyone
- Count: 57 logs (including unregistered staff)
- Logs from staff not in List Staff page

### After Fix:
- Machine ONLY accepts logs from registered staff with machine IDs
- Count: Should match your registered staff count (e.g., 32)
- ONLY logs from staff in List Staff page with machine_id set

---

## Troubleshooting

### If unregistered logs are still being saved:

1. **Check the backend console** - Do you see the REJECTED messages?
2. **Verify staff tables** - Run the query to see which staff have machine_ids
3. **Check machine_user_id mapping** - The `user_machine_mapping` table might have incorrect mappings

### If registered logs are being rejected:

1. **Check machine_id format** - Make sure it's stored as the same type (string/number)
2. **Check the console logs** - See what machine IDs are registered vs what's being sent
3. **Verify the staff exists** - Run the query to confirm the staff has a machine_id

---

## Summary

The system now:
- ✅ Lists all registered staff with machine IDs on every log attempt
- ✅ Shows clear ACCEPTED or REJECTED decision
- ✅ Only saves logs from staff with matching machine_id
- ✅ Ignores all other logs (no name matching, no ID guessing)

This ensures ONLY authorized staff logs are imported from the AI06 machine!
