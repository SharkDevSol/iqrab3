# 🧪 Test Leave Management Page

## Steps to Test:

1. **Refresh the Leave Management page** in your browser
2. **Check the backend logs** - should show:
   ```
   📋 Found X registered staff members
   👥 Registered staff IDs: ['7', '8', '9', ...]
   📋 Querying attendance issues for X registered staff
   📅 Month: 6, Year: 2018, Status filter: PENDING
   🔍 Executing query...
   ✅ Query returned X attendance issues
   ```

3. **If no data shows:**
   - Check if registered staff have any LATE, ABSENT, or HALF_DAY records in month 6/2018
   - Try changing the month dropdown to see other months
   - Check the "All" filter to see all statuses

## What the Query Does:

1. Gets all registered staff from Teacher/AdministrativeStaff/SupportiveStaff tables
2. Queries attendance records for those staff IDs only
3. Filters by:
   - Month and Year
   - Status: LATE, ABSENT, HALF_DAY
   - Staff ID must be in registered staff list

## Key Points:

✅ Only shows staff registered in staff tables
✅ Staff with machine ID but not registered = NOT shown
✅ Staff registered but no machine ID = CAN be shown (if they have attendance records)
✅ Students (ID 1001+) = NOT shown (not in staff tables)

## After Refresh:

Please share the backend console output so I can see:
- How many registered staff were found
- What staff IDs are being queried
- How many attendance issues were returned
