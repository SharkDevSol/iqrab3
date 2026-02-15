# 📝 How to Add REAL Student Names

## Current Situation

The Student table has these dummy names:
- `00000000-0000-0000-0004-000000000001` → "Student 0001"
- `00000000-0000-0000-0005-000000000002` → "Student 0002"
- `00000000-0000-0000-0006-000000000003` → "Student 0003"

You need to UPDATE these with the REAL student names.

## ⚡ Quick Method: Direct SQL Update

### Step 1: Get Student IDs
```bash
cd backend
node scripts/check-student-names.js
```

This will show you the student IDs.

### Step 2: Update with Real Names

**Option A: Using Database Client (Recommended)**

Connect to your PostgreSQL database and run:

```sql
-- Replace with your actual student names
UPDATE "Student" 
SET "studentName" = 'Ahmed Ali Hassan' 
WHERE id = '00000000-0000-0000-0004-000000000001';

UPDATE "Student" 
SET "studentName" = 'Fatima Omar Mohammed' 
WHERE id = '00000000-0000-0000-0005-000000000002';

UPDATE "Student" 
SET "studentName" = 'Hassan Yusuf Ibrahim' 
WHERE id = '00000000-0000-0000-0006-000000000003';
```

**Option B: Using Script**

1. Edit `backend/scripts/update-real-student-names.js`
2. Replace the dummy names with real names:
```javascript
const studentNames = {
  '00000000-0000-0000-0004-000000000001': 'Ahmed Ali Hassan',
  '00000000-0000-0000-0005-000000000002': 'Fatima Omar Mohammed',
  '00000000-0000-0000-0006-000000000003': 'Hassan Yusuf Ibrahim'
};
```
3. Uncomment the update code in the script
4. Run: `node scripts/update-real-student-names.js`

### Step 3: Verify
```bash
node scripts/check-student-names.js
```

Should show:
```
✅ All invoice student IDs have matching Student records!
📋 Sample of students with names:
   00000000-0000-0000-0004-000000000001 → Ahmed Ali Hassan
   00000000-0000-0000-0005-000000000002 → Fatima Omar Mohammed
   00000000-0000-0000-0006-000000000003 → Hassan Yusuf Ibrahim
```

### Step 4: Refresh Browser
Press `Ctrl + Shift + R` (or `Cmd + Shift + R` on Mac)

---

## 📋 Bulk Update Method (For Many Students)

### Method 1: Using CSV File

**Step 1: Create CSV file** `backend/scripts/real-student-names.csv`:
```csv
studentId,studentName
00000000-0000-0000-0004-000000000001,Ahmed Ali Hassan
00000000-0000-0000-0005-000000000002,Fatima Omar Mohammed
00000000-0000-0000-0006-000000000003,Hassan Yusuf Ibrahim
```

**Step 2: Create import script** `backend/scripts/import-real-names.js`:
```javascript
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

async function importRealNames() {
  try {
    console.log('📝 Importing real student names from CSV...\n');

    const csvFile = path.join(__dirname, 'real-student-names.csv');
    const csvContent = fs.readFileSync(csvFile, 'utf8');
    
    const lines = csvContent.split('\n').slice(1); // Skip header
    
    let updated = 0;
    for (const line of lines) {
      if (!line.trim()) continue;
      
      const [studentId, studentName] = line.split(',').map(s => s.trim());
      
      await prisma.student.update({
        where: { id: studentId },
        data: { studentName }
      });
      
      console.log(`✅ Updated: ${studentId} → ${studentName}`);
      updated++;
    }

    console.log(`\n✅ Successfully imported ${updated} student names!\n`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

importRealNames();
```

**Step 3: Run the script**:
```bash
node scripts/import-real-names.js
```

### Method 2: Using JSON File

**Step 1: Create JSON file** `backend/scripts/real-student-names.json`:
```json
{
  "00000000-0000-0000-0004-000000000001": "Ahmed Ali Hassan",
  "00000000-0000-0000-0005-000000000002": "Fatima Omar Mohammed",
  "00000000-0000-0000-0006-000000000003": "Hassan Yusuf Ibrahim"
}
```

**Step 2: Create import script** `backend/scripts/import-real-names-json.js`:
```javascript
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

async function importRealNames() {
  try {
    console.log('📝 Importing real student names from JSON...\n');

    const jsonFile = path.join(__dirname, 'real-student-names.json');
    const names = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));

    let updated = 0;
    for (const [studentId, studentName] of Object.entries(names)) {
      await prisma.student.update({
        where: { id: studentId },
        data: { studentName }
      });
      console.log(`✅ Updated: ${studentId} → ${studentName}`);
      updated++;
    }

    console.log(`\n✅ Successfully imported ${updated} student names!\n`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

importRealNames();
```

**Step 3: Run the script**:
```bash
node scripts/import-real-names-json.js
```

---

## 🔍 Where to Get Real Student Names?

### If you have a student registration system:
1. Export student data from your registration system
2. Match student IDs with invoice student IDs
3. Update the Student table

### If students are in another database:
1. Query that database for student names
2. Create a mapping of ID → Name
3. Update the Student table

### If you need to manually enter names:
1. Use the SQL method above
2. Or use the CSV/JSON method for bulk updates

---

## ✅ After Updating

1. **Verify in database**:
```bash
node scripts/check-student-names.js
```

2. **Restart backend** (if needed):
```bash
cd backend
.\kill-port-5000.ps1
node server.js
```

3. **Refresh browser**:
Press `Ctrl + Shift + R` (or `Cmd + Shift + R`)

4. **Check the UI**:
- Navigate to: Finance → Monthly Payments → Select a class
- You should now see REAL student names!

---

## 📊 Expected Result

**Before:**
```
┌────────────┬──────────────┬──────────┐
│ Student ID │ Student Name │ Amount   │
├────────────┼──────────────┼──────────┤
│ ...0001    │ Student 0001 │ 6200.00  │
│ ...0002    │ Student 0002 │ 6200.00  │
│ ...0003    │ Student 0003 │ 6200.00  │
└────────────┴──────────────┴──────────┘
```

**After:**
```
┌────────────┬────────────────────────┬──────────┐
│ Student ID │ Student Name           │ Amount   │
├────────────┼────────────────────────┼──────────┤
│ ...0001    │ Ahmed Ali Hassan       │ 6200.00  │
│ ...0002    │ Fatima Omar Mohammed   │ 6200.00  │
│ ...0003    │ Hassan Yusuf Ibrahim   │ 6200.00  │
└────────────┴────────────────────────┴──────────┘
```

---

## 🎯 Summary

The Student table is the ONLY source of student names. To show real names:

1. **Get student IDs** from the database
2. **Update Student table** with real names (SQL, CSV, or JSON)
3. **Verify** the update worked
4. **Refresh browser** to see changes

Choose the method that works best for you:
- **3 students**: Use SQL (quickest)
- **10+ students**: Use CSV or JSON (easier to manage)
- **100+ students**: Use CSV export from your registration system

The code is already set up to fetch and display names from the Student table. You just need to update the names in that table!
