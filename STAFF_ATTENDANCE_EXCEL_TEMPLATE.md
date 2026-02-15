# Staff Attendance System - Excel/Google Sheets Template

## Overview
This document provides a simplified Excel/Google Sheets template for tracking staff attendance with the two-step verification logic for teachers.

---

## Excel Template Structure

### Sheet 1: Daily Attendance Log

| Column | Field Name | Description | Formula/Validation |
|--------|-----------|-------------|-------------------|
| A | Date | Date of attendance | Date format |
| B | Staff ID | Unique staff identifier | Text |
| C | Staff Name | Full name | Text |
| D | Role | Teacher or General Staff | Dropdown: Teacher, General Staff |
| E | Step 1 Time | First timestamp (Teachers only) | Time format (HH:MM:SS) |
| F | Step 2 Time | Confirmation timestamp (Teachers) | Time format (HH:MM:SS) |
| G | Time In | Official arrival time | =IF(D2="Teacher",F2,E2) |
| H | Time Out | Departure time | Time format (HH:MM:SS) |
| I | Hours Worked | Total hours | =IF(H2<>"",H2-G2,"") |
| J | Verification Status | Single-step or Verified | =IF(D2="Teacher","Verified","Single Step") |
| K | Notes | Additional comments | Text |

### Sample Data

```
Date       | Staff ID | Name        | Role          | Step 1  | Step 2  | Time In | Time Out | Hours | Verification | Notes
-----------|----------|-------------|---------------|---------|---------|---------|----------|-------|--------------|-------
2026-01-29 | T001     | John Doe    | Teacher       | 7:59:45 | 8:00:00 | 8:00:00 | 16:30:00 | 8:30  | Verified     |
2026-01-29 | GS001    | Jane Smith  | General Staff | 8:15:00 |         | 8:15:00 | 17:00:00 | 8:45  | Single Step  |
2026-01-29 | T002     | Bob Wilson  | Teacher       | 8:05:20 | 8:05:35 | 8:05:35 | 16:00:00 | 7:54  | Verified     |
```

---

## Sheet 2: Staff Master List

| Column | Field Name | Description |
|--------|-----------|-------------|
| A | Staff ID | Unique identifier |
| B | Full Name | Staff member name |
| C | Role | Teacher or General Staff |
| D | Department | Department/Subject |
| E | Contact | Phone number |
| F | Email | Email address |

---

## Sheet 3: Monthly Summary

| Column | Field Name | Formula |
|--------|-----------|---------|
| A | Staff ID | From Daily Log |
| B | Staff Name | From Daily Log |
| C | Role | From Daily Log |
| D | Total Days | =COUNTIF(DailyLog!B:B,A2) |
| E | Complete Days | =COUNTIFS(DailyLog!B:B,A2,DailyLog!H:H,"<>") |
| F | Incomplete Days | =D2-E2 |
| G | Total Hours | =SUMIF(DailyLog!B:B,A2,DailyLog!I:I) |
| H | Average Hours | =G2/D2 |

---

## Implementation Steps

### Step 1: Create the Workbook

1. Open Excel or Google Sheets
2. Create three sheets: "Daily Attendance Log", "Staff Master", "Monthly Summary"
3. Set up column headers as shown above

### Step 2: Add Data Validation

**For Role Column (D)**:
```
Data > Data Validation
Allow: List
Source: Teacher,General Staff
```

**For Time Columns (E, F, G, H)**:
```
Format > Number > Time
Format: HH:MM:SS
```

**For Date Column (A)**:
```
Format > Number > Date
Format: YYYY-MM-DD
```

### Step 3: Add Formulas

**Time In Column (G)**:
```excel
=IF(D2="Teacher",F2,E2)
```
*Logic: If role is Teacher, use Step 2 time; otherwise use Step 1 time*

**Hours Worked Column (I)**:
```excel
=IF(H2<>"",H2-G2,"")
```
*Logic: If Time Out exists, calculate difference; otherwise leave blank*

**Verification Status Column (J)**:
```excel
=IF(D2="Teacher","Verified","Single Step")
```
*Logic: Teachers get "Verified", others get "Single Step"*

### Step 4: Conditional Formatting

**Highlight Teachers with Two-Step Verification**:
```
Select columns E-F
Conditional Formatting > New Rule
Formula: =AND($D2="Teacher",$E2<>"",$F2<>"")
Format: Light green background
```

**Highlight Incomplete Days (No Time Out)**:
```
Select column H
Conditional Formatting > New Rule
Formula: =AND($G2<>"",$H2="")
Format: Light red background
```

---

## Usage Instructions

### For Teachers (Two-Step Process)

1. **Step 1 - Initial Clock In**:
   - Enter Date, Staff ID, Name, Role
   - Record current time in "Step 1 Time" column
   - Leave other columns blank

2. **Step 2 - Confirmation** (within 10 minutes):
   - Record current time in "Step 2 Time" column
   - "Time In" will auto-populate with Step 2 time
   - "Verification Status" will show "Verified"

