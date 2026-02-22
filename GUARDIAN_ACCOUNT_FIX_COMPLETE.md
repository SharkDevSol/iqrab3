# Guardian Account System - Complete Fix

## Problems Identified

### 1. Duplicate Guardian Accounts
When registering multiple students with the same guardian phone number, the system creates separate guardian accounts instead of linking all students to one account.

**Current Behavior:**
- First student: Creates guardian account `abdurhmanahmmed_2014`
- Second student: Creates guardian account `abdurhmanahmmed_4386`
- Both accounts have the same phone number but different usernames

**Root Cause:** In `backend/routes/studentRoutes.js` (lines 1050-1150), the guardian search logic finds existing guardians but still generates new credentials instead of reusing them consistently.

### 2. Guardian App Shows Hardcoded Data
The Guardian mobile app components use sample/hardcoded data instead of fetching real data from the backend:
- `GuardianMarks.jsx` - Shows hardcoded marks
- `GuardianAttendance.jsx` - Shows hardcoded attendance
- Only `GuardianWards.jsx` fetches real data

### 3. Missing Backend API Endpoints
No endpoints exist for:
- Guardian marks by guardian username
- Guardian attendance by guardian username  
- Guardian payments (exists but not integrated in frontend)

## Solution Overview

### Phase 1: Fix Guardian Account Creation (Backend)
### Phase 2: Create Missing API Endpoints (Backend)
### Phase 3: Connect Frontend to Real Data (Frontend)

---

## Phase 1: Fix Guardian Account Creation

### File: `backend/routes/studentRoutes.js`

**Location:** Lines 1050-1150 (bulk import section)

**Current Issue:**
```javascript
// Check if guardian already exists by phone number across all classes
let guardianUsername, guardianPassword, guardianName;
let guardianFound = false;

// Search for existing guardian in all available classes
for (const cls of availableClasses) {
  try {
    const existingGuardianQuery = `
      SELECT guardian_username, guardian_password, guardian_name 
      FROM classes_schema."${cls}" 
      WHERE guardian_phone = $1 
      LIMIT 1
    `;
    const existingGuardianResult = await client.query(existingGuardianQuery, [studentData.guardian_phone]);
    
    if (existingGuardianResult.rows.length > 0) {
      // Guardian exists - reuse credentials and name
      guardianUsername = existingGuardianResult.rows[0].guardian_username;
      guardianPassword = existingGuardianResult.rows[0].guardian_password;
      guardianName = existingGuardianResult.rows[0].guardian_name;
      guardianFound = true;
      break;
    }
  } catch (err) {
    // Skip if table doesn't have guardian columns
    continue;
  }
}

if (!guardianFound) {
  // New guardian - create credentials
  guardianUsername = `${studentData.guardian_name.toLowerCase().replace(/\s/g, '')}_${Math.floor(Math.random() * 10000)}`;
  guardianPassword = uuidv4().slice(0, 8);
  guardianName = studentData.guardian_name;
}
```

**Problem:** This logic is correct BUT it's only in the bulk import section. The single student registration doesn't have this logic.

**Fix Required:** Apply the same logic to:
1. Single student registration endpoint
2. Student edit endpoint
3. Ensure consistency across all registration methods

---

## Phase 2: Create Missing API Endpoints

### 2.1 Guardian Marks Endpoint

**File:** `backend/routes/markListRoutes.js`

