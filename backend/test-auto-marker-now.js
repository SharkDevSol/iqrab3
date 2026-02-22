const attendanceAutoMarker = require('./services/attendanceAutoMarker');

console.log('\n🤖 Testing Staff Attendance Auto-Marker...\n');
console.log('This will:');
console.log('1. Check for staff without check-out');
console.log('2. Mark absent staff (past threshold time)');
console.log('3. Apply approved leave overrides\n');

// Run the auto-marker once
attendanceAutoMarker.checkAndMarkAttendance()
  .then(() => {
    console.log('\n✅ Auto-marker test complete!');
    console.log('Check the logs above for details.\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Auto-marker test failed:', error.message);
    process.exit(1);
  });
