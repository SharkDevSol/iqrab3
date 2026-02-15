# ⚡ Quick Fix: Student Names Showing "Unknown"

## 🎯 3-Step Quick Fix

### Step 1: Hard Refresh Browser
```
Press: Ctrl + Shift + R (Windows)
   or: Cmd + Shift + R (Mac)
```

### Step 2: Check You're Logged In
- If not logged in, log in again
- Navigate to: Finance → Monthly Payments → Select a class

### Step 3: Check Browser Console
- Press F12
- Look for any red errors
- If you see errors, take a screenshot

## ✅ Expected Result

You should now see:
- **Student 0001** instead of "Unknown"
- **Student 0002** instead of "Unknown"  
- **Student 0003** instead of "Unknown"

## 🔍 Still Not Working?

### Check Backend is Running
```bash
# In backend folder
.\kill-port-5000.ps1
node server.js
```

### Check Database Has Names
```bash
# In backend folder
node scripts/check-student-names.js
```

Should show:
```
✅ All invoice student IDs have matching Student records!
📋 Sample of students with names:
   ...0003 → Student 0003
   ...0002 → Student 0002
   ...0001 → Student 0001
```

## 🐛 Debug: Check API Response

1. Press F12 (DevTools)
2. Go to "Network" tab
3. Refresh the page
4. Find request to `/class/C`
5. Click it → "Response" tab
6. Look for `"studentName": "Student 0001"`

**If you see `studentName` in response but UI shows "Unknown":**
- Clear browser cache completely
- Restart frontend dev server

**If you DON'T see `studentName` in response:**
- Backend issue
- Restart backend server
- Check backend logs

## 📞 Need Help?

Provide these:
1. Screenshot of browser console (F12)
2. Screenshot of Network tab API response
3. Output of `check-student-names.js`

## 🎉 Success!

Once working, you'll see student names everywhere:
- ✅ Main student list
- ✅ Card details modals
- ✅ All finance pages

Names currently show as "Student 0001", "Student 0002", etc.
To change to real names, see: `UPDATE_STUDENT_NAMES_GUIDE.md`