**Add new endpoint:**
```javascript
// Get all marks for all wards of a guardian
router.get('/guardian-marks/:guardianUsername', async (req, res) => {
  const { guardianUsername } = req.params;
  
  const client = await pool.connect();
  try {
    // Get all class tables
    const tablesResult = await client.query(
      'SELECT table_name FROM information_schema.tables WHERE table_schema = $1', 
      ['classes_schema']
    );
    
    const classes = tablesResult.rows.map(row => row.table_name);
    const wards = [];
    
    // Find all wards for this guardian
    for (const className of classes) {
      try {
        const columnsCheck = await client.query(`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_schema = 'classes_schema' 
            AND table_name = $1 
            AND column_name = 'is_active'
        `, [className]);
        
        const hasIsActive = columnsCheck.rows.length > 0;
        const whereClause = hasIsActive 
          ? `WHERE guardian_username = $1 AND (is_active = TRUE OR is_active IS NULL)`
          : `WHERE guardian_username = $1`;
        
        const result = await client.query(`
          SELECT 
            student_name,
            school_id,
            class_id,
            class,
            age,
            gender
          FROM classes_schema."${className}"
          ${whereClause}
        `, [guardianUsername]);
        
        wards.push(...result.rows.map(row => ({
          ...row,
          class: row.class || className
        })));
      } catch (err) {
        console.warn(`Error fetching from ${className}:`, err.message);
      }
    }
    
    if (wards.length === 0) {
      return res.json({
        success: true,
        data: {
          wards: [],
          marks: []
        }
      });
    }
    
    // Get all subjects
    const subjectsResult = await client.query(
      'SELECT subject_name FROM subjects_of_school_schema.subjects ORDER BY subject_name'
    );
    const subjects = subjectsResult.rows.map(r => r.subject_name);
    
    // Get term count
    const configResult = await client.query(
      'SELECT term_count FROM subjects_of_school_schema.school_config WHERE id = 1'
    );
    const termCount = configResult.rows[0]?.term_count || 2;
    
    // Fetch marks for each ward
    const marksData = [];
    
    for (const ward of wards) {
      for (const subjectName of subjects) {
        const schemaName = `subject_${subjectName.toLowerCase().replace(/[\s\-]+/g, '_')}_schema`;
        
        for (let term = 1; term <= termCount; term++) {
          const tableName = `${ward.class.toLowerCase()}_term_${term}`;
          
          try {
            // Check if table exists
            const tableExistsResult = await client.query(`
              SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = $1 AND table_name = $2
              )
            `, [schemaName, tableName]);
            
            if (tableExistsResult.rows[0].exists) {
              // Get marks for this student
              const marksResult = await client.query(`
                SELECT * FROM ${schemaName}.${tableName}
                WHERE student_name = $1
              `, [ward.student_name]);
              
              if (marksResult.rows.length > 0) {
                const mark = marksResult.rows[0];
                marksData.push({
                  ward: ward.student_name,
                  class: ward.class,
                  subject: subjectName,
                  term: term,
                  total: mark.total || 0,
                  pass_status: mark.pass_status || 'Fail',
                  details: mark
                });
              }
            }
          } catch (error) {
            console.warn(`Error fetching marks for ${ward.student_name} in ${subjectName}:`, error.message);
          }
        }
      }
    }
    
    res.json({
      success: true,
      data: {
        wards: wards,
        marks: marksData,
        subjects: subjects,
        termCount: termCount
      }
    });
  } catch (error) {
    console.error('Error fetching guardian marks:', error);
    res.status(500).json({ error: 'Failed to fetch guardian marks', details: error.message });
  } finally {
    client.release();
  }
});
```

### 2.2 Guardian Attendance Endpoint

**File:** `backend/routes/guardianAttendanceRoutes.js` (already exists but needs enhancement)

