import React, { useState, useEffect } from 'react';
import styles from './FeeManagement/FeeManagement.module.css';

const FeeTypeManagement = () => {
  const [feeTypes, setFeeTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingType, setEditingType] = useState(null);

  // Predefined fee types
  const predefinedTypes = [
    { id: 'TUITION', name: 'Tuition', icon: '📚', color: '#4CAF50' },
    { id: 'TRANSPORT', name: 'Transport', icon: '🚌', color: '#FF9800' },
    { id: 'LIBRARY', name: 'Library', icon: '📖', color: '#2196F3' },
    { id: 'LAB', name: 'Laboratory', icon: '🔬', color: '#9C27B0' },
    { id: 'SPORTS', name: 'Sports', icon: '⚽', color: '#F44336' },
    { id: 'EXAM', name: 'Examination', icon: '📝', color: '#FF5722' },
    { id: 'BOOKS', name: 'Books', icon: '📕', color: '#795548' },
    { id: 'PHONE', name: 'Phone', icon: '📱', color: '#607D8B' },
    { id: 'UNIFORM', name: 'Uniform', icon: '👔', color: '#3F51B5' },
    { id: 'MEALS', name: 'Meals', icon: '🍽️', color: '#FF5722' }
  ];

  useEffect(() => {
    fetchCustomFeeTypes();
  }, []);

  const fetchCustomFeeTypes = async () => {
    try {
      // Fetch fee structures to get custom fee types
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const response = await fetch('/api/simple-fees', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        // Extract unique custom fee types
        const customTypes = [];
        data.data.forEach(structure => {
          if (structure.feeType === 'CUSTOM' && structure.customFeeName) {
            const existing = customTypes.find(ct => ct.name === structure.customFeeName);
            if (!existing) {
              customTypes.push({
                id: structure.customFeeName,
                name: structure.customFeeName,
                icon: '💰',
                color: '#00BCD4',
                isCustom: true
              });
            }
          }
        });
        setFeeTypes(customTypes);
      }
    } catch (error) {
      console.error('Error fetching custom fee types:', error);
    } finally {
      setLoading(false);
    }
  };

  const allFeeTypes = [...predefinedTypes, ...feeTypes];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Fee Type Management</h1>
          <p>Manage different types of fees for your institution</p>
        </div>
        <button 
          className={styles.addButton} 
          onClick={() => { setEditingType(null); setShowModal(true); }}
        >
          + Add Custom Fee Type
        </button>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading fee types...</div>
      ) : (
        <>
          <div className={styles.section}>
            <h2>Predefined Fee Types</h2>
            <div className={styles.grid}>
              {predefinedTypes.map(type => (
                <div key={type.id} className={styles.card} style={{ borderLeft: `4px solid ${type.color}` }}>
                  <div className={styles.cardHeader}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '2rem' }}>{type.icon}</span>
                      <h3>{type.name}</h3>
                    </div>
                    <span className={`${styles.badge} ${styles.active}`}>Built-in</span>
                  </div>
                  <div className={styles.cardBody}>
                    <p><strong>Type ID:</strong> {type.id}</p>
                    <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '8px' }}>
                      This is a standard fee type available for all fee structures
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {feeTypes.length > 0 && (
            <div className={styles.section} style={{ marginTop: '40px' }}>
              <h2>Custom Fee Types</h2>
              <div className={styles.grid}>
                {feeTypes.map(type => (
                  <div key={type.id} className={styles.card} style={{ borderLeft: `4px solid ${type.color}` }}>
                    <div className={styles.cardHeader}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '2rem' }}>{type.icon}</span>
                        <h3>{type.name}</h3>
                      </div>
                      <span className={`${styles.badge}`} style={{ backgroundColor: '#00BCD4' }}>Custom</span>
                    </div>
                    <div className={styles.cardBody}>
                      <p><strong>Type ID:</strong> {type.id}</p>
                      <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '8px' }}>
                        Custom fee type created for specific needs
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {showModal && (
        <CustomFeeTypeModal 
          type={editingType}
          onClose={() => setShowModal(false)}
          onSuccess={() => { 
            setShowModal(false); 
            fetchCustomFeeTypes(); 
          }}
        />
      )}
    </div>
  );
};

const CustomFeeTypeModal = ({ type, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: type?.name || '',
    description: type?.description || ''
  });

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Add Custom Fee Type</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        
        <div className={styles.form}>
          <div className={styles.infoBox} style={{ 
            backgroundColor: '#E3F2FD', 
            padding: '15px', 
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #2196F3'
          }}>
            <p style={{ margin: 0, color: '#1976D2' }}>
              ℹ️ <strong>Note:</strong> Custom fee types are automatically created when you add a fee structure 
              with a custom fee category. You can use any name you want when creating fee structures.
            </p>
          </div>

          <div className={styles.formGroup}>
            <label>Custom Fee Type Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g., Computer Lab Fee, Art Supplies, etc."
            />
            <small style={{ color: '#666', display: 'block', marginTop: '5px' }}>
              Enter the name of your custom fee type. This will be used when creating fee structures.
            </small>
          </div>

          <div className={styles.formGroup}>
            <label>Description (Optional)</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe what this fee is for..."
              rows="3"
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
          </div>

          <div className={styles.modalActions}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Close
            </button>
            <button 
              type="button" 
              onClick={() => {
                alert('Custom fee types are created automatically when you add them to fee structures. Go to Fee Management to create a fee structure with your custom type.');
                onClose();
              }}
              className={styles.submitButton}
            >
              Go to Fee Management
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeeTypeManagement;
