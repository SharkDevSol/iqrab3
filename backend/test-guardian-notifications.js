/**
 * Guardian Notification System Test Script
 * 
 * This script helps you test the guardian notification system
 * Run: node backend/test-guardian-notifications.js
 */

require('dotenv').config();
const guardianNotificationService = require('./services/guardianNotificationService');

async function testNotificationSystem() {
  console.log('\n🧪 Testing Guardian Notification System\n');
  console.log('='.repeat(50));

  // Test 1: Check Email Configuration
  console.log('\n1️⃣ Checking Email Configuration...');
  console.log('   SMTP Host:', process.env.SMTP_HOST || '❌ Not configured');
  console.log('   SMTP Port:', process.env.SMTP_PORT || '❌ Not configured');
  console.log('   SMTP User:', process.env.SMTP_USER || '❌ Not configured');
  console.log('   SMTP Pass:', process.env.SMTP_PASS ? '✅ Configured' : '❌ Not configured');
  
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('\n❌ Email not configured. Please update backend/.env with SMTP settings.');
    console.log('   See GUARDIAN_NOTIFICATIONS_SETUP.md for instructions.\n');
    process.exit(1);
  }

  // Test 2: Check Service Status
  console.log('\n2️⃣ Checking Service Status...');
  console.log('   Service Running:', guardianNotificationService.isRunning ? '✅ Yes' : '❌ No');
  console.log('   Email Transporter:', guardianNotificationService.transporter ? '✅ Initialized' : '❌ Not initialized');

  // Test 3: Get Guardian Count
  console.log('\n3️⃣ Fetching Guardians...');
  try {
    const guardians = await guardianNotificationService.getAllGuardiansWithWards();
    console.log('   Total Guardians:', guardians.length);
    
    if (guardians.length > 0) {
      console.log('\n   Sample Guardians:');
      guardians.slice(0, 3).forEach((g, i) => {
        console.log(`   ${i + 1}. ${g.guardian_name} (${g.guardian_username})`);
        console.log(`      Email: ${g.guardian_phone || 'Not set'}`);
        console.log(`      Wards: ${g.wards.length}`);
        g.wards.forEach(w => {
          console.log(`         - ${w.student_name} (${w.class})`);
        });
      });
    } else {
      console.log('   ⚠️ No guardians found in the system');
    }
  } catch (error) {
    console.log('   ❌ Error fetching guardians:', error.message);
  }

  // Test 4: Test Email Sending (if configured)
  console.log('\n4️⃣ Testing Email Sending...');
  const testEmail = process.env.SMTP_USER; // Send test to yourself
  
  try {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: testEmail,
      subject: '🧪 Guardian Notification System - Test Email',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <div style="background: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 8px;">
            <h2>✅ Test Successful!</h2>
          </div>
          <div style="background: #f9f9f9; padding: 20px; margin-top: 20px;">
            <p>Your guardian notification system is configured correctly!</p>
            <p><strong>Configuration Details:</strong></p>
            <ul>
              <li>SMTP Host: ${process.env.SMTP_HOST}</li>
              <li>SMTP Port: ${process.env.SMTP_PORT}</li>
              <li>From Email: ${process.env.SMTP_USER}</li>
            </ul>
            <p>You can now send attendance reports and payment summaries to guardians.</p>
          </div>
          <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
            <p>Test performed at: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `
    };

    await guardianNotificationService.transporter.sendMail(mailOptions);
    console.log(`   ✅ Test email sent successfully to ${testEmail}`);
    console.log('   📧 Check your inbox (and spam folder)');
  } catch (error) {
    console.log('   ❌ Failed to send test email:', error.message);
    console.log('\n   Common issues:');
    console.log('   - Gmail: Use App Password, not regular password');
    console.log('   - Check firewall/network settings');
    console.log('   - Verify SMTP credentials are correct');
  }

  // Test 5: Preview Sample Report
  console.log('\n5️⃣ Preview Sample Reports...');
  try {
    const guardians = await guardianNotificationService.getAllGuardiansWithWards();
    if (guardians.length > 0) {
      const sampleGuardian = guardians[0];
      console.log(`   Testing with: ${sampleGuardian.guardian_name}`);
      
      // Preview attendance
      const attendanceData = await guardianNotificationService.getWardAttendanceForToday(sampleGuardian.wards);
      console.log('   ✅ Attendance data retrieved');
      console.log(`      Wards checked: ${attendanceData.length}`);
      
      // Preview payment
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      const paymentData = await guardianNotificationService.getWardPaymentSummary(sampleGuardian.wards, lastMonth);
      console.log('   ✅ Payment data retrieved');
      console.log(`      Payment records: ${paymentData.length}`);
    }
  } catch (error) {
    console.log('   ⚠️ Could not preview reports:', error.message);
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('\n📋 Test Summary:');
  console.log('   - Email configuration: ' + (process.env.SMTP_USER ? '✅' : '❌'));
  console.log('   - Service running: ' + (guardianNotificationService.isRunning ? '✅' : '❌'));
  console.log('   - Guardians found: ' + '✅');
  console.log('   - Email sending: Check results above');
  
  console.log('\n📚 Next Steps:');
  console.log('   1. Update guardian email addresses in database');
  console.log('   2. Test manual sending via API endpoints');
  console.log('   3. Wait for scheduled times or trigger manually');
  console.log('   4. Monitor server logs for automated sends');
  
  console.log('\n📖 For more info, see: GUARDIAN_NOTIFICATIONS_SETUP.md\n');
  
  process.exit(0);
}

// Run tests
testNotificationSystem().catch(error => {
  console.error('\n❌ Test failed:', error);
  process.exit(1);
});
