# Guardian Notifications Setup Guide

## Overview
This system automatically sends notifications to guardians/parents about:
1. **Daily Attendance Reports** - Sent at 4:00 PM every day
2. **Monthly Payment Summaries** - Sent on the 1st of each month at 8:00 AM

## Features
- ✅ Automated daily attendance reports with check-in/check-out times
- ✅ Monthly payment summaries with invoice details and balances
- ✅ Beautiful HTML email templates
- ✅ Support for multiple wards per guardian
- ✅ Manual trigger endpoints for testing
- ✅ Email preview functionality
- ✅ Status monitoring

## Installation

### 1. Install Dependencies
```bash
cd backend
npm install nodemailer
```

### 2. Configure Email Settings

Edit `backend/.env` and add your email configuration:

```env
# Email Configuration for Guardian Notifications
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-school-email@gmail.com
SMTP_PASS=your-app-password
```

#### For Gmail:
1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Generate an App Password:
   - Go to Security → 2-Step Verification → App passwords
   - Select "Mail" and your device
   - Copy the 16-character password
   - Use this as `SMTP_PASS`

#### For Other Email Providers:
- **Outlook/Office365**: `smtp.office365.com`, port 587
- **Yahoo**: `smtp.mail.yahoo.com`, port 587
- **Custom SMTP**: Use your provider's settings

### 3. Update Guardian Email Addresses

The system uses the `guardian_phone` field to store email addresses. Update your guardian records:

```sql
-- Example: Update guardian email in class table
UPDATE classes_schema."your_class_name"
SET guardian_phone = 'parent@example.com'
WHERE guardian_username = 'guardian_username';
```

### 4. Start the Server

The notification service starts automatically with the server:

```bash
npm start
```

You should see:
```
📬 Guardian notification service started
✅ Guardian Notification Service started
```

## API Endpoints

### 1. Test Email Configuration
```bash
POST /api/guardian-notifications/test-email
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "test@example.com"
}
```

### 2. Manually Send Daily Attendance Reports
```bash
POST /api/guardian-notifications/send-attendance
Authorization: Bearer <token>
```

### 3. Manually Send Monthly Payment Summaries
```bash
POST /api/guardian-notifications/send-payments
Authorization: Bearer <token>
```

### 4. Check Service Status
```bash
GET /api/guardian-notifications/status
Authorization: Bearer <token>
```

### 5. Preview Attendance Report
```bash
GET /api/guardian-notifications/preview-attendance/:guardianUsername
Authorization: Bearer <token>
```

### 6. Preview Payment Summary
```bash
GET /api/guardian-notifications/preview-payment/:guardianUsername?month=1&year=2024
Authorization: Bearer <token>
```

## Testing

### Step 1: Test Email Configuration
```bash
curl -X POST http://localhost:5000/api/guardian-notifications/test-email \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email": "your-test-email@example.com"}'
```

### Step 2: Preview Reports
```bash
# Preview attendance report
curl http://localhost:5000/api/guardian-notifications/preview-attendance/guardian_username \
  -H "Authorization: Bearer YOUR_TOKEN"

# Preview payment summary
curl http://localhost:5000/api/guardian-notifications/preview-payment/guardian_username \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Step 3: Send Test Reports
```bash
# Send attendance reports to all guardians
curl -X POST http://localhost:5000/api/guardian-notifications/send-attendance \
  -H "Authorization: Bearer YOUR_TOKEN"

# Send payment summaries to all guardians
curl -X POST http://localhost:5000/api/guardian-notifications/send-payments \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Scheduled Times

### Daily Attendance Reports
- **Time**: 4:00 PM (16:00) every day
- **Content**: Today's attendance status for all wards
- **Includes**: Check-in time, check-out time, attendance status

### Monthly Payment Summaries
- **Time**: 8:00 AM on the 1st of each month
- **Content**: Previous month's payment summary
- **Includes**: Total due, paid amount, balance, invoice details

## Customization

### Change Notification Times

Edit `backend/services/guardianNotificationService.js`:

```javascript
// For daily attendance (currently 4:00 PM)
if (hour === 16 && minute === 0) {
  // Change hour to your preferred time (24-hour format)
}

// For monthly payments (currently 1st at 8:00 AM)
if (day === 1 && hour === 8) {
  // Change day or hour as needed
}
```

### Customize Email Templates

Edit the `generateAttendanceEmailBody()` and `generatePaymentEmailBody()` methods in `backend/services/guardianNotificationService.js` to modify:
- Colors and styling
- Content and layout
- Additional information

## Troubleshooting

### Email Not Sending
1. Check SMTP credentials in `.env`
2. Verify email provider allows SMTP access
3. Check firewall/network settings
4. Review server logs for error messages

### Guardian Not Receiving Emails
1. Verify `guardian_phone` field contains valid email
2. Check if guardian has `is_active = TRUE`
3. Ensure guardian has associated wards
4. Check spam/junk folder

### Service Not Starting
1. Check server logs for errors
2. Verify nodemailer is installed: `npm list nodemailer`
3. Ensure `.env` file is properly configured

## Monitoring

### Check Service Status
```bash
curl http://localhost:5000/api/guardian-notifications/status \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Response:
```json
{
  "success": true,
  "status": {
    "isRunning": true,
    "emailConfigured": true,
    "smtpHost": "smtp.gmail.com",
    "smtpUser": "your-email@gmail.com"
  }
}
```

### Server Logs
Monitor the server console for:
- `📬 Guardian notification service started` - Service initialized
- `📊 Sending daily attendance reports...` - Daily reports triggered
- `💰 Sending monthly payment summaries...` - Monthly summaries triggered
- `✅ Sent attendance reports to X guardians` - Success message
- `❌ Failed to send...` - Error messages

## Email Templates

### Attendance Report Email
- Header with date
- Table showing each ward's attendance
- Color-coded status (Green=Present, Red=Absent, Orange=Late)
- Check-in and check-out times

### Payment Summary Email
- Header with month/year
- Table showing each ward's payment details
- Overall summary with totals
- Payment reminder if balance exists
- Thank you message if fully paid

## Security Notes

1. **Never commit** `.env` file with real credentials
2. Use **App Passwords** for Gmail (not your main password)
3. Store SMTP credentials securely
4. Use HTTPS in production
5. Implement rate limiting for manual trigger endpoints

## Support

For issues or questions:
1. Check server logs: `npm start`
2. Test email configuration first
3. Verify guardian data in database
4. Review this guide's troubleshooting section

## Future Enhancements

Potential additions:
- SMS notifications via Twilio/Africa's Talking
- WhatsApp notifications
- Push notifications for mobile app
- Customizable notification schedules per guardian
- Multi-language support
- Notification preferences (opt-in/opt-out)
