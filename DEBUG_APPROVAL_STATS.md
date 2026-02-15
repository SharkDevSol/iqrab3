# 🔍 Debug: Approval Stats Not Recording

## Issue

Approval and rejection counts are showing 0 even after approving/rejecting permissions.

---

## 🧪 How to Debug

### Step 1: Check Database Records

**Run:**
```
Double-click: CHECK_APPROVAL_STATS.bat
```

**This will show:**
- Total approval records in database
- Recent approval/rejection records
- Stats by user (who approved what)
- Stats by status (APPROVED, REJECTED, PENDING)

**Expected Output:**
```
✅ Table exists

📋 Total records: 5

Recent approval records:
────────────────────────────────────────────────────────────────────
1. Status: APPROVED | Approved By: admin | Date: 2026-02-09...
2. Status: REJECTED | Approved By: admin | Date: 2026-02-09...
────────────────────────────────────────────────────────────────────

📊 Approval stats by user:
────────────────────────────────────────────────────────────────────
User: admin
  ✅ Approved: 3
  ❌ Rejected: 2
  📊 Total: 5
────────────────────────────────────────────────────────────────────
```

### Step 2: Check Browser Console

1. Open **Leave Management**
2. Press **F12** → **Console** tab
3. Look for logs:

**When page loads:**
```
📊 Fetching approval stats...
📈 Approval stats response: {success: true, data: {...}}
✅ Approval stats set: {approved: 3, rejected: 2, total: 5}
```

**When you approve/reject:**
```
✅ Permission approved!
📊 Fetching approval stats...
📈 Approval stats response: {success: true, data: {...}}
```

### Step 3: Check Backend Logs

**Look for:**
```
📊 Fetching approval stats for: admin
👤 User object: {id: 1, username: 'admin', ...}
📈 Query result: {approved: '3', rejected: '2', total: '5'}
📋 All approval records: [...]
```

---

## 🔧 Common Issues

### Issue 1: No Records in Database

**Symptoms:**
```
📋 Total records: 0
⚠️ No approval records found!
```

**Cause:** No permissions have been approved/rejected yet

**Solution:**
1. Go to Leave Management
2. Find a PENDING issue
3. Click Approve or Reject
4. Enter reason and submit
5. Check database again

### Issue 2: approved_by is NULL

**Symptoms:**
```
⚠️ No approval stats by user found!
This means approved_by field is NULL for all records.
```

**Cause:** The `approved_by` field is not being set when approving/rejecting

**Solution:**
- Check backend logs for user object
- Verify `req.user.username` or `req.user.id` exists
- May need to re-approve permissions

### Issue 3: Username Mismatch

**Symptoms:**
```
User: admin
  ✅ Approved: 3

But frontend shows: 0
```

**Cause:** Frontend is logged in as different user than backend expects

**Solution:**
- Check browser console for username
- Check backend logs for username
- Ensure they match
- May need to logout and login again

### Issue 4: Stats Not Updating

**Symptoms:**
- Approve a permission
- Stats don't change

**Cause:** Frontend not refreshing stats after approval

**Solution:**
- Check browser console for "Fetching approval stats"
- Should see this after each approval
- If not, check `fetchApprovalStats()` is being called

---

## 🎯 Quick Test

### Test Approval Recording

1. **Before:**
   - Run `CHECK_APPROVAL_STATS.bat`
   - Note current counts

2. **Approve:**
   - Go to Leave Management
   - Click Approve on a pending issue
   - Enter reason: "Test approval"
   - Submit

3. **After:**
   - Run `CHECK_APPROVAL_STATS.bat` again
   - Count should increase by 1
   - Should see new record with your username

4. **Frontend:**
   - Refresh Leave Management page
   - "My Approvals" card should show increased count

---

## 📊 Manual Database Check

**Check records:**
```sql
SELECT * FROM hr_attendance_permissions 
ORDER BY created_at DESC 
LIMIT 10;
```

**Check stats for specific user:**
```sql
SELECT 
  COUNT(*) FILTER (WHERE permission_status = 'APPROVED') as approved,
  COUNT(*) FILTER (WHERE permission_status = 'REJECTED') as rejected,
  COUNT(*) as total
FROM hr_attendance_permissions
WHERE approved_by = 'admin';  -- Replace with your username
```

**Check all users:**
```sql
SELECT 
  approved_by,
  permission_status,
  COUNT(*) as count
FROM hr_attendance_permissions
GROUP BY approved_by, permission_status
ORDER BY approved_by, permission_status;
```

---

## 🔍 Debug Checklist

- [ ] Run CHECK_APPROVAL_STATS.bat
- [ ] Check total records count
- [ ] Check if approved_by is set
- [ ] Check browser console logs
- [ ] Check backend console logs
- [ ] Verify username matches
- [ ] Test approve/reject action
- [ ] Verify stats update after action
- [ ] Check frontend displays correct count

---

## 💡 Expected Behavior

### When You Approve:
1. Click Approve button
2. Enter reason
3. Submit
4. Backend saves with `approved_by = your_username`
5. Frontend calls `fetchApprovalStats()`
6. Backend counts records where `approved_by = your_username`
7. Frontend updates "My Approvals" card

### When You Reject:
1. Click Reject button
2. Enter reason
3. Submit
4. Backend saves with `approved_by = your_username`
5. Frontend calls `fetchApprovalStats()`
6. Backend counts records where `approved_by = your_username`
7. Frontend updates "My Rejections" card

---

## 🚀 Next Steps

1. **Run the debug script:**
   ```
   CHECK_APPROVAL_STATS.bat
   ```

2. **Check the output:**
   - If no records: Approve/reject some permissions first
   - If approved_by is NULL: Backend issue with user object
   - If records exist but stats show 0: Username mismatch

3. **Check browser console:**
   - Should see approval stats logs
   - Should see stats updating after actions

4. **Report findings:**
   - Share output from CHECK_APPROVAL_STATS.bat
   - Share browser console logs
   - Share backend console logs

---

**Files Created:**
- `backend/scripts/check-approval-stats.js` - Debug script
- `CHECK_APPROVAL_STATS.bat` - One-click debug
- `DEBUG_APPROVAL_STATS.md` - This guide
