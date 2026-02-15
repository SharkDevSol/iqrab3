# ERP Modules - API Architecture

## Base URL Structure
```
/api/v1/{module}/{resource}
```

---

## 1. FINANCE MANAGEMENT API

### Chart of Accounts
```
GET    /api/finance/accounts                    # List all accounts (with hierarchy)
GET    /api/finance/accounts/:id                # Get account details
POST   /api/finance/accounts                    # Create new account
PUT    /api/finance/accounts/:id                # Update account
DELETE /api/finance/accounts/:id                # Deactivate account
GET    /api/finance/accounts/tree               # Get hierarchical tree view
GET    /api/finance/accounts/balance-sheet      # Generate balance sheet
GET    /api/finance/accounts/income-statement   # Generate income statement
```

### Fee Management
```
GET    /api/finance/fee-structures              # List fee structures
POST   /api/finance/fee-structures              # Create fee structure
PUT    /api/finance/fee-structures/:id          # Update fee structure
DELETE /api/finance/fee-structures/:id          # Delete fee structure

GET    /api/finance/discount-rules              # List discount rules
POST   /api/finance/discount-rules              # Create discount rule
PUT    /api/finance/discount-rules/:id          # Update discount rule

GET    /api/finance/late-fee-rules              # List late fee rules
POST   /api/finance/late-fee-rules              # Create late fee rule
PUT    /api/finance/late-fee-rules/:id          # Update late fee rule

POST   /api/finance/student-fees/assign         # Assign fees to student(s)
GET    /api/finance/student-fees/:studentId     # Get student fee details
```

### Billing & Payments
```
GET    /api/finance/invoices                    # List invoices (with filters)
GET    /api/finance/invoices/:id                # Get invoice details
POST   /api/finance/invoices/generate           # Generate invoice(s)
PUT    /api/finance/invoices/:id                # Update invoice
POST   /api/finance/invoices/:id/cancel         # Cancel invoice
GET    /api/finance/invoices/:id/pdf            # Download invoice PDF

POST   /api/finance/payments                    # Record payment
GET    /api/finance/payments/:id                # Get payment details
GET    /api/finance/payments/student/:studentId # Get student payment history
POST   /api/finance/payments/:id/refund         # Process refund

POST   /api/finance/reconciliation              # Create reconciliation
GET    /api/finance/reconciliation/:id          # Get reconciliation details
PUT    /api/finance/reconciliation/:id/complete # Complete reconciliation
```

### Journal Entries
```
GET    /api/finance/journal-entries             # List journal entries
GET    /api/finance/journal-entries/:id         # Get entry details
POST   /api/finance/journal-entries             # Create journal entry
PUT    /api/finance/journal-entries/:id         # Update entry (if draft)
POST   /api/finance/journal-entries/:id/post    # Post entry to ledger
POST   /api/finance/journal-entries/:id/reverse # Reverse entry
```

### Budgeting
```
GET    /api/finance/budgets                     # List budgets
POST   /api/finance/budgets                     # Create budget
PUT    /api/finance/budgets/:id                 # Update budget
POST   /api/finance/budgets/:id/approve         # Approve budget
GET    /api/finance/budgets/:id/vs-actual       # Budget vs Actual report
GET    /api/finance/budgets/variance-analysis   # Variance analysis report
```

### Reports
```
GET    /api/finance/reports/trial-balance       # Trial balance
GET    /api/finance/reports/cash-flow           # Cash flow statement
GET    /api/finance/reports/aging-report        # Accounts receivable aging
GET    /api/finance/reports/revenue-analysis    # Revenue analysis
GET    /api/finance/reports/expense-analysis    # Expense analysis
```

---

## 2. INVENTORY & STOCK MANAGEMENT API

### Item Master
```
GET    /api/inventory/items                     # List items
GET    /api/inventory/items/:id                 # Get item details
POST   /api/inventory/items                     # Create item
PUT    /api/inventory/items/:id                 # Update item
DELETE /api/inventory/items/:id                 # Deactivate item
GET    /api/inventory/items/:id/stock-levels    # Get current stock levels
GET    /api/inventory/items/:id/valuation       # Get item valuation
```

### Suppliers
```
GET    /api/inventory/suppliers                 # List suppliers
POST   /api/inventory/suppliers                 # Create supplier
PUT    /api/inventory/suppliers/:id             # Update supplier
DELETE /api/inventory/suppliers/:id             # Deactivate supplier
```

