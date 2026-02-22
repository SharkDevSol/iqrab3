const axios = require('axios');

const API_URL = 'http://localhost:5000';
const token = 'test-token'; // Replace with actual token if needed

async function testEndpoints() {
  console.log('🧪 Testing Attendance Time Settings Endpoints\n');
  
  try {
    // Test 1: GET shift settings
    console.log('1️⃣ Testing GET /api/hr/shift-settings');
    try {
      const shiftResponse = await axios.get(`${API_URL}/api/hr/shift-settings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log('✅ Shift settings fetched successfully');
      console.log('   Data:', JSON.stringify(shiftResponse.data, null, 2));
    } catch (error) {
      console.log('❌ Shift settings failed:', error.response?.data || error.message);
    }
    
    console.log('\n');
    
    // Test 2: GET attendance time settings
    console.log('2️⃣ Testing GET /api/hr/attendance/time-settings');
    try {
      const timeResponse = await axios.get(`${API_URL}/api/hr/attendance/time-settings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log('✅ Time settings fetched successfully');
      console.log('   Data:', JSON.stringify(timeResponse.data, null, 2));
    } catch (error) {
      console.log('❌ Time settings failed:', error.response?.data || error.message);
    }
    
    console.log('\n');
    
    // Test 3: POST attendance time settings
    console.log('3️⃣ Testing POST /api/hr/attendance/time-settings');
    try {
      const postResponse = await axios.post(
        `${API_URL}/api/hr/attendance/time-settings`,
        {
          standardCheckIn: '08:00',
          lateThreshold: '08:15',
          standardCheckOut: '17:00',
          minimumWorkHours: 8.0,
          halfDayThreshold: 4.0,
          gracePeriodMinutes: 15,
          maxCheckoutHours: 3.0,
          absentThresholdTime: '15:00',
          weekendDays: [0, 6] // Sunday and Saturday
        },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      console.log('✅ Time settings saved successfully');
      console.log('   Data:', JSON.stringify(postResponse.data, null, 2));
    } catch (error) {
      console.log('❌ Save time settings failed:', error.response?.data || error.message);
    }
    
    console.log('\n✅ All tests completed!');
    
  } catch (error) {
    console.error('❌ Test suite failed:', error.message);
  }
}

// Check if server is running
axios.get(`${API_URL}/api/health`)
  .then(() => {
    console.log('✅ Server is running\n');
    testEndpoints();
  })
  .catch(() => {
    console.log('❌ Server is not running. Please start the server first.');
    console.log('   Run: npm start or node server.js\n');
  });
