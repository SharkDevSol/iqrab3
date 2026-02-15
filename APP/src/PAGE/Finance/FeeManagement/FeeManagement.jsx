import React, { useState, useEffect } from 'react';
import styles from './FeeManagement.module.css';

const FeeManagement = () => {
  const [feeStructures, setFeeStructures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFee, setEditingFee] = useState(null);

  useEffect(() => {
    fetchFeeStructures();
  }, []);

  const fetchFeeStructures = async () => {
    try {
      // Try both 'authToken' and 'token' keys for compatibility
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      // Check if token is valid (not null, undefined, or the string "null")
      if (!token || token === 'null' || token === 'undefined') {
        console.error('No valid token found. Please log in again.');
        console.log('Checked localStorage keys: authToken, token');
        setLoading(false);
        return;
      }
      
      console.log('Token found, length:', token.length);
      
      const response = await fetch('/api/simple-fees', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setFeeStructures(data.data);
      } else {
        console.error('Failed to fetch:', response.status, response.statusText);
        if (response.status === 401 || response.status === 403) {
          console.error('Authentication failed. Please log in again.');
        }
      }
    } catch (error) {
      console.error('Error fetching fee structures:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this fee structure?')) return;
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const response = await fetch(`/api/simple-fees/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        fetchFeeStructures();
      } else {
        console.error('Failed to delete:', response.status);
      }
    } catch (error) {
      console.error('Error deleting fee structure:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Fee Management</h1>
          <p>Configure fee structures for different classes and terms</p>
        </div>
        <button className={styles.addButton} onClick={() => { setEditingFee(null); setShowModal(true); }}>
          + Add Fee Structure
        </button>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading fee structures...</div>
      ) : (
        <div className={styles.grid}>
          {feeStructures.length === 0 ? (
            <div className={styles.noData}>No fee structures found</div>
          ) : (
            feeStructures.map(fee => (
              <div key={fee.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>{fee.name}</h3>
                  <span className={`${styles.badge} ${fee.isActive ? styles.active : styles.inactive}`}>
                    {fee.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className={styles.cardBody}>
                  <p><strong>Classes:</strong> {fee.classNames && fee.classNames.length > 0 ? fee.classNames.join(', ') : 'All Classes'}</p>
                  <p><strong>Academic Year:</strong> {fee.academicYear}</p>
                  <p><strong>Term:</strong> {fee.term || 'All Terms'}</p>
                  <p><strong>Amount:</strong> <span className={styles.amount}>${parseFloat(fee.amount).toFixed(2)}</span></p>
                  <p><strong>Type:</strong> {fee.feeType === 'CUSTOM' && fee.customFeeName ? fee.customFeeName : fee.feeType}</p>
                  {fee.isRecurring && <p className={styles.recurring}>🔄 Recurring</p>}
                  {fee.dueDate && <p><strong>Due:</strong> {new Date(fee.dueDate).toLocaleDateString()}</p>}
                </div>
                <div className={styles.cardActions}>
                  <button onClick={() => { setEditingFee(fee); setShowModal(true); }}>✏️ Edit</button>
                  <button onClick={() => handleDelete(fee.id)}>🗑️ Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {showModal && (
        <FeeModal 
          fee={editingFee}
          onClose={() => setShowModal(false)}
          onSuccess={() => { setShowModal(false); fetchFeeStructures(); }}
        />
      )}
    </div>
  );
};

const FeeModal = ({ fee, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: fee?.name || '',
    classNames: fee?.classNames || [],
    academicYear: fee?.academicYear || new Date().getFullYear().toString(),
    term: fee?.term || '',
    amount: fee?.amount || '',
    feeType: fee?.feeType || 'TUITION',
    customFeeName: fee?.customFeeName || '',
    isRecurring: fee?.isRecurring || false,
    dueDate: fee?.dueDate || ''
  });
  const [loading, setLoading] = useState(false);
  const [metadata, setMetadata] = useState({
    classes: [],
    academicYears: [],
    terms: []
  });
  const [loadingMetadata, setLoadingMetadata] = useState(true);

  // Fetch metadata on mount
  useEffect(() => {
    fetchMetadata();
  }, []);

  const fetchMetadata = async () => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const response = await fetch('/api/simple-fees/metadata', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMetadata(data.data);
      }
    } catch (error) {
      console.error('Error fetching metadata:', error);
    } finally {
      setLoadingMetadata(false);
    }
  };

  const handleClassToggle = (className) => {
    setFormData(prev => ({
      ...prev,
      classNames: prev.classNames.includes(className)
        ? prev.classNames.filter(c => c !== className)
        : [...prev.classNames, className]
    }));
  };

  const handleSelectAllClasses = () => {
    setFormData(prev => ({
      ...prev,
      classNames: prev.classNames.length === metadata.classes.length ? [] : [...metadata.classes]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const url = fee ? `/api/simple-fees/${fee.id}` : '/api/simple-fees';
      const method = fee ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      
      if (response.ok) {
        alert(`Fee structure ${fee ? 'updated' : 'created'} successfully!`);
        onSuccess();
      } else {
        alert(result.error || 'Operation failed');
        console.error('Error response:', result);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Fee type benefits
  const feeTypeBenefits = {
    TUITION: '📚 Core educational fees - tracked separately for academic reporting',
    TRANSPORT: '🚌 Transportation costs - helps manage bus routes and schedules',
    LIBRARY: '📖 Library access and book fees - tracks reading program participation',
    LAB: '🔬 Laboratory and practical fees - monitors science program costs',
    SPORTS: '⚽ Sports and athletics fees - supports extracurricular activities',
    EXAM: '📝 Examination fees - separates assessment costs from tuition',
    BOOKS: '📕 Textbook and material fees - tracks educational resource costs',
    PHONE: '📱 Communication and technology fees - manages digital infrastructure',
    UNIFORM: '👔 Uniform and dress code fees - ensures proper student attire',
    MEALS: '🍽️ Meal and cafeteria fees - supports nutrition programs',
    CUSTOM: '💰 Custom fee type - create your own category for specific needs'
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className={styles.modalHeader}>
          <h2>{fee ? 'Edit Fee Structure' : 'Add Fee Structure'}</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        
        {loadingMetadata ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <p>Loading form data...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label>Fee Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g., Grade 1 Tuition Fee"
              />
            </div>

            {/* Multi-select Classes */}
            <div className={styles.formGroup}>
              <label>
                Classes * 
                <button 
                  type="button" 
                  onClick={handleSelectAllClasses}
                  style={{ 
                    marginLeft: '10px', 
                    padding: '4px 8px', 
                    fontSize: '0.85rem',
                    background: '#f0f0f0',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  {formData.classNames.length === metadata.classes.length ? 'Deselect All' : 'Select All'}
                </button>
              </label>
              <div style={{ 
                border: '1px solid #ddd', 
                borderRadius: '4px', 
                padding: '10px',
                maxHeight: '150px',
                overflowY: 'auto',
                background: '#f9f9f9'
              }}>
                {metadata.classes.length === 0 ? (
                  <p style={{ color: '#666', margin: 0 }}>No classes found in database</p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '8px' }}>
                    {metadata.classes.map(className => (
                      <label 
                        key={className}
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '6px',
                          padding: '6px',
                          background: formData.classNames.includes(className) ? '#e3f2fd' : 'white',
                          border: `1px solid ${formData.classNames.includes(className) ? '#2196F3' : '#ddd'}`,
                          borderRadius: '4px',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={formData.classNames.includes(className)}
                          onChange={() => handleClassToggle(className)}
                        />
                        <span style={{ fontSize: '0.9rem' }}>{className}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              <small style={{ color: '#666', display: 'block', marginTop: '5px' }}>
                Selected: {formData.classNames.length} class(es)
              </small>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Academic Year *</label>
                <select
                  required
                  value={formData.academicYear}
                  onChange={(e) => setFormData({...formData, academicYear: e.target.value})}
                >
                  {metadata.academicYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Term</label>
                <select
                  value={formData.term}
                  onChange={(e) => setFormData({...formData, term: e.target.value})}
                >
                  <option value="">All Terms</option>
                  {metadata.terms.map(term => (
                    <option key={term} value={term}>{term}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Amount *</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                placeholder="0.00"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Fee Type *</label>
              <select
                required
                value={formData.feeType}
                onChange={(e) => setFormData({...formData, feeType: e.target.value})}
              >
                <option value="TUITION">Tuition</option>
                <option value="TRANSPORT">Transport</option>
                <option value="LIBRARY">Library</option>
                <option value="LAB">Laboratory</option>
                <option value="SPORTS">Sports</option>
                <option value="EXAM">Examination</option>
                <option value="BOOKS">Books</option>
                <option value="PHONE">Phone</option>
                <option value="UNIFORM">Uniform</option>
                <option value="MEALS">Meals</option>
                <option value="CUSTOM">Custom/Other</option>
              </select>
              {formData.feeType && (
                <div style={{ 
                  marginTop: '8px', 
                  padding: '10px', 
                  background: '#f0f7ff', 
                  borderLeft: '3px solid #2196F3',
                  borderRadius: '4px',
                  fontSize: '0.9rem'
                }}>
                  <strong>Benefit:</strong> {feeTypeBenefits[formData.feeType]}
                </div>
              )}
            </div>

            {formData.feeType === 'CUSTOM' && (
              <div className={styles.formGroup}>
                <label>Custom Fee Name *</label>
                <input
                  type="text"
                  required
                  value={formData.customFeeName || ''}
                  onChange={(e) => setFormData({...formData, customFeeName: e.target.value})}
                  placeholder="Enter custom fee name"
                />
              </div>
            )}

            <div className={styles.formGroup}>
              <label>Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
              />
            </div>

            <div className={styles.checkboxGroup}>
              <label>
                <input
                  type="checkbox"
                  checked={formData.isRecurring}
                  onChange={(e) => setFormData({...formData, isRecurring: e.target.checked})}
                />
                <span>Recurring Fee (charged every term/year)</span>
              </label>
            </div>

            <div className={styles.modalActions}>
              <button type="button" onClick={onClose} className={styles.cancelButton}>Cancel</button>
              <button type="submit" disabled={loading || formData.classNames.length === 0} className={styles.submitButton}>
                {loading ? 'Saving...' : 'Save Fee Structure'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default FeeManagement;
