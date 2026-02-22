# Test Guardian Account Fix

## What Was Fixed

### 1. Backend - Guardian Account Creation
- **File:** `backend/routes/studentRoutes.js`
- **Fix:** Added logic to search for existing guardians by phone number before creating new accounts
- **Result:** Only ONE guardian account per phone number

### 2. Backend - Guardian Marks API
- **File:** `backend/routes/markListRoutes.js`
- **New Endpoint:** `GET /api/mark-list/guardian-marks/:guardianUsername`
- **Returns:** All marks for all wards of a guardian

### 3. Backend - Guardian Attendance API
- **File:** `backend/routes/guardianAttendanceRoutes.js`
- **New Endpoint:** `GET /api/guardian-attendance/guardian-attendance/:guardianUsername`
- **Returns:** All attendance records for all wards of a guardian

### 4. Frontend - Guardian Marks Component
- **File:** `APP/src/Guardian/GuardianMarks/GuardianMarks.jsx`
- **Fix:** Connected to real API instead of hardcoded data
- **Result:** Shows real marks for ALL wards

### 5. Frontend - Guardian Attendance Component
- **File:** `APP/src/Guardian/GuardianAttendance/GuardianAttendance.jsx`
- **Fix:** Connected to real API instead of hardcoded data
- **Result:** Shows real attendance for ALL wards

---

## Testing Steps

### Step 1: Restart Backend Server
```bash
cd backend
npm start
```

Wait for: "Server running on port 5000"

### Step 2: Test Guardian Account Creation

#### Test Case 1: Register First Student
1. Go to admin panel
2. Navigate to Student Registration
3. Fill in student details:
   - Student Name: `khalid abdurhman ahmed`
   - Age: `21`
   - Gender: `Male`
   - Class: `KG1B`
   - Guardian Name: `abdurhman ahmed`
   - Guardian Phone: `0936311768`
   - Guardian Relation: `father`
4. Click Register
5. **Note the guardian username** (e.g., `abdurhmanahmmed_4386`)

#### Test Case 2: Register Second Student with Same Guardian
1. Register another student:
   - Student Name: `obsa yusuf`
   - Age: `12`
   - Gender: `Male`
   - Class: `KG2A`
   - Guardian Name: `abdurhman ahmed`
   - Guardian Phone: `0936311768` (SAME PHONE)
   - Guardian Relation: `father`
2. Click Register
3. **Check the guardian username** - it should be THE SAME as the first student

**Expected Result:** Both students should have the SAME guardian username

### Step 3: Test Guardian App Login

1. Open Guardian App (mobile app)
2. Login with the guardian username from Step 1
3. Use the password provided during registration

### Step 4: Test Profile Tab

1. Go to Profile tab
2. **Expected:** You should see BOTH students:
   - khalid abdurhman ahmed (KG1B)
   - obsa yusuf (KG2A)

### Step 5: Test Marks Tab

1. Go to Marks tab
2. **Expected:** 
   - Dropdown shows both students
   - Can filter by "All Wards" or individual student
   - Shows marks for both students (if marks exist)
   - Statistics calculated for all students

### Step 6: Test Attendance Tab

1. Go to Attendance tab
2. **Expected:**
   - Dropdown shows both students
   - Can filter by "All Wards" or individual student
   - Shows attendance for both students
   - Statistics calculated for all students

### Step 7: Test Payments Tab

1. Go to Payments tab
2. **Expected:**
   - Shows payments for both students
   - Can see payment history for each student

---

## Verification Checklist

- [ ] Backend server started successfully
- [ ] First student registered - guardian account created
- [ ] Second student registered - NO new guardian account created
- [ ] Both students have SAME guardian username
- [ ] Guardian app login successful
- [ ] Profile tab shows BOTH students
- [ ] Marks tab shows marks for BOTH students
- [ ] Attendance tab shows attendance for BOTH students
- [ ] Payments tab shows payments for BOTH students
- [ ] Filter by individual student works correctly
- [ ] Statistics calculated correctly

---

## Troubleshooting

### Issue: Backend won't start
**Solution:** Check if port 5000 is already in use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or use different port in backend/.env
PORT=5001
```

### Issue: Guardian username still different
**Solution:** 
1. Check backend console for logs
2. Look for: "Found existing guardian: ..." or "Creating new guardian: ..."
3. If creating new guardian, the phone number might not match exactly
4. Verify phone numbers are EXACTLY the same (no spaces, same format)

### Issue: Marks/Attendance not showing
**Solution:**
1. Check browser console for errors
2. Verify API endpoints are working:
   - Open: `http://localhost:5000/api/mark-list/guardian-marks/abdurhmanahmmed_4386`
   - Should return JSON with wards and marks
3. Check if marks/attendance data exists in database

### Issue: "Cannot read property 'guardian_username' of undefined"
**Solution:**
1. Guardian info not stored in localStorage
2. Login again to guardian app
3. Check localStorage in browser dev tools

---

## Database Verification

### Check Guardian Accounts in Database

```sql
-- Check all students with guardian phone 0936311768
SELECT 
  student_name,
  class,
  guardian_name,
  guardian_phone,
  guardian_username,
  guardian_password
FROM classes_schema."KG1B"
WHERE guardian_phone = '0936311768'
UNION ALL
SELECT 
  student_name,
  class,
  guardian_name,
  guardian_phone,
  guardian_username,
  guardian_password
FROM classes_schema."KG2A"
WHERE guardian_phone = '0936311768';
```

**Expected Result:** Both rows should have the SAME guardian_username

---

## Success Criteria

✅ Only ONE guardian account per phone number
✅ All students with same guardian phone linked to ONE account
✅ Guardian app shows ALL wards in profile
✅ Marks tab shows marks for ALL wards
✅ Attendance tab shows attendance for ALL wards
✅ Payments tab shows payments for ALL wards
✅ Filtering by individual ward works correctly

---

## Next Steps After Testing

If all tests pass:
1. Test with more students (3rd, 4th student with same guardian)
2. Test with different guardian phone numbers
3. Test editing student information
4. Test deactivating students

If tests fail:
1. Check the troubleshooting section
2. Review backend console logs
3. Review browser console logs
4. Check the GUARDIAN_ACCOUNT_FIX_COMPLETE.md document
