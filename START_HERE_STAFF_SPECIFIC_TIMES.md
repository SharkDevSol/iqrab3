# 🚀 START HERE: Staff-Specific Time Settings

## ⚡ Quick Start (2 Minutes)

### What is this?
Configure custom work hours for individual staff members (e.g., night shift, part-time, flexible schedules).

### Where is it?
**HR Module → Attendance → Time Settings → Scroll Down**

### What does it look like?
Look for: **"👤 Staff-Specific Time Settings"** section with a green **"➕ Add Staff-Specific Time"** button

---

## 🎯 Your First Staff-Specific Time (Step-by-Step)

### Step 1: Navigate (30 seconds)
1. Go to **HR Module**
2. Click **Attendance**
3. Click **Time Settings**
4. **Scroll down** past the global settings

### Step 2: Open Modal (10 seconds)
1. Click the green **"➕ Add Staff-Specific Time"** button
2. Wait for staff list to load

### Step 3: Configure (60 seconds)
1. **Select Staff**: Choose a staff member from dropdown
2. **Set Times**:
   - Check-In: When they should arrive (e.g., `09:00`)
   - Late Threshold: When they're marked late (e.g., `09:15`)
   - Check-Out: When they should leave (e.g., `15:00`)
3. **Set Thresholds**:
   - Min Hours: Required hours for full day (e.g., `6`)
   - Half Day: Hours below which is half day (e.g., `3`)
   - Grace Period: Allowed delay in minutes (e.g., `15`)
4. **Add Note** (optional): e.g., "Part-time teacher"

### Step 4: Save (10 seconds)
1. Click **"💾 Save Staff-Specific Time"**
2. Wait for success message
3. See entry appear in table

### Step 5: Verify (10 seconds)
1. Check table shows your entry
2. Verify times are correct
3. See color-coded badges:
   - 🟢 Green = Check-in
   - 🟠 Orange = Late threshold
   - 🌸 Pink = Check-out

---

## 💡 Common Scenarios

### Scenario 1: Night Shift Worker
```
Staff: Security Guard
Check-In: 20:00 (8 PM)
Late After: 20:15
Check-Out: 04:00 (4 AM)
Min Hours: 8
Note: "Night shift"
```

### Scenario 2: Part-Time Staff
```
Staff: Part-Time Teacher
Check-In: 09:00
Late After: 09:15
Check-Out: 13:00
Min Hours: 4
Note: "Morning classes only"
```

### Scenario 3: Flexible Schedule
```
Staff: Manager
Check-In: 10:00
Late After: 10:30
Check-Out: 18:00
Min Hours: 7.5
Grace: 30 min
Note: "Flexible schedule"
```

---

## 🎨 What You'll See

### Empty State (No Data):
```
┌─────────────────────────────────────┐
│              👤                      │
│                                      │
│  No staff-specific times configured  │
│                                      │
│  Click "Add Staff-Specific Time"    │
│  to set custom hours                 │
└─────────────────────────────────────┘
```

### Table (With Data):
```
┌──────────────────────────────────────────────────────────┐
│ Name    │ Type    │ Check-In │ Late  │ Check-Out │ ...  │
├─────────┼─────────┼──────────┼───────┼───────────┼──────┤
│ Chaltu  │ Teacher │  09:00   │ 09:15 │   15:00   │ ...  │
│         │         │  (green) │(orange)│  (pink)   │      │
└──────────────────────────────────────────────────────────┘
```

### Modal:
```
┌─────────────────────────────────────┐
│  👤 Add Staff-Specific Time         │
├─────────────────────────────────────┤
│  Select Staff: [Dropdown ▼]        │
│  Check-In: [09:00]                  │
│  Late After: [09:15]                │
│  Check-Out: [15:00]                 │
│  Min Hours: [6]                     │
│  Half Day: [3]                      │
│  Grace: [15]                        │
│  Notes: [Optional text...]          │
├─────────────────────────────────────┤
│  [Cancel]  [💾 Save]                │
└─────────────────────────────────────┘
```

---

## ✅ Quick Checklist

Before you start:
- [ ] Backend server is running
- [ ] You're logged in
- [ ] You have staff members in the database

To add a staff-specific time:
- [ ] Navigate to Time Settings
- [ ] Scroll down to Staff-Specific section
- [ ] Click "Add Staff-Specific Time"
- [ ] Select staff from dropdown
- [ ] Configure times and thresholds
- [ ] Add optional note
- [ ] Click "Save"
- [ ] Verify entry appears in table

To delete a staff-specific time:
- [ ] Find entry in table
- [ ] Click "🗑️ Delete" button
- [ ] Confirm deletion
- [ ] Verify entry disappears

---

## 🔍 Troubleshooting

### Problem: Can't find the section
**Solution**: 
- Make sure you're on **Time Settings** page
- **Scroll down** past global settings
- Look for "👤 Staff-Specific Time Settings" header

### Problem: Staff dropdown is empty
**Solution**:
- Check if staff data exists in database
- Check browser console for errors
- Verify backend server is running
- Try refreshing the page

### Problem: Save button doesn't work
**Solution**:
- Fill all required fields (marked with *)
- Check browser console for errors
- Verify backend server is running
- Try again

### Problem: Entry doesn't appear after save
**Solution**:
- Check for success alert
- Refresh the page
- Check browser console for errors
- Verify API call succeeded (Network tab)

---

## 📚 Need More Help?

### Quick Reference:
- **Feature Docs**: `STAFF_SPECIFIC_TIME_SETTINGS_COMPLETE.md`
- **Testing Guide**: `QUICK_TEST_STAFF_SPECIFIC_TIMES.md`
- **Navigation Guide**: `WHERE_TO_FIND_STAFF_SPECIFIC_TIMES.md`
- **Task Summary**: `TASK_10_STAFF_SPECIFIC_TIMES_COMPLETE.md`

### Key Points:
- Staff-specific times **override** global settings
- Each staff can have **one** specific time setting
- You can **update** by adding again (UPSERT)
- You can **delete** anytime
- Changes take effect **immediately**

---

## 🎯 Success!

You've successfully added your first staff-specific time setting! 🎉

**Next Steps**:
1. Add more staff-specific times for other staff
2. Test attendance marking with these settings
3. Verify correct status calculation (PRESENT, LATE, HALF_DAY)

**Remember**: Staff-specific times override global settings, so staff with specific times will use their custom hours instead of the default times.

---

## 💪 You're Ready!

You now know how to:
- ✅ Navigate to staff-specific times
- ✅ Add staff-specific time settings
- ✅ Configure custom work hours
- ✅ View all staff-specific times
- ✅ Delete staff-specific times

**Happy configuring!** 🚀

---

**Quick Access**: HR → Attendance → Time Settings → Scroll Down → "👤 Staff-Specific Time Settings"
