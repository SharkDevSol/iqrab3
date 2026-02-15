# Automatic Due Date Update Guide

## ✅ What's New

### 1. Automatic Due Date Recalculation
When you change the grace period in a late fee rule, **all invoice due dates are automatically updated**.

**Example:**
- You have 30 invoices with due dates based on 20-day grace period
- You change the grace period to 15 days
- System automatically recalculates all 30 invoice due dates
- No manual script needed!

### 2. Multiple Due Dates Display
When you have **2 active late fee rules**, the system shows **both due dates** in the invoice table.

**Example:**
- Rule 1: 15 days grace period, +$50 penalty
- Rule 2: 20 days grace period, +$70 penalty

**Display:**
```
Due Date:
  5/16/2018 (Tir) (late: +50 Birr)
  1/23/2026

  5/21/2018 (Tir) (I: +70 Birr)
  1/28/2026
```

## 🎯 How It Works

### Changing Grace Period
1. Go to **Finance → Monthly Payment Settings → Late Fee Rules**
2. Click on a late fee rule to edit
3. Change the **Grace Period** value
4. Click **Save**
5. ✅ System automatically updates all invoice due dates!

### Viewing Multiple Due Dates
1. Go to **Finance → Monthly Payments**
2. Select a class and student
3. View **Invoice Breakdown by Month** table
4. If you have 2 active late fee rules, you'll see:
   - **First due date** (earliest grace period) - shown in bold
   - **Second due date** (longer grace period) - shown below
   - Each with the penalty amount

## 📋 Current Setup

### Your Active Late Fee Rules:
1. **Rule "I"**: 20 days grace period, $70 penalty - **Active**
2. **Rule "late"**: 15 days grace period, $50 penalty - **Inactive**

### Current Due Dates (Based on 20-day grace period):
- Meskerem: 1/21/2018 (September 30, 2025)
- Tikimt: 2/21/2018 (October 30, 2025)
- Hidar: 3/21/2018 (November 29, 2025)
- Tahsas: 4/21/2018 (December 29, 2025)
- Tir: 5/21/2018 (January 28, 2026)
- Yekatit: 6/21/2018 (February 27, 2026)

## 🔄 To Switch to 15-Day Grace Period

### Option 1: Activate the "late" rule
1. Go to **Finance → Monthly Payment Settings → Late Fee Rules**
2. Toggle **ON** the "late" rule (15 days)
3. ✅ Due dates automatically update to 15-day grace period
4. Now you'll see **both due dates** (15 days and 20 days)

### Option 2: Edit the "I" rule
1. Go to **Finance → Monthly Payment Settings → Late Fee Rules**
2. Click on rule "I"
3. Change grace period from **20 days** to **15 days**
4. Click **Save**
5. ✅ Due dates automatically update to 15-day grace period

## 📊 Expected Results After Switching to 15 Days

### New Due Dates:
- Meskerem: 1/16/2018 (September 25, 2025)
- Tikimt: 2/16/2018 (October 25, 2025)
- Hidar: 3/16/2018 (November 24, 2025)
- Tahsas: 4/16/2018 (December 24, 2025)
- Tir: 5/16/2018 (January 23, 2026) ← **12 days overdue today**
- Yekatit: 6/16/2018 (February 22, 2026)

### Late Fee Application:
- Tir month will now show late fee because it's 12 days overdue
- All months before Tir will also show late fees

## 🎨 UI Features

### Due Date Display:
- **Ethiopian calendar** shown on top (larger font)
- **Gregorian calendar** shown below (smaller, gray)
- **Multiple due dates** shown when 2 rules are active
- **Penalty amounts** shown next to each due date

### Color Coding:
- 🟢 **Green**: Paid
- 🔴 **Red**: Overdue
- 🔵 **Blue**: Pending (not yet due)
- 🟡 **Yellow**: Partially paid

## ⚠️ Important Notes

1. **Maximum 2 late fee rules**: System allows maximum 2 active late fee rules
2. **Cumulative penalties**: Both penalties apply cumulatively after their respective due dates
3. **Automatic updates**: No need to run scripts manually - everything updates automatically
4. **Real-time display**: Refresh browser to see updated due dates

## 🚀 Quick Actions

### To see both due dates right now:
```bash
# Activate the "late" rule (15 days)
1. Go to Finance → Monthly Payment Settings → Late Fee Rules
2. Toggle ON the "late" rule
3. Refresh browser
4. View student invoices - you'll see both due dates!
```

### To switch to 15-day grace period only:
```bash
# Deactivate the "I" rule and activate "late" rule
1. Go to Finance → Monthly Payment Settings → Late Fee Rules
2. Toggle OFF the "I" rule (20 days)
3. Toggle ON the "late" rule (15 days)
4. Refresh browser
5. All due dates now use 15-day grace period
```

## ✅ Summary

- ✅ Automatic due date recalculation when grace period changes
- ✅ Multiple due dates display when 2 rules are active
- ✅ Ethiopian calendar format with Gregorian below
- ✅ Penalty amounts shown next to each due date
- ✅ No manual scripts needed - everything is automatic!
