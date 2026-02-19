# Quick Reference Card

## 🚀 Starting the System

```bash
cd backend
npm start
```

That's it! Auto-setup handles everything.

---

## 🔍 Check System Status

```bash
# Quick health check
curl http://localhost:5000/api/health

# Detailed setup status
curl http://localhost:5000/api/health/setup-status
```

---

## 🔄 After Database Reset

```bash
# Just start the server - auto-setup will recreate everything
npm start
```

---

## 🛠️ Manual Commands (If Needed)

```bash
# Run migrations manually
npx prisma migrate deploy

# Setup accounts manually
node scripts/setup-default-accounts.js

# Test auto-setup
node test-auto-setup.js
```

---

## ✅ What's Automated

- ✓ Prisma migrations
- ✓ Default accounts creation
- ✓ Database table checks
- ✓ Missing column handling

---

## 📍 Key Endpoints

| Endpoint | Purpose |
|----------|---------|
| `/api/health` | System health check |
| `/api/health/setup-status` | Detailed setup status |
| `/api/guardian-list/guardians` | Guardian directory |
| `/api/finance/late-fee-rules` | Late fee rules |
| `/api/finance/monthly-payments-view/overview` | Monthly payments |

---

## 🐛 Troubleshooting

**Problem:** Finance endpoints return errors

**Solution:** Check health endpoint first
```bash
curl http://localhost:5000/api/health
```

**Problem:** "Setup Required" message appears

**Solution:** Restart server - auto-setup will fix it
```bash
npm start
```

**Problem:** Migrations fail

**Solution:** Run manually
```bash
npx prisma migrate deploy
```

---

## 📚 Documentation Files

- `AUTO_SETUP_DOCUMENTATION.md` - Complete auto-setup guide
- `SETUP_COMPLETE_SUMMARY.md` - Summary of all fixes
- `QUICK_REFERENCE.md` - This file

---

**Remember:** The system is now fully automated. Just start the server and everything works! 🎉
