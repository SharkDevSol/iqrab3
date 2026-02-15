# Super Admin API Key - Quick Reference

## 🔑 Generate API Key

```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# PowerShell
$bytes = New-Object byte[] 32; [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes); [System.BitConverter]::ToString($bytes).Replace('-','').ToLower()

# Linux/Mac
openssl rand -hex 32
```

## 📡 Usage

### JavaScript/Node.js
```javascript
const axios = require('axios');

const API_KEY = 'your-64-character-hex-key-here';
const response = await axios.get('http://localhost:5000/api/student-list', {
  headers: { 'Authorization': `Bearer ${API_KEY}` }
});
```

### cURL
```bash
curl -H "Authorization: Bearer your-64-character-hex-key-here" \
  http://localhost:5000/api/student-list
```

## ✅ API Key Requirements

- **Length:** > 60 characters (recommended: 64)
- **Format:** Hexadecimal only (0-9, a-f, A-F)
- **Example:** `a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456`

## 🧪 Test Authentication

```bash
cd backend
node test-super-admin-auth.js
```

## 📊 All Available Endpoints

### Quick Summary (Super Admin Dashboard)
- `/api/reports/summary` ⭐ NEW - Quick metrics for dashboard

### Dashboard Summaries
- `/api/reports/finance/summary`
- `/api/reports/inventory/summary`
- `/api/reports/hr/summary`
- `/api/reports/assets/summary`

### Student & Staff
- `/api/student-list`
- `/api/staff`
- `/api/reports/students/summary`
- `/api/reports/staff/summary`

### Academic & Behavior
- `/api/reports/academic/class-performance`
- `/api/reports/faults/summary`
- `/api/reports/attendance/summary`

### Finance Details
- `/api/finance/reports/trial-balance`
- `/api/finance/reports/income-statement`
- `/api/finance/reports/balance-sheet`

**See:** `ALL_DASHBOARD_REPORT_ENDPOINTS.md` for complete list (52 endpoints)

## 🔒 Security Notes

✅ Store in environment variables  
✅ Use HTTPS in production  
✅ Rotate keys regularly  
✅ Monitor access logs  
❌ Never commit to version control  
❌ Never share publicly  

## 📞 Troubleshooting

| Issue | Solution |
|-------|----------|
| 401 Unauthorized | Check API key format and length |
| 403 Forbidden | Verify key is hexadecimal only |
| Connection refused | Start server: `npm run dev` |
| Invalid token | Ensure key is > 60 characters |

## 🎯 Quick Test

```bash
# Test with example key (replace with your real key)
curl -H "Authorization: Bearer a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456" \
  http://localhost:5000/api/health
```

Expected: `{"status":"OK","message":"Server is running"}`
