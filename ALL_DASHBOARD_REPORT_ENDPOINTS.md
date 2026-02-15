# Complete Dashboard Report Endpoints Reference

**Base URL:** `http://localhost:5000/api`  
**Authentication:** All endpoints require JWT token in Authorization header

---

## 🆕 NEW MODULE ENDPOINTS (Dashboard Summary)

### Finance Management
```
GET /api/reports/finance/summary
```
**Returns:** `{ revenue, expenses, profit, pending }`

### Inventory & Stock Management
```
GET /api/reports/inventory/summary
```
**Returns:** `{ totalItems, lowStock, outOfStock, totalValue }`

### HR & Staff Management
```
GET /api/reports/hr/summary
```
**Returns:** `{ totalStaff, present, absent, onLeave }`

### Asset Management
```
GET /api/reports/assets/summary
```
**Returns:** `{ totalAssets, inUse, maintenance, totalValue }`

---

## 📊 OVERVIEW & SYSTEM REPORTS

### Complete System Overview
```
GET /api/reports/overview
```
**Returns:** Complete statistics for students, staff, classes, faults, attendance, evaluations

### Quick Summary (For Super Admin Dashboard)
```
GET /api/reports/summary
```
**Returns:** Quick summary with key metrics
```json
{
  "totalStudents": 485,
  "totalTeachers": 30,
  "totalStaff": 42,
  "totalRevenue": 125000,
  "attendanceRate": 92.0,
  "totalFaults": 47,
  "totalClasses": 12,
  "lastUpdated": "2026-01-31T10:30:00.000Z"
}
```

### Enhanced Dashboard Stats
```
GET /api/dashboard/enhanced-stats
```
**Returns:** Academic data, behavior data, class rankings, top performers

---

## 👨‍🎓 STUDENT REPORTS

### 1. Student Summary
```
GET /api/reports/students/summary
```
**Returns:** Total students, gender distribution, class count

### 2. Students by Class
```
GET /api/reports/students/by-class
```
**Returns:** Student count per class with gender breakdown

### 3. Gender Distribution
```
GET /api/reports/students/by-gender
```
**Returns:** Male/female counts and percentages

### 4. Age Distribution
```
GET /api/reports/students/by-age
```
**Returns:** Student count grouped by age

---

## 👨‍🏫 STAFF REPORTS

### 1. Staff Summary
```
GET /api/reports/staff/summary
```
**Returns:** Total staff, teachers, admin, support counts

### 2. Staff by Type
```
GET /api/reports/staff/by-type
```
**Returns:** Staff count by employment type

### 3. Staff by Role
```
GET /api/reports/staff/by-role
```
**Returns:** Staff count by specific roles

### 4. Staff Gender Distribution
```
GET /api/reports/staff/by-gender
```
**Returns:** Gender distribution of staff

---

## 📚 ACADEMIC REPORTS

### 1. Class Performance
```
GET /api/reports/academic/class-performance
```
**Returns:** Average scores per class with student count

### 2. Subject Averages
```
GET /api/reports/academic/subject-averages
```
**Returns:** Average scores across all subjects

### 3. Top Performers
```
GET /api/reports/academic/top-performers?limit=10
```
**Parameters:** `limit` (default: 10)  
**Returns:** Top performing students by average score

### 4. Bottom Performers
```
GET /api/reports/academic/bottom-performers?limit=10
```
**Parameters:** `limit` (default: 10)  
**Returns:** Students needing academic support

### 5. Class Rankings
```
GET /api/reports/academic/class-rankings
```
**Returns:** Classes ranked by average performance

### 6. Pass/Fail Rates
```
GET /api/reports/academic/pass-fail-rates
```
**Returns:** Pass and fail rates by class

---

## ⚠️ BEHAVIOR & FAULTS REPORTS

### 1. Faults Summary
```
GET /api/reports/faults/summary
```
**Returns:** Total faults, unique students, critical faults, weekly count

### 2. Faults by Class
```
GET /api/reports/faults/by-class
```
**Returns:** Fault count per class with student count

### 3. Faults by Type
```
GET /api/reports/faults/by-type
```
**Returns:** Fault count by type (Behavioral, Academic, Attendance, etc.)

### 4. Faults by Severity Level
```
GET /api/reports/faults/by-level
```
**Returns:** Fault count by severity (High, Medium, Low)

### 5. Recent Faults
```
GET /api/reports/faults/recent?days=7&limit=20
```
**Parameters:** `days` (default: 7), `limit` (default: 20)  
**Returns:** Recent faults within timeframe

### 6. Top Offenders
```
GET /api/reports/faults/top-offenders?limit=10
```
**Parameters:** `limit` (default: 10)  
**Returns:** Students with most faults

### 7. Fault Trends
```
GET /api/reports/faults/trends?days=30
```
**Parameters:** `days` (default: 30)  
**Returns:** Daily fault counts over time period

