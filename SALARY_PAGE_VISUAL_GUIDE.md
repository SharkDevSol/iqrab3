# 📍 Where to Find the Salary Management Page

## Step-by-Step Navigation

### 1. **Login to the System**
   - Use your credentials to login

### 2. **Go to Home Page**
   - After login, you'll see the main dashboard/home page

### 3. **Find HR & Staff Management Section**
   - Look for the section titled "HR & Staff Management"
   - It should have various HR-related links

### 4. **Click "💰 Salary Management"**
   - You'll see a link with the money bag emoji: **💰 Salary Management**
   - Click on it

## What You'll See

### Main Page Layout
```
┌─────────────────────────────────────────────────────────┐
│  HR & Staff Salary Management                           │
│  Manage staff salaries with tax deductions              │
│                                                          │
│  [➕ Add Salary]  ← Click this button                   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  Salary Table                                            │
├──────────┬────────┬──────────┬──────────┬──────────────┤
│ Staff    │ Staff  │ Base     │ Tax      │ Net          │
│ Name     │ Type   │ Salary   │ Amount   │ Salary       │
├──────────┼────────┼──────────┼──────────┼──────────────┤
│ John Doe │TEACHER │ $5000.00 │ $500.00  │ $4500.00    │
│          │        │          │          │              │
└──────────┴────────┴──────────┴──────────┴──────────────┘
```

### Add Salary Modal
```
┌─────────────────────────────────────────────────────────┐
│  Add Salary                                         [×]  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Staff Type *                                            │
│  [Select Staff Type ▼]                                  │
│    - Teacher                                             │
│    - Supportive                                          │
│    - Administrative                                      │
│                                                          │
│  Staff Name *                                            │
│  [Select Staff Member ▼]                                │
│                                                          │
│  Account *                                               │
│  [Select Account ▼]                                     │
│                                                          │
│  Base Salary Amount *                                    │
│  [Enter base salary]                                    │
│                                                          │
│  Tax Amount *                                            │
│  [Enter tax amount]                                     │
│                                                          │
│  ┌───────────────────────────────────────────────────┐ │
│  │  Net Salary: $4500.00                             │ │
│  └───────────────────────────────────────────────────┘ │
│                                                          │
│                          [Cancel]  [Add Salary]         │
└─────────────────────────────────────────────────────────┘
```

## Color Coding

### Staff Type Badges
- **TEACHER** - Blue badge
- **SUPPORTIVE** - Purple badge
- **ADMINISTRATIVE** - Orange badge

### Amounts
- **Base Salary** - Normal black text
- **Tax Amount** - Red text (deduction)
- **Net Salary** - Green bold text (final amount)

## Quick Actions

1. **Add Salary**: Click the "➕ Add Salary" button at the top
2. **View Details**: All salaries are displayed in the table below
3. **Filter by Type**: Select staff type in the modal to see only relevant staff

## Example Workflow

```
User clicks "Add Salary"
    ↓
Selects "TEACHER" from Staff Type dropdown
    ↓
System shows only teachers in Staff Name dropdown
    ↓
User selects "John Doe (T001)"
    ↓
User selects "Salary Expense" account
    ↓
User enters Base Salary: 5000
    ↓
User enters Tax Amount: 500
    ↓
System shows Net Salary: 4500 (automatically calculated)
    ↓
User clicks "Add Salary"
    ↓
Success! Salary appears in the table
```

## Troubleshooting

### Can't see the Salary Management link?
- Make sure you're logged in
- Check if you have HR permissions
- Refresh the home page

### Modal not opening?
- Check browser console for errors
- Make sure frontend is running
- Clear browser cache

### Can't see staff in dropdown?
- Make sure staff type is selected first
- Check if staff exist in the system
- Verify backend is running

### Salary not saving?
- Check all required fields are filled
- Verify backend server is running on port 5000
- Check browser console for error messages

---

**Need Help?**
- Backend must be running: `npm run dev` in backend folder
- Frontend must be running: `npm run dev` in APP folder
- Check console logs for any errors
