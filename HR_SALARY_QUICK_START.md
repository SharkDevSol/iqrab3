# HR Salary Management - Quick Start Guide

## 🚀 Quick Setup (5 Minutes)

### Step 1: Update Database Schema

Add this to your `backend/prisma/schema.prisma` file (at the end):

```prisma
// HR & Staff Salary Management
model Staff {
  id                String   @id @default(uuid()) @db.Uuid
  employeeNumber    String   @unique
  firstName         String
  lastName          String
  email             String   @unique
  phone             String
  staffType         StaffType
  dateOfBirth       DateTime @db.Date
  gender            Gender
  address           String?
  emergencyContact  Json?
  hireDate          DateTime @db.Date
  contractType      ContractType
  status            StaffStatus @default(ACTIVE)
  profilePhotoUrl   String?
  createdAt         DateTime @default(now()) @db.Timestamptz
  updatedAt         DateTime @updatedAt @db.Timestamptz

  salaries          Salary[]
  deductions        StaffDeduction[]
  allowances        StaffAllowance[]
  retentionBenefits StaffRetention[]

  @@index([employeeNumber])
  @@index([staffType])
  @@index([status])
}

enum StaffType {
  TEACHER
  SUPPORTIVE
  ADMINISTRATIVE
}

enum Gender {
  MALE
  FEMALE
  OTHER
}

enum ContractType {
  PERMANENT
  CONTRACT
  PART_TIME
  TEMPORARY
}

enum StaffStatus {
  ACTIVE
  ON_LEAVE
  SUSPENDED
  EXITED
}

model Salary {
  id              String   @id @default(uuid()) @db.Uuid
  staffId         String   @db.Uuid
  accountId       String   @db.Uuid
  baseSalary      Decimal  @db.Decimal(15, 2)
  effectiveFrom   DateTime @db.Date
  effectiveTo     DateTime? @db.Date
  isActive        Boolean  @default(true)
  notes           String?
  createdAt       DateTime @default(now()) @db.Timestamptz
  updatedAt       DateTime @updatedAt @db.Timestamptz

  staff           Staff    @relation(fields: [staffId], references: [id], onDelete: Cascade)
  account         Account  @relation(fields: [accountId], references: [id])

  @@index([staffId])
  @@index([isActive])
}

model DeductionType {
  id              String   @id @default(uuid()) @db.Uuid
  name            String   @unique
  description     String?
  calculationType CalculationType
  defaultValue    Decimal  @db.Decimal(15, 2)
  accountId       String   @db.Uuid
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now()) @db.Timestamptz
  updatedAt       DateTime @updatedAt @db.Timestamptz

  account         Account  @relation(fields: [accountId], references: [id])
  staffDeductions StaffDeduction[]

  @@index([name])
  @@index([isActive])
}

model StaffDeduction {
  id              String   @id @default(uuid()) @db.Uuid
  staffId         String   @db.Uuid
  deductionTypeId String   @db.Uuid
  amount          Decimal  @db.Decimal(15, 2)
  calculationType CalculationType
  effectiveFrom   DateTime @db.Date
  effectiveTo     DateTime? @db.Date
  isActive        Boolean  @default(true)
  notes           String?
  createdAt       DateTime @default(now()) @db.Timestamptz
  updatedAt       DateTime @updatedAt @db.Timestamptz

  staff           Staff          @relation(fields: [staffId], references: [id], onDelete: Cascade)
  deductionType   DeductionType  @relation(fields: [deductionTypeId], references: [id])

  @@index([staffId])
  @@index([deductionTypeId])
  @@index([isActive])
}

model AllowanceType {
  id              String   @id @default(uuid()) @db.Uuid
  name            String   @unique
  description     String?
  calculationType CalculationType
  defaultValue    Decimal  @db.Decimal(15, 2)
  accountId       String   @db.Uuid
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now()) @db.Timestamptz
  updatedAt       DateTime @updatedAt @db.Timestamptz

  account         Account  @relation(fields: [accountId], references: [id])
  staffAllowances StaffAllowance[]

  @@index([name])
  @@index([isActive])
}

model StaffAllowance {
  id              String   @id @default(uuid()) @db.Uuid
  staffId         String   @db.Uuid
  allowanceTypeId String   @db.Uuid
  amount          Decimal  @db.Decimal(15, 2)
  calculationType CalculationType
  effectiveFrom   DateTime @db.Date
  effectiveTo     DateTime? @db.Date
  isActive        Boolean  @default(true)
  notes           String?
  createdAt       DateTime @default(now()) @db.Timestamptz
  updatedAt       DateTime @updatedAt @db.Timestamptz

  staff           Staff          @relation(fields: [staffId], references: [id], onDelete: Cascade)
  allowanceType   AllowanceType  @relation(fields: [allowanceTypeId], references: [id])

  @@index([staffId])
  @@index([allowanceTypeId])
  @@index([isActive])
}

model RetentionBenefitType {
  id              String   @id @default(uuid()) @db.Uuid
  name            String   @unique
  type            RetentionType
  description     String?
  calculationType CalculationType
  defaultValue    Decimal  @db.Decimal(15, 2)
  accountId       String   @db.Uuid
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now()) @db.Timestamptz
  updatedAt       DateTime @updatedAt @db.Timestamptz

  account         Account  @relation(fields: [accountId], references: [id])
  staffRetentions StaffRetention[]

  @@index([name])
  @@index([type])
  @@index([isActive])
}

enum RetentionType {
  TUITION_WAIVER
  MERIT_PAY
}

model StaffRetention {
  id                      String   @id @default(uuid()) @db.Uuid
  staffId                 String   @db.Uuid
  retentionBenefitTypeId  String   @db.Uuid
  amount                  Decimal  @db.Decimal(15, 2)
  calculationType         CalculationType
  effectiveFrom           DateTime @db.Date
  effectiveTo             DateTime? @db.Date
  isActive                Boolean  @default(true)
  notes                   String?
  createdAt               DateTime @default(now()) @db.Timestamptz
  updatedAt               DateTime @updatedAt @db.Timestamptz

  staff                   Staff                  @relation(fields: [staffId], references: [id], onDelete: Cascade)
  retentionBenefitType    RetentionBenefitType   @relation(fields: [retentionBenefitTypeId], references: [id])

  @@index([staffId])
  @@index([retentionBenefitTypeId])
  @@index([isActive])
}
```

