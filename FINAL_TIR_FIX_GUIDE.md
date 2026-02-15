# 🎯 FINAL TIR FIX GUIDE

## Run This Now

### Option 1: One-Click Fix (Recommended)

**Double-click this file:**
```
DIAGNOSE_AND_FIX.bat
```

This will:
1. Show ALL invoices and their current late fees
2. Force fix ALL invoices including Tir
3. Show you exactly what was fixed

### Option 2: Manual Commands

```bash
cd backend

# Step 1: See what's wrong
node scripts/show-all-invoices.js

# Step 2: Fix everything
node scripts/force-fix-all-invoices.js
```

---

## What to Look For in the Output

### Step 1 Output (show-all-invoices.js)

You should see something like:

```
📋 Showing ALL Invoices...

Total unpaid invoices: 30

Active Late Fee Rules: 2
  - First Late Fee: 50 Birr after 15 days
  - Second Late Fee: 80 Birr after 20 days

═══════════════════════════════════════════════════════════════
INVOICE DETAILS
═══════════════════════════════════════════════════════════════

1. Meskerem (Month 1)
   Invoice: INV-...-M1
   Due Date: 2025-10-01 (127 days overdue)
   Total Amount: 1200 Birr
   Current Late Fee: 130 Birr
   Should Be Late Fee: 130 Birr
   ✅ Late fee is correct

2. Tikimt (Month 2)
   Invoice: INV-...-M2
   Due Date: 2025-10-31 (97 days overdue)
   Current Late Fee: 130 Birr
   Should Be Late Fee: 130 Birr
   ✅ Late fee is correct

...

5. Tir (Month 5)
   Invoice: INV-...-M5
   Due Date: 2026-01-29 (7 days overdue)
   Current Late Fee: 0 Birr
   Should Be Late Fee: 0 Birr
   ⏳ Within grace period

🎯 TIR MONTH INVOICES FOUND:

Invoice: INV-...-M5
  Student: 00000000-0000-0000-0004-000000000001
  Due Date: 2026-01-29
  Days Past Due: 7
  Current Late Fee: 0 Birr
  Balance: 1200 Birr
  Status: ISSUED
```

**KEY THINGS TO CHECK:**
- Is Tir invoice found? (Should say "TIR MONTH INVOICES FOUND")
- What is "Days Past Due"? (If less than 15, it's within grace period)
- What is "Current Late Fee"?
- What is "Should Be Late Fee"?

### Step 2 Output (force-fix-all-invoices.js)

You should see:

```
🔧 FORCE FIXING ALL INVOICES...

✓ Found 2 active late fee rules:
  - First Late Fee: 50 Birr after 15 days
  - Second Late Fee: 80 Birr after 20 days

✓ Found 30 unpaid invoices

Processing each invoice...

Meskerem (M1) - INV-...-M1
  Days past due: 127
  Current late fee: 130 Birr
  Should be: 130 Birr
  ✅ Already correct

...

Tir (M5) - INV-...-M5
  Days past due: 7
  ⏳ Within grace period (no late fee yet)

═══════════════════════════════════════════════════════════════
SUMMARY
═══════════════════════════════════════════════════════════════
✅ Fixed: 0 invoices
⏭️  Already correct: 12 invoices
⏳ Within grace period: 3 invoices
📅 Not yet due: 15 invoices
📋 Total processed: 30 invoices
═══════════════════════════════════════════════════════════════
```

---

## Understanding the Results

### Case 1: Tir is Within Grace Period

If you see:
```
Tir (M5) - INV-...-M5
  Days past due: 7
  ⏳ Within grace period (no late fee yet)
```

**This is CORRECT!** Tir doesn't have a late fee yet because:
- It's only 7 days overdue
- Your grace period is 15 days
- Late fee will apply after day 15

**This is NOT a bug!** The system is working correctly.

### Case 2: Tir Should Have Late Fee But Doesn't

If you see:
```
Tir (M5) - INV-...-M5
  Days past due: 25
  Current late fee: 0 Birr
  Should be: 130 Birr
  🔧 FIXED! Updated from 0 to 130 Birr
```

**This means it was fixed!** The script updated Tir to have the correct late fee.

### Case 3: Tir Not Found

If you see:
```
❌ NO TIR MONTH INVOICES FOUND!
```

**This means:**
- Tir invoice doesn't exist yet
- Or it's already paid
- Or it has different metadata

---

## After Running the Scripts

1. **Check the output** - Did it say "FIXED" for Tir?
2. **Refresh browser** - Press Ctrl+F5 (hard refresh)
3. **Clear cache** - If needed, clear browser cache
4. **Check in UI**:
   - Go to Finance → Monthly Payments
   - Select your class
   - Click on a student
   - Find Tir month
   - Check the balance

---

## Expected Behavior

### If Tir is 7 days overdue (within 15-day grace period):
- **Balance should be**: 1200 Birr (NO late fee yet)
- **This is CORRECT!**

### If Tir is 16-20 days overdue:
- **Balance should be**: 1250 Birr (1200 + 50 first late fee)
- **This is CORRECT!**

### If Tir is 21+ days overdue:
- **Balance should be**: 1330 Birr (1200 + 50 + 80 both late fees)
- **This is CORRECT!**

---

## Troubleshooting

### Issue: Script says "Within grace period"

**This is NOT a bug!** Your Tir invoice is not yet past the grace period.

**Check:**
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
      console.log('Tir Invoice Due Date:', tir.dueDate);
      console.log('Today:', today.toISOString().split('T')[0]);
      console.log('Days Past Due:', daysPastDue);
      console.log('');
      console.log('Grace Period: 15 days');
      console.log('Late fee applies after:', daysPastDue > 15 ? 'YES' : 'NO');
    }
    process.exit(0);
  });
