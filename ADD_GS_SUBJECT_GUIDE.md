# Add G.S Subject and Fix Subject Display Guide

## Problem Summary
1. Need to add "G.S" subject to the database
2. Map G.S subject to classes: G7A, G7B, G8A, G8B
3. Ensure CreateEvaluation page displays subjects from database (not hardcoded)

## Solution

### Part 1: Add G.S Subject via SQL Script

Two files have been created:
- `ADD_GS_SUBJECT.sql` - SQL script to add the subject and mappings
- `ADD_GS_SUBJECT.bat` - Batch file to execute the SQL script

#### Steps to Execute:

1. Open Command Prompt or PowerShell
2. Navigate to the project directory
3. Run the batch file:
   ```bash
   ADD_GS_SUBJECT.bat
   ```
4. Enter your PostgreSQL password when prompted
5. Verify the output shows:
   - Subject Added: G.S
   - Mappings Created for G7A, G7B, G8A, G8B

#### What the Script Does:

1. Inserts "G.S" into `subjects_of_school_schema.subjects` table
2. Creates 4 mappings in `subjects_of_school_schema.subject_class_mappings`:
   - G.S → G7A
   - G.S → G7B
   - G.S → G8A
   - G.S → G8B
3. Uses `ON CONFLICT DO NOTHING` to prevent duplicates
4. Displays verification queries to confirm success

### Part 2: Subject Display Issue Analysis

The CreateEvaluation component is already correctly configured to fetch subjects from the database:

#### Current Implementation (Correct):
```javascript
// Fetches subjects from database
const [areasRes, subjectsRes, rolesRes] = await Promise.all([
  fetch(`${API_BASE}/areas`),
  fetch(`${API_BASE}/subjects`),  // ✓ Fetches from DB
  fetch(`${API_BASE}/roles`)
]);

if (subjectsRes.ok) setSubjects(await subjectsRes.json());
```

#### Backend Endpoint (Correct):
```javascript
// GET /api/evaluations/subjects
router.get('/subjects', async (req, res) => {
  const result = await pool.query(
    'SELECT id, subject_name FROM subjects_of_school_schema.subjects ORDER BY subject_name'
  );
  res.json(result.rows);
});
```

#### Rendering (Correct):
```javascript
<select name="subject_name" value={formData.subject_name} onChange={handleInputChange} required>
  <option value="">Select a Subject</option>
  {subjects.map(sub => <option key={sub.id} value={sub.subject_name}>{sub.subject_name}</option>)}
</select>
```

### Troubleshooting: If Subjects Still Don't Display Correctly

If you're seeing incorrect subjects after running the SQL script, try these steps:

1. **Clear Browser Cache:**
   - Press Ctrl+Shift+Delete
   - Clear cached data
   - Refresh the page (Ctrl+F5)

2. **Verify Database Connection:**
   - Check that the API is connecting to the correct database
   - Verify `backend/.env` or database configuration

3. **Test the API Endpoint Directly:**
   ```bash
   curl https://bilal.skoolific.com/api/evaluations/subjects
   ```
   This should return all subjects including G.S

4. **Check Browser Console:**
   - Open Developer Tools (F12)
   - Check Console tab for any errors
   - Check Network tab to see the API response

5. **Restart Backend Server:**
   If the backend is cached, restart it:
   ```bash
   # Navigate to backend directory
   cd backend
   # Restart the server
   npm restart
   ```

### Verification Steps

After running the SQL script:

1. **Verify in Database:**
   ```sql
   -- Check subject exists
   SELECT * FROM subjects_of_school_schema.subjects WHERE subject_name = 'G.S';
   
   -- Check mappings exist
   SELECT * FROM subjects_of_school_schema.subject_class_mappings WHERE subject_name = 'G.S';
   ```

2. **Verify in API:**
   - Visit: https://bilal.skoolific.com/api/evaluations/subjects
   - Should see G.S in the list

3. **Verify in Frontend:**
   - Open Create Evaluation page
   - Click Subject dropdown
   - G.S should appear in the list
   - Select G.S
   - Class dropdown should show: G7A, G7B, G8A, G8B

## Summary

The CreateEvaluation component is already correctly implemented to fetch subjects from the database. After running the `ADD_GS_SUBJECT.bat` script, the G.S subject will be available in the dropdown automatically. No frontend code changes are needed.

If subjects are not displaying correctly, it's likely a caching issue or database connection problem, not a code issue.
