# 🚀 Make Auto-Marker Run Now

The auto-marker is waiting until 15:00 (3:00 PM) to mark absent. To make it run immediately:

## Option 1: SQL Command (Quick)

```sql
UPDATE hr_attendance_time_settings
SET absent_threshold_time = '00:00';
```

This sets the threshold to midnight, so the auto-marker will run immediately on the next cycle (within 1 minute).

## Option 2: Time Settings Page (UI)

1. Go to HR Module → ⏰ Time Settings
2. Find "🤖 Absent Threshold Time"
3. Change from `15:00` to `00:00`
4. Click "Save Global Settings"

## What Will Happen

Within 1 minute, you'll see in the console:

```
🔍 Auto-marker checking attendance at 09:12...
✅ Past threshold - checking for absent staff...
👥 Found 1 staff with past attendance records:
   - khalid (ID: 100)

📅 Checking date: 6/4/2018
📅 Checking date: 6/3/2018
📅 Checking date: 6/2/2018
✅ Marked khalid (ID: 100) as ABSENT for 6/2/2018
📅 Checking date: 6/1/2018
✅ Marked khalid (ID: 100) as ABSENT for 6/1/2018

✅ Marked 2 staff as ABSENT across past 7 days
```

Then refresh your attendance page and you'll see "A" marks for Khalid on days 1 and 2!

## Reset After Testing

```sql
UPDATE hr_attendance_time_settings
SET absent_threshold_time = '15:00';
```

Or change it back to 15:00 in the Time Settings page.