---

## 📅 ATTENDANCE REPORTS

### 1. Attendance Summary
```
GET /api/reports/attendance/summary
```
**Returns:** Total records, present, absent, late, permission, attendance rate

### 2. Attendance by Class
```
GET /api/reports/attendance/by-class
```
**Returns:** Attendance rates per class

### 3. Attendance by Day of Week
```
GET /api/reports/attendance/by-day
```
**Returns:** Attendance patterns by day (Monday-Friday)

### 4. Attendance Trends
```
GET /api/reports/attendance/trends?weeks=4
```
**Parameters:** `weeks` (default: 4)  
**Returns:** Attendance trends over time

### 5. Frequently Absent Students
```
GET /api/reports/attendance/absentees?limit=10
```
**Parameters:** `limit` (default: 10)  
**Returns:** Students with high absence rates

---

## 📝 EVALUATION REPORTS

### 1. Evaluation Summary
```
GET /api/reports/evaluations/summary
```
**Returns:** Total evaluations, responded, pending, response rate

### 2. Evaluations by Class
```
GET /api/reports/evaluations/by-class
```
**Returns:** Evaluation count per class

### 3. Guardian Response Rates
```
GET /api/reports/evaluations/response-rates
```
**Returns:** Guardian engagement metrics

---

## 📢 POSTS & ANNOUNCEMENTS REPORTS

### 1. Posts Summary
```
GET /api/reports/posts/summary
```
**Returns:** Total posts, weekly count, monthly count

### 2. Posts by Audience
```
GET /api/reports/posts/by-audience
```
**Returns:** Post count by target audience

### 3. Recent Posts
```
GET /api/reports/posts/recent?limit=10
```
**Parameters:** `limit` (default: 10)  
**Returns:** Most recent posts

---

## 📆 SCHEDULE REPORTS

### 1. Schedule Summary
```
GET /api/reports/schedule/summary
```
**Returns:** Total teachers, classes, periods

### 2. Teacher Workload
```
GET /api/reports/schedule/teacher-workload
```
**Returns:** Period count per teacher

---

## 👪 GUARDIAN REPORTS

### 1. Guardian Summary
```
GET /api/reports/guardians/summary
```
**Returns:** Total guardians, with accounts, without accounts

### 2. Guardian Engagement
```
GET /api/reports/guardians/engagement
```
**Returns:** Guardian engagement metrics

---

## 🔔 ACTIVITY REPORTS

### Recent System Activity
```
GET /api/reports/activity/recent?limit=20
```
**Parameters:** `limit` (default: 20)  
**Returns:** Recent activities (faults, posts, evaluations)

---

## 💰 FINANCE MODULE - DETAILED REPORTS

### 1. Trial Balance
```
GET /api/finance/reports/trial-balance?asOfDate=2026-01-31&campusId=1
```
**Parameters:** `asOfDate`, `campusId` (optional)  
**Returns:** Account balances with debit/credit totals

### 2. Income Statement (Profit & Loss)
```
GET /api/finance/reports/income-statement?startDate=2026-01-01&endDate=2026-01-31&campusId=1
```
**Parameters:** `startDate`, `endDate`, `campusId` (optional)  
**Returns:** Income, expenses, net income, profit margin

### 3. Balance Sheet
```
GET /api/finance/reports/balance-sheet?asOfDate=2026-01-31&campusId=1
```
**Parameters:** `asOfDate`, `campusId` (optional)  
**Returns:** Assets, liabilities, equity

### 4. Cash Flow Statement
```
GET /api/finance/reports/cash-flow?startDate=2026-01-01&endDate=2026-01-31&campusId=1
```
**Parameters:** `startDate`, `endDate`, `campusId` (optional)  
**Returns:** Operating, investing, financing cash flows

### 5. Accounts Receivable Aging
```
GET /api/finance/reports/ar-aging?campusId=1
```
**Parameters:** `campusId` (optional)  
**Returns:** Aging buckets (current, 30, 60, 90, 90+ days)

### 6. Revenue Analysis
```
GET /api/finance/reports/revenue-analysis?startDate=2026-01-01&endDate=2026-01-31&groupBy=month&campusId=1
```
**Parameters:** `startDate`, `endDate`, `groupBy` (month/year), `campusId` (optional)  
**Returns:** Revenue by period and category

---

## 📦 INVENTORY MODULE - DETAILED REPORTS

### 1. Get All Items
```
GET /api/inventory/items?category=SUPPLIES&isActive=true&search=pen&page=1&limit=20
```
**Parameters:** `category`, `isActive`, `search`, `page`, `limit`  
**Returns:** Paginated inventory items

### 2. Get Single Item
```
GET /api/inventory/items/:id
```
**Returns:** Detailed item information

### 3. Get Stock Levels
```
GET /api/inventory/items/:id/stock-levels
```
**Returns:** Stock levels for specific item