### Stores
```
GET    /api/inventory/stores                    # List stores
POST   /api/inventory/stores                    # Create store
PUT    /api/inventory/stores/:id                # Update store
GET    /api/inventory/stores/:id/stock          # Get store stock levels
```

### Procurement Workflow
```
# Purchase Requests
GET    /api/inventory/purchase-requests         # List PRs
POST   /api/inventory/purchase-requests         # Create PR
PUT    /api/inventory/purchase-requests/:id     # Update PR
POST   /api/inventory/purchase-requests/:id/submit   # Submit for approval
POST   /api/inventory/purchase-requests/:id/approve  # Approve PR
POST   /api/inventory/purchase-requests/:id/reject   # Reject PR
POST   /api/inventory/purchase-requests/:id/convert-to-po # Convert to PO

# Purchase Orders
GET    /api/inventory/purchase-orders           # List POs
POST   /api/inventory/purchase-orders           # Create PO
PUT    /api/inventory/purchase-orders/:id       # Update PO
POST   /api/inventory/purchase-orders/:id/send  # Send to supplier
POST   /api/inventory/purchase-orders/:id/cancel # Cancel PO
GET    /api/inventory/purchase-orders/:id/pdf   # Download PO PDF
```

### Goods Receipt
```
GET    /api/inventory/grn                       # List GRNs
POST   /api/inventory/grn                       # Create GRN
PUT    /api/inventory/grn/:id                   # Update GRN
POST   /api/inventory/grn/:id/quality-check     # Perform quality check
POST   /api/inventory/grn/:id/accept            # Accept goods
POST   /api/inventory/grn/:id/reject            # Reject goods
```

### Stock Operations
```
# Stock Issuance
GET    /api/inventory/issuances                 # List issuances
POST   /api/inventory/issuances                 # Create issuance
POST   /api/inventory/issuances/:id/approve     # Approve issuance
POST   /api/inventory/issuances/:id/return      # Return items

# Stock Transfers
GET    /api/inventory/transfers                 # List transfers
POST   /api/inventory/transfers                 # Create transfer
POST   /api/inventory/transfers/:id/receive     # Receive transfer

# Stock Adjustments
GET    /api/inventory/adjustments               # List adjustments
POST   /api/inventory/adjustments               # Create adjustment
POST   /api/inventory/adjustments/:id/approve   # Approve adjustment
```

### Reports
```
GET    /api/inventory/reports/stock-summary     # Stock summary by item/store
GET    /api/inventory/reports/reorder-list      # Items below reorder level
GET    /api/inventory/reports/expiry-alert      # Items nearing expiry
GET    /api/inventory/reports/slow-moving       # Slow-moving items
GET    /api/inventory/reports/valuation         # Inventory valuation
GET    /api/inventory/reports/transaction-history # Transaction history
```

---

## 3. PROPERTY & ASSET MANAGEMENT API

### Asset Categories
```
GET    /api/assets/categories                   # List categories
POST   /api/assets/categories                   # Create category
PUT    /api/assets/categories/:id               # Update category
```

### Asset Registry
```
GET    /api/assets                              # List assets
GET    /api/assets/:id                          # Get asset details
POST   /api/assets                              # Register new asset
PUT    /api/assets/:id                          # Update asset
DELETE /api/assets/:id                          # Deactivate asset
GET    /api/assets/:id/qr-code                  # Generate QR code
GET    /api/assets/:id/barcode                  # Generate barcode
GET    /api/assets/:id/history                  # Get asset history
```

### Asset Assignment
```
GET    /api/assets/:id/assignments              # Get assignment history
POST   /api/assets/:id/assign                   # Assign asset
POST   /api/assets/:id/return                   # Return asset
POST   /api/assets/:id/transfer                 # Transfer asset
```

### Maintenance Management
```
GET    /api/assets/maintenance/schedules        # List maintenance schedules
POST   /api/assets/maintenance/schedules        # Create schedule
PUT    /api/assets/maintenance/schedules/:id    # Update schedule

GET    /api/assets/maintenance/logs             # List maintenance logs
POST   /api/assets/maintenance/logs             # Create log
PUT    /api/assets/maintenance/logs/:id         # Update log
POST   /api/assets/maintenance/logs/:id/complete # Complete maintenance

GET    /api/assets/maintenance/due              # Get due maintenance
GET    /api/assets/maintenance/overdue          # Get overdue maintenance
```

