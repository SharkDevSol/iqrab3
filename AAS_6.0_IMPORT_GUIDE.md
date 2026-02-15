# AAS 6.0 Attendance Import Guide

## Overview

This guide explains how to use the **AAS 6.0 (Attendance Automation Software)** workflow to import attendance data from your AI06 Face Recognition Machine into the School Management System.

Since direct TCP/IP connection using `node-zklib` is not compatible with your specific AI06 firmware version, we use the official ZKTeco software (AAS 6.0) as an intermediary.

---

## Workflow Summary

```
┌─────────────────┐
│  AI06 Machine   │  (Captures face recognition check-ins)
└────────┬────────┘
         │
         │ (Download via AAS 6.0 software)
         ▼
┌─────────────────┐
│   AAS 6.0       │  (Official ZKTeco software)
│   Software      │
└────────┬────────┘
         │
         │ (Export to CSV)
         ▼
┌─────────────────┐
│   CSV File      │  (Department, Name, Staff Code, Date, Times)
└────────┬────────┘
         │
         │ (Upload via web interface)
         ▼
┌─────────────────┐
│  School System  │  (Imports and processes attendance)
│  Backend API    │
└─────────────────┘
```

---

## Step-by-Step Instructions

### Step 1: Download Attendance from Machine (Using AAS 6.0)

1. **Open AAS 6.0 Software** on your computer
2. **Connect to the AI06 Machine**:
   - Ensure machine and computer are on the same network
   - Machine IP: `10.22.134.43`
   - Add the machine in AAS 6.0 if not already configured
3. **Download Attendance Logs**:
   - Select the date range you want to download
   - Click "Download" or "Sync" button
   - Wait for the download to complete

### Step 2: Export to CSV

1. **In AAS 6.0**, select the downloaded attendance records
2. **Export to CSV**:
   - Look for "Export" or "Export to Excel/CSV" option
   - Choose CSV format
   - Save the file to a known location (e.g., Desktop)

**Expected CSV Format:**
```csv
Department,Name,Staff Code,Date,Week,Time1,Time2,Time3,Time4,Time5,Time6,Time7,Time8,Time9,Time10,Time11,Time12
IT,khalid,00000001,1/27/2026,Monday,23:29,23:36,,,,,,,,,,
HR,Ahmed,00000002,1/27/2026,Monday,08:15,12:30,13:45,,,,,,,,,
```

**Important Fields:**
- **Staff Code**: The User ID registered on the machine (e.g., `00000001`)
- **Date**: Format is `M/D/YYYY` (e.g., `1/27/2026`)
- **Time1-Time12**: Multiple check-in times per day

### Step 3: Map Staff Codes to Database IDs

Before importing, you need to map the machine's Staff Codes to your database person IDs.

**API Endpoint:** `POST /api/machine-attendance/user-mapping`

**Example Request:**
```json
{
  "personId": "staff-123",
  "personType": "staff",
  "machineUserId": 1
}
```

**Create mappings for all staff/students who use the machine.**

### Step 4: Import CSV into School System

**Option A: Via API (Recommended for automation)**

```bash
curl -X POST http://localhost:5000/api/machine-attendance/import-csv \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "csvFile=@/path/to/attendance.csv"
```

**Option B: Via Web Interface (Coming Soon)**

Upload the CSV file through the admin dashboard.

### Step 5: Review Import Results

The import will return:
```json
{
  "success": true,
  "recordsProcessed": 50,
  "recordsSaved": 45,
  "unmappedStaffCodes": ["00000005", "00000007"],
  "errors": []
}
```

**If there are unmapped staff codes:**
1. Create user mappings for those codes (Step 3)
2. Re-import the CSV file
3. Previously unmapped records will now be processed

---

## Database Tables

### dual_mode_attendance
Stores all attendance records with source tracking:
```sql
- person_id: Database ID (student-123, staff-456)
- person_type: 'student' or 'staff'
- date: Attendance date
- status: 'present', 'absent', 'late'
- source_type: 'manual' or 'machine'
- source_machine_ip: 'AAS6.0' for CSV imports
- timestamp: When the check-in occurred
```

