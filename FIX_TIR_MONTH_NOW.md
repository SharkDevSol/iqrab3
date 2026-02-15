# 🔧 Fix Tir Month Now

## Quick Fix for Tir Month Late Fee

### Step 1: Debug Tir Invoice

Run this to see what's wrong with Tir:

```bash
cd backend
node scripts/debug-tir-invoice.js
```

This will show you:
- Current late fee on Tir invoice
- What the late fee SHOULD be
- Why it's different
- Automatically fix it if there's a mismatch

### Step 2: Force Fix Tir Invoice

If the debug script doesn't fix it, run this:

```bash
cd backend
node scripts/fix-tir-now.js
```

This will:
- Find ALL Tir invoices
- Calculate correct late fee
- Update the invoice
- Show confirmation

### Step 3: Verify in UI

1. Go to Finance → Monthly Payments
2. Select your class
3. Click on a student
4. Find Tir month
5. Should now show correct balance with late fee

---

## Expected Output

### Debug Script Output:
```
🔍 Debugging Tir Month Invoice...

Found 1 Tir month invoices

Active Late Fee Rules: 2
  - First Late Fee: 50 Birr after 15 days
  - Second Late Fee: 80 Birr after 20 days

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Invoice: INV-1770281937186-41-M5
Student ID: 00000000-0000-0000-0004-000000000001
Status: OVERDUE
Due Date: 2026-01-29
Days Past Due: 7

Current Amounts:
  Total Amount: 1200 Birr
  Discount: 0 Birr
  Late Fee: 0 Birr
  Net Amount: 1200 Birr
  Paid Amount: 0 Birr
  Balance: 1200 Birr

Invoice Items:
  - Tir Monthly Fee (Month 5 of 12): 1200 Birr

Calculated Late Fee:
  Within grace period (no late fee yet)

📅 Not yet due (7 days until due date)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Diagnostic complete!
```

OR if there's a mismatch:

```
⚠️  MISMATCH DETECTED!
   Current late fee: 0 Birr
   Should be: 130 Birr
   Difference: 130 Birr

🔧 Fixing now...
✅ Fixed! Late fee updated to 130 Birr
```

### Fix Script Output:
```
🔧 Fixing Tir Month Invoice...

✓ Found 2 active late fee rules

✓ Found 30 total invoices

✓ Found 1 Tir invoices

Invoice: INV-1770281937186-41-M5
  Days past due: 25
  Current late fee: 0 Birr
  Should be: 130 Birr
    - First Late Fee: +50 Birr
    - Second Late Fee: +80 Birr
  ✅ FIXED! Updated to 130 Birr

✅ Done! Fixed 1 Tir invoices

Please refresh the Monthly Payments page to see the changes.
```

---

## Troubleshooting

### Issue: "No Tir invoices found"

**Possible Causes**:
1. Tir invoice doesn't exist yet
2. Tir invoice has different metadata format
3. Tir invoice is already paid

**Solution**:
```bash
# Check all invoices
cd backend
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.invoice.findMany({ take: 20 })
  .then(invoices => {
    console.log('All invoices:');
    invoices.forEach(inv => {
      console.log(\`- \${inv.invoiceNumber}: metadata =\`, inv.metadata);
    });
    process.exit(0);
  });
"
```

### Issue: "Within grace period"

This means Tir invoice is not yet past the grace period.

**Check due date**:
```bash
cd backend
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.invoice.findMany()
  .then(invoices => {
    const tir = invoices.find(inv => 
      inv.metadata?.month === 'Tir' || 
      inv.invoiceNumber.includes('-M5')
    );
    if (tir) {
      const today = new Date();
      const dueDate = new Date(tir.dueDate);
      const daysPastDue = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
      console.log('Tir Invoice:');
      console.log('  Invoice Number:', tir.invoiceNumber);
      console.log('  Due Date:', tir.dueDate);
      console.log('  Days Past Due:', daysPastDue);
      console.log('  Status:', tir.status);
      console.log('  Late Fee:', tir.lateFeeAmount, 'Birr');
    } else {
      console.log('Tir invoice not found');
    }
    process.exit(0);
  });
"
```

### Issue: Script runs but UI still shows 1200 Birr

**Solution**:
1. Hard refresh browser (Ctrl+F5)
2. Clear browser cache
3. Check if you're looking at the right student
4. Run the script again

---

## Manual Fix (If Scripts Don't Work)

If the scripts don't work, you can manually update the database:

```bash
cd backend
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function manualFix() {
  // Find Tir invoice
  const invoices = await prisma.invoice.findMany();
  const tir = invoices.find(inv => 
    inv.metadata?.month === 'Tir' || 
    inv.invoiceNumber.includes('-M5')
  );
  
  if (!tir) {
    console.log('Tir invoice not found');
    process.exit(1);
  }
  
  console.log('Found Tir invoice:', tir.invoiceNumber);
  
  // Update with late fee (adjust amount as needed)
  const lateFee = 130; // 50 + 80 from both rules
  const newNetAmount = parseFloat(tir.totalAmount) + lateFee - parseFloat(tir.discountAmount);
  
  await prisma.invoice.update({
    where: { id: tir.id },
    data: {
      lateFeeAmount: lateFee,
      netAmount: newNetAmount,
      status: 'OVERDUE'
    }
  });
  
  console.log('✅ Updated Tir invoice');
  console.log('  Late Fee:', lateFee, 'Birr');
  console.log('  Net Amount:', newNetAmount, 'Birr');
  process.exit(0);
}

manualFix();
"
```

---

## Check Current State

Before running the fix, check the current state:

```bash
cd backend
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkState() {
  const invoices = await prisma.invoice.findMany({
    where: {
      status: { in: ['ISSUED', 'PARTIALLY_PAID', 'OVERDUE'] }
    }
  });
  
  console.log('All Unpaid Invoices:');
  invoices.forEach(inv => {
    const metadata = inv.metadata || {};
    const month = metadata.month || 'Unknown';
    const monthNum = metadata.monthNumber || '?';
    console.log(\`\${month} (M\${monthNum}): Late Fee = \${inv.lateFeeAmount} Birr, Balance = \${parseFloat(inv.netAmount) - parseFloat(inv.paidAmount)} Birr\`);
  });
  
  process.exit(0);
}

checkState();
"
```

---

## Quick Commands

### Debug Tir
```bash
cd backend
node scripts/debug-tir-invoice.js
```

### Fix Tir
```bash
cd backend
node scripts/fix-tir-now.js
```

### Check All Late Fees
```bash
cd backend
node scripts/apply-late-fees-now.js
```

---

## What to Expect

After running the fix script:
- Tir invoice should have late fee added
- Balance should increase from 1200 Birr to 1330 Birr (or 1250 Birr depending on days overdue)
- Status should change to OVERDUE
- UI should show updated balance after refresh

---

Run the debug script first to see what's happening, then run the fix script if needed! 🔧