### Depreciation
```
GET    /api/assets/depreciation/schedules       # List depreciation schedules
POST   /api/assets/depreciation/calculate       # Calculate depreciation
POST   /api/assets/depreciation/post            # Post to accounting
GET    /api/assets/depreciation/report          # Depreciation report
```

### Asset Disposal
```
GET    /api/assets/disposals                    # List disposals
POST   /api/assets/disposals                    # Create disposal request
POST   /api/assets/disposals/:id/approve        # Approve disposal
POST   /api/assets/disposals/:id/complete       # Complete disposal
```

### Asset Valuation
```
GET    /api/assets/:id/valuations               # Get valuation history
POST   /api/assets/:id/valuations               # Add valuation
```

### Reports
```
GET    /api/assets/reports/register             # Asset register
GET    /api/assets/reports/depreciation-summary # Depreciation summary
GET    /api/assets/reports/maintenance-cost     # Maintenance cost analysis
GET    /api/assets/reports/asset-utilization    # Asset utilization
GET    /api/assets/reports/warranty-expiry      # Warranty expiry alert
```

---

## 4. HR & STAFF MANAGEMENT API

### Dynamic Structure
```
# Roles
GET    /api/hr/roles                            # List roles
POST   /api/hr/roles                            # Create role
PUT    /api/hr/roles/:id                        # Update role
DELETE /api/hr/roles/:id                        # Delete role

# Departments
GET    /api/hr/departments                      # List departments
POST   /api/hr/departments                      # Create department
PUT    /api/hr/departments/:id                  # Update department
GET    /api/hr/departments/tree                 # Get department hierarchy

# Job Positions
GET    /api/hr/positions                        # List positions
POST   /api/hr/positions                        # Create position
PUT    /api/hr/positions/:id                    # Update position
```

### Recruitment (ATS)
```
# Job Postings
GET    /api/hr/job-postings                     # List job postings
POST   /api/hr/job-postings                     # Create posting
PUT    /api/hr/job-postings/:id                 # Update posting
POST   /api/hr/job-postings/:id/publish         # Publish posting
POST   /api/hr/job-postings/:id/close           # Close posting

# Applications
GET    /api/hr/applications                     # List applications
GET    /api/hr/applications/:id                 # Get application details
POST   /api/hr/applications                     # Submit application
PUT    /api/hr/applications/:id/status          # Update status
POST   /api/hr/applications/:id/shortlist       # Shortlist candidate
POST   /api/hr/applications/:id/schedule-interview # Schedule interview
POST   /api/hr/applications/:id/offer           # Make offer
POST   /api/hr/applications/:id/reject          # Reject application
POST   /api/hr/applications/:id/convert-to-employee # Convert to employee
```

### Employee Management
```
GET    /api/hr/employees                        # List employees
GET    /api/hr/employees/:id                    # Get employee details
POST   /api/hr/employees                        # Create employee
PUT    /api/hr/employees/:id                    # Update employee
POST   /api/hr/employees/:id/terminate          # Terminate employee
GET    /api/hr/employees/:id/profile            # Get complete profile
```

### Attendance Management
```
# Devices
GET    /api/hr/attendance/devices               # List devices
POST   /api/hr/attendance/devices               # Register device
POST   /api/hr/attendance/devices/:id/sync      # Sync device data

# Shifts
GET    /api/hr/attendance/shifts                # List shifts
POST   /api/hr/attendance/shifts                # Create shift
PUT    /api/hr/attendance/shifts/:id            # Update shift
POST   /api/hr/attendance/shifts/assign         # Assign shift to employee(s)

# Attendance Records
GET    /api/hr/attendance/records               # List records (with filters)
POST   /api/hr/attendance/records               # Manual entry
PUT    /api/hr/attendance/records/:id           # Update record
POST   /api/hr/attendance/records/:id/approve   # Approve manual entry
GET    /api/hr/attendance/summary               # Attendance summary
GET    /api/hr/attendance/employee/:id          # Employee attendance history
POST   /api/hr/attendance/bulk-import           # Bulk import from biometric
```

