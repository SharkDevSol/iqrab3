// Test expense endpoints

const BASE_URL = 'http://localhost:5000';

// Test credentials - use a valid staff login
const testLogin = async () => {
  console.log('\n🔐 Testing login...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/staff/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'bilal915',
        password: 'M8P45i68'
      })
    });
    
    const data = await response.json();
    
    if (data.token) {
      console.log('✅ Login successful');
      return data.token;
    } else {
      console.log('❌ Login failed:', data);
      return null;
    }
  } catch (error) {
    console.error('❌ Login error:', error.message);
    return null;
  }
};

const testGetStaff = async (token) => {
  console.log('\n👥 Testing GET /api/staff...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/staff`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ Staff endpoint working - Found ${data.count} staff members`);
      if (data.data && data.data.length > 0) {
        console.log('   Sample staff:', data.data[0]);
      }
      return true;
    } else {
      console.log('❌ Staff endpoint failed:', data);
      return false;
    }
  } catch (error) {
    console.error('❌ Staff endpoint error:', error.message);
    return false;
  }
};

const testGetExpenses = async (token) => {
  console.log('\n💰 Testing GET /api/finance/expenses...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/finance/expenses`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ Expenses endpoint working - Found ${data.data.length} expenses`);
      return true;
    } else {
      console.log('❌ Expenses endpoint failed:', data);
      return false;
    }
  } catch (error) {
    console.error('❌ Expenses endpoint error:', error.message);
    return false;
  }
};

const testCreateExpense = async (token) => {
  console.log('\n➕ Testing POST /api/finance/expenses...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/finance/expenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        category: 'SUPPLIES',
        description: 'Test expense from automated test',
        amount: 100.50,
        expenseDate: new Date().toISOString().split('T')[0],
        requestedBy: 'Test User',
        vendorName: 'Test Vendor',
        paymentMethod: 'CASH'
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Expense created successfully');
      console.log('   Expense Number:', data.data.expenseNumber);
      return data.data.id;
    } else {
      console.log('❌ Create expense failed:', data);
      return null;
    }
  } catch (error) {
    console.error('❌ Create expense error:', error.message);
    return null;
  }
};

// Run all tests
const runTests = async () => {
  console.log('🧪 Starting Expense Management Tests...');
  console.log('=====================================\n');
  
  const token = await testLogin();
  
  if (!token) {
    console.log('\n❌ Cannot proceed without authentication token');
    console.log('💡 Please update the test credentials in this file');
    return;
  }
  
  await testGetStaff(token);
  await testGetExpenses(token);
  await testCreateExpense(token);
  
  console.log('\n=====================================');
  console.log('✅ All tests completed!');
  console.log('\n💡 You can now test the frontend at:');
  console.log('   http://localhost:5173/finance/expenses');
};

runTests();