### Step 2: Run Migration

```bash
cd backend
npx prisma migrate dev --name add_hr_salary_management
npx prisma generate
```

### Step 3: Setup Default Data

Create `backend/scripts/setup-hr-salary-defaults.js`:

```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function setup() {
  try {
    // Create default account for salary
    let salaryAccount = await prisma.account.upsert({
      where: { code: '5100' },
      update: {},
      create: {
        code: '5100',
        name: 'Staff Salaries',
        type: 'EXPENSE'
      }
    });

    // Create deduction types
    const deductions = [
      { name: 'Tax', description: 'Income Tax', defaultValue: 15 },
      { name: 'Pension', description: 'Pension Fund', defaultValue: 7 },
      { name: 'Service', description: 'Service Charge', defaultValue: 2 },
      { name: 'Credit', description: 'Loan/Credit', defaultValue: 0 }
    ];

    for (const d of deductions) {
      await prisma.deductionType.upsert({
        where: { name: d.name },
        update: {},
        create: {
          ...d,
          calculationType: 'PERCENTAGE',
          accountId: salaryAccount.id
        }
      });
    }

    // Create allowance types
    const allowances = [
      { name: 'Housing Allowance', defaultValue: 500 },
      { name: 'Transport Allowance', defaultValue: 200 },
      { name: 'Medical Allowance', defaultValue: 150 }
    ];

    for (const a of allowances) {
      await prisma.allowanceType.upsert({
        where: { name: a.name },
        update: {},
        create: {
          ...a,
          calculationType: 'FIXED',
          accountId: salaryAccount.id
        }
      });
    }

    // Create retention benefit types
    await prisma.retentionBenefitType.upsert({
      where: { name: 'Tuition Waiver' },
      update: {},
      create: {
        name: 'Tuition Waiver',
        type: 'TUITION_WAIVER',
        description: 'Tuition fee waiver for staff children',
        calculationType: 'FIXED',
        defaultValue: 1000,
        accountId: salaryAccount.id
      }
    });

    await prisma.retentionBenefitType.upsert({
      where: { name: 'Merit Pay' },
      update: {},
      create: {
        name: 'Merit Pay',
        type: 'MERIT_PAY',
        description: 'Performance-based merit pay',
        calculationType: 'PERCENTAGE',
        defaultValue: 10,
        accountId: salaryAccount.id
      }
    });

    console.log('✅ HR Salary defaults created successfully!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setup();
```

