# Test Receipt Rendering - Debug Guide

## Quick Test Steps

### Step 1: Hard Refresh
1. Close the payment details modal if open
2. Press `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
3. Wait for page to fully reload

### Step 2: Open Browser Console
1. Press `F12` to open Developer Tools
2. Go to "Console" tab
3. Keep it open

### Step 3: Open Payment Details
1. Go to Finance → Fee Payment Tracking
2. Click eye icon (👁️) on any payment
3. Modal should open

### Step 4: Check if Content Exists
In the console, type this and press Enter:
```javascript
document.getElementById('printable-receipt')
```

**Expected Result**: Should show the receipt div element
**If null**: The component didn't render properly

### Step 5: Check Content Inside
In the console, type:
```javascript
document.getElementById('printable-receipt').innerHTML.length
```

**Expected Result**: Should show a number > 1000 (means content exists)
**If 0 or small number**: Content is not rendering

### Step 6: Visual Check
Look at the modal on screen. You should see:
- Print button at top (purple)
- School name and address
- Receipt number
- Student information
- Fee information
- Payment details
- Amount breakdown
- Close button at bottom

**If you DON'T see this content on screen**, the problem is with the component rendering, not the print CSS.

## Debug: If Content Not Showing On Screen

### Check 1: Console Errors
Look in the console for red error messages. Common errors:
- `Cannot read property 'X' of undefined` - Missing payment data
- `Unexpected token` - Syntax error in JSX
- `X is not defined` - Missing variable

### Check 2: Check Payment Data
In console, type:
```javascript
// This will show if payment data exists
console.log('Payment data check')
```

### Check 3: Verify File Saved
1. Open `APP/src/PAGE/Finance/FeePaymentManagement.jsx`
2. Search for `id="printable-receipt"`
3. Should be on line ~830
4. If not found, file wasn't saved

## Debug: If Content Shows On Screen But Not in Print

### Test 1: Check Print CSS
In console while print dialog is open:
```javascript
// Check if receipt element exists
document.getElementById('printable-receipt')

// Check if it's visible
window.getComputedStyle(document.getElementById('printable-receipt')).display
```

Should return: `"block"` not `"none"`

### Test 2: Simplify Print Test
1. Open payment details
2. Press `Ctrl+P` (or `Cmd+P`) directly
3. Check print preview
4. If still blank, it's a CSS issue

### Test 3: Check Browser Print Settings
Make sure these are set:
- Background graphics: **ON**
- Paper size: **A6** or **A4** (try both)
- Margins: **Default**
- Scale: **100%**

## Alternative: Create Standalone Receipt Page

If print from modal doesn't work, we can create a separate receipt page.

Would you like me to:
1. Create a standalone receipt page (opens in new tab, easier to print)
2. Add a "Download PDF" button instead
3. Try a different print approach

## Quick Fix: Try Regular Paper Size

Instead of A6, try printing on regular A4/Letter:

1. Click print button
2. Paper size: **A4** or **Letter**
3. Check if content shows now
4. If yes, the issue is A6-specific

## Status Check

Please check and report:
- [ ] Can you see the receipt content ON SCREEN in the modal?
- [ ] What do you see in the console when you type `document.getElementById('printable-receipt')`?
- [ ] Are there any red errors in the console?
- [ ] What browser are you using?
- [ ] What happens if you try A4 paper instead of A6?

## Next Steps

Based on your answers above, I can:
1. Fix the component rendering if content not showing on screen
2. Fix the print CSS if content shows on screen but not in print
3. Create an alternative print solution
