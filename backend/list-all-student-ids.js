const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listStudentIds() {
  try {
    const invoices = await prisma.invoice.findMany({
      select: {
        studentId: true,
        invoiceNumber: true
      },
      distinct: ['studentId'],
      take: 20
    });
    
    console.log(`Found ${invoices.length} unique student IDs:\n`);
    invoices.forEach(inv => {
      console.log(`StudentId: ${inv.studentId}`);
      console.log(`  Invoice: ${inv.invoiceNumber}\n`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

listStudentIds();
