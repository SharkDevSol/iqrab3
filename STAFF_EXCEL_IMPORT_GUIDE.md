# Staff Excel Import/Export Guide

## Quick Start

### Download Template
1. Go to Staff Registration page
2. Select your staff type (Teachers, Supportive Staff, etc.)
3. Select the class/department
4. Click **"📥 Download Excel"** button
5. Excel template will download with all required columns

### Fill Template
The template includes all staff fields EXCEPT these (auto-generated):
- `id` - Database ID
- `global_staff_id` - Global staff ID
- `staff_id` - Table-specific staff ID
- `username` - Login username
- `password` - Login password
- `image_staff` - Photo (not supported in bulk import)

**Required Field:**
- `name` - Staff member's full name

**Recommended Fields:**
- `gender` - Male or Female
- `role` - Teacher, Director, Coordinator, Guard, Cleaner, etc.
- `staff_enrollment_type` - Permanent or Contract
- `staff_work_time` - Full Time or Part Time
- `phone` - Contact number
- `machine_id` - For attendance system (must be unique)

### Upload File
1. Fill the Excel template with staff data
2. Save the file
3. Go back to Staff Registration page
4. Click **"📤 Upload Excel"** button
5. Select your filled Excel file
6. Wait for processing
7. See results with success/error counts

## What Happens During Upload

For each staff member in your Excel:

1. **IDs Assigned Automatically**
   - `global_staff_id` - Unique across all staff
   - `staff_id` - Unique within this staff table
   - `id` - Database record ID

2. **Credentials Generated**
   - `username` - Based on name + random number
   - `password` - 8-character secure password
   - User account created for login

3. **Additional Processing**
   - If role is "Teacher" → Added to teachers table
   - If staff type is "Teachers" → Added to schedule system
   - All staff → Attendance profile initialized

## Example

### Excel Template Columns
```
name | gender | role | staff_enrollment_type | staff_work_time | phone | machine_id
```

### Fill With Data
```
name          | gender | role    | staff_enrollment_type | staff_work_time | phone      | machine_id
John Smith    | Male   | Teacher | Permanent             | Full Time       | 1234567890 | 100
Mary Johnson  | Female | Teacher | Contract              | Part Time       | 0987654321 | 101
Bob Williams  | Male   | Guard   | Permanent             | Full Time       | 5551234567 | 102
```

### After Upload
```
✅ Successfully imported 3 staff members

John Smith:
- global_staff_id: 1
- staff_id: 1
- username: johnsmith_4523
- password: a7b3c9d2
- Added to teachers table ✓
- Schedule system ✓
- Attendance profile ✓

Mary Johnson:
- global_staff_id: 2
- staff_id: 2
- username: maryjohnson_8901
- password: x4y2z8w1
- Added to teachers table ✓
- Schedule system ✓
- Attendance profile ✓

Bob Williams:
- global_staff_id: 3
- staff_id: 3
- username: bobwilliams_3456
- password: p9q5r3s7
- Attendance profile ✓
```

## Important Notes

### Machine ID
- Must be unique for each staff member
- Used for attendance tracking
- Recommended format: 100-999 for staff (3 digits)
- Different from student machine IDs (1000-9999)

### Work Time
- **Full Time**: Automatically assigned Monday-Friday, morning & afternoon shifts
- **Part Time**: Schedule needs to be set up individually after import

### File Uploads
- Staff photos and documents cannot be uploaded via Excel
- Add these individually through the regular form after bulk import

### Validation
- Each row is validated before import
- If a row has errors, it's skipped
- Other valid rows continue to import
- You'll see detailed error messages for failed rows

## Troubleshooting

### Error: "Missing required field: name"
- Every staff member must have a name
- Check that the `name` column is filled for all rows

### Error: "duplicate key value violates unique constraint"
- You have duplicate `machine_id` values
- Each staff member needs a unique machine ID
- Check your Excel for duplicates

### Error: "Table does not exist"
- The selected staff type/class doesn't exist
- Create the staff table first before importing

### Partial Import Success
- Some staff imported, others failed
- Check error details to see which rows failed
- Fix the errors in your Excel
- Re-upload only the failed staff members

### No Credentials Shown
- Credentials are generated but not displayed after bulk import
- Staff can use the "Forgot Password" feature
- Or admin can reset passwords individually

## Tips

1. **Start Small**: Test with 2-3 staff members first
2. **Check Data**: Verify all required fields are filled
3. **Unique IDs**: Ensure machine_ids are unique
4. **Save Template**: Keep a copy of the template for future use
5. **Backup**: Download existing staff data before bulk import

## Need Help?

If you encounter issues:
1. Check the error message details
2. Verify your Excel data format
3. Ensure all required fields are filled
4. Try importing one staff member at a time to isolate the problem
5. Contact system administrator if problems persist
