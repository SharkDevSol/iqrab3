import React, { useState, useEffect } from 'react';
import styles from './PaymentManagement.module.css';

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPayments();
    fetchPendingInvoices();
  }, [filter]);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const params = new URLSearchParams();
      if (filter !== 'ALL') params.append('status', filter);
      
      const response = await fetch(`/api/finance/payments?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPayments(data.data);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingInvoices = async () => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const response = await fetch('/api/finance/invoices?status=ISSUED,PARTIALLY_PAID', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setInvoices(data.data);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'PENDING': '#FF9800',
      'COMPLETED': '#4CAF50',
      'FAILED': '#F44336',
      'REFUNDED': '#9E9E9E'
    };
    return colors[status] || '#9E9E9E';
  };

  const filteredPayments = payments.filter(payment =>
    payment.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Payment Management</h1>
          <p>Record and track student payments</p>
        </div>
        <button 
          className={styles.recordButton}
          onClick={() => setShowRecordModal(true)}
        >
          + Record Payment
        </button>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.filterTabs}>
          {['ALL', 'COMPLETED', 'PENDING', 'FAILED'].map(status => (
            <button
              key={status}
              className={`${styles.filterTab} ${filter === status ? styles.active : ''}`}
              onClick={() => setFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>
        
        <input
          type="text"
          placeholder="Search by receipt number or student..."
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Payments Table */}
      {loading ? (
        <div className={styles.loading}>Loading payments...</div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Receipt #</th>
                <th>Student ID</th>
                <th>Payment Date</th>
                <th>Amount</th>
                <th>Fee Type</th>
                <th>Payment Method</th>
                <th>Reference</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="9" className={styles.noData}>
                    No payments found
                  </td>
                </tr>
              ) : (
                filteredPayments.map(payment => {
                  // Extract fee types from allocations
                  const feeTypes = payment.allocations?.map(alloc => {
                    const invoice = alloc.invoice;
                    if (invoice?.metadata?.feeType) {
                      return invoice.metadata.feeType === 'CUSTOM' && invoice.metadata.customFeeName 
                        ? invoice.metadata.customFeeName 
                        : invoice.metadata.feeType;
                    }
                    return 'N/A';
                  }).join(', ') || 'N/A';

                  return (
                    <tr key={payment.id}>
                      <td className={styles.receiptNumber}>{payment.receiptNumber}</td>
                      <td>{payment.studentId}</td>
                      <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                      <td className={styles.amount}>${parseFloat(payment.amount).toFixed(2)}</td>
                      <td className={styles.feeType}>{feeTypes}</td>
                      <td>{payment.paymentMethod}</td>
                      <td>{payment.referenceNumber || '-'}</td>
                      <td>
                        <span 
                          className={styles.statusBadge}
                          style={{ backgroundColor: getStatusColor(payment.status) }}
                        >
                          {payment.status}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actions}>
                          <button className={styles.actionButton} title="View">👁️</button>
                          <button className={styles.actionButton} title="Print Receipt">🖨️</button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Record Payment Modal */}
      {showRecordModal && (
        <RecordPaymentModal 
          invoices={invoices}
          onClose={() => setShowRecordModal(false)}
          onSuccess={() => {
            setShowRecordModal(false);
            fetchPayments();
            fetchPendingInvoices();
          }}
        />
      )}
    </div>
  );
};

const RecordPaymentModal = ({ invoices, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    studentId: '',
    invoiceId: '',
    amount: '',
    paymentMethod: 'CASH',
    referenceNumber: '',
    campusId: ''
  });
  const [loading, setLoading] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const handleInvoiceSelect = (invoiceId) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (invoice) {
      setSelectedInvoice(invoice);
      setFormData({
        ...formData,
        invoiceId,
        studentId: invoice.studentId,
        campusId: invoice.campusId,
        amount: (parseFloat(invoice.netAmount) - parseFloat(invoice.paidAmount)).toFixed(2)
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const response = await fetch('/api/finance/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Payment recorded successfully!');
        onSuccess();
      } else {
        const error = await response.json();
        alert(error.error?.message || 'Failed to record payment');
      }
    } catch (error) {
      console.error('Error recording payment:', error);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Record Payment</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Select Invoice *</label>
            <select
              required
              value={formData.invoiceId}
              onChange={(e) => handleInvoiceSelect(e.target.value)}
            >
              <option value="">-- Select Invoice --</option>
              {invoices.map(invoice => (
                <option key={invoice.id} value={invoice.id}>
                  {invoice.invoiceNumber} - Student: {invoice.studentId} - Balance: $
                  {(parseFloat(invoice.netAmount) - parseFloat(invoice.paidAmount)).toFixed(2)}
                </option>
              ))}
            </select>
          </div>

          {selectedInvoice && (
            <div className={styles.invoiceInfo}>
              <p><strong>Invoice:</strong> {selectedInvoice.invoiceNumber}</p>
              <p><strong>Total:</strong> ${parseFloat(selectedInvoice.netAmount).toFixed(2)}</p>
              <p><strong>Paid:</strong> ${parseFloat(selectedInvoice.paidAmount).toFixed(2)}</p>
              <p><strong>Balance:</strong> ${(parseFloat(selectedInvoice.netAmount) - parseFloat(selectedInvoice.paidAmount)).toFixed(2)}</p>
            </div>
          )}

          <div className={styles.formGroup}>
            <label>Amount *</label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Payment Method *</label>
            <select
              required
              value={formData.paymentMethod}
              onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
            >
              <option value="CASH">Cash</option>
              <option value="BANK_TRANSFER">Bank Transfer</option>
              <option value="CHEQUE">Cheque</option>
              <option value="CARD">Card</option>
              <option value="ONLINE">Online</option>
              <option value="MOBILE_MONEY">Mobile Money</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Reference Number</label>
            <input
              type="text"
              value={formData.referenceNumber}
              onChange={(e) => setFormData({...formData, referenceNumber: e.target.value})}
              placeholder="Transaction reference (optional)"
            />
          </div>

          <div className={styles.modalActions}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className={styles.submitButton}>
              {loading ? 'Recording...' : 'Record Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentManagement;
