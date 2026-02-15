# Final School Week Implementation Plan

## What You Want

**Current (Wrong)**:
- Selects: Month (Yekatit), Week (Week 1)
- Shows: Yek 1 (Wed), Yek 2 (Thu), Yek 4 (Sat), Yek 6 (Mon), Yek 7 (Tue)
- Problem: Starts from Wednesday, not Monday

**Desired (Correct)**:
- Selector: Date Range "29/5 - 7/6" (Tir 29 to Yek 7)
- Shows: Tir 29 (Mon), Tir 30 (Tue), Yek 1 (Wed), Yek 2 (Thu), Yek 4 (Sat)
- Always starts from Monday
- Shows consecutive school days only

## Implementation

### 1. Backend: Calculate School Weeks from Monday

Create endpoint that finds school weeks starting from Monday:

```javascript
// GET /api/academic/student-attendance/school-weeks
// Get all school weeks for the year, starting from Monday
router.get('/school-weeks', async (req, res) => {
  try {
    const { year } = req.query;
    
    // Get settings
    const settingsResult = await pool.query(
      'SELECT * FROM academic_student_attendance_settings ORDER BY id DESC LIMIT 1'
    );
    
    const settings = settingsResult.rows[0];
    const schoolDays = settings.school_days;
    
    // Find all Mondays in the year and build school weeks
    const weeks = [];
    let currentYear = parseInt(year);
    let currentMonth = 1;
    let currentDay = 1;
    let weekNumber = 1;
    
    // Find first Monday of the year
    while (currentMonth <= 13) {
      const dayOfWeek = getEthiopianDayOfWeek(currentYear, currentMonth, currentDay);
      
      if (dayOfWeek === 'Monday') {
        // Found a Monday, build a school week from here
        const weekDays = [];
        let tempYear = currentYear;
        let tempMonth = currentMonth;
        let tempDay = currentDay;
        let schoolDaysCollected = 0;
        
        // Collect school days for this week
        while (schoolDaysCollected < schoolDays.length && tempDay <= 365) {
          const dow = getEthiopianDayOfWeek(tempYear, tempMonth, tempDay);
          
          if (schoolDays.includes(dow)) {
            weekDays.push({
              year: tempYear,
              month: tempMonth,
              day: tempDay,
              dayOfWeek: dow
            });
            schoolDaysCollected++;
          }
          
          // Next day
          tempDay++;
          const daysInMonth = tempMonth === 13 ? 5 : 30;
          if (tempDay > daysInMonth) {
            tempDay = 1;
            tempMonth++;
            if (tempMonth > 13) break;
          }
        }
        
        if (weekDays.length > 0) {
          const firstDay = weekDays[0];
          const lastDay = weekDays[weekDays.length - 1];
          
          weeks.push({
            weekNumber: weekNumber++,
            label: `${firstDay.day}/${firstDay.month} - ${lastDay.day}/${lastDay.month}`,
            startDate: firstDay,
            endDate: lastDay,
            days: weekDays
          });
        }
        
        // Jump to next Monday (approximately 7 days)
        currentDay += 7;
      } else {
        currentDay++;
      }
      
      // Handle month transitions
      const daysInMonth = currentMonth === 13 ? 5 : 30;
      if (currentDay > daysInMonth) {
        currentDay = 1;
        currentMonth++;
      }
    }
    
    res.json({
      success: true,
      data: weeks
    });
    
  } catch (error) {
    console.error('Error calculating school weeks:', error);
    res.status(500).json({ error: 'Failed to calculate school weeks' });
  }
});
```

### 2. Frontend: Date Range Selector

Replace month/week selectors with a single dropdown showing date ranges:

```javascript
const [schoolWeeks, setSchoolWeeks] = useState([]);
const [selectedWeekData, setSelectedWeekData] = useState(null);

// Fetch school weeks on load
useEffect(() => {
  fetchSchoolWeeks();
}, [selectedYear]);

const fetchSchoolWeeks = async () => {
  try {
    const response = await axios.get(
      'http://localhost:5000/api/academic/student-attendance/school-weeks',
      { params: { year: selectedYear } }
    );
    
    if (response.data.success) {
      setSchoolWeeks(response.data.data);
      if (response.data.data.length > 0) {
        setSelectedWeekData(response.data.data[0]);
      }
    }
  } catch (err) {
    console.error('Error fetching school weeks:', err);
  }
};

// Render selector
<div className={styles.filterGroup}>
  <label>School Week</label>
  <select
    value={selectedWeekData?.weekNumber || ''}
    onChange={(e) => {
      const week = schoolWeeks.find(w => w.weekNumber === parseInt(e.target.value));
      setSelectedWeekData(week);
    }}
    className={styles.select}
  >
    {schoolWeeks.map(week => (
      <option key={week.weekNumber} value={week.weekNumber}>
        {week.label}
      </option>
    ))}
  </select>
</div>
```

### 3. Table Headers

Use the actual dates from selected week:

```javascript
<thead>
  <tr>
    <th>Student Name</th>
    <th>Class ID</th>
    <th>Machine ID</th>
    {selectedWeekData?.days.map((dayInfo, index) => (
      <th key={index}>
        {ethiopianMonths[dayInfo.month - 1].substring(0, 3)} {dayInfo.day} ({dayInfo.dayOfWeek.substring(0, 3)})
      </th>
    ))}
  </tr>
</thead>
```

## Result

**Filters**:
```
Class: [C ▼]  Year: [2018]  Week: [29/5 - 7/6 ▼]  [🤖 Run Auto-Marker]
```

**Table Headers**:
```
| Student Name | Class ID | Machine ID | Tir 29 (Mon) | Tir 30 (Tue) | Yek 1 (Wed) | Yek 2 (Thu) | Yek 4 (Sat) |
```

**Benefits**:
- ✅ Always starts from Monday
- ✅ Shows only school days
- ✅ Clear date range display
- ✅ Spans months naturally
- ✅ Easy to navigate weeks

This is exactly what you need!
