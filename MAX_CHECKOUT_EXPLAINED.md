# 📊 Maximum Check-Out Hours - Explained

## 🎯 What is "Maximum Check-Out Hours"?

**Maximum Check-Out Hours** is the time limit after check-in before the system marks attendance as "without check out".

---

## 📍 Where is This Setting?

### Current Location: **Database**

The setting is stored in the database table:
```
Table: hr_attendance_time_settings
Column: max_checkout_hours
Default Value: 3.0 hours
```

---

## 🔍 How It Works

### Example with 3.0 Hours:

```
08:00 AM - Staff checks in
         ↓
11:00 AM - 3 hours passed (08:00 + 3 hours)
         ↓
11:01 AM - Auto-marker checks
         ↓
         No check-out found?
         ↓
         Mark as "P+NCO" (Present + No Check-Out)
```

---

## ⚙️ How to View Current Setting

### Option 1: SQL Query
```sql
SELECT max_checkout_hours FROM hr_attendance_time_settings;
```

**Result:**
```
max_checkout_hours
------------------
3.0
```

### Option 2: Check Console
When auto-marker runs, it logs the settings:
```
⚙️ Using global time settings (Late: 08:15, Half Day: 4.0h)
```

---

## 🔧 How to Change the Setting

### Option 1: SQL Update
```sql
-- Change to 4 hours
UPDATE hr_attendance_time_settings
SET max_checkout_hours = 4.0;

-- Change to 2 hours
UPDATE hr_attendance_time_settings
SET max_checkout_hours = 2.0;

-- Change to 5 hours
UPDATE hr_attendance_time_settings
SET max_checkout_hours = 5.0;
```

### Option 2: Add to Time Settings Page (Future)

Looking at your screenshot, you have a Time Settings page with:
- Standard Check-In Time
- Late Threshold Time
- Standard Check-Out Time
- Minimum Work Hours
- Half Day Threshold

**You can add "Maximum Check-Out Hours" to this page!**

---

## 📊 Examples with Different Settings

### Setting: 2.0 Hours
```
Check-in: 08:00 AM
Deadline: 10:00 AM (08:00 + 2 hours)
At 10:01 AM: Marked as "P+NCO"
```

### Setting: 3.0 Hours (Default)
```
Check-in: 08:00 AM
Deadline: 11:00 AM (08:00 + 3 hours)
At 11:01 AM: Marked as "P+NCO"
```

### Setting: 4.0 Hours
```
Check-in: 08:00 AM
Deadline: 12:00 PM (08:00 + 4 hours)
At 12:01 PM: Marked as "P+NCO"
```

### Setting: 5.0 Hours
```
Check-in: 08:00 AM
Deadline: 01:00 PM (08:00 + 5 hours)
At 01:01 PM: Marked as "P+NCO"
```

---

## 🎯 Recommended Settings

### For Office Work (8-hour day):
```sql
UPDATE hr_attendance_time_settings
SET max_checkout_hours = 9.0;  -- Allow full day + 1 hour
```

### For Half-Day Work:
```sql
UPDATE hr_attendance_time_settings
SET max_checkout_hours = 5.0;  -- Allow 5 hours
```

### For Strict Monitoring:
```sql
UPDATE hr_attendance_time_settings
SET max_checkout_hours = 2.0;  -- Mark after 2 hours
```

---

## 🔍 How System Calculates

### Step 1: Get Check-In Time
```
Staff checks in at: 08:30 AM
```

### Step 2: Get Max Checkout Hours from Database
```sql
SELECT max_checkout_hours FROM hr_attendance_time_settings;
-- Result: 3.0
```

### Step 3: Calculate Deadline
```
Deadline = Check-in + Max Checkout Hours
Deadline = 08:30 AM + 3.0 hours
Deadline = 11:30 AM
```

### Step 4: Check Current Time
```
Current time: 11:31 AM
Is 11:31 AM > 11:30 AM? YES
→ Mark as "without check out"
```

---

## 📝 Code Implementation

### Where It's Used:
```javascript
// In attendanceAutoMarker.js

// Get setting from database
const settings = await this.getSettings();
const maxCheckoutHours = parseFloat(settings.max_checkout_hours || 3.0);

// Calculate elapsed time
const elapsedHours = (currentMinutes - checkInMinutes) / 60;

// Check if exceeded
if (elapsedHours > maxCheckoutHours) {
  // Mark as "without check out"
  status = status + ' + without check out';
}
```

---

## 🎨 Add to Time Settings Page

If you want to add this to your Time Settings UI (like in your screenshot), you need to:

### 1. Add Input Field
```jsx
<div>
  <label>Maximum Check-Out Hours</label>
  <input 
    type="number" 
    step="0.5"
    value={maxCheckoutHours}
    onChange={(e) => setMaxCheckoutHours(e.target.value)}
  />
  <small>Hours to wait before marking "without check out"</small>
</div>
```

### 2. Save to Database
```javascript
await axios.post('/api/hr/attendance/time-settings', {
  maxCheckoutHours: parseFloat(maxCheckoutHours),
  // ... other settings
});
```

---

## ✅ Current Status

### What's Working:
- ✅ Setting is stored in database
- ✅ Auto-marker reads from database
- ✅ Marks "without check out" automatically
- ✅ Can be changed via SQL

### What's Missing:
- ⚠️ UI to change the setting (currently only via SQL)
- ⚠️ Display in Time Settings page

---

## 🚀 Quick Commands

### View Current Setting:
```sql
SELECT max_checkout_hours FROM hr_attendance_time_settings;
```

### Change to 4 Hours:
```sql
UPDATE hr_attendance_time_settings SET max_checkout_hours = 4.0;
```

### Change to 2 Hours:
```sql
UPDATE hr_attendance_time_settings SET max_checkout_hours = 2.0;
```

### Test with 0.1 Hours (6 minutes):
```sql
UPDATE hr_attendance_time_settings SET max_checkout_hours = 0.1;
```

---

## 📊 Summary

| Question | Answer |
|----------|--------|
| Where is it stored? | Database table `hr_attendance_time_settings` |
| Column name? | `max_checkout_hours` |
| Default value? | 3.0 hours |
| How to change? | SQL UPDATE or add to Time Settings page |
| How system knows? | Reads from database every minute |
| When it marks? | When elapsed time > max_checkout_hours |

---

## 🎯 Example Scenario

```
Setting: max_checkout_hours = 3.0

Timeline:
08:00 AM - Khalid checks in (P)
09:00 AM - 1 hour passed (no action)
10:00 AM - 2 hours passed (no action)
11:00 AM - 3 hours passed (no action)
11:01 AM - 3.02 hours passed → Mark as "P+NCO"
```

---

**The system reads `max_checkout_hours` from the database and uses it to determine when to mark "without check out"!** ✅

**You can change it anytime with SQL, or add it to your Time Settings page UI!** 🎨
