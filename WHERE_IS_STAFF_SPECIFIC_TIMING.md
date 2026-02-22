# Where to Find Staff-Specific Timing Feature

## Location 1: As a Tab in Time & Shift Settings (RECOMMENDED)

### How to Access:
1. Login to the system
2. Go to **HR** section from the main menu
3. Click on **"⏰ Time & Shift Settings"**
4. You will see 4 tabs at the top:
   - 🌍 Global Settings
   - 🌅 Shift Settings
   - 👥 Staff Shift Assignment
   - **⏰ Staff-Specific Timing** ← Click this tab

### What You'll See:
- **Current Specific Timings Table**: Shows all staff with custom timing configurations
- **Add Specific Timing Section**: Search for staff and click "Set Specific Time" button

### The "Set Specific Time" Button:
- Located in the last column of the staff table
- Click it to open a modal where you can:
  - Select which shift to configure (Shift 1 or Shift 2)
  - Set custom check-in/out times
  - Set custom late threshold
  - Enable "Anytime Check" option
  - Add notes

## Location 2: Standalone Page (Alternative)

### How to Access:
1. Login to the system
2. Go to **HR** section from the main menu
3. Click on **"👤 Staff-Specific Timing"** (separate menu item)

This is the same functionality but as a dedicated page.

## Quick Visual Guide

```
Main Menu
  └── HR
      ├── HR Dashboard
      ├── Salary Management
      ├── Attendance System
      ├── Device Status
      ├── ⏰ Time & Shift Settings  ← Go here
      │   └── Tabs:
      │       ├── Global Settings
      │       ├── Shift Settings
      │       ├── Staff Shift Assignment
      │       └── ⏰ Staff-Specific Timing  ← Then click this tab
      │           └── Staff Table
      │               └── [Set Specific Time] button  ← Click this!
      │
      └── 👤 Staff-Specific Timing  ← Or go directly here
```

## Step-by-Step Example

### To Set Custom Time for Ahmed:

1. **Navigate**: HR → Time & Shift Settings → Staff-Specific Timing tab

2. **Search**: Type "Ahmed" in the search box

3. **Click Button**: Find Ahmed in the table, click "Set Specific Time" button

4. **Configure**:
   - Select Shift: Shift 1
   - Custom Check-In: 09:00
   - Custom Check-Out: 17:00
   - Custom Late Threshold: 09:15
   - Notes: "Doctor - flexible hours"

5. **Save**: Click "Save" button

6. **Done**: Ahmed now has custom times!

### To Enable Anytime Check for Sara:

1. **Navigate**: HR → Time & Shift Settings → Staff-Specific Timing tab

2. **Search**: Type "Sara" in the search box

3. **Click Button**: Find Sara in the table, click "Set Specific Time" button

4. **Configure**:
   - Select Shift: Shift 1
   - ✅ Check "Anytime Check" checkbox
   - Notes: "Senior staff - flexible attendance"

5. **Save**: Click "Save" button

6. **Done**: Sara can now come anytime without penalties!

## Button Appearance

The "Set Specific Time" button looks like:
```
┌─────────────────────┐
│ Set Specific Time   │
└─────────────────────┘
```

- Blue background
- White text
- Located in the "Action" column of the staff table
- One button per staff member

## Modal Window

When you click "Set Specific Time", a popup window appears with:

```
┌────────────────────────────────────────┐
│  Set Specific Timing for Ahmed Ali     │
│  Current Shift: Shift 1                │
│                                        │
│  Select Shift to Configure:            │
│  [Shift 1 ▼]                          │
│                                        │
│  ☐ Anytime Check - Staff can come     │
│     anytime (no late/half-day/absent  │
│     deductions)                        │
│                                        │
│  Custom Check-In Time:                 │
│  [09:00]                              │
│                                        │
│  Custom Check-Out Time:                │
│  [17:00]                              │
│                                        │
│  Custom Late Threshold:                │
│  [09:15]                              │
│                                        │
│  Notes (optional):                     │
│  [Doctor - flexible hours]            │
│                                        │
│  [Save]  [Cancel]                     │
└────────────────────────────────────────┘
```

## Troubleshooting

### Can't find the tab?
- Make sure you're in "Time & Shift Settings" page
- Look at the top of the page for tabs
- The 4th tab should be "⏰ Staff-Specific Timing"

### Can't find the button?
- Make sure you're in the "Staff-Specific Timing" tab
- Scroll down to "Add Specific Timing for Staff" section
- Look in the "Action" column of the staff table
- Use the search box to filter staff

### Button is disabled?
- Wait for the page to finish loading
- Check if you have proper permissions
- Refresh the page and try again

## Need Help?

If you still can't find it:
1. Check that you ran the database migration: `ADD_STAFF_SPECIFIC_TIMING.bat`
2. Restart the backend server
3. Clear browser cache and refresh
4. Check browser console for errors (F12)
