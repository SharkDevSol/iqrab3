# Guardian Notifications - Quick Start

## 🚀 Setup in 3 Steps

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Configure Email
Edit `backend/.env`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-school-email@gmail.com
SMTP_PASS=your-app-password
```

**Gmail Users**: Generate App Password at https://myaccount.google.com/apppasswords

### Step 3: Test Configuration
```bash
npm run test:notifications
```

## 📧 What Gets Sent

### Daily Attendance Reports (4:00 PM)
- Sent to all guardians automatically
- Shows each ward's attendance status
- Includes check-in/check-out times
- Color-coded status indicators

### Monthly Payment Summaries (1st of month, 8:00 AM)
- Previous month's payment details
- Total due, paid, and balance
- Invoice breakdown per ward
- Payment reminders for outstanding balances

## 🧪 Testing

### Test Email Configuration
```bash
curl -X POST http://localhost:5000/api/guardian-notifications/test-email \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

### Send Test Attendance Report
```bash
curl -X POST http://localhost:5000/api/guardian-notifications/send-attendance \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Send Test Payment Summary
```bash
curl -X POST http://localhost:5000/api/guardian-notifications/send-payments \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Check Status
```bash
curl http://localhost:5000/api/guardian-notifications/status \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📝 Important Notes

1. **Guardian Emails**: The system uses the `guardian_phone` field for email addresses
2. **Update Emails**: Run SQL to update guardian emails:
   ```sql
   UPDATE classes_schema."class_name"
   SET guardian_phone = 'parent@example.com'
   WHERE guardian_username = 'username';
   ```

3. **Automatic Start**: Service starts automatically with the server
4. **Logs**: Check console for `📬 Guardian notification service started`

## 🔧 Customization

### Change Notification Times
Edit `backend/services/guardianNotificationService.js`:
- Line ~50: Daily attendance time (default: 16:00)
- Line ~60: Monthly payment time (default: 1st at 08:00)

### Customize Email Templates
Edit methods in `guardianNotificationService.js`:
- `generateAttendanceEmailBody()` - Attendance email design
- `generatePaymentEmailBody()` - Payment email design

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Email not sending | Check SMTP credentials, use App Password for Gmail |
| Guardian not receiving | Verify email in `guardian_phone` field |
| Service not starting | Check `npm list nodemailer`, verify .env config |
| Wrong time zone | Adjust server time or modify schedule times |

## 📚 Full Documentation

See `GUARDIAN_NOTIFICATIONS_SETUP.md` for complete details.

## ✅ Checklist

- [ ] Install nodemailer: `npm install`
- [ ] Configure SMTP in `.env`
- [ ] Run test script: `npm run test:notifications`
- [ ] Update guardian emails in database
- [ ] Test manual sending via API
- [ ] Verify scheduled sends work
- [ ] Monitor logs for errors

## 🎯 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/guardian-notifications/test-email` | POST | Test email config |
| `/api/guardian-notifications/send-attendance` | POST | Send attendance reports |
| `/api/guardian-notifications/send-payments` | POST | Send payment summaries |
| `/api/guardian-notifications/status` | GET | Check service status |
| `/api/guardian-notifications/preview-attendance/:username` | GET | Preview attendance email |
| `/api/guardian-notifications/preview-payment/:username` | GET | Preview payment email |

All endpoints require authentication token.