**Add new endpoint:**
```javascript
// Get all attendance for all wards of a guardian
router.get('/guardian-attendance/:guardianUsername', async (req, res) => {
  const { guardianUsername } = req.params;
  const { year, month } = req.query;
  
  try {
    // Get all class tables
    const tablesResult = await pool.query(
      'SELECT table_name FROM information_schema.tables WHERE table_schema = $1', 
      ['classes_schema']
    );
    
    const classes = tablesResult.rows.map(row => row.table_name);
    const wards = [];
    
    // Find all wards for this guardian
    for (const className of classes) {
      try {
        const columnsCheck = await pool.query(`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_schema = 'classes_schema' 
            AND table_name = $1 
            AND column_name = 'is_active'
        `, [className]);
        
        const hasIsActive = columnsCheck.rows.length > 0;
        const whereClause = hasIsActive 
          ? `WHERE guardian_username = $1 AND (is_active = TRUE OR is_active IS NULL)`
          : `WHERE guardian_username = $1`;
        
        const result = await pool.query(`
          SELECT 
            student_name,
            school_id,
            class_id,
            class
          FROM classes_schema."${className}"
          ${whereClause}
        `, [guardianUsername]);
        
        wards.push(...result.rows.map(row => ({
          ...row,
          class: row.class || className
        })));
      } catch (err) {
        console.warn(`Error fetching from ${className}:`, err.message);
      }
    }
    
    if (wards.length === 0) {
      return res.json({
        success: true,
        data: {
          wards: [],
          attendance: []
        }
      });
    }
    
    // Fetch attendance for each ward
    const attendanceData = [];
    
    for (const ward of wards) {
      try {
        let query = `
          SELECT 
            student_id,
            student_name,
            class_name,
            date,
            status,
            check_in_time,
            ethiopian_year,
            ethiopian_month,
            ethiopian_day,
            day_of_week,
            shift_number,
            notes,
            created_at
          FROM academic_student_attendance
          WHERE student_id = $1
        `;
        
        const params = [String(ward.school_id)];
        
        if (year && month) {
          query += ` AND ethiopian_year = $2 AND ethiopian_month = $3`;
          params.push(parseInt(year), parseInt(month));
        }
        
        query += ` ORDER BY ethiopian_year DESC, ethiopian_month DESC, ethiopian_day DESC LIMIT 100`;
        
        const result = await pool.query(query, params);
        
        attendanceData.push(...result.rows.map(row => ({
          ...row,
          ward: ward.student_name,
          class: ward.class
        })));
      } catch (error) {
        console.warn(`Error fetching attendance for ${ward.student_name}:`, error.message);
      }
    }
    
    // Calculate statistics
    const stats = {
      total: attendanceData.length,
      present: attendanceData.filter(a => a.status === 'PRESENT').length,
      absent: attendanceData.filter(a => a.status === 'ABSENT').length,
      late: attendanceData.filter(a => a.status === 'LATE').length
    };
    
    stats.percentage = stats.total > 0 ? ((stats.present / stats.total) * 100).toFixed(1) : 0;
    
    res.json({
      success: true,
      data: {
        wards: wards,
        attendance: attendanceData,
        stats: stats
      }
    });
  } catch (error) {
    console.error('Error fetching guardian attendance:', error);
    res.status(500).json({ error: 'Failed to fetch guardian attendance', details: error.message });
  }
});
```

---

## Phase 3: Connect Frontend to Real Data

### 3.1 Update GuardianMarks.jsx

**File:** `APP/src/Guardian/GuardianMarks/GuardianMarks.jsx`