"
```

### Issue: Script says "Already correct" but UI shows 1200

**Solution:**
1. Hard refresh browser (Ctrl+F5)
2. Clear browser cache completely
3. Close and reopen browser
4. Check if you're looking at the right student

### Issue: Tir not found

**Solution:**
```bash
cd backend
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.invoice.findMany()
  .then(invoices => {
    console.log('All invoice numbers:');
    invoices.forEach(inv => {
      const metadata = inv.metadata || {};
      console.log(\`- \${inv.invoiceNumber}: month = \${metadata.month}, monthNumber = \${metadata.monthNumber}\`);
    });
    process.exit(0);
  });
"
```

---

## Manual Database Check

If scripts don't work, check the database directly:

```bash
cd backend
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const invoices = await prisma.invoice.findMany({
    where: {
      status: { in: ['ISSUED', 'PARTIALLY_PAID', 'OVERDUE'] }
    }
  });
  
  console.log('All Unpaid Invoices:\n');
  invoices.forEach(inv => {
    const metadata = inv.metadata || {};
    const month = metadata.month || 'Unknown';
    const balance = parseFloat(inv.netAmount) - parseFloat(inv.paidAmount);
    console.log(\`\${month}: Late Fee = \${inv.lateFeeAmount} Birr, Balance = \${balance} Birr\`);
  });
  
  process.exit(0);
}

check();
"
```

---

## What to Share If Still Not Working

Please run the diagnostic script and share the output:

```bash
cd backend
node scripts/show-all-invoices.js > output.txt
```

Then share the `output.txt` file or copy the output here.

Specifically, I need to see:
1. The "TIR MONTH INVOICES FOUND" section
2. Days Past Due for Tir
3. Current Late Fee vs Should Be Late Fee
4. Whether it says "Within grace period" or "MISMATCH"

---

## Quick Commands

### Show all invoices
```bash
cd backend
node scripts/show-all-invoices.js
```

### Force fix all
```bash
cd backend
node scripts/force-fix-all-invoices.js
```

### Check Tir specifically
```bash
cd backend
node scripts/debug-tir-invoice.js
```

---

Run the scripts and share the output if it still doesn't work! 🔧
