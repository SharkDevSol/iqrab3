/**
 * Test Super Admin API Key Authentication
 * 
 * This script tests the Super Admin API key authentication feature
 * Run with: node test-super-admin-auth.js
 */

const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:5000/api';
const SUPER_ADMIN_API_KEY = 'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456'; // Example 64-char hex key

// Test endpoints
const TEST_ENDPOINTS = [
  { method: 'GET', path: '/reports/summary', name: 'Quick Summary (Super Admin)' },
  { method: 'GET', path: '/reports/overview', name: 'Overview Report' },
  { method: 'GET', path: '/reports/finance/summary', name: 'Finance Summary' },
  { method: 'GET', path: '/reports/inventory/summary', name: 'Inventory Summary' },
  { method: 'GET', path: '/reports/hr/summary', name: 'HR Summary' },
  { method: 'GET', path: '/reports/assets/summary', name: 'Asset Summary' },
  { method: 'GET', path: '/student-list/classes', name: 'Student List Classes' },
  { method: 'GET', path: '/dashboard/enhanced-stats', name: 'Dashboard Stats' }
];

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testEndpoint(endpoint) {
  try {
    const response = await axios({
      method: endpoint.method,
      url: `${BASE_URL}${endpoint.path}`,
      headers: {
        'Authorization': `Bearer ${SUPER_ADMIN_API_KEY}`
      },
      timeout: 5000
    });

    log(`  ✅ ${endpoint.name}`, 'green');
    return { success: true, endpoint: endpoint.name };
  } catch (error) {
    if (error.response) {
      log(`  ❌ ${endpoint.name} - ${error.response.status}: ${error.response.data.error || 'Unknown error'}`, 'red');
    } else if (error.code === 'ECONNREFUSED') {
      log(`  ❌ ${endpoint.name} - Server not running`, 'red');
    } else {
      log(`  ❌ ${endpoint.name} - ${error.message}`, 'red');
    }
    return { success: false, endpoint: endpoint.name, error: error.message };
  }
}

async function testInvalidKey() {
  log('\n📋 Testing Invalid API Keys:', 'cyan');
  
  const invalidKeys = [
    { key: 'short', name: 'Too Short' },
    { key: 'a'.repeat(65), name: 'Valid Length but All Same Char' },
    { key: 'invalid-characters-in-key-1234567890abcdef1234567890abcdef12345', name: 'Invalid Characters' },
    { key: '', name: 'Empty Key' }
  ];

  for (const test of invalidKeys) {
    try {
      await axios.get(`${BASE_URL}/reports/overview`, {
        headers: { 'Authorization': `Bearer ${test.key}` },
        timeout: 5000
      });
      log(`  ❌ ${test.name} - Should have been rejected`, 'red');
    } catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        log(`  ✅ ${test.name} - Correctly rejected`, 'green');
      } else {
        log(`  ⚠️  ${test.name} - Unexpected error: ${error.message}`, 'yellow');
      }
    }
  }
}

async function runTests() {
  log('╔════════════════════════════════════════════════════════════╗', 'blue');
  log('║     Super Admin API Key Authentication Test Suite         ║', 'blue');
  log('╚════════════════════════════════════════════════════════════╝', 'blue');
  
  log(`\n🔑 API Key: ${SUPER_ADMIN_API_KEY.substring(0, 20)}...`, 'cyan');
  log(`🌐 Base URL: ${BASE_URL}`, 'cyan');
  
  // Test server connectivity
  log('\n🔌 Testing Server Connectivity...', 'cyan');
  try {
    await axios.get(`${BASE_URL}/health`, { timeout: 5000 });
    log('  ✅ Server is running', 'green');
  } catch (error) {
    log('  ❌ Server is not running or not accessible', 'red');
    log('  💡 Start the server with: cd backend && npm run dev', 'yellow');
    process.exit(1);
  }

  // Test valid Super Admin API key
  log('\n📋 Testing Super Admin API Key Access:', 'cyan');
  const results = [];
  
  for (const endpoint of TEST_ENDPOINTS) {
    const result = await testEndpoint(endpoint);
    results.push(result);
  }

  // Test invalid keys
  await testInvalidKey();

  // Summary
  log('\n╔════════════════════════════════════════════════════════════╗', 'blue');
  log('║                      Test Summary                          ║', 'blue');
  log('╚════════════════════════════════════════════════════════════╝', 'blue');
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  log(`\n✅ Successful: ${successful}/${results.length}`, successful === results.length ? 'green' : 'yellow');
  log(`❌ Failed: ${failed}/${results.length}`, failed === 0 ? 'green' : 'red');
  
  if (successful === results.length) {
    log('\n🎉 All tests passed! Super Admin authentication is working correctly.', 'green');
  } else {
    log('\n⚠️  Some tests failed. Check the errors above.', 'yellow');
  }
  
  log('\n💡 Tips:', 'cyan');
  log('  - Make sure the server is running: cd backend && npm run dev');
  log('  - Check that all database schemas exist');
  log('  - Verify the API key format (64+ hex characters)');
  log('  - Review server logs for detailed error messages');
}

// Run tests
runTests().catch(error => {
  log(`\n❌ Test suite failed: ${error.message}`, 'red');
  process.exit(1);
});
