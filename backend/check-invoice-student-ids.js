const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkInvoiceStudentIds() {
  try {
    console.log('Checking invoice studentIds...\n');
    
    const invoices = await prisma.invoice.findMany({
      select: {
        studentId: true,
        invoiceNumber: true
      },
      take: 10
    });
    
    console.log('Sample invoices:');
    invoices.forEach(inv => {
      console.log(`  Invoice: ${inv.invoiceNumber}`);
      console.log(`  StudentId: ${inv.studentId}`);
      console.log(`  StudentId length: ${inv.studentId.length}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkInvoiceStudentIds();
