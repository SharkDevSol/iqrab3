# 📝 How to Update Student Names

## Current Situation

Student names are currently showing as:
- Student 0001
- Student 0002
- Student 0003

## Option 1: Update via SQL (Quick)

### Step 1: Connect to Database
Use your database client (pgAdmin, DBeaver, etc.)

### Step 2: Run Update Queries
```sql
-- Update Student 0001
UPDATE "Student" 
SET "studentName" = 'Ahmed Ali' 
WHERE id = '00000000-0000-0000-0004-000000000001';

-- Update Student 0002
UPDATE "Student" 
SET "studentName" = 'Fatima Omar' 
WHERE id = '00000000-0000-0000-0005-000000000002';

-- Update Student 0003
UPDATE "Student" 
SET "studentName" = 'Hassan Yusuf' 
WHERE id = '00000000-0000-0000-0006-000000000003';
```

### Step 3: Verify
```sql
SELECT id, "studentName" FROM "Student";
```

### Step 4: Refresh Frontend
Press `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac) in your browser

---

## Option 2: Create Bulk Update Script

### Step 1: Create Names File
Create `backend/scripts/student-names.json`:
```json
{
  "00000000-0000-0000-0004-000000000001": "Ahmed Ali",
  "00000000-0000-0000-0005-000000000002": "Fatima Omar",
  "00000000-0000-0000-0006-000000000003": "Hassan Yusuf"
}
```

### Step 2: Create Update Script
Create `backend/scripts/update-student-names.js`:
```javascript
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

async function updateStudentNames() {
  try {
    console.log('📝 Updating student names...\n');

    // Read names from JSON file
    const namesFile = path.join(__dirname, 'student-names.json');
    const names = JSON.parse(fs.readFileSync(namesFile, 'utf8'));

    let updated = 0;
    for (const [studentId, studentName] of Object.entries(names)) {
      await prisma.student.update({
        where: { id: studentId },
        data: { studentName }
      });
      console.log(`✅ Updated: ${studentId} → ${studentName}`);
      updated++;
    }

    console.log(`\n✅ Successfully updated ${updated} student names!\n`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

updateStudentNames();
```

### Step 3: Run Script
```bash
node backend/scripts/update-student-names.js
```

---

## Option 3: Update via CSV Import

### Step 1: Create CSV File
Create `backend/scripts/student-names.csv`:
```csv
studentId,studentName
00000000-0000-0000-0004-000000000001,Ahmed Ali
00000000-0000-0000-0005-000000000002,Fatima Omar
00000000-0000-0000-0006-000000000003,Hassan Yusuf
```

### Step 2: Create Import Script
Create `backend/scripts/import-student-names-csv.js`:
```javascript
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

async function importStudentNames() {
  try {
    console.log('📝 Importing student names from CSV...\n');

    // Read CSV file
    const csvFile = path.join(__dirname, 'student-names.csv');
    const csvContent = fs.readFileSync(csvFile, 'utf8');
    
    // Parse CSV (skip header)
    const lines = csvContent.split('\n').slice(1);
    
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

importStudentNames();
```

### Step 3: Run Script
```bash
node backend/scripts/import-student-names-csv.js
```

---

## Verification

After updating, verify the changes:

### 1. Check Database
```bash
node backend/scripts/check-student-names.js
```

Should show:
```
📋 Sample of students with names:
   00000000-0000-0000-0004-000000000001 → Ahmed Ali
   00000000-0000-0000-0005-000000000002 → Fatima Omar
   00000000-0000-0000-0006-000000000003 → Hassan Yusuf
```

### 2. Check Frontend
1. Refresh browser (Ctrl+Shift+R)
2. Go to Finance → Monthly Payments
3. Select a class
4. Verify names appear in:
   - Main student list table
   - Card details modals

---

## Quick SQL Reference

### View All Students
```sql
SELECT id, "studentName", "classId" FROM "Student";
```

### Update Single Student
```sql
UPDATE "Student" 
SET "studentName" = 'New Name' 
WHERE id = 'student-id-here';
```

### Update Multiple Students
```sql
UPDATE "Student" 
SET "studentName" = CASE id
  WHEN '00000000-0000-0000-0004-000000000001' THEN 'Ahmed Ali'
  WHEN '00000000-0000-0000-0005-000000000002' THEN 'Fatima Omar'
  WHEN '00000000-0000-0000-0006-000000000003' THEN 'Hassan Yusuf'
END
WHERE id IN (
  '00000000-0000-0000-0004-000000000001',
  '00000000-0000-0000-0005-000000000002',
  '00000000-0000-0000-0006-000000000003'
);
```

---

## Recommended Approach

**For 3 students:** Use Option 1 (SQL) - Quick and simple

**For 10+ students:** Use Option 2 (JSON) or Option 3 (CSV) - More maintainable

**For 100+ students:** Use Option 3 (CSV) - Easy to prepare in Excel/Sheets

---

## After Updating

1. ✅ Refresh frontend
2. ✅ Verify names appear correctly
3. ✅ Check both main list and modals
4. ✅ Done!

The names will now show as the actual student names instead of "Student 0001", etc.
