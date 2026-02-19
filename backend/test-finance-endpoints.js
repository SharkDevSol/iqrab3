const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testFinanceEndpoints() {
  try {
    console.log('Testing Prisma connection and late fee rules...\n');
    
    // Test 1: Check if Prisma is connected
    console.log('1. Testing Prisma connection...');
    await prisma.$connect();
    console.log('✓ Prisma connected successfully\n');
    
    // Test 2: Try to query late fee rules
    console.log('2. Querying late fee rules...');
    const lateFeeRules = await prisma.lateFeeRule.findMany({
      where: { isActive: true }
    });
    console.log(`✓ Found ${lateFeeRules.length} active late fee rules`);
    lateFeeRules.forEach(rule => {
      console.log(`  - ${rule.name}: ${rule.type} ${rule.value}, grace period: ${rule.gracePeriodDays} days`);
    });
    console.log('');
    
    // Test 3: Try to query fee structures
    console.log('3. Querying fee structures...');
    const feeStructures = await prisma.feeStructure.findMany({
      where: { isActive: true },
      include: { items: true }
    });
    console.log(`✓ Found ${feeStructures.length} active fee structures`);
    feeStructures.forEach(fs => {
      console.log(`  - ${fs.name} (${fs.gradeLevel}): ${fs.items.length} items`);
    });
    console.log('');
    
    // Test 4: Check if class tables exist
    console.log('4. Checking class tables...');
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'classes_schema'
    `;
    console.log(`✓ Found ${tables.length} class tables`);
    console.log('');
    
    // Test 5: Try the problematic query from monthly payments view
    console.log('5. Testing class table query (KG1A)...');
    try {
      // Check for is_active column
      const columnCheck = await prisma.$queryRawUnsafe(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_schema = 'classes_schema' 
          AND table_name = 'KG1A'
          AND column_name IN ('is_active', 'is_free')
      `);
      
      const columns = columnCheck.map(c => c.column_name);
      const hasIsActive = columns.includes('is_active');
      const hasIsFree = columns.includes('is_free');
      
      console.log(`  - has is_active column: ${hasIsActive}`);
      console.log(`  - has is_free column: ${hasIsFree}`);
      
      const whereClause = hasIsActive ? 'WHERE is_active = TRUE OR is_active IS NULL' : '';
      const selectIsFree = hasIsFree ? ', is_free' : '';
      
      const students = await prisma.$queryRawUnsafe(`
        SELECT school_id, class_id, student_name${selectIsFree}
        FROM classes_schema."KG1A"
        ${whereClause}
      `);
      
      console.log(`✓ Found ${students.length} students in KG1A`);
    } catch (error) {
      console.error('✗ Error querying KG1A:', error.message);
    }
    
    console.log('\n✅ All tests completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testFinanceEndpoints();
