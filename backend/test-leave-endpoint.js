const axios = require('axios');

const API_URL = 'http://localhost:5000';

async function testLeaveEndpoint() {
  try {
    console.log('🔍 Testing leave management endpoint...\n');
    
    // You'll need to replace this with a valid token from your browser
    const token = 'YOUR_TOKEN_HERE';
    
    console.log('📊 Testing attendance-issues endpoint...');
    const issuesResponse = await axios.get(
      `${API_URL}/api/hr/leave/attendance-issues?ethMonth=6&ethYear=2018&status=ALL`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    
    console.log('✅ Attendance Issues Response:');
    console.log('Success:', issuesResponse.data.success);
    console.log('Data count:', issuesResponse.data.data?.length || 0);
    console.log('Data:', JSON.stringify(issuesResponse.data.data, null, 2));
    
    console.log('\n📋 Testing leave-records endpoint...');
    const recordsResponse = await axios.get(
      `${API_URL}/api/hr/leave/leave-records?ethMonth=6&ethYear=2018`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    
    console.log('✅ Leave Records Response:');
    console.log('Success:', recordsResponse.data.success);
    console.log('Data count:', recordsResponse.data.data?.length || 0);
    console.log('Data:', JSON.stringify(recordsResponse.data.data, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testLeaveEndpoint();
