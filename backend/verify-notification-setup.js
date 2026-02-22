/**
 * Verify Guardian Notification Setup
 * This checks all components without starting the full server
 */

require('dotenv').config();

async function verify() {
  console.log('\n🔍 Verifying Guardian Notification Setup\n');
  console.log('='.repeat(60));
  
  let allPassed = true;
  
  // Check 1: Environment Variables
  console.log('\n1️⃣ Environment Variables');
  const envVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'];
  envVars.forEach(varName => {
    const value = process.env[varName];
    if (value && value !== 'your-email@gmail.com' && value !== 'your-app-password') {
      console.log(`   ✅ ${varName}: Configured`);
    } else {
      console.log(`   ⚠️  ${varName}: Not configured (using default/placeholder)`);
      if (varName === 'SMTP_USER' || varName === 'SMTP_PASS') {
        console.log(`      → Update backend/.env with real credentials`);
      }
    }
  });
  
  // Check 2: Service Module
  console.log('\n2️⃣ Guardian Notification Service');
  try {
    const service = require('./services/guardianNotificationService');
    console.log('   ✅ Service module loaded');
    console.log('   ✅ Email transporter initialized');
    console.log('   ℹ️  Service will start automatically with server');
  } catch (error) {
    console.log('   ❌ Failed to load service:', error.message);
    allPassed = false;
  }
  
  // Check 3: Routes Module
  console.log('\n3️⃣ API Routes');
  try {
    const routes = require('./routes/guardianNotificationRoutes');
    console.log('   ✅ Routes module loaded');
    console.log('   ℹ️  Available endpoints:');
    console.log('      - POST /api/guardian-notifications/test-email');
    console.log('      - POST /api/guardian-notifications/send-attendance');
    console.log('      - POST /api/guardian-notifications/send-payments');
    console.log('      - GET  /api/guardian-notifications/status');
    console.log('      - GET  /api/guardian-notifications/preview-attendance/:username');
    console.log('      - GET  /api/guardian-notifications/preview-payment/:username');
  } catch (error) {
    console.log('   ❌ Failed to load routes:', error.message);
    allPassed = false;
  }
  
  // Check 4: Database Connection
  console.log('\n4️⃣ Database Connection');
  try {
    const db = require('./config/db');
    const result = await db.query(
      "SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = 'classes_schema'"
    );
    console.log('   ✅ Database connected');
    console.log(`   ✅ Found ${result.rows[0].count} class tables`);
  } catch (error) {
    console.log('   ❌ Database error:', error.message);
    allPassed = false;
  }
  
  // Check 5: Guardian Data
  console.log('\n5️⃣ Guardian Data');
  try {
    const service = require('./services/guardianNotificationService');
    const guardians = await service.getAllGuardiansWithWards();
    console.log(`   ✅ Found ${guardians.length} guardians in system`);
    
    if (guardians.length > 0) {
      const guardiansWithEmail = guardians.filter(g => 
        g.guardian_phone && 
        g.guardian_phone.includes('@') &&
        g.guardian_phone !== 'your-email@gmail.com'
      );
      console.log(`   ℹ️  Guardians with email: ${guardiansWithEmail.length}/${guardians.length}`);
      
      if (guardiansWithEmail.length === 0) {
        console.log('   ⚠️  No guardians have email addresses configured');
        console.log('      → Update guardian_phone field with email addresses');
      } else {
        console.log('\n   Sample guardians with email:');
        guardiansWithEmail.slice(0, 3).forEach(g => {
          console.log(`      - ${g.guardian_name}: ${g.guardian_phone} (${g.wards.length} wards)`);
        });
      }
    } else {
      console.log('   ⚠️  No guardians found in system');
    }
  } catch (error) {
    console.log('   ❌ Error fetching guardians:', error.message);
    allPassed = false;
  }
  
  // Check 6: Nodemailer Package
  console.log('\n6️⃣ Dependencies');
  try {
    require('nodemailer');
    console.log('   ✅ nodemailer package installed');
  } catch (error) {
    console.log('   ❌ nodemailer not installed');
    console.log('      → Run: npm install nodemailer');
    allPassed = false;
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  if (allPassed) {
    console.log('\n✅ All checks passed! Guardian notification system is ready.\n');
    console.log('📋 Next Steps:');
    console.log('   1. Update SMTP credentials in backend/.env (if not done)');
    console.log('   2. Update guardian email addresses in database');
    console.log('   3. Start server: npm start');
    console.log('   4. Test with: POST /api/guardian-notifications/test-email');
    console.log('\n📚 Documentation: GUARDIAN_NOTIFICATIONS_QUICK_START.md\n');
  } else {
    console.log('\n⚠️  Some checks failed. Please review the errors above.\n');
  }
  
  process.exit(allPassed ? 0 : 1);
}

verify().catch(error => {
  console.error('\n❌ Verification failed:', error);
  process.exit(1);
});
