const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkStudentInvoices() {
  try {
    const studentId = '00000000-0000-0000-0001-000000000001';
    
    const invoices = await prisma.invoice.findMany({
      where: { studentId },
      include: {
        items: true
      },
      orderBy: {
        issueDate: 'asc'
      }
    });
    
    console.log(`Found ${invoices.length} invoices for student ${studentId}\n`);
    
    invoices.forEach(inv => {
      console.log(`Invoice: ${inv.invoiceNumber}`);
      console.log(`  Month: ${inv.metadata?.month} (${inv.metadata?.monthNumber})`);
      console.log(`  Status: ${inv.status}`);
      console.log(`  Total: ${inv.totalAmount} ETB`);
      console.log(`  Net: ${inv.netAmount} ETB`);
      console.log(`  Paid: ${inv.paidAmount} ETB`);
      console.log(`  Issue Date: ${inv.issueDate.toISOString().split('T')[0]}`);
      console.log(`  Due Date: ${inv.dueDate.toISOString().split('T')[0]}`);
      console.log(`  Items:`);
      inv.items.forEach(item => {
        console.log(`    - ${item.description}: ${item.amount} ETB`);
      });
      console.log('');
    });
    
    const total = invoices.reduce((sum, inv) => sum + parseFloat(inv.netAmount), 0);
    console.log(`Total of all invoices: ${total} ETB`);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkStudentInvoices();
