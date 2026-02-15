const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function testOverview() {
  try {
    console.log('\n🔍 Testing Overview Endpoint Logic\n');
    
    const currentEthiopianMonth = 6;
    
    // Get fee structure for class A
    const feeStructure = await prisma.feeStructure.findFirst({
      where: {
        gradeLevel: 'A',
        isActive: true
      },
      include: {
        items: true
      }
    });
    
    if (!feeStructure) {
      console.log('❌ No fee structure found');
      return;
    }
    
    console.log(`📋 Fee Structure: ${feeStructure.gradeLevel}`);
    
    // STEP 1: Get active students
    const activeStudents = await prisma.$queryRawUnsafe(`
      SELECT school_id, class_id, student_name
      FROM classes_schema."A"
      WHERE is_active = TRUE OR is_active IS NULL
    `);
    
    console.log(`\n✅ Active Students: ${activeStudents.length}`);
    
    // Build active student IDs
    const activeStudentIds = new Set();
    for (const student of activeStudents) {
      const schoolIdPadded = String(student.school_id).padStart(4, '0');
      const classIdPadded = String(student.class_id).padStart(12, '0');
      const studentId = `00000000-0000-0000-${schoolIdPadded}-${classIdPadded}`;
      activeStudentIds.add(studentId);
      console.log(`   - ${student.student_name} → ${studentId}`);
    }
    
    // STEP 2: Get all invoices
    const allInvoices = await prisma.invoice.findMany({
      where: {
        feeStructureId: feeStructure.id
      }
    });
    
    console.log(`\n📄 Total Invoices: ${allInvoices.length}`);
    
    // STEP 3: Filter invoices for active students only
    const invoices = allInvoices.filter(inv => activeStudentIds.has(inv.studentId));
    
    console.log(`✅ Invoices for Active Students: ${invoices.length}`);
    console.log(`❌ Invoices Filtered Out: ${allInvoices.length - invoices.length}`);
    
    // Show which invoices were filtered out
    const filteredOut = allInvoices.filter(inv => !activeStudentIds.has(inv.studentId));
    if (filteredOut.length > 0) {
      console.log('\n🚫 Filtered Out Invoices:');
      for (const inv of filteredOut) {
        console.log(`   - Student ID: ${inv.studentId}, Amount: ${inv.totalAmount}`);
      }
    }
    
    // STEP 4: Calculate unlocked amounts
    const unlockedInvoices = invoices.filter(inv => {
      const monthNumber = inv.metadata?.monthNumber || 0;
      return monthNumber <= currentEthiopianMonth;
    });
    
    const unlockedTotalAmount = unlockedInvoices.reduce((sum, inv) => sum + parseFloat(inv.totalAmount), 0);
    const unlockedTotalPaid = unlockedInvoices.reduce((sum, inv) => sum + parseFloat(inv.paidAmount), 0);
    const unlockedTotalPending = unlockedTotalAmount - unlockedTotalPaid;
    
    console.log(`\n💰 Unlocked Amounts (Active Students Only):`);
    console.log(`   Total Students: ${activeStudentIds.size}`);
    console.log(`   Unlocked Invoices: ${unlockedInvoices.length}`);
    console.log(`   Unlocked Total Amount: ${unlockedTotalAmount.toFixed(2)} Birr`);
    console.log(`   Unlocked Total Paid: ${unlockedTotalPaid.toFixed(2)} Birr`);
    console.log(`   Unlocked Total Pending: ${unlockedTotalPending.toFixed(2)} Birr`);
    
    console.log('\n✅ Test Complete!\n');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testOverview();
