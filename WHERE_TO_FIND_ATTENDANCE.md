# Where to Find the Teacher/Staff Attendance Pages

## 🎯 Quick Answer

The **NEW Staff Personal Attendance System** (with two-step verification for teachers) is located at:

**Route**: `/staff/my-attendance`

**Access**: Login as Staff → Click "My Attendance" in the navigation menu

---

## 📍 All Attendance Pages Locations

### 1. Staff Personal Attendance (NEW - Two-Step Verification)

```
┌─────────────────────────────────────────┐
│  Login as Staff Member                  │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  Staff Portal Navigation Menu           │
│  ┌───────────────────────────────────┐ │
│  │ • Home                            │ │
│  │ • Post                            │ │
│  │ • Student Attendance              │ │
│  │ • My Attendance ◄── CLICK HERE   │ │
│  │ • Marks                           │ │
│  │ • Evaluation                      │ │
│  │ • Profile                         │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  Staff Attendance System                │
│  (Two-Step Verification for Teachers)   │
│                                         │
│  • Real-time clock                     │
│  • Clock In (Step 1 & 2 for teachers) │
│  • Clock Out                           │
│  • Today's attendance status           │
└─────────────────────────────────────────┘
```

**URL**: `http://localhost:5173/staff/my-attendance`

---

### 2. Student Attendance (Existing - For Class Teachers)

```
┌─────────────────────────────────────────┐
│  Login as Class Teacher                 │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  Staff Portal Navigation Menu           │
│  ┌───────────────────────────────────┐ │
│  │ • Home                            │ │
│  │ • Post                            │ │
│  │ • Student Attendance ◄── HERE    │ │
│  │ • My Attendance                   │ │
│  │ • Marks                           │ │
│  │ • Evaluation                      │ │
│  │ • Profile                         │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  Student Attendance System              │
│  (Mark student attendance)              │
│                                         │
│  • View class roster                   │
│  • Mark Present/Absent/Late            │
│  • Save attendance                     │
└─────────────────────────────────────────┘
```

**URL**: `http://localhost:5173/staff/attendance-staff`

---

### 3. Attendance Records (Admin View)

```
┌─────────────────────────────────────────┐
│  Login as Administrator                 │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  Main Navigation Menu                   │
│  ┌───────────────────────────────────┐ │
│  │ • Dashboard                       │ │
│  │ • Attendance Records ◄── HERE    │ │
│  │ • Staff Management                │ │
│  │ • Reports                         │ │
│  │ • Settings                        │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  Attendance Records Dashboard           │
│  (View all staff attendance)            │
│                                         │
│  • Filter by staff/date/role           │
│  • View records                        │
│  • Generate reports                    │
│  • Export CSV                          │
└─────────────────────────────────────────┘
```

**URL**: `http://localhost:5173/attendance-records`

---

## 🔍 How to Access Each Page

### For Teachers

#### To Clock In/Out (Your Own Attendance)
1. Login to the system
2. You'll be in the Staff Portal
3. Look at the left navigation menu
4. Click **"My Attendance"**
5. You'll see the attendance system with:
   - Current time display
   - "Clock In (Step 1)" button
   - After Step 1: "Confirm Arrival (Step 2)" button
   - After clocking in: "Clock Out" button

#### To Mark Student Attendance
1. Login to the system
2. You'll be in the Staff Portal
3. Look at the left navigation menu
4. Click **"Student Attendance"**
5. You'll see your class roster
6. Mark students as Present/Absent/Late

---

### For General Staff

#### To Clock In/Out (Your Own Attendance)
1. Login to the system
2. You'll be in the Staff Portal
3. Look at the left navigation menu
4. Click **"My Attendance"**
5. You'll see the attendance system with:
   - Current time display
   - "Clock In" button (single step)
   - After clocking in: "Clock Out" button

---

### For Administrators

#### To View Staff Attendance Records
1. Login to the system
2. You'll be in the Main Dashboard
3. Look at the navigation menu
4. Click **"Attendance Records"**
5. You'll see:
   - Filter options
   - All staff attendance records
   - Summary reports
   - Export button

---

## 📱 Direct URLs (After Login)

Copy and paste these URLs in your browser after logging in:

| Page | URL |
|------|-----|
| Staff Personal Attendance | `http://localhost:5173/staff/my-attendance` |
| Student Attendance | `http://localhost:5173/staff/attendance-staff` |
| Attendance Records (Admin) | `http://localhost:5173/attendance-records` |
| Alternative Staff Attendance | `http://localhost:5173/staff-attendance-system` |

---

## 🎨 Visual Menu Location

### Staff Portal Menu (Left Sidebar)

