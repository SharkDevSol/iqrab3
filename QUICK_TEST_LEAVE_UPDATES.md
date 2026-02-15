# 🧪 Quick Test: Leave Request Updates

## ⚡ 3-Minute Test

### Test 1: Staff List (FIXED)
1. Go to **Leave Management**
2. Click **🏖️ Grant Leave**
3. Click **Select Staff Member** dropdown
4. **VERIFY:**
   - ✅ Dropdown shows staff names
   - ✅ Format: "Name (Department)"
   - ✅ Multiple staff visible

**If empty:** Check that staff exists in ListStaff page

---

### Test 2: Days Duration (Default)
1. Select any staff member
2. Duration type: **📅 Days** (should be selected by default)
3. Enter: **7** days
4. **VERIFY:**
   - ✅ Shows "7 consecutive day(s)"
   - ✅ Summary shows "Duration: 7 day(s)"
   - ✅ Summary shows "Total Days: 7 days"

---

### Test 3: Months Duration (NEW)
1. Click **📆 Months** button
2. **VERIFY:**
   - ✅ Button turns blue
   - ✅ Days input disappears
   - ✅ Months input appears
3. Enter: **3** months
4. **VERIFY:**
   - ✅ Shows "3 month(s) (approximately 90 days)"
   - ✅ Summary shows "Duration: 3 month(s) (~90 days)"
   - ✅ Summary shows "Total Days: 90 days"

---

### Test 4: Year Duration (NEW)
1. Click **🗓️ Year** button
2. **VERIFY:**
   - ✅ Button turns blue
   - ✅ Input field disappears
   - ✅ Blue info box appears
   - ✅ Shows "1 full Ethiopian year (365 days)"
   - ✅ Summary shows "Duration: 1 year (365 days)"
   - ✅ Summary shows "Total Days: 365 days"

---

### Test 5: Submit and Verify
1. Fill all fields:
   - Staff: Any staff member
   - Reason: Maternity Leave
   - Start: Day 1, Meskerem 2018
   - Duration: **Months**
   - Months: **3**
2. Click **🏖️ Grant Leave**
3. **VERIFY:**
   - ✅ Success message: "3 month(s) (90 days) marked as LEAVE"
   - ✅ Modal closes

4. Go to **HR Attendance System**
5. Check **Meskerem, Tikimt, Hidar 2018**
6. **VERIFY:**
   - ✅ All days in these 3 months show purple
   - ✅ Badge shows "V"
   - ✅ Total ~90 days marked

---

## 🎯 Expected Results

### Staff Dropdown
```
Select Staff Member *
┌────────────────────────────────────┐
│ John Doe (Teachers)                │
│ Jane Smith (Administrative Staff)  │
│ Bob Wilson (Supportive Staff)      │
│ Sarah Johnson (Teachers)           │
└────────────────────────────────────┘
```

### Duration Type Buttons
```
┌──────────────────────────────────────┐
│ [📅 Days] [📆 Months] [🗓️ Year]     │
│  (Blue)    (White)     (White)       │
└──────────────────────────────────────┘
```

### Days Input
```
Number of Days *
[7                                    ]
Leave will be granted for 7 consecutive day(s)
```

### Months Input
```
Number of Months *
[3                                    ]
Leave will be granted for 3 month(s) (approximately 90 days)
```

### Year Display
```
┌─────────────────────────────────────┐
│ 🗓️ Full Year Leave                  │
│ Leave will be granted for 1 full    │
│ Ethiopian year (365 days)           │
└─────────────────────────────────────┘
```

### Summary
```
📋 Leave Summary:
Staff: John Doe
Department: Teachers
Reason: Maternity Leave
Start Date: Day 1, Meskerem 2018
Duration: 3 month(s) (~90 days)
Total Days: 90 days
Status: Will be marked as LEAVE (no deduction)
```

---

## ✅ Success Checklist

- [ ] Staff dropdown shows staff members
- [ ] Days button works (default)
- [ ] Months button works (new)
- [ ] Year button works (new)
- [ ] Correct input shows for each type
- [ ] Summary updates correctly
- [ ] Total days calculated correctly
- [ ] Success message shows correct format
- [ ] Leave appears in attendance
- [ ] Long leave spans multiple months

---

## ❌ Common Issues

### Issue: Staff dropdown empty
**Solution:** 
- Check staff exists in ListStaff page
- Verify API endpoints working
- Check browser console for errors

### Issue: Duration buttons not working
**Solution:**
- Click directly on button
- Check button state changes (blue = active)
- Verify input field changes

### Issue: Total days wrong
**Solution:**
- Check duration type selected
- Verify input value is valid
- Days: value × 1
- Months: value × 30
- Year: 365

---

## 🔍 Quick Debug

### Check Staff Loading
```javascript
// Open browser console
// Should see:
✅ Loaded staff for leave: X members
```

### Check Duration Calculation
```javascript
// In summary, verify:
Days: numberOfDays = totalDays
Months: numberOfMonths × 30 = totalDays
Year: 365 = totalDays
```

---

**Test Duration:** ~3 minutes
**Priority:** High - Bug fix + New feature
**Status:** Ready to test