---

## 📊 QUICK REFERENCE - ENDPOINT COUNT

| Category | Endpoints |
|----------|-----------|
| **New Modules (Dashboard)** | 4 |
| **Overview & System** | 2 |
| **Students** | 4 |
| **Staff** | 4 |
| **Academic** | 6 |
| **Behavior/Faults** | 7 |
| **Attendance** | 5 |
| **Evaluations** | 3 |
| **Posts** | 3 |
| **Schedule** | 2 |
| **Guardians** | 2 |
| **Activity** | 1 |
| **Finance Detailed** | 6 |
| **Inventory Detailed** | 3 |
| **TOTAL** | **52 Endpoints** |

---

## 🚀 USAGE EXAMPLES

### JavaScript/React Example
```javascript
import api from './utils/api';

// Fetch all dashboard summaries
const fetchDashboardData = async () => {
  try {
    const [finance, inventory, hr, assets, overview] = await Promise.all([
      api.get('/reports/finance/summary'),
      api.get('/reports/inventory/summary'),
      api.get('/reports/hr/summary'),
      api.get('/reports/assets/summary'),
      api.get('/reports/overview')
    ]);
    
    console.log('Finance:', finance.data);
    console.log('Inventory:', inventory.data);
    console.log('HR:', hr.data);
    console.log('Assets:', assets.data);
    console.log('Overview:', overview.data);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
  }
};

// Fetch academic reports
const fetchAcademicReports = async () => {
  const [performance, topStudents, rankings] = await Promise.all([
    api.get('/reports/academic/class-performance'),
    api.get('/reports/academic/top-performers?limit=5'),
    api.get('/reports/academic/class-rankings')
  ]);
  
  return { performance, topStudents, rankings };
};

// Fetch behavior reports
const fetchBehaviorReports = async () => {
  const [summary, byClass, recent] = await Promise.all([
    api.get('/reports/faults/summary'),
    api.get('/reports/faults/by-class'),
    api.get('/reports/faults/recent?days=7&limit=10')
  ]);
  
  return { summary, byClass, recent };
};
```

### cURL Examples
```bash
# Get finance summary
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:5000/api/reports/finance/summary

# Get top performers
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:5000/api/reports/academic/top-performers?limit=5

# Get recent faults
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:5000/api/reports/faults/recent?days=7&limit=20

# Get attendance by class
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:5000/api/reports/attendance/by-class

# Get income statement
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  "http://localhost:5000/api/finance/reports/income-statement?startDate=2026-01-01&endDate=2026-01-31"
```

### Axios Example
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

// Get all dashboard data
const getDashboardData = async () => {
  const endpoints = [
    '/reports/finance/summary',
    '/reports/inventory/summary',
    '/reports/hr/summary',
    '/reports/assets/summary',
    '/reports/students/summary',
    '/reports/staff/summary',
    '/reports/faults/summary',
    '/reports/attendance/summary'
  ];
  
  const results = await Promise.all(
    endpoints.map(endpoint => api.get(endpoint))
  );
  
  return results.map(r => r.data);
};
```

---

## 📝 RESPONSE FORMAT

All endpoints follow this format:

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data here
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```

---

## 🔐 AUTHENTICATION

All endpoints require JWT authentication:

```javascript
// Set token in headers
headers: {
  'Authorization': `Bearer ${token}`
}
```

Get token from login endpoints:
- `POST /api/admin/login`
- `POST /api/staff/login`
- `POST /api/students/login`

---

## ⚡ PERFORMANCE TIPS

1. **Use Promise.all()** for parallel requests
2. **Cache responses** when data doesn't change frequently
3. **Implement pagination** for large datasets
4. **Use query parameters** to filter data server-side
5. **Debounce search inputs** to reduce API calls

---

## 🎯 DASHBOARD TAB MAPPING

| Dashboard Tab | Primary Endpoints |
|--------------|-------------------|
| **Overview** | `/reports/overview`, `/dashboard/enhanced-stats` |
| **Academic** | `/reports/academic/*` (6 endpoints) |
| **Behavior** | `/reports/faults/*` (7 endpoints) |
| **Attendance** | `/reports/attendance/*` (5 endpoints) |
| **Finance** | `/reports/finance/summary`, `/finance/reports/*` |
| **Inventory** | `/reports/inventory/summary`, `/inventory/items` |
| **HR & Staff** | `/reports/hr/summary`, `/reports/staff/*` |
| **Assets** | `/reports/assets/summary` |
| **Activity** | `/reports/activity/recent` |

---

## 📞 SUPPORT

For issues or questions:
1. Check response format and status codes
2. Verify JWT token is valid and not expired
3. Ensure database schemas exist
4. Check server logs for detailed errors
5. Verify network connectivity

---

**Last Updated:** January 31, 2026  
**Total Endpoints:** 52  
**Authentication:** Required for all endpoints