```
╔═══════════════════════════════╗
║  STAFF PORTAL                 ║
╠═══════════════════════════════╣
║  🏠 Home                      ║
║  ✏️  Post                      ║
║  👥 Student Attendance        ║ ← Mark students
║  ⏰ My Attendance             ║ ← Clock in/out (NEW)
║  📋 Marks                     ║
║  📊 Evaluation                ║
║  👤 Profile                   ║
╚═══════════════════════════════╝
```

### Main Dashboard Menu (Top/Side Navigation)

```
╔═══════════════════════════════╗
║  MAIN DASHBOARD               ║
╠═══════════════════════════════╣
║  📊 Dashboard                 ║
║  📅 Attendance Records        ║ ← View all staff (NEW)
║  👥 Staff Management          ║
║  📈 Reports                   ║
║  ⚙️  Settings                 ║
╚═══════════════════════════════╝
```

---

## 🔐 Access Permissions

| Page | Teachers | General Staff | Administrators |
|------|----------|---------------|----------------|
| My Attendance | ✅ Yes | ✅ Yes | ✅ Yes |
| Student Attendance | ✅ Yes (if class teacher) | ❌ No | ✅ Yes |
| Attendance Records | ❌ No | ❌ No | ✅ Yes |

---

## 🚀 First Time Setup

### Step 1: Run Database Migration
```bash
cd backend
psql -U your_user -d your_db -f database/staff_attendance_schema.sql
```

### Step 2: Restart Backend
```bash
cd backend
npm start
```

### Step 3: Restart Frontend
```bash
cd APP
npm run dev
```

### Step 4: Login and Navigate
1. Open browser: `http://localhost:5173`
2. Login as staff member
3. Click "My Attendance" in the menu
4. Start using the system!

---

## 📝 What You'll See

### Teacher View (Two-Step Verification)

```
┌────────────────────────────────────────────┐
│  Staff Attendance System                    │
├────────────────────────────────────────────┤
│                                             │
│  ⏰ Current Time: 08:00:00                 │
│     Thursday, January 29, 2026             │
│                                             │
│  👨‍🏫 John Doe                               │
│  Teacher | ID: T001                        │
│  ✓ Two-Step Verification                   │
│                                             │
│  ┌──────────────────────────────────────┐ │
│  │  [🔐 Clock In (Step 1)]              │ │
│  └──────────────────────────────────────┘ │
│                                             │
│  How It Works:                             │
│  • Step 1: Click "Clock In"                │
│  • Step 2: Confirm your arrival            │
│  • Both timestamps recorded                │
│                                             │
└────────────────────────────────────────────┘
```

### General Staff View (Single-Step)

```
┌────────────────────────────────────────────┐
│  Staff Attendance System                    │
├────────────────────────────────────────────┤
│                                             │
│  ⏰ Current Time: 08:15:00                 │
│     Thursday, January 29, 2026             │
│                                             │
│  👤 Jane Smith                             │
│  General Staff | ID: GS001                 │
│                                             │
│  ┌──────────────────────────────────────┐ │
│  │  [✓ Clock In]                        │ │
│  └──────────────────────────────────────┘ │
│                                             │
│  How It Works:                             │
│  • Click "Clock In" when you arrive        │
│  • Click "Clock Out" when you leave        │
│  • All times logged securely               │
│                                             │
└────────────────────────────────────────────┘
```

---

## ❓ Troubleshooting

### Can't Find "My Attendance" Menu Item?

1. **Check if you're logged in as staff**
   - The menu only appears in the Staff Portal
   - URL should be: `/staff/...`

2. **Check the Staff.jsx file**
   - Verify the route was added correctly
   - Look for `{ path: "my-attendance", ... }`

3. **Clear browser cache**
   - Press Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Or clear cache in browser settings

### Page Shows 404 Error?

1. **Verify the route in App.jsx**
   - Check if `<Route path="my-attendance" element={<StaffAttendanceSystem />} />` exists

2. **Restart the development server**
   ```bash
   cd APP
   npm run dev
   ```

### Database Error?

1. **Run the SQL schema**
   ```bash
   psql -U your_user -d your_db -f backend/database/staff_attendance_schema.sql
   ```

2. **Check database connection**
   - Verify `.env` file has correct `DATABASE_URL`

---

## 📚 Related Documentation

- **Full System Documentation**: `STAFF_ATTENDANCE_SYSTEM.md`
- **Quick Start Guide**: `STAFF_ATTENDANCE_QUICK_START.md`
- **Visual Diagrams**: `STAFF_ATTENDANCE_DIAGRAMS.md`
- **Excel Template**: `STAFF_ATTENDANCE_EXCEL_TEMPLATE.md`

---

## ✅ Summary

**The teacher/staff attendance page with two-step verification is located at:**

**`/staff/my-attendance`**

**Access it by:**
1. Login as staff member
2. Click "My Attendance" in the Staff Portal navigation menu

That's it! The system automatically handles teachers with two-step verification and general staff with single-step verification.
