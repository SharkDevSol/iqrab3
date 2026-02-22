const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testGrade12API() {
  try {
    console.log('\n=== Testing GRADE12 API Logic ===\n');
    
    const className = 'GRADE12';
    const currentEthiopianMonth = 5;
    
    // Step 1: Get fee structure
    console.log('1. Getting fee structure...');
    const feeStructure = await prisma.feeStructure.findFirst({
      where: {
        gradeLevel: className,
        isActive: true
      },
      include: { items: true }
    });
    
    if (!feeStructure) {
      console.log('✗ No fee structure found');
      return;
    }
    console.log(`✓ Fee structure found: ${feeStructure.id}`);
    
    // Step 2: Get invoices
    console.log('\n2. Getting invoices...');
    const invoices = await prisma.invoice.findMany({
      where: { feeStructureId: feeStructure.id },
      orderBy: { studentId: 'asc' }
    });
    console.log(`✓ Found ${invoices.length} invoices`);
    
    // Step 3: Get unique student IDs
    const studentIds = [...new Set(invoices.map(inv => inv.studentId))];
    console.log(`✓ Found ${studentIds.length} unique students`);
    console.log('Sample student IDs:', studentIds.slice(0, 3));
    
    // Step 4: Try to fetch student names
    console.log('\n3. Fetching student names from classes_schema...');
    const studentNameMap = new Map();
    
    for (const studentId of studentIds) {
      const parts = studentId.split('-');
      if (parts.length >= 5) {
        const schoolId = parseInt(parts[3], 10);
        const classId = parseInt(parts[4], 10);
        
        console.log(`\nChecking student ${studentId}:`);
        console.log(`  Parsed: school_id=${schoolId}, class_id=${classId}`);
        
        try {
          // Check if is_active column exists
          const columnCheck = await prisma.$queryRawUnsafe(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_schema = 'classes_schema' 
              AND table_name = '${className}'
              AND column_name = 'is_active'
          `);
          
          const hasIsActive = columnCheck.length > 0;
          const whereClause = hasIsActive 
            ? 'AND (is_active = TRUE OR is_active IS NULL)'
            : '';
          
          const result = await prisma.$queryRawUnsafe(`
            SELECT school_id, class_id, student_name, is_free
            FROM classes_schema."${className}"
            WHERE school_id = $1 AND class_id = $2
              ${whereClause}
          `, schoolId, classId);
          
          if (result.length > 0) {
            studentNameMap.set(studentId, result[0].student_name);
            console.log(`  ✓ Found: ${result[0].student_name}${result[0].is_free ? ' [FREE]' : ''}`);
          } else {
            console.log(`  ✗ No match found in database`);
            
            // Debug: Check what's actually in the table
            const debugResult = await prisma.$queryRawUnsafe(`
              SELECT school_id, class_id, student_name 
              FROM classes_schema."${className}"
              WHERE school_id = $1 OR class_id = $2
              LIMIT 3
            `, schoolId, classId);
            console.log(`  Debug - Similar records:`, debugResult);
          }
        } catch (error) {
          console.log(`  ✗ Error: ${error.message}`);
        }
        
        // Only check first 3 students for debugging
        if (studentNameMap.size >= 3) break;
      }
    }
    
    console.log(`\n4. Summary:`);
    console.log(`Total invoices: ${invoices.length}`);
    console.log(`Unique students: ${studentIds.length}`);
    console.log(`Students with names: ${studentNameMap.size}`);
    console.log(`Students that would be filtered out: ${studentIds.length - studentNameMap.size}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testGrade12API();
