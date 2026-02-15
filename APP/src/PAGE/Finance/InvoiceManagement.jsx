import React, { useState, useEffect } from 'react';
import styles from './InvoiceManagement.module.css';

const InvoiceManagement = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [showGenerateModal, setShowGenerateModal] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, [filter]);

  const fetchInvoices = async () => {
    try {
      const params = new URLSearchParams();
      if (filter !== 'ALL') params.append('status', filter);
      
      const response = await fetch(`/api/finance/invoices?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setInvoices(data.data);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'DRAFT': '#9E9E9E',
      'ISSUED': '#2196F3',
      'PARTIALLY_PAID': '#FF9800',
      'PAID': '#4CAF50',
      'OVERDUE': '#F44336',
      'CANCELLED': '#757575'
    };
    return colors[status] || '#9E9E9E';
  };

  const filteredInvoices = invoices.filter(invoice =>
    invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Invoice Management</h1>
          <p>Generate and manage student invoices</p>
        </div>
        <button 
          className={styles.generateButton}
          onClick={() => setShowGenerateModal(true)}
        >
          + Generate Invoice
        </button>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.filterTabs}>
          {['ALL', 'ISSUED', 'PARTIALLY_PAID', 'PAID', 'OVERDUE'].map(status => (
            <button
              key={status}
              className={`${styles.filterTab} ${filter === status ? styles.active : ''}`}
              onClick={() => setFilter(status)}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>
        
        <input
          type="text"
          placeholder="Search by invoice number or student..."
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Invoices Table */}
      {loading ? (
        <div className={styles.loading}>Loading invoices...</div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Student ID</th>
                <th>Issue Date</th>
                <th>Due Date</th>
                <th>Total Amount</th>
                <th>Paid Amount</th>
                <th>Balance</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan="9" className={styles.noData}>
                    No invoices found
                  </td>
                </tr>
              ) : (
                filteredInvoices.map(invoice => (
                  <tr key={invoice.id}>
                    <td className={styles.invoiceNumber}>{invoice.invoiceNumber}</td>
                    <td>{invoice.studentId}</td>
                    <td>{new Date(invoice.issueDate).toLocaleDateString()}</td>
                    <td>{new Date(invoice.dueDate).toLocaleDateString()}</td>
                    <td>${parseFloat(invoice.netAmount).toFixed(2)}</td>
                    <td>${parseFloat(invoice.paidAmount).toFixed(2)}</td>
                    <td className={styles.balance}>
                      ${(parseFloat(invoice.netAmount) - parseFloat(invoice.paidAmount)).toFixed(2)}
                    </td>
                    <td>
                      <span 
                        className={styles.statusBadge}
                        style={{ backgroundColor: getStatusColor(invoice.status) }}
                      >
                        {invoice.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button className={styles.actionButton} title="View">👁️</button>
                        <button className={styles.actionButton} title="Download">📥</button>
                        <button className={styles.actionButton} title="Record Payment">💳</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Generate Invoice Modal */}
      {showGenerateModal && (
        <GenerateInvoiceModal 
          onClose={() => setShowGenerateModal(false)}
          onSuccess={() => {
            setShowGenerateModal(false);
            fetchInvoices();
          }}
        />
      )}
    </div>
  );
};

const GenerateInvoiceModal = ({ onClose, onSuccess }) => {
  const [students, setStudents] = useState([]);
  const [feeStructures, setFeeStructures] = useState([]);
  const [formData, setFormData] = useState({
    studentId: '',
    academicYearId: '',
    feeStructureId: '',
    dueDate: '',
    campusId: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
    fetchFeeStructures();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/students', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setStudents(data.data || data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchFeeStructures = async () => {
    try {
      const response = await fetch('/api/finance/fee-structures', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setFeeStructures(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching fee structures:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/finance/invoices/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Invoice generated successfully!');
        onSuccess();
      } else {
        const error = await response.json();
        alert(error.error?.message || 'Failed to generate invoice');
      }
    } catch (error) {
      console.error('Error generating invoice:', error);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Generate Invoice</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Student *</label>
            <select
              required
              value={formData.studentId}
              onChange={(e) => setFormData({...formData, studentId: e.target.value})}
            >
              <option value="">-- Select Student --</option>
              {students.map(student => (
                <option key={student.id} value={student.id}>
                  {student.name || `${student.firstName} ${student.lastName}`} - {student.className || student.class}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Fee Structure *</label>
            <select
              required
              value={formData.feeStructureId}
              onChange={(e) => setFormData({...formData, feeStructureId: e.target.value})}
            >
              <option value="">-- Select Fee Structure --</option>
              {feeStructures.map(fee => (
                <option key={fee.id} value={fee.id}>
                  {fee.name} - ${parseFloat(fee.amount).toFixed(2)}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Due Date *</label>
            <input
              type="date"
              required
              value={formData.dueDate}
              onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Academic Year *</label>
            <input
              type="text"
              required
              value={formData.academicYearId}
              onChange={(e) => setFormData({...formData, academicYearId: e.target.value})}
              placeholder="e.g., 2024-2025"
            />
          </div>

          <div className={styles.modalActions}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className={styles.submitButton}>
              {loading ? 'Generating...' : 'Generate Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoiceManagement;
