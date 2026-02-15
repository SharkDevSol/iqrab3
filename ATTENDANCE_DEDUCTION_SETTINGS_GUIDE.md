# Attendance Deduction Settings - Complete Guide

## Overview
The Attendance Deduction Settings page allows you to configure automatic salary deductions based on staff attendance records. You can set different deduction amounts for different staff types (Teachers, Supportive Staff, Administrative Staff) and different attendance issues (Absent, Late, Half Day).

---

## Features

### 1. **Deduction Rules Management**
- Create deduction rules for each staff type
- Set different amounts for ABSENT, LATE, and HALF_DAY
- Add descriptions and notes for each rule
- Activate/deactivate rules as needed

### 2. **Staff Type Support**
- **Teachers** - Configure deductions for teaching staff
- **Supportive Staff** - Configure deductions for support staff
- **Administrative Staff** - Configure deductions for admin staff

### 3. **Deduction Types**
- **ABSENT** - Full day absence deduction
- **LATE** - Late arrival deduction
- **HALF_DAY** - Half day deduction

### 4. **Summary Dashboard**
- View total active rules per staff type
- See average absent deduction amounts
- Quick overview of all configured rules

---

## How to Access

1. Navigate to **HR & Staff Management** section in the sidebar
2. Click on **⚙️ Attendance Deductions**
3. You'll see the Attendance Deduction Settings page

---

## How to Use

### Creating a New Deduction Rule

1. Click the **➕ Add Deduction Rule** button
2. Fill in the form:
   - **Staff Type**: Select Teachers, Supportive Staff, or Administrative Staff
   - **Deduction Type**: Choose ABSENT, LATE, or HALF_DAY
   - **Deduction Amount**: Enter the amount in Birr (e.g., 100.00)
   - **Description**: Add optional notes (e.g., "Per day absent deduction")
   - **Active Rule**: Check to activate immediately
3. Click **Create Rule**

### Example Rules

**For Teachers:**
- Absent: 200 Birr per day
- Late: 50 Birr per occurrence
- Half Day: 100 Birr per occurrence

**For Supportive Staff:**
- Absent: 150 Birr per day
- Late: 30 Birr per occurrence
- Half Day: 75 Birr per occurrence

**For Administrative Staff:**
- Absent: 180 Birr per day
- Late: 40 Birr per occurrence
- Half Day: 90 Birr per occurrence

### Editing a Rule

1. Find the rule in the table
2. Click the **✏️ Edit** button
3. Update the fields as needed
4. Click **Update Rule**

### Deleting a Rule

1. Find the rule in the table
2. Click the **🗑️ Delete** button
3. Confirm the deletion

### Activating/Deactivating Rules

- Edit the rule and check/uncheck the **Active Rule** checkbox
- Only active rules will be applied to salary calculations

---

## How Deductions Are Calculated

The system automatically calculates deductions based on:

1. **Attendance Records** - From the Ethiopian Calendar Attendance System
2. **Active Rules** - Only rules marked as "Active" are applied
3. **Staff Type** - Matches the staff member's type with the rule

### Calculation Formula:
```
Total Deduction = (Number of Absences × Absent Rate) + 
                  (Number of Late × Late Rate) + 
                  (Number of Half Days × Half Day Rate)
```

### Example:
If a Teacher has:
- 2 Absent days
- 3 Late arrivals
- 1 Half day

And the rules are:
- Absent: 200 Birr
- Late: 50 Birr
- Half Day: 100 Birr

**Total Deduction = (2 × 200) + (3 × 50) + (1 × 100) = 650 Birr**

---

## API Endpoints

### Get All Settings
```
GET /api/hr/attendance/deduction-settings
```

### Create Setting
```
POST /api/hr/attendance/deduction-settings
Body: {
  staffType: "Teachers",
  deductionType: "ABSENT",
  deductionAmount: 200.00,
  description: "Per day absent deduction",
  isActive: true
}
```

### Update Setting
```
PUT /api/hr/attendance/deduction-settings/:id
Body: { deductionAmount: 250.00 }
```

### Delete Setting
```
DELETE /api/hr/attendance/deduction-settings/:id
```

### Calculate Deductions for Staff
```
GET /api/hr/attendance/calculate-deductions?staffId=123&staffType=Teachers&ethMonth=6&ethYear=2018
```

---

## Database Schema

### Table: `hr_attendance_deduction_settings`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| staff_type | VARCHAR(255) | Teachers, Supportive Staff, Administrative Staff |
| deduction_type | VARCHAR(50) | ABSENT, LATE, HALF_DAY |
| deduction_amount | DECIMAL(10,2) | Amount in Birr |
| description | TEXT | Optional notes |
| is_active | BOOLEAN | Active status |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |

**Unique Constraint**: (staff_type, deduction_type)

---

## Integration with Salary Management

The deductions configured here will be automatically applied when calculating staff salaries:

1. System fetches attendance records for the month
2. Counts occurrences of ABSENT, LATE, HALF_DAY
3. Applies active deduction rules for the staff type
4. Adds deductions to the salary calculation

---

## Best Practices

1. **Set Reasonable Amounts** - Consider the staff salary when setting deduction amounts
2. **Use Descriptions** - Add clear descriptions to help understand each rule
3. **Test Before Activating** - Create rules as inactive first, then activate after review
4. **Regular Reviews** - Review and update deduction amounts periodically
5. **Communicate Clearly** - Inform staff about deduction policies

---

## Troubleshooting

### Deductions Not Applying
- Check if the rule is marked as "Active"
- Verify the staff type matches the rule
- Ensure attendance records exist for the period

### Wrong Amounts
- Review the deduction amount in the rule
- Check if multiple rules are being applied
- Verify the attendance count is correct

### Cannot Create Rule
- Check if a rule already exists for that staff type and deduction type
- Ensure all required fields are filled
- Verify the amount is positive

---

## Files Created

### Frontend
- `APP/src/PAGE/HR/AttendanceDeductionSettings.jsx` - Main settings page

### Backend
- `backend/routes/hr/attendance.js` - Added deduction settings endpoints

### Navigation
- `APP/src/PAGE/Home.jsx` - Added menu link
- `APP/src/App.jsx` - Added route

---

## Next Steps

1. Navigate to the page and create your first deduction rule
2. Test with different staff types
3. Verify calculations in the salary management system
4. Adjust amounts based on your school's policies

---

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify the backend server is running
3. Ensure you're logged in with proper permissions
4. Check the database connection

---

**Created**: February 8, 2026
**Status**: ✅ Complete and Ready to Use
