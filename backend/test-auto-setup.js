const { autoSetup, cleanup } = require('./utils/autoSetup');

async function test() {
  console.log('Testing auto-setup...\n');
  
  try {
    await autoSetup();
    console.log('\n✅ Test completed successfully!');
  } catch (error) {
    console.error('\n❌ Test failed:', error);
  } finally {
    await cleanup();
  }
}

test();
