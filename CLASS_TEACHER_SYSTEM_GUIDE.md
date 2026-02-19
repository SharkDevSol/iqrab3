# Class Teacher System - Complete Guide

## What is a Class Teacher?

A **Class Teacher** is a teacher who is assigned to manage a specific class. They have special responsibilities:
- Mark weekly attendance for their assigned class
- View their class students
- Communicate with their class
- Access class-specific features in the staff app

## How the System Works

### 1. Database Structure
- **Table:** `school_schema_points.class_teachers`
- **Fields:**
  - `global_staff_id` - Teacher's unique ID
  - `teacher_name` - Teacher's name
  - `assigned_class` - Class name (e.g., KG1B, GRADE1A)
  - `assigned_at` - When the assignment was made
  - `is_active` - Whether the assignment is active

### 2. Key Features
- ✅ One teacher per class (unique constraint)
- ✅ Teachers can be reassigned to different classes
- ✅ Assignments can be removed
- ✅ Auto-creates table on server startup
- ✅ Works after data deletion (permanent fix)

## How to Assign a Class Teacher

### Step 1: Access the Assignment Page
1. Log in as **Admin**
2. Go to **Home** page
3. Look for **"Class Teachers"** in the navigation menu
4. Click on it to open the **Class Teacher Assignment** page

**Direct URL:** `http://localhost:5173/app/class-teacher-assignment`

### Step 2: Assign a Teacher
1. On the Class Teacher Assignment page, you'll see:
   - **Select Teacher** dropdown (shows all teachers)
   - **Select Class** dropdown (shows unassigned classes only)
   - **Assign** button

2. Select a teacher from the dropdown
   - Shows teacher name and work time (Full Time/Part Time)
   
3. Select a class from the dropdown
   - Only shows classes that don't have a teacher yet
   
4. Click **"Assign"** button
   - Success message will appear
   - The assignment will show in "Current Assignments" section

### Step 3: View Current Assignments
The page shows all current class teacher assignments with:
- Class name
- Teacher name
- Work time (Full Time/Part Time)
- Assignment date
- Remove button (trash icon)

### Step 4: Remove an Assignment
1. Find the assignment card you want to remove
2. Click the **trash icon** (🗑️) in the top-right corner
3. Confirm the removal
4. The teacher will be unassigned from that class

## What Teachers Can Do After Assignment

Once a teacher is assigned as a class teacher, they can:

### 1. View "My Classes" Tab
- In the staff app, they'll see a **"My Classes"** tab
- Shows their assigned class
- Displays class information

### 2. Mark Weekly Attendance
- Create weekly attendance sheets
- Mark students as Present (P), Absent (A), or Late (L)
- Save attendance for each school day
- View attendance history

### 3. View Class Students
- See all students in their assigned class
- View student details (name, age, gender, photo)
- Access student information

### 4. Class Communication
- Send messages to their class
- Communicate with students/guardians
- Post announcements

## API Endpoints

### For Admin (Assignment Management)

**Get all teachers:**
```
GET /api/class-teacher/teachers
```

**Get all classes:**
```
GET /api/class-teacher/classes
```

**Get all assignments:**
```
GET /api/class-teacher/assignments
```

**Assign a teacher:**
```
POST /api/class-teacher/assign
Body: {
  "global_staff_id": 2,
  "teacher_name": "John Doe",
  "assigned_class": "KG1B"
}
```

**Remove assignment:**
```
DELETE /api/class-teacher/unassign/:className
```

### For Teachers (Staff App)

**Check if teacher is a class teacher:**
```
GET /api/class-teacher/check/:globalStaffId
```

**Get students for assigned class:**
```
GET /api/class-teacher/students/:className
```

**Create weekly attendance:**
```
POST /api/class-teacher/create-weekly-attendance
Body: {
  "className": "KG1B",
  "weekStart": "2026-02-17",
  "globalStaffId": 2
}
```

**Get weekly attendance:**
```
GET /api/class-teacher/weekly-attendance/:className/:weekStart
```

