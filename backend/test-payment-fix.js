const db = require('./config/db');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testPaymentFix() {
  try {
    // Get the student from class table
    const result = await db.query(`
      SELECT id, school_id, student_name, class 
      FROM classes_schema."KG1B" 
      WHERE guardian_username = 'abdurhmanahmed_4386'
    `);
    
    if (result.rows.length === 0) {
      console.log('No student found');
      return;
    }
    
    const student = result.rows[0];
    console.log('Student from class table:');
    console.log(`  Name: ${student.student_name}`);
    console.log(`  School ID: ${student.school_id}`);
    console.log(`  ID: ${student.id}`);
    console.log(`  Class: ${student.class}`);
    
    // Apply the fixed conversion
    const schoolIdNum = parseInt(student.school_id);
    const idNum = parseInt(student.id);
    const studentId = `00000000-0000-0000-${String(schoolIdNum).padStart(4, '0')}-${String(idNum).padStart(12, '0')}`;
    
    console.log(`\nConverted UUID: ${studentId}`);
    
    // Fetch invoices
    const invoices = await prisma.invoice.findMany({
      where: { studentId },
      include: { items: true },
      orderBy: { issueDate: 'asc' }
    });
    
    console.log(`\nFound ${invoices.length} invoices:`);
    
    // Get current Ethiopian month (approximate)
    const now = new Date();
    const gregorianMonth = now.getMonth() + 1;
    let currentEthiopianMonth;
    if (gregorianMonth >= 9) {
      currentEthiopianMonth = gregorianMonth - 8;
    } else {
      currentEthiopianMonth = gregorianMonth + 4;
    }
    
    console.log(`Current Ethiopian month: ${currentEthiopianMonth}`);
    
    // Filter to unlocked months
    const unlockedInvoices = invoices.filter(inv => {
      const monthNumber = inv.metadata?.monthNumber;
      return monthNumber && monthNumber <= currentEthiopianMonth;
    });
    
    console.log(`\nUnlocked invoices (${unlockedInvoices.length}):`);
    unlockedInvoices.forEach(inv => {
      console.log(`  ${inv.metadata?.month} (Month ${inv.metadata?.monthNumber}): ${inv.totalAmount} ETB - Status: ${inv.status}`);
    });
    
    // Calculate totals
    const totalAmount = unlockedInvoices.reduce((sum, inv) => sum + parseFloat(inv.totalAmount), 0);
    const totalPaid = unlockedInvoices.reduce((sum, inv) => sum + parseFloat(inv.paidAmount), 0);
    const totalBalance = unlockedInvoices.reduce((sum, inv) => sum + (parseFloat(inv.totalAmount) - parseFloat(inv.paidAmount)), 0);
    
    console.log(`\nTotals:`);
    console.log(`  Total Amount: ${totalAmount.toFixed(2)} ETB`);
    console.log(`  Total Paid: ${totalPaid.toFixed(2)} ETB`);
    console.log(`  Total Balance: ${totalBalance.toFixed(2)} ETB`);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await db.end();
    await prisma.$disconnect();
  }
}

testPaymentFix();