### user_machine_mapping
Maps machine User IDs to database person IDs:
```sql
- person_id: Database ID
- person_type: 'student' or 'staff'
- machine_user_id: Machine User ID (Staff Code)
```

### attendance_audit_log
Tracks all import operations:
```sql
- operation_type: 'machine_sync'
- details: JSON with import statistics
- timestamp: When the import occurred
```

---

## Testing the Import

### Test with Sample Data

Run the test script to verify the import functionality:

```bash
cd backend
npm run test:csv-import
```

This will:
1. Create a sample CSV file with test data
2. Run the import process
3. Display results and unmapped staff codes
4. Show next steps

### Manual Testing

1. Create a small CSV file with 2-3 records
2. Ensure at least one Staff Code is mapped in the database
3. Import the CSV via API
4. Check the `dual_mode_attendance` table for new records
5. Verify `source_type = 'machine'` and `source_machine_ip = 'AAS6.0'`

---

## API Endpoints

### Import CSV
```
POST /api/machine-attendance/import-csv
Content-Type: multipart/form-data
Authorization: Bearer <token>

Body: csvFile (file upload)
```

### Create User Mapping
```
POST /api/machine-attendance/user-mapping
Content-Type: application/json
Authorization: Bearer <token>

Body:
{
  "personId": "staff-123",
  "personType": "staff",
  "machineUserId": 1
}
```

### Get User Mappings
```
GET /api/machine-attendance/user-mappings?personType=staff
Authorization: Bearer <token>
```

### Get Unmapped Staff Codes
```
GET /api/machine-attendance/unmapped-staff-codes
Authorization: Bearer <token>
```

---

## Troubleshooting

### Issue: "Unmapped Staff Codes" in import results

**Cause:** The Staff Code from the CSV doesn't have a corresponding entry in `user_machine_mapping` table.

**Solution:**
1. Get the list of unmapped codes from the import result
2. Identify which staff/students those codes belong to
3. Create user mappings using the API
4. Re-import the CSV

### Issue: "No records saved" despite processing records

**Cause:** All Staff Codes in the CSV are unmapped.

**Solution:** Create user mappings first, then re-import.

### Issue: Duplicate records on re-import

**Solution:** The system uses `ON CONFLICT DO NOTHING` to prevent duplicates. Re-importing the same data is safe.

### Issue: Invalid date format errors

**Cause:** CSV date format doesn't match `M/D/YYYY`.

**Solution:** Ensure AAS 6.0 exports dates in the correct format. If not, you may need to pre-process the CSV.

---

## Best Practices

### 1. Regular Imports
- Import attendance data daily or weekly
- Don't wait too long between imports to avoid large CSV files

### 2. User Mapping Management
- Create user mappings when registering new staff/students
- Keep a master list of Staff Codes and their corresponding database IDs
- Regularly check for unmapped codes

### 3. Data Validation
- Review import results after each import
- Check for errors or unmapped codes
- Verify attendance records in the database

### 4. Backup
- Keep CSV files as backup records
- Store them in a organized folder structure (e.g., by month)

### 5. Conflict Handling
- If both manual and machine records exist for the same person/date, a conflict is created
- Review conflicts regularly in the admin dashboard
- Mark one record as authoritative

---

## Next Steps

1. **Test the import** with sample data using `npm run test:csv-import`
2. **Create user mappings** for your staff and students
3. **Download real data** from AAS 6.0 and export to CSV
4. **Import the CSV** via API or web interface
5. **Verify the results** in the database
6. **Build frontend UI** for CSV upload and mapping management

---

## Support

If you encounter issues:
1. Check the `attendance_audit_log` table for error details
2. Review the backend console logs
3. Verify database connectivity
4. Ensure CSV format matches the expected structure
5. Confirm user mappings exist for all Staff Codes

---

## Files Reference

- **Backend Service**: `backend/services/aasImportService.js`
- **API Routes**: `backend/routes/machineAttendance.js`
- **Test Script**: `backend/scripts/test-csv-import.js`
- **Database Schema**: `backend/database/dual_mode_attendance_schema.sql`
- **Design Document**: `.kiro/specs/dual-mode-attendance-system/design.md`
