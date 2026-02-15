# 🎯 Setup Database - Final Step!

## Great Progress! 🎉

You're almost there! The error shows:
```
Cannot read properties of undefined (reading 'findMany')
```

This means:
- ✅ Backend is running
- ✅ Routes are working
- ✅ Authentication is working
- ⏳ Database tables don't exist yet

## Quick Setup (3 Steps)

### Step 1: Add Schema to Prisma (2 minutes)

1. Open `backend/prisma/schema.prisma`
2. Scroll to the **very end** of the file
3. Copy **ALL** the content from `backend/prisma/schema-hr-salary.prisma`
4. Paste it at the end of `backend/prisma/schema.prisma`
5. Save the file

### Step 2: Run Migration (1 minute)

Open a **NEW** terminal (keep the server running in the other one):

```powershell
cd backend
npx prisma migrate dev --name add_hr_salary_management
```

Wait for it to complete. You should see:
```
✔ Generated Prisma Client
```

### Step 3: Generate Prisma Client (30 seconds)

```powershell
npx prisma generate
```

### Step 4: Restart Backend

Go back to your server terminal and press `Ctrl + C`, then:

```powershell
npm start
```

### Step 5: Setup Default Data (Optional but Recommended)

```powershell
node backend/scripts/setup-hr-salary-defaults.js
```

This creates:
- Default deduction types (Tax, Pension, Service, Credit)
- Default allowance types (Housing, Transport, Medical, Food)
- Default retention benefit types (Tuition Waiver, Merit Pay)
- 3 sample staff members for testing

### Step 6: Test!

1. Refresh your browser
2. Navigate to: **HR & Staff Management → 💰 Salary Management**
3. You should see the page load successfully!

## What to Copy

Open `backend/prisma/schema-hr-salary.prisma` and copy **EVERYTHING** from this file.

It contains:
- Staff model
- Salary model
- DeductionType model
- StaffDeduction model
- AllowanceType model
- StaffAllowance model
- RetentionBenefitType model
- StaffRetention model
- All enums (StaffType, Gender, ContractType, etc.)

## Where to Paste

Open `backend/prisma/schema.prisma` and scroll to the **very bottom**.

Paste the copied content **after** all existing models.

## Verification

After running the migration, check if it worked:

```powershell
# In backend folder
npx prisma studio
```

This opens Prisma Studio in your browser. You should see the new tables:
- Staff
- Salary
- DeductionType
- StaffDeduction
- AllowanceType
- StaffAllowance
- RetentionBenefitType
- StaffRetention

## Common Issues

### Issue: Migration fails with "relation already exists"
**Solution:** Some tables might already exist. That's okay, the migration will skip them.

### Issue: "Prisma Client not generated"
**Solution:** Run `npx prisma generate` again.

### Issue: Still getting 500 error after migration
**Solution:** 
1. Make sure you restarted the backend server
2. Check if the schema was actually added to schema.prisma
3. Run `npx prisma generate` again

## Quick Commands

```powershell
# Add schema (manual - copy/paste in editor)

# Run migration
npx prisma migrate dev --name add_hr_salary_management

# Generate client
npx prisma generate

# Setup defaults
node backend/scripts/setup-hr-salary-defaults.js

# Restart server
npm start

# Open Prisma Studio (to verify tables)
npx prisma studio
```

## After Setup

Once everything is set up, you should be able to:

1. ✅ View the salary management page without errors
2. ✅ See empty staff list (or 3 sample staff if you ran the setup script)
3. ✅ Click action buttons to open modals
4. ✅ Add salaries, deductions, allowances, and retention benefits

## Visual Progress

```
Before:
❌ 404 Error → Routes don't exist
   ↓ (Restart backend)
✅ 403 Error → Token issue
   ↓ (Fix token key)
✅ 500 Error → Database tables don't exist
   ↓ (Add schema + migrate)
✅ 200 Success → Everything works!
```

You're at the last step! 🎯

## Summary

**Right Now:**
1. Open `backend/prisma/schema.prisma`
2. Copy content from `backend/prisma/schema-hr-salary.prisma`
3. Paste at the end of `schema.prisma`
4. Save
5. Run: `npx prisma migrate dev --name add_hr_salary_management`
6. Run: `npx prisma generate`
7. Restart backend: `npm start`
8. Refresh browser
9. Test!

---

**Do this now and your salary management system will be fully functional!** 🚀
