const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function findCorrectStudent() {
  try {
    // The admin panel shows student ID: 00000000-0000-0000-0041-000000000001
    const studentId = '00000000-0000-0000-0041-000000000001';
    
    console.log(`Checking invoices for: ${studentId}\n`);
    
    const invoices = await prisma.invoice.findMany({
      where: { studentId },
      include: { items: true },
      orderBy: { issueDate: 'asc' }
    });
    
    if (invoices.length === 0) {
      console.log('No invoices found for this student ID');
      console.log('\nLet me search for invoices with "411" in the ID...\n');
      
      // Search for all invoices
      const allInvoices = await prisma.invoice.findMany({
        select: {
          studentId: true,
          invoiceNumber: true,
          totalAmount: true,
          metadata: true
        },
        take: 50
      });
      
      const matching = allInvoices.filter(inv => 
        inv.studentId.includes('0041') || 
        inv.invoiceNumber.includes('411')
      );
      
      console.log(`Found ${matching.length} invoices with '0041' or '411':`);
      matching.forEach(inv => {
        console.log(`  ${inv.studentId} - ${inv.invoiceNumber} - ${inv.totalAmount} ETB - ${inv.metadata?.month}`);
      });
    } else {
      console.log(`Found ${invoices.length} invoices:\n`);
      invoices.forEach(inv => {
        console.log(`${inv.metadata?.month}: ${inv.totalAmount} ETB (Net: ${inv.netAmount} ETB)`);
        inv.items.forEach(item => {
          console.log(`  - ${item.description}: ${item.amount} ETB`);
        });
        console.log('');
      });
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

findCorrectStudent();
