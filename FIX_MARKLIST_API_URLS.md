# Fix Mark List API URLs - Complete Guide

## Summary

Successfully added G.S subject to database and mapped it to G7A, G7B, G8A, G8B classes. Fixed backend to handle periods in subject names. Frontend needs API URL updates.

## What Was Done

### 1. Added G.S Subject to Database ✓
- Subject "G.S" added to `subjects_of_school_schema.subjects`
- Mapped to classes: G7A, G7B, G8A, G8B in `subject_class_mappings`
- Database: `school_management10` on bilal.skoolific.com

### 2. Fixed Backend for Special Characters ✓
- Updated `/var/www/bilal-school/backend/routes/markListRoutes.js`
- Changed regex from `/[\s\-]+/g` to `/[\s\-\.]+/g` to handle periods
- Schema name: `subject_g.s_schema` becomes `subject_g_s_schema`
- Backend restarted and working

## What Needs to Be Done

### Frontend API URL Fixes

Three files need API_BASE_URL added and fetch calls updated:

#### 1. APP/src/PAGE/CreateMarklist/MarkListManagement.jsx

Add at top after imports:
```javascript
const API_BASE_URL = 'https://bilal.skoolific.com/api';
```

Replace all fetch calls:
- `fetch('/api/mark-list/...` → `fetch(`${API_BASE_URL}/mark-list/...`)`
- `fetch('/api/schedule/...` → `fetch(`${API_BASE_URL}/schedule/...`)`

Lines to fix: 34, 35, 36, 38, 111, 193, 453, 454, 455, 507, 650, 651

#### 2. APP/src/PAGE/CreateMarklist/SubjectMappingSetup.jsx

Add at top after imports:
```javascript
const API_BASE_URL = 'https://bilal.skoolific.com/api';
```

Replace all fetch calls:
- `fetch('/api/mark-list/...` → `fetch(`${API_BASE_URL}/mark-list/...`)`
- `fetch('/api/schedule/...` → `fetch(`${API_BASE_URL}/schedule/...`)`

Lines to fix: 18, 71, 73, 191, 192, 193, 242

#### 3. APP/src/PAGE/TaskDetail.jsx

Add at top after imports:
```javascript
const API_BASE_URL = 'https://bilal.skoolific.com/api';
```

Replace all fetch calls:
- `fetch('/api/mark-list/...` → `fetch(`${API_BASE_URL}/mark-list/...`)`

Lines to fix: 465, 480, 545, 582

## Manual Fix Steps

1. Open each file in your editor
2. Add `const API_BASE_URL = 'https://bilal.skoolific.com/api';` after imports
3. Find and replace:
   - Find: `fetch('/api/`
   - Replace: `fetch(\`${API_BASE_URL}/`
4. Save all files
5. Run `npm run build` in APP directory
6. Deploy to server

## Deployment Commands

```bash
# Build frontend
cd APP
npm run build

# Upload to server
scp -r dist/* root@76.13.48.245:/var/www/bilal-school/frontend/

# Or use your existing deployment script
```

## Verification

After deployment:
1. Go to bilal.skoolific.com
2. Navigate to Create Mark List page
3. Select Subject: G.S
4. Select Class: G7A, G7B, G8A, or G8B
5. Select Term and create mark list
6. Should work without 502 errors

## Files Modified on Server

- `/var/www/bilal-school/backend/routes/markListRoutes.js` - Fixed regex for special characters
- Database `school_management10`:
  - Added G.S to `subjects_of_school_schema.subjects`
  - Added 4 mappings to `subjects_of_school_schema.subject_class_mappings`

## Backup

Backend backup created at:
- `/var/www/bilal-school/backend/routes/markListRoutes.js.backup`