**Replace with:**
```javascript
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiBook, FiTrendingUp, FiAward, FiUser } from 'react-icons/fi';
import axios from 'axios';
import styles from './GuardianMarks.module.css';

const GuardianMarks = () => {
  const [selectedWard, setSelectedWard] = useState('all');
  const [selectedTerm, setSelectedTerm] = useState('1');
  const [wards, setWards] = useState([]);
  const [marksData, setMarksData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [termCount, setTermCount] = useState(2);

  useEffect(() => {
    fetchMarks();
  }, []);

  const fetchMarks = async () => {
    try {
      const guardianInfo = JSON.parse(localStorage.getItem('guardianInfo') || '{}');
      const response = await axios.get(
        `http://localhost:5000/api/mark-list/guardian-marks/${guardianInfo.guardian_username}`
      );
      
      if (response.data.success) {
        setWards(response.data.data.wards);
        setMarksData(response.data.data.marks);
        setTermCount(response.data.data.termCount || 2);
      }
    } catch (error) {
      console.error('Error fetching marks:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAverage = (wardName) => {
    const wardMarks = marksData.filter(m => m.ward === wardName && m.term === parseInt(selectedTerm));
    if (wardMarks.length === 0) return 0;
    const sum = wardMarks.reduce((acc, m) => acc + (m.total || 0), 0);
    return (sum / wardMarks.length).toFixed(1);
  };

  const getGradeColor = (passStatus) => {
    return passStatus === 'Pass' ? '#28a745' : '#ef4444';
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading marks...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className={styles.header}>
          <h1>Academic Performance</h1>
          <p>View your wards' marks and grades</p>
        </div>

        {/* Filters */}
        <div className={styles.filters}>
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className={styles.select}
          >
            <option value="all">All Wards</option>
            {wards.map((ward, index) => (
              <option key={index} value={ward.student_name}>{ward.student_name}</option>
            ))}
          </select>

          <select
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
            className={styles.select}
          >
            {Array.from({ length: termCount }, (_, i) => (
              <option key={i + 1} value={i + 1}>Term {i + 1}</option>
            ))}
          </select>
        </div>

        {/* Ward Performance Cards */}
        <div className={styles.performanceGrid}>
          {wards.map((ward, index) => (
            <motion.div
              key={index}
              className={styles.performanceCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={styles.cardHeader}>
                <div className={styles.avatar}>
                  <FiUser size={24} />
                </div>
                <div>
                  <h3>{ward.student_name}</h3>
                  <p>{ward.class}</p>
                </div>
              </div>
              <div className={styles.cardStats}>
                <div className={styles.stat}>
                  <FiTrendingUp className={styles.statIcon} />
                  <div>
                    <div className={styles.statValue}>{calculateAverage(ward.student_name)}%</div>
                    <div className={styles.statLabel}>Average</div>
                  </div>
                </div>
                <div className={styles.stat}>
                  <FiAward className={styles.statIcon} />
                  <div>
                    <div className={styles.statValue}>
                      {marksData.filter(m => m.ward === ward.student_name && m.term === parseInt(selectedTerm)).length}
                    </div>
                    <div className={styles.statLabel}>Subjects</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Marks Table */}
        <div className={styles.marksSection}>
          <h2>Subject Marks</h2>
          {marksData.filter(m => 
            (selectedWard === 'all' || m.ward === selectedWard) && 
            m.term === parseInt(selectedTerm)
          ).length === 0 ? (
            <div className={styles.empty}>
              <FiBook size={48} />
              <p>No marks available for this selection</p>
            </div>
          ) : (
            <div className={styles.marksGrid}>
              {marksData
                .filter(m => 
                  (selectedWard === 'all' || m.ward === selectedWard) && 
                  m.term === parseInt(selectedTerm)
                )
                .map((mark, index) => (
                  <motion.div
                    key={index}
                    className={styles.markCard}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className={styles.markSubject}>
                      <FiBook className={styles.subjectIcon} />
                      <div>
                        <h4>{mark.subject}</h4>
                        <p>{mark.ward}</p>
                      </div>
                    </div>
                    <div className={styles.markScore}>
                      <div className={styles.score}>{mark.total}%</div>
                      <div 
                        className={styles.grade}
                        style={{ color: getGradeColor(mark.pass_status) }}
                      >
                        {mark.pass_status}
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default GuardianMarks;
```

### 3.2 Update GuardianAttendance.jsx

**File:** `APP/src/Guardian/GuardianAttendance/GuardianAttendance.jsx`

**Replace with:**
```javascript
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiCheck, FiX, FiClock, FiUser } from 'react-icons/fi';
import axios from 'axios';
import styles from './GuardianAttendance.module.css';

const GuardianAttendance = () => {
  const [selectedWard, setSelectedWard] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [wards, setWards] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [stats, setStats] = useState({ total: 0, present: 0, absent: 0, late: 0, percentage: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendance();
  }, [selectedMonth, selectedYear]);

  const fetchAttendance = async () => {
    try {
      const guardianInfo = JSON.parse(localStorage.getItem('guardianInfo') || '{}');
      const response = await axios.get(
        `http://localhost:5000/api/guardian-attendance/guardian-attendance/${guardianInfo.guardian_username}`,
        {
          params: {
            year: selectedYear,
            month: selectedMonth
          }
        }
      );
      
      if (response.data.success) {
        setWards(response.data.data.wards);
        setAttendanceData(response.data.data.attendance);
        setStats(response.data.data.stats);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case 'PRESENT':
        return <FiCheck className={styles.iconPresent} />;
      case 'ABSENT':
        return <FiX className={styles.iconAbsent} />;
      case 'LATE':
        return <FiClock className={styles.iconLate} />;
      default:
        return null;
    }
  };

  const getStatusClass = (status) => {
    const statusLower = status?.toLowerCase() || '';
    return styles[`status${statusLower.charAt(0).toUpperCase() + statusLower.slice(1)}`];
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading attendance...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className={styles.header}>
          <h1>Attendance</h1>
          <p>Track your wards' attendance records</p>
        </div>

        {/* Filters */}
        <div className={styles.filters}>
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className={styles.select}
          >
            <option value="all">All Wards</option>
            {wards.map((ward, index) => (
              <option key={index} value={ward.student_name}>{ward.student_name}</option>
            ))}
          </select>

          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className={styles.select}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                Month {i + 1}
              </option>
            ))}
          </select>
        </div>

        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: 'rgba(40, 167, 69, 0.1)' }}>
              <FiCheck style={{ color: '#28a745' }} />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>{stats.present}</div>
              <div className={styles.statLabel}>Present</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
              <FiX style={{ color: '#ef4444' }} />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>{stats.absent}</div>
              <div className={styles.statLabel}>Absent</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: 'rgba(255, 193, 7, 0.1)' }}>
              <FiClock style={{ color: '#ffc107' }} />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>{stats.late}</div>
              <div className={styles.statLabel}>Late</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: 'rgba(0, 123, 255, 0.1)' }}>
              <FiCalendar style={{ color: '#007bff' }} />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>{stats.percentage}%</div>
              <div className={styles.statLabel}>Attendance Rate</div>
            </div>
          </div>
        </div>

        {/* Attendance List */}
        <div className={styles.attendanceList}>
          <h2>Recent Attendance</h2>
          {attendanceData.length === 0 ? (
            <div className={styles.empty}>
              <FiCalendar size={48} />
              <p>No attendance records found</p>
            </div>
          ) : (
            <div className={styles.records}>
              {attendanceData
                .filter(record => selectedWard === 'all' || record.ward === selectedWard)
                .map((record, index) => (
                  <motion.div
                    key={index}
                    className={styles.recordCard}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className={styles.recordDate}>
                      <FiCalendar />
                      <span>{record.date ? new Date(record.date).toLocaleDateString() : `${record.ethiopian_day}/${record.ethiopian_month}/${record.ethiopian_year}`}</span>
                    </div>
                    <div className={styles.recordWard}>
                      <FiUser />
                      <span>{record.ward}</span>
                    </div>
                    <div className={`${styles.recordStatus} ${getStatusClass(record.status)}`}>
                      {getStatusIcon(record.status)}
                      <span>{record.status}</span>
                    </div>
                  </motion.div>
                ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default GuardianAttendance;
```

---

## Implementation Steps

### Step 1: Fix Backend Guardian Creation
1. Open `backend/routes/studentRoutes.js`
2. Find the single student registration endpoint (around line 400-600)
3. Add the same guardian search logic from bulk import
4. Test by registering 2 students with same guardian phone

### Step 2: Add Backend API Endpoints
1. Open `backend/routes/markListRoutes.js`
2. Add the guardian marks endpoint at the end
3. Open `backend/routes/guardianAttendanceRoutes.js`
4. Add the guardian attendance endpoint at the end
5. Restart backend server

### Step 3: Update Frontend Components
1. Replace `APP/src/Guardian/GuardianMarks/GuardianMarks.jsx`
2. Replace `APP/src/Guardian/GuardianAttendance/GuardianAttendance.jsx`
3. Test in the guardian app

### Step 4: Test Complete Flow
1. Register first student with guardian phone `0936311768`
2. Register second student with same guardian phone
3. Login to guardian app with the guardian username
4. Verify:
   - Profile tab shows ALL students
   - Marks tab shows marks for ALL students
   - Attendance tab shows attendance for ALL students
   - Payments tab shows payments for ALL students

---

## Expected Results

After implementing all fixes:

1. **Single Guardian Account:** Only one guardian account created per phone number
2. **All Students Linked:** All students with same guardian phone linked to one account
3. **Complete Data Display:** Guardian app shows marks, attendance, and payments for ALL wards
4. **No Duplicate Accounts:** No more multiple accounts with same phone number

---

## Testing Checklist

- [ ] Register first student - guardian account created
- [ ] Register second student with same phone - NO new account created
- [ ] Login to guardian app
- [ ] Profile tab shows both students
- [ ] Marks tab shows marks for both students
- [ ] Attendance tab shows attendance for both students
- [ ] Payments tab shows payments for both students
- [ ] Filter by individual student works correctly
- [ ] Statistics calculated correctly for all students

---

## Files Modified

### Backend
1. `backend/routes/studentRoutes.js` - Fix guardian creation logic
2. `backend/routes/markListRoutes.js` - Add guardian marks endpoint
3. `backend/routes/guardianAttendanceRoutes.js` - Add guardian attendance endpoint

### Frontend
1. `APP/src/Guardian/GuardianMarks/GuardianMarks.jsx` - Connect to real API
2. `APP/src/Guardian/GuardianAttendance/GuardianAttendance.jsx` - Connect to real API

---

## Notes

- The guardian payments endpoint already exists at `backend/routes/guardianPayments.js`
- The guardian wards component already fetches real data correctly
- The issue is primarily in the backend guardian creation logic and missing API endpoints
- Frontend components were using hardcoded data for development/testing

---

## Support

If you encounter any issues during implementation:
1. Check backend console for errors
2. Check browser console for API errors
3. Verify guardian username is stored correctly in localStorage
4. Test API endpoints directly using Postman/Thunder Client