3. **Clock Out**:
   - Record departure time in "Time Out" column
   - "Hours Worked" will auto-calculate

### For General Staff (Single-Step Process)

1. **Clock In**:
   - Enter Date, Staff ID, Name, Role
   - Record current time in "Step 1 Time" column
   - "Time In" will auto-populate with Step 1 time
   - "Verification Status" will show "Single Step"

2. **Clock Out**:
   - Record departure time in "Time Out" column
   - "Hours Worked" will auto-calculate

---

## Google Sheets Specific Features

### Auto-Timestamp Function

Add this script to automatically capture timestamps:

```javascript
function onEdit(e) {
  var sheet = e.source.getActiveSheet();
  var range = e.range;
  
  // Check if we're in the Daily Attendance Log sheet
  if (sheet.getName() !== "Daily Attendance Log") return;
  
  var row = range.getRow();
  var col = range.getColumn();
  
  // If Role is entered (column 4) and it's "Teacher"
  if (col === 4 && range.getValue() === "Teacher") {
    // Auto-fill Step 1 Time (column 5)
    if (sheet.getRange(row, 5).getValue() === "") {
      sheet.getRange(row, 5).setValue(new Date());
    }
  }
  
  // If Role is entered and it's "General Staff"
  if (col === 4 && range.getValue() === "General Staff") {
    // Auto-fill Step 1 Time (column 5)
    if (sheet.getRange(row, 5).getValue() === "") {
      sheet.getRange(row, 5).setValue(new Date());
    }
  }
}
```

### Add Button for Step 2 Confirmation

1. Insert > Drawing
2. Create a button labeled "Confirm Arrival"
3. Assign script:

```javascript
function confirmArrival() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var row = sheet.getActiveRange().getRow();
  var role = sheet.getRange(row, 4).getValue();
  
  if (role === "Teacher") {
    sheet.getRange(row, 6).setValue(new Date());
    SpreadsheetApp.getUi().alert("Arrival confirmed!");
  } else {
    SpreadsheetApp.getUi().alert("Only teachers need Step 2 confirmation.");
  }
}
```

---

## Reports and Analytics

### Daily Summary Report

Create a pivot table:
- Rows: Role
- Values: Count of Staff ID, Average of Hours Worked
- Filter: Date

### Weekly Attendance Report

```excel
=COUNTIFS(DailyLog!A:A,">="&StartDate,DailyLog!A:A,"<="&EndDate,DailyLog!B:B,StaffID)
```

### Late Arrivals Report

Add a column for "Late" status:
```excel
=IF(G2>TIME(8,30,0),"Late","On Time")
```

---

## Data Validation Rules

### Prevent Duplicate Entries

Add this to prevent multiple entries per staff per day:

```excel
=COUNTIFS($A:$A,$A2,$B:$B,$B2)=1
```

### Ensure Step 2 Within 10 Minutes

Add validation for Step 2 Time:
```excel
=IF(D2="Teacher",AND(F2<>"",F2-E2<=TIME(0,10,0)),TRUE)
```

---

## Export and Backup

### Daily Backup
1. File > Download > Excel (.xlsx)
2. Save with date: `Attendance_2026-01-29.xlsx`

### Monthly Archive
1. Create new sheet for each month
2. Copy all data from Daily Log
3. Clear Daily Log for new month

---

## Advantages of Excel/Sheets Approach

✅ **Simple**: No coding required
✅ **Accessible**: Works offline
✅ **Familiar**: Most users know Excel
✅ **Flexible**: Easy to customize
✅ **Portable**: Easy to share and backup

## Limitations

❌ **Manual Entry**: Requires manual timestamp entry
❌ **No Real-Time**: Not connected to live system
❌ **Limited Security**: Easy to modify historical data
❌ **No Automation**: Clock-in/out not automatic

---

## Recommended Workflow

1. **Morning**: Staff members enter their attendance
2. **Midday**: Supervisor reviews incomplete entries
3. **Evening**: All staff complete clock-out
4. **Weekly**: Generate summary reports
5. **Monthly**: Archive data and start fresh

---

## Tips for Success

1. **Train Staff**: Ensure everyone understands the two-step process
2. **Regular Audits**: Review data weekly for accuracy
3. **Backup Daily**: Save copies to prevent data loss
4. **Use Templates**: Create monthly templates to save time
5. **Document Issues**: Keep notes on any attendance problems

---

## Transition to Digital System

When ready to move to the full digital system:

1. Export all Excel data to CSV
2. Import into database using provided scripts
3. Train staff on new web interface
4. Run both systems in parallel for 1 week
5. Fully transition to digital system

---

## Support

For questions about the Excel template:
- Check formula syntax
- Verify data validation rules
- Review conditional formatting
- Test with sample data first

For the full digital system, refer to `STAFF_ATTENDANCE_SYSTEM.md`
