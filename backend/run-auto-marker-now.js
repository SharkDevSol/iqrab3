const { markAbsentStudents } = require('./services/studentAttendanceAutoMarker');

console.log('\n🤖 Running Auto-Marker Manually...\n');

markAbsentStudents()
  .then(result => {
    console.log('\n✅ Auto-marker completed successfully!\n');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Auto-marker failed:', error.message);
    process.exit(1);
  });
