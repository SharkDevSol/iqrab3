# School Week View Implementation Guide

## Current Problem
The attendance system shows calendar weeks (Days 1-7, 8-14, etc.) but you want **school weeks** that:
- Only show configured school days (e.g., Mon-Sat)
- Span across months if needed (e.g., Yek 29-30, Meg 1-4)
- Show consecutive school days, not calendar days

## Example Scenario

**Settings**: School Days = Monday, Tuesday, Wednesday, Thursday, Saturday

**School Week 1** should show:
```
Yek 29 (Mon) | Yek 30 (Tue) | Meg 1 (Wed) | Meg 2 (Thu) | Meg 4 (Sat)
```

Notice:
- Skips Friday (Meg 3) - not a school day
- Spans two months (Yekatit → Megabit)
- Shows exactly 5 days (the configured school days)

## Solution Architecture

### 1. Backend: School Week Calculator

Create a new endpoint that calculates school weeks:

**File**: `backend/routes/academic/studentAttendance.js`

```javascript
// GET /api/academic/student-attendance/school-week
// Get school week dates based on settings
router.get('/school-week', async (req, res) => {
  try {
    const { weekNumber, startYear, startMonth } = req.query;
    
    // Get settings
    const settingsResult = await pool.query(
      'SELECT * FROM academic_student_attendance_settings ORDER BY id DESC LIMIT 1'
    );
    
    if (settingsResult.rows.length === 0) {
      return res.status(404).json({ error: 'Settings not found' });
    }
    
    const settings = settingsResult.rows[0];
    const schoolDays = settings.school_days;
    const daysPerWeek = schoolDays.length;
    
    // Calculate which school days to show
    const daysToSkip = (parseInt(weekNumber) - 1) * daysPerWeek;
    
    let currentYear = parseInt(startYear);
    let currentMonth = parseInt(startMonth);
    let currentDay = 1;
    let schoolDaysFound = 0;
    let schoolDaysSkipped = 0;
    const result = [];
    
    // Iterate through days
    while (schoolDaysFound < daysPerWeek && currentDay <= 365) {
      const dayOfWeek = getEthiopianDayOfWeek(currentYear, currentMonth, currentDay);
      
      if (schoolDays.includes(dayOfWeek)) {
        if (schoolDaysSkipped < daysToSkip) {
          schoolDaysSkipped++;
        } else {
          result.push({
            year: currentYear,
            month: currentMonth,
            day: currentDay,
            dayOfWeek: dayOfWeek
          });
          schoolDaysFound++;
        }
      }
      
      // Move to next day
      currentDay++;
      const daysInMonth = currentMonth === 13 ? 5 : 30;
      if (currentDay > daysInMonth) {
        currentDay = 1;
        currentMonth++;
        if (currentMonth > 13) {
          currentMonth = 1;
          currentYear++;
        }
      }
    }
    
    res.json({
      success: true,
      data: {
        weekNumber: parseInt(weekNumber),
        schoolDays: result,
        daysPerWeek: daysPerWeek
      }
    });
    
  } catch (error) {
    console.error('Error calculating school week:', error);
    res.status(500).json({ error: 'Failed to calculate school week' });
  }
});
```

### 2. Frontend: Use School Week Data

**File**: `APP/src/PAGE/Academic/StudentAttendanceSystem.jsx`

```javascript
// Fetch school week days
const fetchSchoolWeek = async () => {
  try {
    setIsLoading(true);
    
    const response = await axios.get(
      'http://localhost:5000/api/academic/student-attendance/school-week',
      {
        params: {
          weekNumber: selectedWeek,
          startYear: selectedYear,
          startMonth: selectedMonth
        }
      }
    );
    
    if (response.data.success) {
      setSchoolWeekDays(response.data.data.schoolDays);
    }
  } catch (err) {
    console.error('Error fetching school week:', err);
  } finally {
    setIsLoading(false);
  }
};

// Use in table
<thead>
  <tr>
    <th>Student Name</th>
    <th>Class ID</th>
    <th>Machine ID</th>
    {schoolWeekDays.map((dayInfo, index) => (
      <th key={index}>
        {ethiopianMonths[dayInfo.month - 1].substring(0, 3)} {dayInfo.day} ({dayInfo.dayOfWeek.substring(0, 3)})
      </th>
    ))}
  </tr>
</thead>

<tbody>
  {students.map(student => (
    <tr key={student.student_id}>
      <td>{student.student_name}</td>
      <td>{student.class_id}</td>
      <td>{student.smachine_id || 'Not Set'}</td>
      {schoolWeekDays.map((dayInfo, index) => (
        <td key={index} onClick={() => handleCellClick(student, dayInfo)}>
          {renderStatusBadge(getAttendanceStatus(student.student_id, dayInfo))}
        </td>
      ))}
    </tr>
  ))}
</tbody>
```

### 3. Update Attendance Queries

When fetching attendance, query by multiple dates:

```javascript
const fetchAttendance = async () => {
  if (!schoolWeekDays || schoolWeekDays.length === 0) return;
  
  try {
    setIsLoading(true);
    
    // Build query for multiple dates
    const dateConditions = schoolWeekDays.map(day => 
      `(ethiopian_year = ${day.year} AND ethiopian_month = ${day.month} AND ethiopian_day = ${day.day})`
    ).join(' OR ');
    
    const response = await axios.get(
      'http://localhost:5000/api/academic/student-attendance/by-dates',
      {
        params: {
          class: selectedClass,
          dates: JSON.stringify(schoolWeekDays)
        }
      }
    );
    
    if (response.data.success) {
      setAttendanceData(response.data.data);
    }
  } catch (err) {
    console.error('Error fetching attendance:', err);
  } finally {
    setIsLoading(false);
  }
};
```

## Implementation Steps

### Step 1: Add School Week Endpoint
1. Open `backend/routes/academic/studentAttendance.js`
2. Add the `/school-week` endpoint (code above)
3. Test with: `GET /api/academic/student-attendance/school-week?weekNumber=1&startYear=2018&startMonth=5`

### Step 2: Add Multi-Date Query Endpoint
1. Add endpoint to fetch attendance for multiple specific dates
2. Accepts array of {year, month, day} objects
3. Returns all matching attendance records

### Step 3: Update Frontend State
1. Replace `weekDays` state with `schoolWeekDays`
2. Store full date objects: `{year, month, day, dayOfWeek}`
3. Update all functions to use new structure

### Step 4: Update Table Rendering
1. Map over `schoolWeekDays` instead of simple day numbers
2. Pass full date object to click handlers
3. Update attendance lookup to match year/month/day

### Step 5: Update Edit Modal
1. Store full date info in modal state
2. Send year/month/day to update endpoint
3. Handle cross-month dates correctly

## Benefits

✅ Shows only school days
✅ Spans across months naturally
✅ Respects configured school days
✅ Easy to understand (School Week 1, 2, 3...)
✅ Works with any school day configuration

## Testing

1. Set school days to Mon-Fri
2. Select week that spans months
3. Verify correct days shown
4. Change to Mon-Sat
5. Verify Saturday appears
6. Test attendance marking across months

---

This is a significant refactor but will give you exactly what you need!