**Update weekly attendance:**
```
PUT /api/class-teacher/weekly-attendance/:className/:weekStart
Body: {
  "records": [...],
  "globalStaffId": 2
}
```

## Troubleshooting

### Issue: "No teachers found"
**Solution:** Make sure teachers are registered in the system
- Go to Staff Registration
- Add teachers with role = "Teacher"

### Issue: "No classes found"
**Solution:** Make sure classes are created
- Go to Student Registration
- Create classes first
- Classes are stored in `school_schema_points.classes`

### Issue: Teacher can't see "My Classes" tab
**Solution:** 
1. Check if teacher is assigned: `/api/class-teacher/check/:globalStaffId`
2. Make sure `is_active = true` in the assignment
3. Teacher must log out and log back in to see changes

### Issue: Can't assign teacher to class
**Solution:**
- Check if class already has a teacher assigned
- Each class can only have ONE class teacher
- Remove existing assignment first, then assign new teacher

### Issue: Assignment page shows empty
**Solution:**
1. Check if `school_schema_points.class_teachers` table exists
2. Restart the server (auto-setup will create the table)
3. Check browser console for errors

## Permanent Fix Guarantee

The class teacher system is **permanent** and will work:
- ✅ After deleting all data
- ✅ On a new device
- ✅ With a fresh database
- ✅ Without manual intervention

**Why?**
- Table is created automatically on server startup
- Code in: `backend/routes/classTeacherRoutes.js`
- Function: `initializeClassTeachersTable()`
- Runs every time the server starts

## Example Workflow

### Scenario: Assign "John Doe" to "KG1B"

1. **Admin logs in**
2. **Goes to Class Teacher Assignment page**
3. **Selects:**
   - Teacher: John Doe (Full Time)
   - Class: KG1B
4. **Clicks "Assign"**
5. **Success!** John Doe is now the class teacher for KG1B

### What John Doe can now do:

1. **Logs into Staff App**
2. **Sees "My Classes" tab** (new tab appears)
3. **Clicks on "My Classes"**
4. **Sees KG1B class with all students**
5. **Can create weekly attendance:**
   - Selects week (e.g., Feb 17-23, 2026)
   - Marks attendance for each day
   - Saves the attendance
6. **Can view attendance history**
7. **Can communicate with class**

## Screenshots Guide

### Admin View:
1. **Assignment Page** - Shows form to assign teachers
2. **Current Assignments** - Shows all assigned class teachers
3. **Unassigned Classes** - Shows classes without teachers

### Teacher View (Staff App):
1. **My Classes Tab** - Shows assigned class
2. **Class Students** - Shows all students in the class
3. **Weekly Attendance** - Mark attendance for the week
4. **Attendance History** - View past attendance records

## Best Practices

1. **Assign class teachers at the beginning of the term**
2. **One teacher per class** (system enforces this)
3. **Update assignments when teachers change**
4. **Remove assignments for inactive teachers**
5. **Check assignments regularly** to ensure all classes have teachers

## Related Features

- **Subject-Teacher Assignment** - Different from class teacher
  - Subject teachers teach specific subjects
  - Class teachers manage the whole class
  - A teacher can be BOTH a class teacher AND a subject teacher

- **Weekly Attendance** - Managed by class teachers
  - Different from daily attendance
  - Covers Monday-Sunday
  - Stored per week

- **Class Communication** - Available to class teachers
  - Send messages to class
  - Post announcements
  - View class feed

## Summary

**Class Teacher System** allows you to:
- ✅ Assign one teacher to manage each class
- ✅ Teachers can mark weekly attendance
- ✅ Teachers can view their class students
- ✅ Easy assignment and removal
- ✅ Permanent and reliable
- ✅ Works on all devices

**To assign a class teacher:**
1. Go to **Class Teacher Assignment** page
2. Select **Teacher** and **Class**
3. Click **Assign**
4. Done! ✅

The teacher will immediately see their assigned class in the staff app!
