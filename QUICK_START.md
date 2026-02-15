# ⚡ Quick Start - Machine Direct Connection

## 🎯 3-Step Setup

### Step 1: Fix Machine IP (2 min)
```
Machine → Menu → Comm set → Server
Change: 010.022.134.155 → 010.022.134.159
Save
```

### Step 2: Create Mappings (1 min per user)
```bash
cd backend
node scripts/add-mapping.js 1 staff khalid
node scripts/list-mappings.js  # verify
```

### Step 3: Start & Test (1 min)
```bash
npm start
# Do face check-in on machine
# Watch console for data
```

---

## 📊 Check Status Anytime
```bash
npm run status
```

---

## ✅ What You'll See When It Works

```
📥 ========================================
📥 Received data from AI06 machine
📥 ========================================
⏰ Time: 1/30/2026, 2:30:45 PM
🔍 Parsing machine data...
✅ Mapped: Machine User 1 → khalid (staff)
✅ Attendance saved: khalid at 1/30/2026, 2:30:45 PM
✅ Data processed successfully!
```

---

## 🐛 Not Working?

1. **Check machine Server IP**: `010.022.134.159`
2. **Check server is running**: `npm start`
3. **Check user mappings**: `npm run status`
4. **Check firewall**: Port 5000 open

---

## 📖 Full Guide
Read: **MACHINE_DIRECT_CONNECTION_GUIDE.md**

---

## 🎉 That's It!

Machine → Server → Database  
No AAS software needed!
