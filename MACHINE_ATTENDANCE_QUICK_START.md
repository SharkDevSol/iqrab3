# Machine Attendance Quick Start Guide

## 🎯 Solution Overview

Your AI06 Face Recognition Machine attendance data can now be imported into the School Management System using the **AAS 6.0 CSV Import Workflow**.

**Why this approach?**
- Direct TCP/IP connection via `node-zklib` is incompatible with your AI06 firmware
- AAS 6.0 is the official ZKTeco software that works with your machine
- CSV import is reliable, simple, and doesn't require constant network connection

---

## 🚀 Quick Start (5 Steps)

### 1️⃣ Install Dependencies
```bash
cd backend
npm install csv-parser
```
✅ **Status:** Complete (csv-parser installed)

### 2️⃣ Test the Import System
```bash
npm run test:csv-import
```
This creates sample data and tests the import process.

### 3️⃣ Create User Mappings
Map machine Staff Codes to database person IDs:

```bash
# Example: Map Staff Code 1 to staff-123
curl -X POST http://localhost:5000/api/machine-attendance/user-mapping \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "personId": "staff-123",
    "personType": "staff",
    "machineUserId": 1
  }'
```

### 4️⃣ Export from AAS 6.0
1. Open AAS 6.0 software
2. Connect to machine (IP: 10.22.134.43)
3. Download attendance logs
4. Export to CSV format

### 5️⃣ Import CSV
```bash
curl -X POST http://localhost:5000/api/machine-attendance/import-csv \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "csvFile=@attendance.csv"
```

---

## 📊 CSV Format

Your AAS 6.0 exports should look like this:

```csv
Department,Name,Staff Code,Date,Week,Time1,Time2,Time3,...,Time12
IT,khalid,00000001,1/27/2026,Monday,23:29,23:36,,,,,,,,,,
HR,Ahmed,00000002,1/27/2026,Monday,08:15,12:30,13:45,,,,,,,,,
```

**Key Fields:**
- **Staff Code**: Machine User ID (must be mapped to database person_id)
- **Date**: Format `M/D/YYYY`
- **Time1-Time12**: Multiple check-ins per day

---

## 🔧 API Endpoints

### Import CSV
```
POST /api/machine-attendance/import-csv
Content-Type: multipart/form-data
Body: csvFile (file)
```

### Create User Mapping
```
POST /api/machine-attendance/user-mapping
Body: { personId, personType, machineUserId }
```

### Get Unmapped Codes
```
GET /api/machine-attendance/unmapped-staff-codes
```

### Get All Mappings
```
GET /api/machine-attendance/user-mappings?personType=staff
```

---

## 📁 Files Created

### Backend
- ✅ `backend/services/aasImportService.js` - CSV import logic
- ✅ `backend/routes/machineAttendance.js` - API endpoints (updated)
- ✅ `backend/scripts/test-csv-import.js` - Test script
- ✅ `backend/database/dual_mode_attendance_schema.sql` - Database schema

### Documentation
- ✅ `AAS_6.0_IMPORT_GUIDE.md` - Detailed guide
- ✅ `MACHINE_ATTENDANCE_QUICK_START.md` - This file

---

## 🗄️ Database Tables

### dual_mode_attendance
Stores all attendance records:
- `person_id` - Database ID
- `person_type` - 'student' or 'staff'
- `date` - Attendance date
- `status` - 'present', 'absent', 'late'
- `source_type` - 'manual' or 'machine'
- `source_machine_ip` - 'AAS6.0' for CSV imports
- `timestamp` - Check-in time

### user_machine_mapping
Maps machine IDs to database IDs:
- `person_id` - Database ID
- `person_type` - 'student' or 'staff'
- `machine_user_id` - Machine Staff Code

### attendance_audit_log
Tracks all operations:
- `operation_type` - 'machine_sync'
- `details` - JSON with import stats
- `timestamp` - When import occurred

---

## ⚠️ Important Notes

### User Mapping is Critical
- **Before importing**, create user mappings for all staff/students
- Unmapped Staff Codes will be skipped during import
- You can create mappings later and re-import

### Re-importing is Safe
- The system prevents duplicate records
- You can re-import the same CSV multiple times
- Only new records will be added

### Source Tracking
- All machine imports have `source_type = 'machine'`
- All machine imports have `source_machine_ip = 'AAS6.0'`
- Manual entries have `source_type = 'manual'`

---

## 🧪 Testing Checklist

- [ ] Run `npm run test:csv-import` successfully
- [ ] Create at least one user mapping
- [ ] Export sample data from AAS 6.0
- [ ] Import CSV via API
- [ ] Verify records in `dual_mode_attendance` table
- [ ] Check `attendance_audit_log` for import details
- [ ] Test with unmapped Staff Codes (should be reported)
- [ ] Re-import same CSV (should not create duplicates)

---

## 🎨 Frontend TODO

### CSV Upload Component
Create a React component for:
- File upload (drag & drop or browse)
- Upload progress indicator
- Import results display
- Unmapped codes warning

### User Mapping Interface
Create a React component for:
- List all staff/students
- Input field for Machine User ID
- Bulk import from CSV
- Validation and error handling

### Attendance View
Update existing attendance view to:
- Show source indicator (👤 manual, 🤖 machine)
- Filter by source type
- Display machine IP for machine records
- Highlight conflicts (manual + machine for same person/date)

---

## 📞 Support

### Check Import Status
```sql
SELECT * FROM attendance_audit_log 
WHERE operation_type = 'machine_sync' 
ORDER BY timestamp DESC 
LIMIT 10;
```

### View Unmapped Codes
```sql
SELECT details->>'unmappedStaffCodes' 
FROM attendance_audit_log 
WHERE operation_type = 'machine_sync' 
AND details->>'source' = 'AAS6.0_CSV';
```

### View Recent Imports
```sql
SELECT * FROM dual_mode_attendance 
WHERE source_type = 'machine' 
AND source_machine_ip = 'AAS6.0' 
ORDER BY created_at DESC 
LIMIT 50;
```

---

## 🎯 Next Steps

1. **Test the system** with sample data
2. **Create user mappings** for your staff/students
3. **Export real data** from AAS 6.0
4. **Import and verify** the results
5. **Build frontend UI** for easier management
6. **Train staff** on the workflow
7. **Set up regular imports** (daily/weekly)

---

## 📚 Related Documents

- **Detailed Guide**: `AAS_6.0_IMPORT_GUIDE.md`
- **Design Document**: `.kiro/specs/dual-mode-attendance-system/design.md`
- **Requirements**: `.kiro/specs/dual-mode-attendance-system/requirements.md`
- **Tasks**: `.kiro/specs/dual-mode-attendance-system/tasks.md`
- **Database Schema**: `backend/database/dual_mode_attendance_schema.sql`

---

## ✅ What's Working

- ✅ Database schema created and verified
- ✅ CSV parser service implemented
- ✅ API endpoints created
- ✅ User mapping system ready
- ✅ Audit logging in place
- ✅ Test script available
- ✅ Documentation complete

## 🚧 What's Next

- 🔲 Frontend CSV upload component
- 🔲 Frontend user mapping interface
- 🔲 Attendance view with source indicators
- 🔲 Conflict detection UI
- 🔲 Bulk user mapping import
- 🔲 Automated import scheduling

---

**You're ready to start importing attendance data from your AI06 machine! 🎉**
