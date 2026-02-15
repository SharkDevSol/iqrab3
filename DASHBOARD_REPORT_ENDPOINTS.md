# Dashboard Report Endpoints - Complete Reference

All endpoints require authentication via JWT token.
Base URL: `http://localhost:5000/api`

## NEW MODULES - Dashboard Summary Endpoints

### 💰 Finance Management
```
GET /api/reports/finance/summary
```
Returns: revenue, expenses, profit, pending payments (current month)

### 📦 Inventory & Stock Management
```
GET /api/reports/inventory/summary
```
Returns: totalItems, lowStock, outOfStock, totalValue

### 👥 HR & Staff Management
```
GET /api/reports/hr/summary
```
Returns: totalStaff, present, absent, onLeave (today)

### 🏢 Asset Management
```
GET /api/reports/assets/summary
```
Returns: totalAssets, inUse, maintenance, totalValue

---

## EXISTING REPORT ENDPOINTS

### Overview
- `GET /api/reports/overview` - Complete system overview

### Students
- `GET /api/reports/students/summary`
- `GET /api/reports/students/by-class`
- `GET /api/reports/students/by-gender`
- `GET /api/reports/students/by-age`

### Staff
- `GET /api/reports/staff/summary`
- `GET /api/reports/staff/by-type`
- `GET /api/reports/staff/by-role`
- `GET /api/reports/staff/by-gender`

### Academic
- `GET /api/reports/academic/class-performance`
- `GET /api/reports/academic/subject-averages`
- `GET /api/reports/academic/top-performers?limit=10`
- `GET /api/reports/academic/bottom-performers?limit=10`
- `GET /api/reports/academic/class-rankings`
- `GET /api/reports/academic/pass-fail-rates`

### Behavior/Faults
- `GET /api/reports/faults/summary`
- `GET /api/reports/faults/by-class`
- `GET /api/reports/faults/by-type`
- `GET /api/reports/faults/by-level`
- `GET /api/reports/faults/recent?days=7&limit=20`
- `GET /api/reports/faults/top-offenders?limit=10`
- `GET /api/reports/faults/trends?days=30`

### Attendance
- `GET /api/reports/attendance/summary`
- `GET /api/reports/attendance/by-class`
- `GET /api/reports/attendance/by-day`
- `GET /api/reports/attendance/trends?weeks=4`
- `GET /api/reports/attendance/absentees?limit=10`

### Evaluations
- `GET /api/reports/evaluations/summary`
- `GET /api/reports/evaluations/by-class`
- `GET /api/reports/evaluations/response-rates`

### Posts/Announcements
- `GET /api/reports/posts/summary`
- `GET /api/reports/posts/by-audience`
- `GET /api/reports/posts/recent?limit=10`

### Schedule
- `GET /api/reports/schedule/summary`
- `GET /api/reports/schedule/teacher-workload`

### Guardians
- `GET /api/reports/guardians/summary`
- `GET /api/reports/guardians/engagement`

### Activity
- `GET /api/reports/activity/recent?limit=20`

---

## FINANCE MODULE - Detailed Reports

### Financial Statements
- `GET /api/finance/reports/trial-balance?asOfDate=2026-01-31`
- `GET /api/finance/reports/income-statement?startDate=2026-01-01&endDate=2026-01-31`
- `GET /api/finance/reports/balance-sheet?asOfDate=2026-01-31`
- `GET /api/finance/reports/cash-flow?startDate=2026-01-01&endDate=2026-01-31`

### Accounts Receivable
- `GET /api/finance/reports/ar-aging`
- `GET /api/finance/reports/revenue-analysis?startDate=2026-01-01&endDate=2026-01-31&groupBy=month`

---

## Usage Example

```javascript
// Fetch all new module summaries
const [finance, inventory, hr, assets] = await Promise.all([
  api.get('/reports/finance/summary'),
  api.get('/reports/inventory/summary'),
  api.get('/reports/hr/summary'),
  api.get('/reports/assets/summary')
]);

console.log('Finance:', finance.data);
console.log('Inventory:', inventory.data);
console.log('HR:', hr.data);
console.log('Assets:', assets.data);
```
