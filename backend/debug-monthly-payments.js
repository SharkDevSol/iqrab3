const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
require('dotenv').config();

const prisma = new PrismaClient();
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'school_management',
  password: process.env.DB_PASSWORD || '12345678',
  port: process.env.DB_PORT || 5432,
});

async function debugMonthlyPayments() {
  try {
    console.log('🔍 Debugging Monthly Payments for Class A\n');
    
    // 1. Get fee structure for class A
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
      console.log('❌ No fee structure found for class A');
      return;
    }
    
    console.log('📋 Fee Structure:');
    console.log(`   Grade Level: ${feeStructure.gradeLevel}`);
    console.log(`   Monthly Fee: ${feeStructure.items[0]?.amount || 0} Birr`);
    console.log(`   Items:`, feeStructure.items.map(i => `${i.description}: ${i.amount}`));
    
    // 2. Get all invoices for this fee structure
    const invoices = await prisma.invoice.findMany({
      where: {
        feeStructureId: feeStructure.id
      },
      include: {
        items: true,
        paymentAllocations: {
          include: {
            payment: true
          }
        }
      },
      orderBy: {
        studentId: 'asc'
      }
    });
    
    console.log(`\n📊 Total Invoices: ${invoices.length}`);
    
    // 3. Get active students from classes_schema
    const activeStudents = await pool.query(`
      SELECT student_name, school_id, class_id, is_active
      FROM classes_schema."A"
      WHERE is_active = TRUE OR is_active IS NULL
      ORDER BY student_name
    `);
    
    console.log(`\n👥 Active Students in Class A: ${activeStudents.rows.length}`);
    activeStudents.rows.forEach(s => {
      console.log(`   - ${s.student_name} (ID: ${s.school_id}-${s.class_id})`);
    });
    
    // 4. Group invoices by student
    const studentMap = new Map();
    const currentEthiopianMonth = 6; // Current month
    
    for (const invoice of invoices) {
      const monthNumber = invoice.metadata?.monthNumber || 0;
      const isUnlocked = monthNumber <= currentEthiopianMonth;
      
      if (!studentMap.has(invoice.studentId)) {
        studentMap.set(invoice.studentId, {
          studentId: invoice.studentId,
          invoices: [],
          unlockedInvoices: [],
          totalAmount: 0,
          unlockedTotalAmount: 0,
          totalPaid: 0,
          unlockedTotalPaid: 0
        });
      }
      
      const student = studentMap.get(invoice.studentId);
      student.invoices.push(invoice);
      student.totalAmount += parseFloat(invoice.totalAmount);
      student.totalPaid += parseFloat(invoice.paidAmount);
      
      if (isUnlocked) {
        student.unlockedInvoices.push(invoice);
        student.unlockedTotalAmount += parseFloat(invoice.totalAmount);
        student.unlockedTotalPaid += parseFloat(invoice.paidAmount);
      }
    }
    
    console.log(`\n💰 Invoice Summary by Student:`);
    console.log(`   Total students with invoices: ${studentMap.size}`);
    
    // 5. Match with active students
    let totalUnlockedAmount = 0;
    let totalUnlockedPaid = 0;
    let activeStudentCount = 0;
    
    for (const [studentId, data] of studentMap.entries()) {
      // Extract school_id and class_id from UUID
      const parts = studentId.split('-');
      if (parts.length >= 5) {
        const schoolId = parseInt(parts[3], 10);
        const classId = parseInt(parts[4], 10);
        
        // Check if this student is active
        const isActive = activeStudents.rows.some(s => 
          parseInt(s.school_id) === schoolId && parseInt(s.class_id) === classId
        );
        
        const studentName = activeStudents.rows.find(s => 
          parseInt(s.school_id) === schoolId && parseInt(s.class_id) === classId
        )?.student_name || 'Unknown';
        
        console.log(`\n   ${isActive ? '✅' : '❌'} ${studentName} (${schoolId}-${classId}):`);
        console.log(`      Student ID: ${studentId}`);
        console.log(`      Total Invoices: ${data.invoices.length}`);
        console.log(`      Unlocked Invoices: ${data.unlockedInvoices.length}`);
        console.log(`      Total Amount (All): ${data.totalAmount.toFixed(2)} Birr`);
        console.log(`      Unlocked Amount: ${data.unlockedTotalAmount.toFixed(2)} Birr`);
        console.log(`      Total Paid: ${data.totalPaid.toFixed(2)} Birr`);
        console.log(`      Unlocked Paid: ${data.unlockedTotalPaid.toFixed(2)} Birr`);
        
        if (isActive) {
          totalUnlockedAmount += data.unlockedTotalAmount;
          totalUnlockedPaid += data.unlockedTotalPaid;
          activeStudentCount++;
        }
      }
    }
    
    console.log(`\n📊 SUMMARY (Active Students Only):`);
    console.log(`   Active Students: ${activeStudentCount}`);
    console.log(`   Total Unlocked Amount: ${totalUnlockedAmount.toFixed(2)} Birr`);
    console.log(`   Total Unlocked Paid: ${totalUnlockedPaid.toFixed(2)} Birr`);
    console.log(`   Total Unlocked Pending: ${(totalUnlockedAmount - totalUnlockedPaid).toFixed(2)} Birr`);
    
    console.log(`\n✅ Debug complete!`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

debugMonthlyPayments();
