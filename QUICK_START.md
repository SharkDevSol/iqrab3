# 🚀 ATTENDANCE SYSTEM - QUICK START GUIDE

## ✅ SYSTEM IS READY!

Everything is configured and will work automatically. Just follow these simple steps:

---

## 1️⃣ START THE SERVER

```bash
cd backend
npm start
```

**That's it!** The auto-marker will start automatically and mark students absent every hour.

---

## 2️⃣ VERIFY EVERYTHING IS WORKING

Run this command anytime to check system health:

```bash
cd backend
npm run health
```

You should see:
```
✅ ALL SYSTEMS OPERATIONAL!
```

---

## 3️⃣ ACCESS THE SYSTEM

### For Staff
1. Go to: `http://localhost:5173/app/staff-login`
2. Login with staff credentials
3. You'll see your assigned class attendance automatically
4. Ethiopian calendar with current week selected
5. Check-in times displayed for late arrivals

### For Guardians
1. Go to: `http://localhost:5173/app/guardian-login`
2. Login with guardian credentials
3. Click on your ward's name
4. Click "Monthly" tab
5. See attendance with Ethiopian dates and times

---

## 4️⃣ USEFUL COMMANDS

### Check if auto-marker is configured correctly
```bash
cd backend
npm run verify
```

### Check today's attendance
```bash
cd backend
npm run check:today
```

### Manually trigger auto-marker (for testing)
```bash
cd backend
npm run mark:now
```

---

## 🔄 WHAT HAPPENS AUTOMATICALLY

### Every Hour
- ✅ Auto-marker runs
- ✅ Checks for students without attendance
- ✅ Marks them absent if past marking time
- ✅ Works even if device is offline

### When Server Starts
- ✅ Auto-marker starts automatically
- ✅ Runs immediately to catch up
- ✅ Then runs every hour

### If Data is Deleted
- ✅ Auto-marker recreates it in next cycle
- ✅ No manual intervention needed

### If Device is Offline
- ✅ System continues working
- ✅ Marks students absent based on time
- ✅ No device dependency

---

## ⚙️ CONFIGURATION

All settings are already configured correctly:

- ✅ **Shift 1 absent marking**: 9:00 AM
- ✅ **Shift 2 absent marking**: 2:00 PM
- ✅ **Auto-absent**: Enabled
- ✅ **School days**: Mon-Fri
- ✅ **Calendar**: Ethiopian

---

## 🎯 EXPECTED BEHAVIOR

### Morning (9:00 AM)
- Auto-marker runs
- Marks Shift 1 students absent if no check-in

### Afternoon (2:00 PM)
- Auto-marker runs
- Marks Shift 2 students absent if no check-in

### Every Hour
- Auto-marker runs
- Catches any missed students
- Updates attendance records

---

## ✅ VERIFICATION CHECKLIST

Run these commands to verify everything:

```bash
cd backend

# 1. Check system health
npm run health

# 2. Verify auto-marker setup
npm run verify

# 3. Check today's attendance
npm run check:today
```

All should show ✅ green checkmarks!

---

## 🆘 TROUBLESHOOTING

### If auto-marker isn't running
1. Make sure server is started: `npm start`
2. Check server logs for errors
3. Run: `npm run verify`

### If no attendance for today
1. Check current time (must be past 9 AM or 2 PM)
2. Check if today is a school day
3. Run: `npm run mark:now` to trigger manually

### If guardian can't see attendance
1. Make sure student has guardian_id set
2. Check if class name matches
3. Hard refresh browser: `Ctrl + Shift + R`

---

## 📞 NEED HELP?

1. **Check system health**: `npm run health`
2. **View server logs**: Check terminal where server is running
3. **Verify configuration**: `npm run verify`
4. **Test manually**: `npm run mark:now`

---

## 🎉 YOU'RE ALL SET!

The system is **fully automated** and will:
- ✅ Mark students absent automatically
- ✅ Work without biometric device
- ✅ Recover from errors
- ✅ Restart automatically
- ✅ Show Ethiopian calendar dates
- ✅ Display check-in times

**Just start the server and everything works!**

```bash
cd backend
npm start
```

---

**Happy Teaching! 🎓**
