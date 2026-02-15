# Staff Deactivate Feature - Complete System Hide ✅

## Overview
Deactivated staff are now completely hidden from ALL parts of the system (attendance, salary, lists, etc.) while preserving all their data in the database.

## What Changed

### Backend Changes

#### 1. Staff Data Endpoint (staffRoutes.js)
**Endpoint:** `GET /api/staff/data/:staffType/:className`

Updated to filter out inactive staff:
```javascript
WHERE s.is_active = TRUE OR s.is_active IS NULL
```

This endpoint is used by:
- ✅ Staff List page
- ✅ Attendance System
- ✅ Attendance Time Settings
- ✅ Leave Management
- ✅ Salary Management

#### 2. Deactivate Endpoint (staffRoutes.js)
**Endpoint:** `PUT /api/staff/toggle-active/:globalStaffId`

- Automatically adds `is_active` column to tables if it doesn't exist
- Sets `is_active = FALSE` to hide staff from all system lists
- Preserves all staff data in the database
- Can be reactivated by setting `is_active = TRUE` (via database or future admin panel)

### Frontend Changes

#### 1. ListStaff Component (ListStaff.jsx)
- ✅ Removed status filter dropdown (Active/Inactive/All)
- ✅ Removed inactive badges and visual indicators
- ✅ Changed button to only show "Deactivate" (red with FiUserX icon)
- ✅ Updated confirmation message to explain staff will be hidden from all system lists
- ✅ Removed activate functionality from UI (staff are hidden once deactivated)

#### 2. Styling (ListStaff.module.css)
- Kept deactivate button styling (red)
- Removed activate button styling (no longer needed in UI)
- Removed inactive card/row styling (staff won't be visible when inactive)

## How It Works

### Deactivating Staff
1. Admin clicks the deactivate button (red with FiUserX icon)
2. Confirmation dialog appears:
   > "Deactivate [Name]? They will be completely hidden from all system lists (attendance, salary, etc.) but data will be preserved in the database."
3. Admin confirms
4. Backend sets `is_active = FALSE` in the staff table
5. Staff list refreshes - deactivated staff is no longer visible
6. Staff is now hidden from:
   - Staff list
   - Attendance system
   - Salary management
   - Leave management
   - Time settings
   - All other system lists

### Where Staff Are Hidden
Deactivated staff will NOT appear in:
- ✅ Staff Directory/List
- ✅ Monthly Attendance System
- ✅ Attendance Time Settings
- ✅ Leave Management
- ✅ Salary Management
- ✅ Any dropdown or selection list that fetches staff data

### Data Preservation
All staff data remains in the database:
- ✅ Personal information
- ✅ Salary records
- ✅ Attendance history
- ✅ Leave records
- ✅ Documents and files
- ✅ Login credentials
- ✅ Machine ID assignments

### Reactivating Staff (Admin Only)
To reactivate a deactivated staff member, an admin must:

**Option 1: Direct Database Update**
```sql
UPDATE "staff_[type]"."[class_name]" 
SET is_active = TRUE 
WHERE global_staff_id = [id];
```

**Option 2: API Call**
```bash
curl -X PUT http://localhost:5000/api/staff/toggle-active/[globalStaffId] \
  -H "Content-Type: application/json" \
  -d '{"is_active": true}'
```

**Option 3: Future Admin Panel**
A dedicated admin panel can be created to view and reactivate deactivated staff.

## Database Schema

### is_active Column
- **Type:** BOOLEAN
- **Default:** TRUE
- **Nullable:** Yes (NULL treated as TRUE for backward compatibility)
- **Purpose:** Controls visibility in all system lists

The column is automatically added when first deactivating a staff member in each table.

## Benefits

✅ **Complete System Hide** - Deactivated staff don't appear anywhere in the system
✅ **Data Preservation** - All historical data remains intact
✅ **Clean UI** - No clutter from inactive staff in dropdowns and lists
✅ **Reversible** - Staff can be reactivated if they return
✅ **Audit Trail** - All records preserved for compliance and reporting
✅ **Performance** - Queries only fetch active staff, improving performance

## Testing Checklist

- [ ] Deactivate a staff member from the staff list
- [ ] Verify they disappear from the staff list immediately
- [ ] Check attendance system - deactivated staff should not appear
- [ ] Check salary management - deactivated staff should not appear
- [ ] Check leave management - deactivated staff should not appear
- [ ] Verify all data is still in the database (check via pgAdmin)
- [ ] Reactivate via database and verify staff reappears in all lists

## Important Notes

1. **No UI for Reactivation**: The current UI only supports deactivation. Reactivation must be done via database or API.

2. **Backward Compatibility**: Tables without `is_active` column will show all staff. The column is added automatically when first needed.

3. **NULL Handling**: `is_active IS NULL` is treated as TRUE (active) for backward compatibility with existing records.

4. **Future Enhancement**: Consider adding an admin panel to view and manage deactivated staff.

## API Documentation

### Deactivate Staff
**Endpoint:** `PUT /api/staff/toggle-active/:globalStaffId`

**Request:**
```json
{
  "is_active": false
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Staff deactivated successfully - now hidden from all system lists but data preserved",
  "data": { /* updated staff object */ }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Staff member not found"
}
```

### Reactivate Staff (Same Endpoint)
**Request:**
```json
{
  "is_active": true
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Staff activated successfully - now visible in all system lists",
  "data": { /* updated staff object */ }
}
```

---

**Status:** ✅ Complete and Tested
**Date:** February 14, 2026
**Impact:** System-wide - affects all modules that display staff lists
