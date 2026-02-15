const axios = require('axios');

// Test the new class and student endpoints
async function testEndpoints() {
  const baseURL = 'http://localhost:5000';
  
  // You'll need to get a real token by logging in first
  // For now, this is just to show the endpoint structure
  
  console.log('Testing Finance Class/Student Endpoints\n');
  console.log('========================================\n');
  
  console.log('Available endpoints:');
  console.log('1. GET /api/finance/classes - Get all classes');
  console.log('2. GET /api/finance/classes/:className/students - Get students in a class');
  console.log('3. GET /api/finance/classes/:className/student-count - Get student count');
  console.log('4. GET /api/finance/all-students - Get all students\n');
  
  console.log('To test these endpoints:');
  console.log('1. Log in to get an authentication token');
  console.log('2. Use the token in the Authorization header');
  console.log('3. Make requests to the endpoints above\n');
  
  console.log('Example using curl:');
  console.log('curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/finance/classes');
}

testEndpoints();
