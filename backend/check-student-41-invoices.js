const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkStudent41() {
  try {
    // Try different formats
    const formats = [
      '00000000-0000-0000-0041-000000000041',
      '00000000-0000-0000-0000-000000000041',
      '00000000-0000-0041-0000-000000000000'
    ];
    
    for (const format of formats) {
      console.log(`\nTrying format: ${format}`);
      const invoices = await prisma.invoice.findMany({
        where: { studentId: format },
        select: {
          studentId: true,
          invoiceNumber: true,
          status: true,
          netAmount: true,
          paidAmount: true
        },
        take: 5
      });
      
      if (invoices.length > 0) {
        console.log(`✅ Found ${invoices.length} invoices!`);
        invoices.forEach(inv => {
          console.log(`  - ${inv.invoiceNumber}: ${inv.status}, Amount: ${inv.netAmount}, Paid: ${inv.paidAmount}`);
        });
      } else {
        console.log('  No invoices found');
      }
    }
    
    // Also search by contains
    console.log('\n\nSearching all invoices containing "41":');
    const allInvoices = await prisma.invoice.findMany({
      where: {
        OR: [
          { studentId: { contains: '41' } },
          { studentId: { contains: '0041' } }
        ]
      },
      select: {
        studentId: true,
        invoiceNumber: true
      },
      take: 10
    });
    
    console.log(`Found ${allInvoices.length} invoices`);
    allInvoices.forEach(inv => {
      console.log(`  StudentId: ${inv.studentId}, Invoice: ${inv.invoiceNumber}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkStudent41();
