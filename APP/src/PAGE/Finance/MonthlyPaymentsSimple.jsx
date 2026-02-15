import { useState, useEffect } from 'react';
import styles from './MonthlyPayments.module.css';
import api from '../../utils/api';

function uuidToCompositeId(uuid) {
  try {
    const parts = uuid.split('-');
    if (parts.length !== 5) return uuid;
    const schoolId = parseInt(parts[3], 10);
    const classId = parseInt(parts[4], 10);
    return `${schoolId}-${classId}`;
  } catch (error) {
    return uuid;
  }
}

const MonthlyPaymentsSimple = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [studentNames, setStudentNames] = useState({});
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    paymentMethod: 'CASH',
    paymentDate: new Date().toISOString().split('T')[0],
    reference: '',
    notes: ''
  });
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [showMultiMonthModal, setShowMultiMonthModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentUnpaidInvoices, setStudentUnpaidInvoices] = useState([]);
  const [selectedInvoicesForPayment, setSelectedInvoicesForPayment] = useState([]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    fetchInvoices();
  }, [selectedMonth, selectedYear]);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const response = await api.get('/finance/invoices');
      const allInvoices = response.data.data || [];
      const filtered = allInvoices.filter(inv => {
        const issueDate = new Date(inv.issueDate);
        return issueDate.getMonth() + 1 === selectedMonth && issueDate.getFullYear() === selectedYear;
      });
      setInvoices(filtered);
      await fetchStudentNames(filtered);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentNames = async (invoiceList) => {
    try {
      const response = await api.get('/finance/all-students');
      const allStudents = response.data.data || [];
      const nameMap = {};
      allStudents.forEach(student => {
        nameMap[student.id] = {
          name: student.name,
          className: student.className,
          guardianName: student.guardianName,
          guardianPhone: student.guardianPhone
        };
      });
      setStudentNames(nameMap);
    } catch (error) {
      console.error('Error fetching student names:', error);
    }
  };

  const handleRecordPayment = (invoice) => {
    const balance = parseFloat(invoice.netAmount) - parseFloat(invoice.paidAmount);
    setSelectedInvoice(invoice);
    setPaymentForm({
      amount: balance.toFixed(2),
      paymentMethod: 'CASH',
      paymentDate: new Date().toISOString().split('T')[0],
      reference: '',
      notes: ''
    });
    setShowPaymentModal(true);
  };

  const handlePayMultipleMonths = async (invoice) => {
    const studentId = invoice.studentId;
    const studentCompositeId = uuidToCompositeId(studentId);
    const studentInfo = studentNames[studentCompositeId];
    
    setSelectedStudent({
      id: studentCompositeId,
      uuid: studentId,
      name: studentInfo?.name || 'Unknown',
      className: studentInfo?.className || '-'
    });

    try {
      // Fetch all unpaid invoices for this student
      const response = await api.get('/finance/invoices');
      const allInvoices = response.data.data || [];
      
      const unpaidInvoices = allInvoices.filter(inv => 
        inv.studentId === studentId && 
        inv.status !== 'PAID'
      ).sort((a, b) => new Date(a.issueDate) - new Date(b.issueDate)); // Sort by oldest first

      setStudentUnpaidInvoices(unpaidInvoices);
      setSelectedInvoicesForPayment(unpaidInvoices.map(inv => inv.id)); // Select all by default
      
      const totalAmount = unpaidInvoices.reduce((sum, inv) => 
        sum + (parseFloat(inv.netAmount) - parseFloat(inv.paidAmount)), 0
      );

      setPaymentForm({
        amount: totalAmount.toFixed(2),
        paymentMethod: 'CASH',
        paymentDate: new Date().toISOString().split('T')[0],
        reference: '',
        notes: ''
      });

      setShowMultiMonthModal(true);
    } catch (error) {
      console.error('Error fetching student invoices:', error);
      alert('Failed to load student invoices');
    }
  };

  const handleToggleInvoiceSelection = (invoiceId) => {
    setSelectedInvoicesForPayment(prev => {
      if (prev.includes(invoiceId)) {
        return prev.filter(id => id !== invoiceId);
      } else {
        return [...prev, invoiceId];
      }
    });
  };

  const calculateSelectedTotal = () => {
    return studentUnpaidInvoices
      .filter(inv => selectedInvoicesForPayment.includes(inv.id))
      .reduce((sum, inv) => sum + (parseFloat(inv.netAmount) - parseFloat(inv.paidAmount)), 0);
  };

  const handleSubmitMultiMonthPayment = async (e) => {
    e.preventDefault();
    
    if (selectedInvoicesForPayment.length === 0) {
      alert('Please select at least one invoice to pay');
      return;
    }

    const totalAmount = parseFloat(paymentForm.amount);
    const selectedTotal = calculateSelectedTotal();

    if (totalAmount > selectedTotal) {
      alert(`Payment amount ($${totalAmount}) cannot exceed total selected invoices ($${selectedTotal.toFixed(2)})`);
      return;
    }

    try {
      // Sort invoices by date (oldest first) to pay in order
      const sortedInvoices = studentUnpaidInvoices
        .filter(inv => selectedInvoicesForPayment.includes(inv.id))
        .sort((a, b) => new Date(a.issueDate) - new Date(b.issueDate));

      let remainingAmount = totalAmount;
      let paymentsRecorded = 0;

      for (const invoice of sortedInvoices) {
        if (remainingAmount <= 0) break;

        const invoiceBalance = parseFloat(invoice.netAmount) - parseFloat(invoice.paidAmount);
        const amountToPay = Math.min(remainingAmount, invoiceBalance);

        await api.post('/finance/payments', {
          invoiceId: invoice.id,
          amount: amountToPay,
          paymentMethod: paymentForm.paymentMethod,
          paymentDate: new Date(paymentForm.paymentDate).toISOString(),
          reference: paymentForm.reference || null,
          notes: paymentForm.notes || `Multi-month payment (${paymentsRecorded + 1}/${sortedInvoices.length})`
        });

        remainingAmount -= amountToPay;
        paymentsRecorded++;
      }

      alert(`Payment recorded successfully!\n\n${paymentsRecorded} invoice(s) paid\nTotal: $${totalAmount.toFixed(2)}`);
      setShowMultiMonthModal(false);
      setSelectedStudent(null);
      setStudentUnpaidInvoices([]);
      setSelectedInvoicesForPayment([]);
      fetchInvoices();
    } catch (error) {
      console.error('Error recording multi-month payment:', error);
      alert('Failed to record payment: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    try {
      const paymentData = {
        invoiceId: selectedInvoice.id,
        amount: parseFloat(paymentForm.amount),
        paymentMethod: paymentForm.paymentMethod,
        paymentDate: new Date(paymentForm.paymentDate).toISOString(),
        reference: paymentForm.reference || null,
        notes: paymentForm.notes || null
      };
      await api.post('/finance/payments', paymentData);
      alert('Payment recorded successfully!');
      setShowPaymentModal(false);
      setSelectedInvoice(null);
      fetchInvoices();
    } catch (error) {
      console.error('Error recording payment:', error);
      alert('Failed to record payment: ' + (error.response?.data?.message || error.message));
    }
  };

  const getFilteredInvoices = () => {
    let filtered = invoices;
    if (filterStatus !== 'ALL') {
      filtered = filtered.filter(inv => inv.status === filterStatus);
    }
    if (searchTerm) {
      filtered = filtered.filter(inv => {
        const studentId = uuidToCompositeId(inv.studentId);
        const studentInfo = studentNames[studentId];
        const studentName = studentInfo?.name || '';
        return (
          inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          studentId.includes(searchTerm) ||
          studentName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }
    return filtered;
  };

  const filteredInvoices = getFilteredInvoices();
  const stats = {
    total: invoices.length,
    paid: invoices.filter(inv => inv.status === 'PAID').length,
    partial: invoices.filter(inv => inv.status === 'PARTIALLY_PAID').length,
    pending: invoices.filter(inv => inv.status === 'ISSUED').length,
    overdue: invoices.filter(inv => {
      const dueDate = new Date(inv.dueDate);
      const today = new Date();
      return inv.status !== 'PAID' && dueDate < today;
    }).length,
    totalAmount: invoices.reduce((sum, inv) => sum + parseFloat(inv.netAmount), 0),
    collected: invoices.reduce((sum, inv) => sum + parseFloat(inv.paidAmount), 0),
    pendingAmount: invoices.reduce((sum, inv) => sum + (parseFloat(inv.netAmount) - parseFloat(inv.paidAmount)), 0)
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>💰 Monthly Payments</h1>
          <p className={styles.subtitle}>Track and manage student fee payments</p>
        </div>
        <div className={styles.monthSelector}>
          <select value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))} className={styles.select}>
            {months.map((month, index) => (
              <option key={index} value={index + 1}>{month}</option>
            ))}
          </select>
          <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))} className={styles.select}>
            {[2024, 2025, 2026, 2027].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading invoices...</p>
        </div>
      ) : invoices.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📄</div>
          <h2>No Invoices Found</h2>
          <p>No invoices have been generated for {months[selectedMonth - 1]} {selectedYear}</p>
          <p className={styles.hint}>Go to <strong>Finance → Payment Settings</strong> to generate invoices</p>
        </div>
      ) : (
        <>
          <div className={styles.summaryCards}>
            <div className={`${styles.card} ${styles.cardInfo}`}>
              <div className={styles.cardIcon}>📊</div>
              <h3>Total Invoices</h3>
              <div className={styles.bigNumber}>{stats.total}</div>
              <p className={styles.cardSubtext}>{stats.paid} paid • {stats.pending} pending</p>
            </div>
            <div className={`${styles.card} ${styles.cardSuccess}`}>
              <div className={styles.cardIcon}>💵</div>
              <h3>Total Amount</h3>
              <div className={styles.bigNumber}>${stats.totalAmount.toFixed(2)}</div>
              <p className={styles.cardSubtext}>Expected revenue</p>
            </div>
            <div className={`${styles.card} ${styles.cardSuccess}`}>
              <div className={styles.cardIcon}>✅</div>
              <h3>Collected</h3>
              <div className={styles.bigNumber}>${stats.collected.toFixed(2)}</div>
              <p className={styles.cardSubtext}>{((stats.collected / stats.totalAmount) * 100).toFixed(1)}% collected</p>
            </div>
            <div className={`${styles.card} ${styles.cardWarning}`}>
              <div className={styles.cardIcon}>⏳</div>
              <h3>Pending</h3>
              <div className={styles.bigNumber}>${stats.pendingAmount.toFixed(2)}</div>
              <p className={styles.cardSubtext}>{stats.overdue > 0 ? `${stats.overdue} overdue` : 'All on time'}</p>
            </div>
          </div>

          <div className={styles.filtersBar}>
            <div className={styles.searchBox}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder="Search by invoice #, student ID, or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            <div className={styles.statusFilters}>
              <button className={`${styles.filterBtn} ${filterStatus === 'ALL' ? styles.active : ''}`} onClick={() => setFilterStatus('ALL')}>
                All ({invoices.length})
              </button>
              <button className={`${styles.filterBtn} ${filterStatus === 'PAID' ? styles.active : ''}`} onClick={() => setFilterStatus('PAID')}>
                Paid ({stats.paid})
              </button>
              <button className={`${styles.filterBtn} ${filterStatus === 'PARTIALLY_PAID' ? styles.active : ''}`} onClick={() => setFilterStatus('PARTIALLY_PAID')}>
                Partial ({stats.partial})
              </button>
              <button className={`${styles.filterBtn} ${filterStatus === 'ISSUED' ? styles.active : ''}`} onClick={() => setFilterStatus('ISSUED')}>
                Pending ({stats.pending})
              </button>
            </div>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Student</th>
                  <th>Class</th>
                  <th>Amount</th>
                  <th>Paid</th>
                  <th>Balance</th>
                  <th>Status</th>
                  <th>Due Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan="9" className={styles.noResults}>No invoices match your search criteria</td>
                  </tr>
                ) : (
                  filteredInvoices.map(invoice => {
                    const studentId = uuidToCompositeId(invoice.studentId);
                    const studentInfo = studentNames[studentId];
                    const balance = parseFloat(invoice.netAmount) - parseFloat(invoice.paidAmount);
                    const isOverdue = new Date(invoice.dueDate) < new Date() && invoice.status !== 'PAID';
                    return (
                      <tr key={invoice.id} className={isOverdue ? styles.overdueRow : ''}>
                        <td><span className={styles.invoiceNumber}>{invoice.invoiceNumber}</span></td>
                        <td>
                          <div className={styles.studentInfo}>
                            <strong>{studentInfo?.name || 'Unknown'}</strong>
                            <small>ID: {studentId}</small>
                          </div>
                        </td>
                        <td><span className={styles.className}>{studentInfo?.className || '-'}</span></td>
                        <td><strong>${parseFloat(invoice.netAmount).toFixed(2)}</strong></td>
                        <td><span className={styles.paidAmount}>${parseFloat(invoice.paidAmount).toFixed(2)}</span></td>
                        <td><strong className={balance > 0 ? styles.balanceDue : styles.balancePaid}>${balance.toFixed(2)}</strong></td>
                        <td>
                          <span className={`${styles.statusBadge} ${styles['status' + invoice.status]}`}>
                            {invoice.status === 'ISSUED' ? 'PENDING' : invoice.status.replace('_', ' ')}
                          </span>
                          {isOverdue && <span className={styles.overdueLabel}>OVERDUE</span>}
                        </td>
                        <td><span className={isOverdue ? styles.overdueDateText : ''}>{new Date(invoice.dueDate).toLocaleDateString()}</span></td>
                        <td>
                          {invoice.status !== 'PAID' ? (
                            <div className={styles.actionButtons}>
                              <button className={styles.payButton} onClick={() => handleRecordPayment(invoice)}>💳 Pay This Month</button>
                              <button className={styles.payMultiButton} onClick={() => handlePayMultipleMonths(invoice)}>📅 Pay Multiple Months</button>
                            </div>
                          ) : (
                            <span className={styles.paidLabel}>✓ Paid</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {showPaymentModal && selectedInvoice && (
        <div className={styles.modal} onClick={() => setShowPaymentModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>💳 Record Payment</h2>
            <div className={styles.invoiceDetails}>
              <p><strong>Invoice:</strong> {selectedInvoice.invoiceNumber}</p>
              <p><strong>Student:</strong> {studentNames[uuidToCompositeId(selectedInvoice.studentId)]?.name || 'Unknown'}</p>
              <p><strong>Total Amount:</strong> ${parseFloat(selectedInvoice.netAmount).toFixed(2)}</p>
              <p><strong>Already Paid:</strong> ${parseFloat(selectedInvoice.paidAmount).toFixed(2)}</p>
              <p><strong>Balance Due:</strong> <span className={styles.balanceHighlight}>${(parseFloat(selectedInvoice.netAmount) - parseFloat(selectedInvoice.paidAmount)).toFixed(2)}</span></p>
            </div>
            <form onSubmit={handleSubmitPayment}>
              <div className={styles.formGroup}>
                <label>Payment Amount *</label>
                <input
                  type="number"
                  step="0.01"
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({...paymentForm, amount: e.target.value})}
                  required
                  min="0.01"
                  max={parseFloat(selectedInvoice.netAmount) - parseFloat(selectedInvoice.paidAmount)}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Payment Method *</label>
                <select value={paymentForm.paymentMethod} onChange={(e) => setPaymentForm({...paymentForm, paymentMethod: e.target.value})} required>
                  <option value="CASH">Cash</option>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                  <option value="MOBILE_MONEY">Mobile Money</option>
                  <option value="CHEQUE">Cheque</option>
                  <option value="CARD">Card</option>
                  <option value="ONLINE">Online Payment</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Payment Date *</label>
                <input
                  type="date"
                  value={paymentForm.paymentDate}
                  onChange={(e) => setPaymentForm({...paymentForm, paymentDate: e.target.value})}
                  required
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Reference Number</label>
                <input
                  type="text"
                  value={paymentForm.reference}
                  onChange={(e) => setPaymentForm({...paymentForm, reference: e.target.value})}
                  placeholder="Transaction ID, Receipt #, etc."
                />
              </div>
              <div className={styles.formGroup}>
                <label>Notes</label>
                <textarea
                  value={paymentForm.notes}
                  onChange={(e) => setPaymentForm({...paymentForm, notes: e.target.value})}
                  placeholder="Additional notes (optional)"
                  rows="3"
                />
              </div>
              <div className={styles.modalActions}>
                <button type="submit" className={styles.submitButton}>✓ Record Payment</button>
                <button type="button" className={styles.cancelButton} onClick={() => setShowPaymentModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showMultiMonthModal && selectedStudent && (
        <div className={styles.modal} onClick={() => setShowMultiMonthModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>📅 Pay Multiple Months</h2>
            <div className={styles.studentHeader}>
              <p><strong>Student:</strong> {selectedStudent.name}</p>
              <p><strong>Class:</strong> {selectedStudent.className}</p>
              <p><strong>ID:</strong> {selectedStudent.id}</p>
            </div>

            <div className={styles.invoiceSelection}>
              <h3>Select Invoices to Pay:</h3>
              <div className={styles.invoiceList}>
                {studentUnpaidInvoices.map(invoice => {
                  const balance = parseFloat(invoice.netAmount) - parseFloat(invoice.paidAmount);
                  const issueDate = new Date(invoice.issueDate);
                  const monthName = issueDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                  const isOverdue = new Date(invoice.dueDate) < new Date();
                  
                  return (
                    <div key={invoice.id} className={`${styles.invoiceItem} ${isOverdue ? styles.overdueItem : ''}`}>
                      <label className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={selectedInvoicesForPayment.includes(invoice.id)}
                          onChange={() => handleToggleInvoiceSelection(invoice.id)}
                        />
                        <div className={styles.invoiceItemDetails}>
                          <div className={styles.invoiceItemHeader}>
                            <strong>{monthName}</strong>
                            {isOverdue && <span className={styles.overdueTag}>OVERDUE</span>}
                          </div>
                          <div className={styles.invoiceItemInfo}>
                            <span>Invoice: {invoice.invoiceNumber}</span>
                            <span>Due: {new Date(invoice.dueDate).toLocaleDateString()}</span>
                          </div>
                          <div className={styles.invoiceItemAmount}>
                            <span>Total: ${parseFloat(invoice.netAmount).toFixed(2)}</span>
                            {parseFloat(invoice.paidAmount) > 0 && (
                              <span className={styles.paidTag}>Paid: ${parseFloat(invoice.paidAmount).toFixed(2)}</span>
                            )}
                            <strong>Balance: ${balance.toFixed(2)}</strong>
                          </div>
                        </div>
                      </label>
                    </div>
                  );
                })}
              </div>
              
              <div className={styles.selectionSummary}>
                <p><strong>Selected Invoices:</strong> {selectedInvoicesForPayment.length} of {studentUnpaidInvoices.length}</p>
                <p><strong>Total Amount:</strong> ${calculateSelectedTotal().toFixed(2)}</p>
              </div>
            </div>

            <form onSubmit={handleSubmitMultiMonthPayment}>
              <div className={styles.formGroup}>
                <label>Payment Amount *</label>
                <input
                  type="number"
                  step="0.01"
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({...paymentForm, amount: e.target.value})}
                  required
                  min="0.01"
                  max={calculateSelectedTotal()}
                />
                <small className={styles.hint}>
                  Maximum: ${calculateSelectedTotal().toFixed(2)} (total of selected invoices)
                </small>
              </div>

              <div className={styles.formGroup}>
                <label>Payment Method *</label>
                <select value={paymentForm.paymentMethod} onChange={(e) => setPaymentForm({...paymentForm, paymentMethod: e.target.value})} required>
                  <option value="CASH">Cash</option>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                  <option value="MOBILE_MONEY">Mobile Money</option>
                  <option value="CHEQUE">Cheque</option>
                  <option value="CARD">Card</option>
                  <option value="ONLINE">Online Payment</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Payment Date *</label>
                <input
                  type="date"
                  value={paymentForm.paymentDate}
                  onChange={(e) => setPaymentForm({...paymentForm, paymentDate: e.target.value})}
                  required
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Reference Number</label>
                <input
                  type="text"
                  value={paymentForm.reference}
                  onChange={(e) => setPaymentForm({...paymentForm, reference: e.target.value})}
                  placeholder="Transaction ID, Receipt #, etc."
                />
              </div>

              <div className={styles.formGroup}>
                <label>Notes</label>
                <textarea
                  value={paymentForm.notes}
                  onChange={(e) => setPaymentForm({...paymentForm, notes: e.target.value})}
                  placeholder="Additional notes (optional)"
                  rows="3"
                />
              </div>

              <div className={styles.paymentInfo}>
                <p>💡 Payment will be applied to invoices in chronological order (oldest first)</p>
              </div>

              <div className={styles.modalActions}>
                <button type="submit" className={styles.submitButton}>✓ Record Payment</button>
                <button type="button" className={styles.cancelButton} onClick={() => setShowMultiMonthModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyPaymentsSimple;
