# 🚨 QUICK FIX - Database Error

## Your Current Error
```
❌ Error fetching attendance issues
relation "hr_attendance_deduction_settings" does not exist
```

---

## ✅ FASTEST FIX (Choose One)

### 🥇 Method 1: pgAdmin (RECOMMENDED - 2 minutes)

**Step 1:** Open pgAdmin

**Step 2:** Connect to database `school_management10`

**Step 3:** Right-click database → **Query Tool**

**Step 4:** Copy this SQL and paste it:

```sql
CREATE TABLE IF NOT EXISTS hr_attendance_deduction_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_type VARCHAR(255) NOT NULL,
  deduction_type VARCHAR(50) NOT NULL,
  deduction_amount DECIMAL(10, 2) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(staff_type, deduction_type)
);

INSERT INTO hr_attendance_deduction_settings 
  (staff_type, deduction_type, deduction_amount, description, is_active)
VALUES 
  ('Teacher', 'Late', 50.00, 'Deduction for late arrival', true),
  ('Teacher', 'Absent', 200.00, 'Deduction for absence', true),
  ('Teacher', 'Half-Day', 100.00, 'Deduction for half-day absence', true),
  ('Administrative', 'Late', 50.00, 'Deduction for late arrival', true),
  ('Administrative', 'Absent', 200.00, 'Deduction for absence', true),
  ('Administrative', 'Half-Day', 100.00, 'Deduction for half-day absence', true),
  ('Support Staff', 'Late', 30.00, 'Deduction for late arrival', true),
  ('Support Staff', 'Absent', 150.00, 'Deduction for absence', true),
  ('Support Staff', 'Half-Day', 75.00, 'Deduction for half-day absence', true),
  ('Management', 'Late', 75.00, 'Deduction for late arrival', true),
  ('Management', 'Absent', 250.00, 'Deduction for absence', true),
  ('Management', 'Half-Day', 125.00, 'Deduction for half-day absence', true)
ON CONFLICT (staff_type, deduction_type) DO NOTHING;
```

**Step 5:** Click **Execute** (F5 or ▶️ button)

**Step 6:** Refresh your browser - **DONE!** ✅

---

### 🥈 Method 2: Double-Click Batch File

1. Navigate to: `backend` folder
2. Double-click: `RUN_THIS_FIX.bat`
3. Enter your PostgreSQL password
4. Refresh browser - **DONE!** ✅

---

### 🥉 Method 3: Command Line

```bash
cd backend
psql -U postgres -d school_management10 -f database/FIX_MISSING_TABLE.sql
```

---

## 🔍 Don't Have pgAdmin?

### Download pgAdmin:
https://www.pgadmin.org/download/

### Or use DBeaver:
https://dbeaver.io/download/

### Or use any PostgreSQL client you have installed

---

## ❓ What If I Don't Know My PostgreSQL Password?

Try these common passwords:
- `postgres`
- `postgres123`
- `admin`
- `root`
- (whatever you set during installation)

Or reset it:
1. Open pgAdmin
2. Right-click on server → Properties
3. Connection tab → check password

---

## ✅ How to Verify It Worked

After running the SQL, check:

```sql
SELECT COUNT(*) FROM hr_attendance_deduction_settings;
```

Should return: **12**

---

## 🔄 After Fixing

1. **Refresh browser** (Ctrl + F5)
2. **Navigate to**: HR → Leave Management
3. **Error should be gone!** ✅

---

## 📁 All Fix Files Available

- `FIX_LOCAL_DATABASE_NOW.md` - Detailed instructions
- `backend/database/FIX_MISSING_TABLE.sql` - Complete SQL script
- `backend/RUN_THIS_FIX.bat` - Windows batch file
- `backend/scripts/quick-fix-table.js` - Node.js script (needs correct password)

---

## 🆘 Still Not Working?

### Check if PostgreSQL is Running

**Windows:**
```powershell
Get-Service postgresql*
```

If not running:
```powershell
Start-Service postgresql-x64-14
```

### Check Database Exists

```bash
psql -U postgres -l
```

Look for `school_management10` in the list.

### Check Backend Server

Make sure your backend server is running:
```bash
cd backend
npm start
```

---

## 📞 What This Fix Does

Creates a table that stores HR deduction rules:

- **Late arrival**: 30-75 ETB deduction
- **Absent**: 150-250 ETB deduction  
- **Half-day**: 75-125 ETB deduction

Different amounts for different staff types (Teacher, Admin, Support, Management).

Used by the HR/Payroll system for automatic salary calculations.

---

## ✅ Success Checklist

After the fix:
- [ ] SQL executed successfully
- [ ] 12 rows inserted
- [ ] Browser refreshed
- [ ] No more "relation does not exist" error
- [ ] HR Leave page loads correctly

---

**Need more help?** Check `FIX_LOCAL_DATABASE_NOW.md` for detailed troubleshooting.

**For VPS deployment:** Check `DEPLOY_NOW.md`