### Leave Management
```
# Leave Types
GET    /api/hr/leave/types                      # List leave types
POST   /api/hr/leave/types                      # Create leave type
PUT    /api/hr/leave/types/:id                  # Update leave type

# Leave Balances
GET    /api/hr/leave/balances/:employeeId       # Get employee balances
POST   /api/hr/leave/balances/initialize        # Initialize balances for year

# Leave Applications
GET    /api/hr/leave/applications               # List applications
POST   /api/hr/leave/applications               # Apply for leave
PUT    /api/hr/leave/applications/:id           # Update application
POST   /api/hr/leave/applications/:id/approve   # Approve leave
POST   /api/hr/leave/applications/:id/reject    # Reject leave
POST   /api/hr/leave/applications/:id/cancel    # Cancel leave
```

### Payroll Management
```
# Salary Components
GET    /api/hr/payroll/components               # List components
POST   /api/hr/payroll/components               # Create component
PUT    /api/hr/payroll/components/:id           # Update component

# Employee Salary Structure
GET    /api/hr/payroll/salary-structure/:employeeId # Get structure
POST   /api/hr/payroll/salary-structure         # Assign structure
PUT    /api/hr/payroll/salary-structure/:id     # Update structure

# Tax Configuration
GET    /api/hr/payroll/tax-slabs                # List tax slabs
POST   /api/hr/payroll/tax-slabs                # Create tax slab
PUT    /api/hr/payroll/tax-slabs/:id            # Update tax slab
```

### Payroll Processing (Complex Transaction)
```
POST   /api/hr/payroll/process                  # Process payroll for period
GET    /api/hr/payroll/runs                     # List payroll runs
GET    /api/hr/payroll/runs/:id                 # Get run details
POST   /api/hr/payroll/runs/:id/calculate       # Calculate payroll
POST   /api/hr/payroll/runs/:id/approve         # Approve payroll
POST   /api/hr/payroll/runs/:id/process-payment # Process payments
GET    /api/hr/payroll/runs/:id/payslips        # Get all payslips
GET    /api/hr/payroll/payslip/:employeeId/:runId # Get employee payslip
GET    /api/hr/payroll/payslip/:id/pdf          # Download payslip PDF
```

### Performance & Training
```
# Performance Reviews
GET    /api/hr/performance/reviews              # List reviews
POST   /api/hr/performance/reviews              # Create review
PUT    /api/hr/performance/reviews/:id          # Update review
POST   /api/hr/performance/reviews/:id/submit   # Submit review
POST   /api/hr/performance/reviews/:id/acknowledge # Acknowledge review

# Training Programs
GET    /api/hr/training/programs                # List programs
POST   /api/hr/training/programs                # Create program
PUT    /api/hr/training/programs/:id            # Update program
POST   /api/hr/training/programs/:id/enroll     # Enroll employee(s)
POST   /api/hr/training/programs/:id/complete   # Mark completion
```

### Reports
```
GET    /api/hr/reports/headcount                # Headcount report
GET    /api/hr/reports/attendance-summary       # Attendance summary
GET    /api/hr/reports/leave-summary            # Leave summary
GET    /api/hr/reports/payroll-summary          # Payroll summary
GET    /api/hr/reports/turnover                 # Employee turnover
GET    /api/hr/reports/training-effectiveness   # Training effectiveness
```

---

## 5. INTEGRATION ENDPOINTS

### Finance <-> Inventory
```
POST   /api/integration/inventory-to-finance    # Sync inventory transactions
GET    /api/integration/inventory-financial-impact # Get financial impact
```

### Asset <-> Finance
```
POST   /api/integration/depreciation-to-finance # Post depreciation entries
GET    /api/integration/asset-financial-summary # Asset financial summary
```

### Attendance <-> Payroll
```
POST   /api/integration/attendance-to-payroll   # Sync attendance data
GET    /api/integration/attendance-summary/:month # Get monthly summary
```

### Cross-Module Reports
```
GET    /api/integration/dashboard               # Unified dashboard data
GET    /api/integration/financial-overview      # Complete financial overview
GET    /api/integration/operational-metrics     # Operational KPIs
```

---

## Common API Patterns

### Pagination
```
?page=1&limit=20&sort=created_at&order=desc
```

### Filtering
```
?status=ACTIVE&department=IT&date_from=2024-01-01&date_to=2024-12-31
```

### Search
```
?search=keyword&fields=name,code,description
```

### Response Format
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful",
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": []
  }
}
```
