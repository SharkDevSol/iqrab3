# Monthly Payments Quick Fix

## Problem: Students not showing on monthly payment page

### Quick Fix (30 seconds)

**Windows:**
```bash
FIX_MONTHLY_PAYMENTS.bat
```

**Or manually:**
```bash
cd backend
node migrations/add-finance-columns-to-all-classes.js
```

Then restart your backend server.

---

## What This Does

Adds 4 required columns to all class tables:
- `is_active` - Track active students
- `is_free` - Track scholarship students  
- `exemption_type` - Type of exemption
- `exemption_reason` - Reason for exemption

---

## Prevention

✅ **Automatic on server startup** - No action needed  
✅ **Automatic on new class creation** - Built into the system  
✅ **Safe to run multiple times** - Won't cause errors  

---

## Still Not Working?

1. Check backend server is running
2. Clear browser cache
3. Check browser console for errors
4. Verify fee structures exist for the class
5. Check `MONTHLY_PAYMENTS_SETUP_GUIDE.md` for detailed troubleshooting
