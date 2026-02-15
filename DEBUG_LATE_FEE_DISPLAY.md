# 🐛 Debug: Why Both Due Dates Aren't Showing

## Issue
Both due dates are not displaying in the invoice table even though 2 late fee rules are active.

## Possible Causes

### 1. Frontend Not Reloaded
**Solution:** Hard refresh the browser
- Windows: `Ctrl + Shift + R` or `Ctrl + F5`
- Mac: `Cmd + Shift + R`

### 2. React App Not Running
**Check:** Is the React development server running?
```bash
# In APP folder, run:
npm run dev
```

### 3. Late Fee Rules Not Fetching
**Reason:** The API endpoint requires authentication

**Debug Steps:**
1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Look for errors like "Access token required" or "401 Unauthorized"
4. Check Network tab for `/api/finance/late-fee-rules` request

### 4. Component State Not Updating
**Check:** Add this temporarily to see the state:

In `MonthlyPaymentsNew.jsx`, add after line 24:
```javascript
useEffect(() => {
  console.log('Late Fee Rules State:', lateFeeRules);
}, [lateFeeRules]);
```

## Quick Fix: Add Debug Display

Add this code temporarily in the component to see what's happening:

```javascript
// Add this right before the invoice table
{lateFeeRules.length > 0 && (
  <div style={{ padding: '10px', background: '#f0f0f0', margin: '10px 0' }}>
    <strong>Debug: Active Late Fee Rules ({lateFeeRules.length}):</strong>
    {lateFeeRules.map((rule, idx) => (
      <div key={idx}>
        {idx + 1}. {rule.name}: {rule.gracePeriodDays} days, ${rule.value}
      </div>
    ))}
  </div>
)}
```

## Expected Behavior

When working correctly, you should see:
1. **In browser console:** No errors
2. **In Network tab:** Successful request to `/api/finance/late-fee-rules?isActive=true`
3. **In the invoice table:** Multiple due dates when 2 rules are active

## Manual Test

Run this in browser console when on the Monthly Payments page:

```javascript
// Check if late fee rules are loaded
console.log('Late Fee Rules:', window.lateFeeRules);

// Or check React component state (if React DevTools installed)
// Look for MonthlyPaymentsNew component and check lateFeeRules state
```

## Alternative: Check Backend Directly

```bash
# Check if both rules are active
node backend/scripts/check-late-fee-rules.js
```

Expected output:
```
✅ late: 15 days, $50
✅ l: 20 days, $70
Total Rules: 2
Active Rules: 2
```

## If Still Not Working

### Option 1: Simplify the Display
Instead of calculating due dates dynamically, show them from invoice metadata:

```javascript
// In the due date cell:
<td>
  <div>{formatEthiopianDate(invoice.dueDate)}</div>
  <div style={{ color: '#666', fontSize: '0.85em' }}>
    {new Date(invoice.dueDate).toLocaleDateString()}
  </div>
  {lateFeeRules.length > 1 && (
    <div style={{ marginTop: '8px', fontSize: '0.85em', color: '#999' }}>
      Additional penalties apply at:
      {lateFeeRules.slice(1).map((rule, idx) => {
        const additionalDays = rule.gracePeriodDays - lateFeeRules[0].gracePeriodDays;
        const additionalDate = new Date(invoice.dueDate);
        additionalDate.setDate(additionalDate.getDate() + additionalDays);
        return (
          <div key={idx}>
            +{additionalDays} days: ${rule.value}
          </div>
        );
      })}
    </div>
  )}
</td>
```

### Option 2: Force Re-render
Add a key to force component re-render when rules change:

```javascript
<div key={lateFeeRules.length}>
  {/* Invoice table here */}
</div>
```

## Next Steps

1. ✅ Hard refresh browser (Ctrl+Shift+R)
2. ✅ Check browser console for errors
3. ✅ Verify React app is running
4. ✅ Check if late fee rules API is returning data
5. ✅ Add debug display to see lateFeeRules state

If none of these work, the issue might be with how the frontend is bundled or cached.
