# 🚨 FIX LOCAL DATABASE ERROR NOW

## Current Error
```
❌ Error fetching attendance issues
relation "hr_attendance_deduction_settings" does not exist
```

## ✅ QUICK FIX (2 Minutes)

### Option 1: Using pgAdmin (Easiest) ⭐

1. **Open pgAdmin** on your computer

2. **Connect to your database**:
   - Server: `localhost`
   - Database: `school_management10`
   - User: `postgres`
   - Password: (your PostgreSQL password)

3. **Open Query Tool**:
   - Right-click on `school_management10` database
   - Select **Query Tool**

4. **Copy and paste this SQL** (from `backend/database/FIX_MISSING_TABLE.sql`):

```sql
-- Create the missing table
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_hr_attendance_deduction_staff_type 
  ON hr_attendance_deduction_settings(staff_type);

CREATE INDEX IF NOT EXISTS idx_hr_attendance_deduction_type 
  ON hr_attendance_deduction_settings(deduction_type);

CREATE INDEX IF NOT EXISTS idx_hr_attendance_deduction_active 
  ON hr_attendance_deduction_settings(is_active);

-- Insert default settings
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

-- Verify
SELECT COUNT(*) as total_settings FROM hr_attendance_deduction_settings;
```

5. **Click Execute** (F5 or the ▶️ button)

6. **You should see**: "Query returned successfully: 12 rows affected"

7. **Refresh your browser** - Error should be gone! ✅

---

### Option 2: Using DBeaver

1. Open **DBeaver**
2. Connect to `school_management10` database
3. Right-click database → **SQL Editor** → **New SQL Script**
4. Paste the SQL from above
5. Press **Ctrl+Enter** to execute
6. Refresh your browser

---

### Option 3: Using psql Command Line

```bash
# Open Command Prompt or PowerShell
cd "C:\Users\USER\Desktop\For Now\iqrab3\backend"

# Run the SQL file
psql -U postgres -d school_management10 -f database/FIX_MISSING_TABLE.sql

# Enter your password when prompted
```

---

### Option 4: Fix Database Password in .env

If you know your PostgreSQL password:

1. Open `backend/.env` file
2. Find this line:
   ```
   DB_PASSWORD=postgres123
   ```
3. Change it to your actual PostgreSQL password
4. Save the file
5. Run:
   ```bash
   cd backend
   node scripts/quick-fix-table.js
   ```

---

## 🔍 How to Find Your PostgreSQL Password

### Method 1: Check pgAdmin
- Open pgAdmin
- Try connecting with different passwords:
  - `postgres`
  - `postgres123`
  - `Bilal2026SchoolSecurePass`
  - (whatever you set during PostgreSQL installation)

### Method 2: Check if PostgreSQL is Running
```bash
# Windows - Check PostgreSQL service
Get-Service postgresql*

# If not running, start it
Start-Service postgresql-x64-14  # or your version
```

---

## ✅ Verify the Fix

After running the SQL, verify it worked:

```sql
SELECT * FROM hr_attendance_deduction_settings;
```

You should see 12 rows with different staff types and deduction amounts.

---

## 🔄 After Fixing

1. **Refresh your browser** (Ctrl + F5)
2. **Navigate to**: HR → Leave Management
3. **The error should be gone!** ✅

---

## 📊 What This Table Does

The table stores salary deduction rules for staff attendance issues:

| Staff Type | Late | Absent | Half-Day |
|------------|------|--------|----------|
| Teacher | 50 ETB | 200 ETB | 100 ETB |
| Administrative | 50 ETB | 200 ETB | 100 ETB |
| Support Staff | 30 ETB | 150 ETB | 75 ETB |
| Management | 75 ETB | 250 ETB | 125 ETB |

Used by HR/Payroll system for automatic salary calculations.

---

## 🆘 Still Having Issues?

### Check Backend Logs
Look at your backend server console for more error details.

### Check Database Connection
Make sure:
- PostgreSQL is running
- Database `school_management10` exists
- You can connect to it with pgAdmin

### Restart Backend Server
After creating the table:
```bash
# Stop and restart your backend server
# Press Ctrl+C in the terminal running the backend
# Then start it again:
cd backend
npm start
```

---

## ✅ Success Indicators

After the fix:
- ✅ No more "relation does not exist" errors
- ✅ HR Leave Management page loads
- ✅ Attendance issues section works
- ✅ No red errors in browser console

---

**This is a LOCAL fix for your development environment.**
**For VPS deployment, follow the instructions in `DEPLOY_NOW.md`**
