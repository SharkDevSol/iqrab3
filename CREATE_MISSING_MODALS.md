# Create Missing Modal Components

You need to create 4 more modal components for the salary management system to work completely. Here's how:

## 1. Create the components folder

```bash
mkdir APP/src/PAGE/HR/components
```

## 2. Create AddSalaryModal.jsx

Create file: `APP/src/PAGE/HR/components/AddSalaryModal.jsx`

Copy this code:

```jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AddSalaryModal = ({ staff, onClose }) => {
  const [accounts, setAccounts] = useState([]);
  const [formData, setFormData] = useState({
    accountId: '',
    baseSalary: '',
    effectiveFrom: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/finance/accounts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setAccounts(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching accounts:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/hr/salary/staff/${staff.id}/salary`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        alert('Salary added successfully!');
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to add salary');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Salary - {staff.firstName} {staff.lastName}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Account *</label>
            <select
              value={formData.accountId}
              onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
              required
            >
              <option value="">Select Account</option>
              {accounts.map(account => (
                <option key={account.id} value={account.id}>
                  {account.code} - {account.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Base Salary *</label>
            <input
              type="number"
              step="0.01"
              value={formData.baseSalary}
              onChange={(e) => setFormData({ ...formData, baseSalary: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Effective From *</label>
            <input
              type="date"
              value={formData.effectiveFrom}
              onChange={(e) => setFormData({ ...formData, effectiveFrom: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows="3"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-submit">
              {loading ? 'Adding...' : 'Add Salary'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSalaryModal;
```

## 3. Create AddDeductionModal.jsx

Create file: `APP/src/PAGE/HR/components/AddDeductionModal.jsx`

Copy this code:

```jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AddDeductionModal = ({ staff, onClose }) => {
  const [deductionTypes, setDeductionTypes] = useState([]);
  const [formData, setFormData] = useState({
    deductionTypeId: '',
    amount: '',
    calculationType: 'FIXED',
    effectiveFrom: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDeductionTypes();
  }, []);

  const fetchDeductionTypes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/hr/salary/deduction-types`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setDeductionTypes(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching deduction types:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/hr/salary/staff/${staff.id}/deductions`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        alert('Deduction added successfully!');
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to add deduction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Deduction - {staff.firstName} {staff.lastName}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Deduction Type *</label>
            <select
              value={formData.deductionTypeId}
              onChange={(e) => setFormData({ ...formData, deductionTypeId: e.target.value })}
              required
            >
              <option value="">Select Deduction Type</option>
              {deductionTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Calculation Type *</label>
            <select
              value={formData.calculationType}
              onChange={(e) => setFormData({ ...formData, calculationType: e.target.value })}
              required
            >
              <option value="FIXED">Fixed Amount</option>
              <option value="PERCENTAGE">Percentage</option>
            </select>
          </div>

          <div className="form-group">
            <label>Amount * {formData.calculationType === 'PERCENTAGE' && '(%)'}</label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Effective From *</label>
            <input
              type="date"
              value={formData.effectiveFrom}
              onChange={(e) => setFormData({ ...formData, effectiveFrom: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows="3"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-submit">
              {loading ? 'Adding...' : 'Add Deduction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDeductionModal;
```

## 4. Create AddRetentionBenefitModal.jsx

Create file: `APP/src/PAGE/HR/components/AddRetentionBenefitModal.jsx`

Copy the same structure as AddDeductionModal but change:
- API endpoint to `/retention-benefit-types` and `/retention-benefits`
- Variable names from `deductionTypes` to `retentionBenefitTypes`
- Title to "Add Retention Benefit"

## 5. Create StaffSalaryDetails.jsx

Create file: `APP/src/PAGE/HR/components/StaffSalaryDetails.jsx`

```jsx
import React from 'react';

const StaffSalaryDetails = ({ staff, onClose }) => {
  const baseSalary = parseFloat(staff.salaries[0]?.baseSalary || 0);
  
  let totalAllowances = 0;
  staff.allowances?.forEach(allowance => {
    if (allowance.calculationType === 'PERCENTAGE') {
      totalAllowances += (baseSalary * parseFloat(allowance.amount)) / 100;
    } else {
      totalAllowances += parseFloat(allowance.amount);
    }
  });
  
  let totalDeductions = 0;
  staff.deductions?.forEach(deduction => {
    if (deduction.calculationType === 'PERCENTAGE') {
      totalDeductions += (baseSalary * parseFloat(deduction.amount)) / 100;
    } else {
      totalDeductions += parseFloat(deduction.amount);
    }
  });
  
  let totalRetention = 0;
  staff.retentionBenefits?.forEach(benefit => {
    if (benefit.calculationType === 'PERCENTAGE') {
      totalRetention += (baseSalary * parseFloat(benefit.amount)) / 100;
    } else {
      totalRetention += parseFloat(benefit.amount);
    }
  });
  
  const netSalary = baseSalary + totalAllowances + totalRetention - totalDeductions;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Salary Details - {staff.firstName} {staff.lastName}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div style={{ padding: '20px 0' }}>
          <h3>Base Salary</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#2c3e50' }}>
            ${baseSalary.toFixed(2)}
          </p>

          <h3 style={{ marginTop: '20px' }}>Deductions (-)</h3>
          {staff.deductions?.map(d => (
            <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
              <span>{d.deductionType.name}</span>
              <span style={{ color: '#e74c3c' }}>
                -${d.calculationType === 'PERCENTAGE' 
                  ? ((baseSalary * parseFloat(d.amount)) / 100).toFixed(2)
                  : parseFloat(d.amount).toFixed(2)}
              </span>
            </div>
          ))}
          <div style={{ borderTop: '1px solid #ddd', paddingTop: '8px', fontWeight: 'bold' }}>
            <span>Total Deductions:</span>
            <span style={{ color: '#e74c3c', float: 'right' }}>-${totalDeductions.toFixed(2)}</span>
          </div>

          <h3 style={{ marginTop: '20px' }}>Allowances (+)</h3>
          {staff.allowances?.map(a => (
            <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
              <span>{a.allowanceType.name}</span>
              <span style={{ color: '#27ae60' }}>
                +${a.calculationType === 'PERCENTAGE' 
                  ? ((baseSalary * parseFloat(a.amount)) / 100).toFixed(2)
                  : parseFloat(a.amount).toFixed(2)}
              </span>
            </div>
          ))}
          <div style={{ borderTop: '1px solid #ddd', paddingTop: '8px', fontWeight: 'bold' }}>
            <span>Total Allowances:</span>
            <span style={{ color: '#27ae60', float: 'right' }}>+${totalAllowances.toFixed(2)}</span>
          </div>

          <h3 style={{ marginTop: '20px' }}>Retention Benefits (+)</h3>
          {staff.retentionBenefits?.map(r => (
            <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
              <span>{r.retentionBenefitType.name}</span>
              <span style={{ color: '#9b59b6' }}>
                +${r.calculationType === 'PERCENTAGE' 
                  ? ((baseSalary * parseFloat(r.amount)) / 100).toFixed(2)
                  : parseFloat(r.amount).toFixed(2)}
              </span>
            </div>
          ))}
          <div style={{ borderTop: '1px solid #ddd', paddingTop: '8px', fontWeight: 'bold' }}>
            <span>Total Benefits:</span>
            <span style={{ color: '#9b59b6', float: 'right' }}>+${totalRetention.toFixed(2)}</span>
          </div>

          <div style={{ 
            marginTop: '30px', 
            padding: '20px', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '8px',
            color: 'white'
          }}>
            <h2 style={{ margin: 0, fontSize: '18px' }}>NET SALARY</h2>
            <p style={{ margin: '10px 0 0 0', fontSize: '32px', fontWeight: 'bold' }}>
              ${netSalary.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="modal-actions">
          <button onClick={onClose} className="btn-cancel">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffSalaryDetails;
```

## Quick Create Script

Or run this script to create all files at once:

```bash
# Create components directory
mkdir -p APP/src/PAGE/HR/components

# Then manually create each file with the code above
```

## After Creating the Files

1. **Refresh your browser**
2. **Navigate to HR → Salary Management**
3. **Click any action button** (💰, ➖, ➕, 🎁, 👁️)
4. **The modals should now work!**

---

**Once you create these 4 modal components, your salary management system will be fully functional!** 🎉
