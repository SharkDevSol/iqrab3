// Test attendance API endpoints
const axios = require('axios');

async function testAttendanceAPI() {
  try {
    console.log('🔍 Testing Attendance API Endpoints\n');
    
    // Test 1: Get current Ethiopian date
    console.log('1️⃣ Testing current date endpoint...');
    const dateResponse = await axios.get('http://localhost:5000/api/academic/student-attendance/current-date');
    console.log('   Response:', JSON.stringify(dateResponse.data, null, 2));
    
    if (dateResponse.data.success) {
      const currentDate = dateResponse.data.data;
      const currentWeek = Math.ceil(currentDate.day / 7);
      
      console.log(`\n   📅 Current Date: ${currentDate.day}/${currentDate.month}/${currentDate.year}`);
      console.log(`   📊 Current Week: ${currentWeek}\n`);
      
      // Test 2: Get weekly attendance for KG1B
      console.log('2️⃣ Testing weekly attendance endpoint for KG1B...');
      const attendanceResponse = await axios.get('http://localhost:5000/api/academic/student-attendance/weekly', {
        params: {
          week: currentWeek,
          year: currentDate.year,
          month: currentDate.month,
          class: 'KG1B'
        }
      });
      
      console.log('   Response:', JSON.stringify(attendanceResponse.data, null, 2));
      
      if (attendanceResponse.data.success) {
        const records = attendanceResponse.data.data || [];
        console.log(`\n   ✅ Found ${records.length} attendance records`);
        
        if (records.length > 0) {
          console.log('\n   Sample records:');
          records.slice(0, 3).forEach((record, i) => {
            console.log(`   ${i + 1}. ${record.student_name} - ${record.status} (${record.ethiopian_day}/${record.ethiopian_month}/${record.ethiopian_year})`);
          });
        } else {
          console.log('\n   ⚠️  No attendance records found for this week');
        }
      } else {
        console.log('\n   ❌ API returned success: false');
      }
    }
    
    console.log('\n✅ Test completed');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.response) {
      console.error('   Response data:', error.response.data);
    }
    process.exit(1);
  }
}

testAttendanceAPI();