Run it:
```bash
node backend/scripts/setup-hr-salary-defaults.js
```

### Step 4: Restart Backend

```bash
cd backend
npm start
```

### Step 5: Add Route to Frontend

Add to your `APP/src/App.jsx` or routing file:

```jsx
import SalaryManagement from './PAGE/HR/SalaryManagement';

// In your routes:
<Route path="/hr/salary" element={<SalaryManagement />} />
```

### Step 6: Add Menu Item

Add to your navigation menu:

```jsx
<Link to="/hr/salary">
  💰 Salary Management
</Link>
```

## 📋 Usage

### 1. Add Staff Member

First, create staff members through your existing staff management or use the API:

```javascript
POST /api/hr/salary/staff
{
  "employeeNumber": "EMP001",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@school.com",
  "phone": "1234567890",
  "staffType": "TEACHER",
  "dateOfBirth": "1990-01-01",
  "gender": "MALE",
  "hireDate": "2024-01-01",
  "contractType": "PERMANENT"
}
```

### 2. Add Salary

Click the 💰 button next to a staff member to add their base salary.

### 3. Add Deductions

Click the ➖ button to add deductions (Tax, Pension, Service, Credit).

### 4. Add Allowances

Click the ➕ button to add allowances (Housing, Transport, Medical, etc.).

### 5. Add Retention Benefits

Click the 🎁 button to add retention benefits (Tuition Waiver, Merit Pay).

### 6. View Details

Click the 👁️ button to see complete salary breakdown.

## 🎯 Features

✅ Staff type selection (Teacher, Supportive, Administrative)
✅ Base salary with account tracking
✅ Deductions: Tax, Pension, Service, Credit
✅ Custom allowances with name and amount
✅ Retention benefits: Tuition Waivers and Merit Pay
✅ Fixed amount or percentage calculations
✅ Real-time net salary calculation
✅ Effective date management
✅ Complete salary history

## 🔧 API Endpoints

All endpoints are under `/api/hr/salary/`

- Staff: `/staff`, `/staff/:id`
- Salary: `/staff/:staffId/salary`
- Deductions: `/staff/:staffId/deductions`
- Allowances: `/staff/:staffId/allowances`
- Retention: `/staff/:staffId/retention-benefits`
- Summary: `/staff/:staffId/salary-summary`

## 📊 Calculation Formula

```
Net Salary = Base Salary + Allowances + Retention Benefits - Deductions

Where:
- Fixed amounts are added/subtracted directly
- Percentage amounts are calculated from base salary
```

## 🎨 Customization

You can customize:
- Deduction types and default values
- Allowance types and amounts
- Retention benefit types
- Staff types (edit enum in schema)
- Calculation methods (fixed vs percentage)

## 🐛 Troubleshooting

**Issue**: Migration fails
**Solution**: Make sure PostgreSQL is running and DATABASE_URL is correct

**Issue**: Can't see staff
**Solution**: Create staff members first using the API or existing staff management

**Issue**: Calculations are wrong
**Solution**: Check if amounts are set correctly and calculation type (FIXED vs PERCENTAGE)

## 📚 Next Steps

1. Create remaining modal components (see HR_SALARY_MANAGEMENT_IMPLEMENTATION.md)
2. Add CSS styling (see example in implementation guide)
3. Add validation and error handling
4. Integrate with payroll processing
5. Add reporting features

## 🎉 You're Done!

Your HR Salary Management system is now ready to use!

Navigate to `/hr/salary` in your app to start managing staff salaries.
