# Design Document: Finance Management Module

## Overview

The Finance Management Module is a comprehensive financial system built on a React frontend with Node.js/Prisma backend and PostgreSQL database. The system follows a modular architecture with clear separation between fee management, expense management, budgeting, payroll, and reporting subsystems. The design emphasizes audit compliance, role-based security, and integration readiness for future modules.

The system implements double-entry accounting principles with a flexible chart of accounts, automated invoice generation, multi-channel payment processing, approval workflows, and comprehensive financial reporting. All financial transactions maintain complete audit trails for compliance purposes.

## Architecture

### System Architecture

```mermaid
graph TB
    subgraph "Frontend Layer - React"
        UI[React UI Components]
        State[State Management - Redux/Context]
        API_Client[API Client Layer]
    end
    
    subgraph "Backend Layer - Node.js"
        API[REST API Routes]
        Auth[Authentication & Authorization]
        Business[Business Logic Layer]
        Workflow[Approval Workflow Engine]
        Scheduler[Job Scheduler]
    end
    
    subgraph "Data Layer"
        Prisma[Prisma ORM]
        DB[(PostgreSQL Database)]
    end
    
    subgraph "External Integrations"
        Payment[Payment Gateways]
        Notification[Notification Service]
        Storage[File Storage]
    end
    
    UI --> State
    State --> API_Client
    API_Client --> API
    API --> Auth
    Auth --> Business
    Business --> Workflow
    Business --> Scheduler
    Business --> Prisma
    Prisma --> DB
    Business --> Payment
    Business --> Notification
    Business --> Storage

```

### Module Structure

The Finance Management Module is organized into the following subsystems:

1. **Chart of Accounts Module**: Manages the hierarchical account structure
2. **Fee Management Module**: Handles fee structures, discounts, scholarships, and late fees
3. **Billing Module**: Manages invoice generation, adjustments, and reversals
4. **Payment Module**: Processes payments, reconciliation, and refunds
5. **Expense Module**: Tracks expenses, vendor management, and approval workflows
6. **Budget Module**: Manages budget creation, tracking, and alerts
7. **Payroll Module**: Handles salary structures, payroll processing, and payslip generation
8. **Reporting Module**: Generates financial statements and analytical reports
9. **Audit Module**: Maintains audit trails and compliance records
10. **Integration Module**: Provides APIs for external module integration

### Technology Stack

- **Frontend**: React with functional components and hooks
- **State Management**: React Context API or Redux (based on existing codebase)
- **Backend**: Node.js with Express.js
- **ORM**: Prisma for database operations
- **Database**: PostgreSQL with proper indexing for performance
- **Authentication**: JWT-based authentication with role-based access control
- **File Storage**: Local file system or cloud storage (S3-compatible)
- **Job Scheduling**: Node-cron for automated tasks (invoice generation, late fees)
- **PDF Generation**: PDFKit or similar library for reports and invoices
- **Excel Export**: ExcelJS for spreadsheet exports

## Components and Interfaces

### Database Schema

#### Core Financial Tables

**Account**
- id: UUID (Primary Key)
- code: String (Unique, indexed)
- name: String
- type: Enum (ASSET, LIABILITY, INCOME, EXPENSE)
- parentId: UUID (Foreign Key to Account, nullable)
- campusId: UUID (Foreign Key to Campus, nullable)
- isActive: Boolean
- isLeaf: Boolean (computed or stored)
- createdAt: DateTime
- updatedAt: DateTime
- createdBy: UUID (Foreign Key to User)

**FeeStructure**
- id: UUID (Primary Key)
- name: String
- academicYearId: UUID (Foreign Key)
- termId: UUID (Foreign Key, nullable)
- gradeLevel: String (nullable)
- campusId: UUID (Foreign Key, nullable)
- studentCategory: String (nullable)
- isActive: Boolean
- createdAt: DateTime
- updatedAt: DateTime

**FeeStructureItem**
- id: UUID (Primary Key)
- feeStructureId: UUID (Foreign Key to FeeStructure)
- feeCategory: String (TUITION, TRANSPORT, LAB, EXAM, etc.)
- amount: Decimal
- accountId: UUID (Foreign Key to Account)
- paymentType: Enum (ONE_TIME, RECURRING, INSTALLMENT)
- dueDate: DateTime (nullable)
- installmentCount: Integer (nullable)
- description: String (nullable)

**Discount**
- id: UUID (Primary Key)
- name: String
- type: Enum (PERCENTAGE, FIXED_AMOUNT)
- value: Decimal
- applicableFeeCategories: JSON (array of fee categories)
- startDate: DateTime
- endDate: DateTime (nullable)
- requiresApproval: Boolean
- isActive: Boolean
- createdAt: DateTime
- updatedAt: DateTime

**Scholarship**
- id: UUID (Primary Key)
- name: String
- discountId: UUID (Foreign Key to Discount)
- eligibilityCriteria: JSON
- maxRecipients: Integer (nullable)
- academicYearId: UUID (Foreign Key)
- approvalWorkflowId: UUID (Foreign Key)
- isActive: Boolean
- createdAt: DateTime
- updatedAt: DateTime

**LateFeeRule**
- id: UUID (Primary Key)
- name: String
- type: Enum (PERCENTAGE, FIXED_AMOUNT)
- value: Decimal
- gracePeriodDays: Integer
- applicableFeeCategories: JSON (array)
- campusId: UUID (Foreign Key, nullable)
- isActive: Boolean
- createdAt: DateTime
- updatedAt: DateTime

**Invoice**
- id: UUID (Primary Key)
- invoiceNumber: String (Unique, indexed)
- studentId: UUID (Foreign Key to Student)
- academicYearId: UUID (Foreign Key)
- termId: UUID (Foreign Key, nullable)
- issueDate: DateTime
- dueDate: DateTime
- totalAmount: Decimal
- discountAmount: Decimal
- lateFeeAmount: Decimal
- netAmount: Decimal
- paidAmount: Decimal
- status: Enum (DRAFT, ISSUED, PARTIALLY_PAID, PAID, OVERDUE, CANCELLED)
- campusId: UUID (Foreign Key)
- createdAt: DateTime
- updatedAt: DateTime
- createdBy: UUID (Foreign Key to User)

**InvoiceItem**
- id: UUID (Primary Key)
- invoiceId: UUID (Foreign Key to Invoice)
- feeCategory: String
- description: String
- amount: Decimal
- accountId: UUID (Foreign Key to Account)
- quantity: Integer (default 1)

**Payment**
- id: UUID (Primary Key)
- receiptNumber: String (Unique, indexed)
- studentId: UUID (Foreign Key to Student)
- amount: Decimal
- paymentMethod: Enum (CASH, BANK_TRANSFER, MOBILE_MONEY, ONLINE)
- paymentDate: DateTime
- referenceNumber: String (nullable)
- status: Enum (PENDING, COMPLETED, FAILED, REFUNDED)
- campusId: UUID (Foreign Key)
- createdAt: DateTime
- createdBy: UUID (Foreign Key to User)

**PaymentAllocation**
- id: UUID (Primary Key)
- paymentId: UUID (Foreign Key to Payment)
- invoiceId: UUID (Foreign Key to Invoice)
- amount: Decimal
- createdAt: DateTime

**Refund**
- id: UUID (Primary Key)
- refundNumber: String (Unique, indexed)
- studentId: UUID (Foreign Key to Student)
- amount: Decimal
- reason: String
- status: Enum (PENDING, APPROVED, REJECTED, COMPLETED)
- requestedBy: UUID (Foreign Key to User)
- approvedBy: UUID (Foreign Key to User, nullable)
- requestDate: DateTime
- approvalDate: DateTime (nullable)
- completionDate: DateTime (nullable)
- createdAt: DateTime
- updatedAt: DateTime

**Expense**
- id: UUID (Primary Key)
- expenseNumber: String (Unique, indexed)
- category: String
- description: String
- amount: Decimal
- expenseDate: DateTime
- vendorId: UUID (Foreign Key to Vendor, nullable)
- accountId: UUID (Foreign Key to Account)
- departmentId: UUID (Foreign Key, nullable)
- campusId: UUID (Foreign Key)
- status: Enum (DRAFT, PENDING_APPROVAL, APPROVED, REJECTED, PAID)
- isRecurring: Boolean
- recurringFrequency: Enum (MONTHLY, QUARTERLY, ANNUALLY, nullable)
- budgetId: UUID (Foreign Key to Budget, nullable)
- createdAt: DateTime
- updatedAt: DateTime
- createdBy: UUID (Foreign Key to User)

**ExpenseAttachment**
- id: UUID (Primary Key)
- expenseId: UUID (Foreign Key to Expense)
- fileName: String
- filePath: String
- fileType: String
- fileSize: Integer
- uploadedAt: DateTime
- uploadedBy: UUID (Foreign Key to User)

**Vendor**
- id: UUID (Primary Key)
- name: String
- contactPerson: String (nullable)
- email: String (nullable)
- phone: String (nullable)
- address: String (nullable)
- taxId: String (nullable)
- isActive: Boolean
- createdAt: DateTime
- updatedAt: DateTime

**Budget**
- id: UUID (Primary Key)
- name: String
- fiscalYear: Integer
- startDate: DateTime
- endDate: DateTime
- totalAmount: Decimal
- status: Enum (DRAFT, PENDING_APPROVAL, APPROVED, ACTIVE, CLOSED)
- campusId: UUID (Foreign Key, nullable)
- approvedBy: UUID (Foreign Key to User, nullable)
- approvalDate: DateTime (nullable)
- createdAt: DateTime
- updatedAt: DateTime
- createdBy: UUID (Foreign Key to User)

**BudgetLine**
- id: UUID (Primary Key)
- budgetId: UUID (Foreign Key to Budget)
- category: String
- accountId: UUID (Foreign Key to Account)
- departmentId: UUID (Foreign Key, nullable)
- allocatedAmount: Decimal
- spentAmount: Decimal (computed or updated)
- remainingAmount: Decimal (computed)
- alertThreshold: Decimal (percentage, e.g., 80)

**SalaryStructure**
- id: UUID (Primary Key)
- name: String
- staffCategory: String
- baseSalary: Decimal
- isActive: Boolean
- createdAt: DateTime
- updatedAt: DateTime

**SalaryComponent**
- id: UUID (Primary Key)
- salaryStructureId: UUID (Foreign Key to SalaryStructure)
- componentType: Enum (ALLOWANCE, DEDUCTION)
- name: String (HOUSING, TRANSPORT, TAX, INSURANCE, etc.)
- calculationType: Enum (FIXED, PERCENTAGE)
- value: Decimal
- accountId: UUID (Foreign Key to Account)

**Payroll**
- id: UUID (Primary Key)
- payrollNumber: String (Unique, indexed)
- month: Integer
- year: Integer
- status: Enum (DRAFT, PENDING_APPROVAL, APPROVED, PAID)
- totalGrossSalary: Decimal
- totalDeductions: Decimal
- totalNetSalary: Decimal
- approvedBy: UUID (Foreign Key to User, nullable)
- approvalDate: DateTime (nullable)
- paymentDate: DateTime (nullable)
- createdAt: DateTime
- updatedAt: DateTime
- createdBy: UUID (Foreign Key to User)

**PayrollItem**
- id: UUID (Primary Key)
- payrollId: UUID (Foreign Key to Payroll)
- staffId: UUID (Foreign Key to Staff)
- salaryStructureId: UUID (Foreign Key to SalaryStructure)
- baseSalary: Decimal
- totalAllowances: Decimal
- totalDeductions: Decimal
- netSalary: Decimal
- payslipGenerated: Boolean
- payslipPath: String (nullable)

**PayrollItemDetail**
- id: UUID (Primary Key)
- payrollItemId: UUID (Foreign Key to PayrollItem)
- componentType: Enum (BASE, ALLOWANCE, DEDUCTION)
- componentName: String
- amount: Decimal
- accountId: UUID (Foreign Key to Account)

**ApprovalWorkflow**
- id: UUID (Primary Key)
- name: String
- entityType: Enum (EXPENSE, REFUND, BUDGET, PAYROLL, SCHOLARSHIP)
- isActive: Boolean
- createdAt: DateTime
- updatedAt: DateTime

**ApprovalStep**
- id: UUID (Primary Key)
- workflowId: UUID (Foreign Key to ApprovalWorkflow)
- stepOrder: Integer
- approverRole: String
- minAmount: Decimal (nullable)
- maxAmount: Decimal (nullable)
- isRequired: Boolean

**ApprovalRequest**
- id: UUID (Primary Key)
- workflowId: UUID (Foreign Key to ApprovalWorkflow)
- entityType: Enum
- entityId: UUID
- currentStepOrder: Integer
- status: Enum (PENDING, APPROVED, REJECTED)
- requestedBy: UUID (Foreign Key to User)
- requestDate: DateTime
- completionDate: DateTime (nullable)

**ApprovalAction**
- id: UUID (Primary Key)
- approvalRequestId: UUID (Foreign Key to ApprovalRequest)
- stepOrder: Integer
- approverUserId: UUID (Foreign Key to User)
- action: Enum (APPROVED, REJECTED)
- comments: String (nullable)
- actionDate: DateTime

**AuditLog**
- id: UUID (Primary Key)
- entityType: String
- entityId: UUID
- action: Enum (CREATE, UPDATE, DELETE, APPROVE, REJECT)
- userId: UUID (Foreign Key to User)
- oldValue: JSON (nullable)
- newValue: JSON (nullable)
- ipAddress: String (nullable)
- userAgent: String (nullable)
- timestamp: DateTime

**Transaction**
- id: UUID (Primary Key)
- transactionNumber: String (Unique, indexed)
- transactionDate: DateTime
- description: String
- sourceType: Enum (INVOICE, PAYMENT, EXPENSE, PAYROLL, ADJUSTMENT)
- sourceId: UUID
- status: Enum (PENDING, POSTED, REVERSED)
- postedBy: UUID (Foreign Key to User, nullable)
- postedAt: DateTime (nullable)
- createdAt: DateTime

**TransactionLine**
- id: UUID (Primary Key)
- transactionId: UUID (Foreign Key to Transaction)
- accountId: UUID (Foreign Key to Account)
- debitAmount: Decimal
- creditAmount: Decimal
- description: String (nullable)

### API Endpoints

#### Chart of Accounts API

```
POST   /api/finance/accounts                 - Create account
GET    /api/finance/accounts                 - List accounts (with filters)
GET    /api/finance/accounts/:id             - Get account details
PUT    /api/finance/accounts/:id             - Update account
DELETE /api/finance/accounts/:id             - Deactivate account
GET    /api/finance/accounts/tree            - Get account hierarchy
POST   /api/finance/accounts/templates       - Apply account template
```

#### Fee Management API

```
POST   /api/finance/fee-structures           - Create fee structure
GET    /api/finance/fee-structures           - List fee structures
GET    /api/finance/fee-structures/:id       - Get fee structure details
PUT    /api/finance/fee-structures/:id       - Update fee structure
DELETE /api/finance/fee-structures/:id       - Deactivate fee structure

POST   /api/finance/discounts                - Create discount
GET    /api/finance/discounts                - List discounts
PUT    /api/finance/discounts/:id            - Update discount
DELETE /api/finance/discounts/:id            - Deactivate discount

POST   /api/finance/scholarships             - Create scholarship
GET    /api/finance/scholarships             - List scholarships
PUT    /api/finance/scholarships/:id         - Update scholarship
POST   /api/finance/scholarships/:id/apply   - Apply for scholarship

POST   /api/finance/late-fee-rules           - Create late fee rule
GET    /api/finance/late-fee-rules           - List late fee rules
PUT    /api/finance/late-fee-rules/:id       - Update late fee rule
```

#### Billing API

```
POST   /api/finance/invoices                 - Create invoice
POST   /api/finance/invoices/generate        - Generate invoices (bulk)
GET    /api/finance/invoices                 - List invoices (with filters)
GET    /api/finance/invoices/:id             - Get invoice details
PUT    /api/finance/invoices/:id             - Update invoice
POST   /api/finance/invoices/:id/adjust      - Adjust invoice
POST   /api/finance/invoices/:id/reverse     - Reverse invoice
GET    /api/finance/invoices/:id/pdf         - Download invoice PDF
POST   /api/finance/invoices/apply-late-fees - Apply late fees (scheduled job)
```

#### Payment API

```
POST   /api/finance/payments                 - Record payment
GET    /api/finance/payments                 - List payments
GET    /api/finance/payments/:id             - Get payment details
POST   /api/finance/payments/reconcile       - Reconcile payments
POST   /api/finance/payments/bulk-upload     - Bulk payment upload
GET    /api/finance/payments/:id/receipt     - Download receipt PDF

POST   /api/finance/refunds                  - Request refund
GET    /api/finance/refunds                  - List refunds
GET    /api/finance/refunds/:id              - Get refund details
POST   /api/finance/refunds/:id/approve      - Approve refund
POST   /api/finance/refunds/:id/reject       - Reject refund
POST   /api/finance/refunds/:id/complete     - Complete refund
```

#### Expense API

```
POST   /api/finance/expenses                 - Create expense
GET    /api/finance/expenses                 - List expenses
GET    /api/finance/expenses/:id             - Get expense details
PUT    /api/finance/expenses/:id             - Update expense
POST   /api/finance/expenses/:id/attachments - Upload attachment
DELETE /api/finance/expenses/:id/attachments/:attachmentId - Delete attachment
POST   /api/finance/expenses/:id/submit      - Submit for approval

POST   /api/finance/vendors                  - Create vendor
GET    /api/finance/vendors                  - List vendors
GET    /api/finance/vendors/:id              - Get vendor details
PUT    /api/finance/vendors/:id              - Update vendor
```

#### Budget API

```
POST   /api/finance/budgets                  - Create budget
GET    /api/finance/budgets                  - List budgets
GET    /api/finance/budgets/:id              - Get budget details
PUT    /api/finance/budgets/:id              - Update budget
POST   /api/finance/budgets/:id/submit       - Submit for approval
GET    /api/finance/budgets/:id/utilization  - Get budget utilization
```

#### Payroll API

```
POST   /api/finance/salary-structures        - Create salary structure
GET    /api/finance/salary-structures        - List salary structures
GET    /api/finance/salary-structures/:id    - Get salary structure details
PUT    /api/finance/salary-structures/:id    - Update salary structure

POST   /api/finance/payroll                  - Create payroll
GET    /api/finance/payroll                  - List payroll records
GET    /api/finance/payroll/:id              - Get payroll details
PUT    /api/finance/payroll/:id              - Update payroll
POST   /api/finance/payroll/:id/submit       - Submit for approval
POST   /api/finance/payroll/:id/generate-payslips - Generate payslips
GET    /api/finance/payroll/:id/payslips/:staffId - Download payslip PDF
```

#### Reporting API

```
GET    /api/finance/reports/income-statement      - Income statement
GET    /api/finance/reports/balance-sheet         - Balance sheet
GET    /api/finance/reports/cash-flow             - Cash flow report
GET    /api/finance/reports/fee-collection        - Fee collection report
GET    /api/finance/reports/outstanding-dues      - Outstanding dues report
GET    /api/finance/reports/expense-analysis      - Expense analysis report
POST   /api/finance/reports/export                - Export report (PDF/Excel)
```

#### Approval Workflow API

```
POST   /api/finance/workflows                - Create workflow
GET    /api/finance/workflows                - List workflows
GET    /api/finance/workflows/:id            - Get workflow details
PUT    /api/finance/workflows/:id            - Update workflow

GET    /api/finance/approvals/pending        - Get pending approvals
POST   /api/finance/approvals/:id/approve    - Approve request
POST   /api/finance/approvals/:id/reject     - Reject request
```

#### Audit API

```
GET    /api/finance/audit-logs               - List audit logs (with filters)
GET    /api/finance/audit-logs/:entityType/:entityId - Get entity audit trail
POST   /api/finance/audit-logs/export        - Export audit logs
```

### Frontend Components

#### Component Structure

```
src/
├── pages/
│   ├── Finance/
│   │   ├── Dashboard/
│   │   │   └── FinanceDashboard.jsx
│   │   ├── ChartOfAccounts/
│   │   │   ├── AccountList.jsx
│   │   │   ├── AccountForm.jsx
│   │   │   └── AccountTree.jsx
│   │   ├── FeeManagement/
│   │   │   ├── FeeStructureList.jsx
│   │   │   ├── FeeStructureForm.jsx
│   │   │   ├── DiscountList.jsx
│   │   │   ├── DiscountForm.jsx
│   │   │   ├── ScholarshipList.jsx
│   │   │   └── ScholarshipForm.jsx
│   │   ├── Billing/
│   │   │   ├── InvoiceList.jsx
│   │   │   ├── InvoiceDetail.jsx
│   │   │   ├── InvoiceForm.jsx
│   │   │   └── BulkInvoiceGeneration.jsx
│   │   ├── Payments/
│   │   │   ├── PaymentList.jsx
│   │   │   ├── PaymentForm.jsx
│   │   │   ├── PaymentReconciliation.jsx
│   │   │   └── RefundManagement.jsx
│   │   ├── Expenses/
│   │   │   ├── ExpenseList.jsx
│   │   │   ├── ExpenseForm.jsx
│   │   │   ├── VendorList.jsx
│   │   │   └── VendorForm.jsx
│   │   ├── Budget/
│   │   │   ├── BudgetList.jsx
│   │   │   ├── BudgetForm.jsx
│   │   │   └── BudgetUtilization.jsx
│   │   ├── Payroll/
│   │   │   ├── SalaryStructureList.jsx
│   │   │   ├── SalaryStructureForm.jsx
│   │   │   ├── PayrollList.jsx
│   │   │   ├── PayrollForm.jsx
│   │   │   └── PayslipViewer.jsx
│   │   ├── Reports/
│   │   │   ├── ReportDashboard.jsx
│   │   │   ├── IncomeStatement.jsx
│   │   │   ├── BalanceSheet.jsx
│   │   │   ├── CashFlowReport.jsx
│   │   │   ├── FeeCollectionReport.jsx
│   │   │   ├── OutstandingDuesReport.jsx
│   │   │   └── ExpenseAnalysisReport.jsx
│   │   └── Approvals/
│   │       ├── PendingApprovals.jsx
│   │       └── ApprovalHistory.jsx
├── components/
│   ├── Finance/
│   │   ├── Common/
│   │   │   ├── AmountInput.jsx
│   │   │   ├── DateRangePicker.jsx
│   │   │   ├── AccountSelector.jsx
│   │   │   ├── CampusFilter.jsx
│   │   │   └── StatusBadge.jsx
│   │   ├── Invoice/
│   │   │   ├── InvoicePreview.jsx
│   │   │   └── InvoiceItemTable.jsx
│   │   ├── Payment/
│   │   │   ├── PaymentMethodSelector.jsx
│   │   │   └── ReceiptPreview.jsx
│   │   ├── Approval/
│   │   │   ├── ApprovalWorkflowViewer.jsx
│   │   │   └── ApprovalActionButtons.jsx
│   │   └── Reports/
│   │       ├── ReportFilters.jsx
│   │       ├── ReportTable.jsx
│   │       └── ReportChart.jsx
├── hooks/
│   ├── useFinancePermissions.js
│   ├── useInvoiceGeneration.js
│   ├── usePaymentReconciliation.js
│   └── useBudgetTracking.js
├── services/
│   ├── financeApi.js
│   ├── invoiceService.js
│   ├── paymentService.js
│   ├── expenseService.js
│   ├── budgetService.js
│   ├── payrollService.js
│   └── reportService.js
└── utils/
    ├── financeCalculations.js
    ├── financeValidation.js
    ├── currencyFormatter.js
    └── pdfGenerator.js
```

## Data Models

### Key Business Logic Models

#### Invoice Generation Logic

```typescript
interface InvoiceGenerationParams {
  studentIds: string[];
  feeStructureId: string;
  academicYearId: string;
  termId?: string;
  dueDate: Date;
  applyDiscounts: boolean;
}

interface GeneratedInvoice {
  studentId: string;
  invoiceNumber: string;
  items: InvoiceItem[];
  totalAmount: number;
  discountAmount: number;
  netAmount: number;
  dueDate: Date;
}
```

**Invoice Generation Algorithm:**
1. Retrieve fee structure and applicable fee items
2. For each student:
   - Check for applicable discounts/scholarships
   - Calculate base fee amounts
   - Apply discounts if configured
   - Generate unique invoice number
   - Create invoice with line items
   - Link to appropriate accounts
3. Return generated invoices with summary

#### Payment Reconciliation Logic

```typescript
interface ReconciliationParams {
  paymentId: string;
  invoiceAllocations: {
    invoiceId: string;
    amount: number;
  }[];
}

interface ReconciliationResult {
  success: boolean;
  allocatedAmount: number;
  remainingAmount: number;
  updatedInvoices: string[];
  creditBalance: number;
}
```

**Reconciliation Algorithm:**
1. Validate payment exists and is not already fully allocated
2. For each invoice allocation:
   - Validate invoice exists and belongs to same student
   - Validate allocation amount doesn't exceed invoice balance
   - Create payment allocation record
   - Update invoice paid amount and status
3. Calculate remaining payment amount
4. If remaining amount > 0, create credit balance for student
5. Generate transaction entries for double-entry accounting
6. Return reconciliation result

#### Late Fee Calculation Logic

```typescript
interface LateFeeCalculation {
  invoiceId: string;
  daysOverdue: number;
  applicableRule: LateFeeRule;
  calculatedAmount: number;
}
```

**Late Fee Algorithm:**
1. Query all invoices with status OVERDUE or PARTIALLY_PAID
2. For each overdue invoice:
   - Calculate days overdue (current date - due date)
   - Check if grace period has passed
   - Find applicable late fee rule
   - Calculate late fee amount (percentage or fixed)
   - Validate late fee doesn't exceed maximum threshold
   - Apply late fee to invoice
   - Update invoice net amount
   - Generate notification to student/parent
3. Log all late fee applications for audit

#### Budget Utilization Tracking

```typescript
interface BudgetUtilization {
  budgetLineId: string;
  allocatedAmount: number;
  spentAmount: number;
  committedAmount: number;
  remainingAmount: number;
  utilizationPercentage: number;
  isOverBudget: boolean;
  alertTriggered: boolean;
}
```

**Budget Tracking Algorithm:**
1. When expense is created/approved:
   - Find associated budget line
   - Update spent amount
   - Calculate remaining amount
   - Calculate utilization percentage
2. Check if utilization exceeds alert threshold
3. If threshold exceeded:
   - Generate alert notification
   - Flag budget line for review
4. If budget exceeded:
   - Mark as over-budget
   - Trigger approval workflow if configured
5. Update budget utilization dashboard

#### Payroll Calculation Logic

```typescript
interface PayrollCalculation {
  staffId: string;
  baseSalary: number;
  allowances: {
    name: string;
    amount: number;
  }[];
  deductions: {
    name: string;
    amount: number;
  }[];
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
}
```

**Payroll Calculation Algorithm:**
1. For each active staff member:
   - Retrieve salary structure
   - Calculate base salary
   - Calculate allowances:
     - Fixed allowances: use configured amount
     - Percentage allowances: calculate from base salary
   - Calculate deductions:
     - Fixed deductions: use configured amount
     - Percentage deductions: calculate from gross salary
   - Calculate gross salary = base + total allowances
   - Calculate net salary = gross - total deductions
2. Create payroll item with detailed breakdown
3. Generate accounting transactions
4. Return payroll calculation summary

### Validation Rules

#### Financial Transaction Validation

```typescript
interface TransactionValidation {
  isBalanced: boolean;          // Debits = Credits
  hasValidAccounts: boolean;    // All accounts exist and are active
  hasValidAmounts: boolean;     // All amounts > 0
  isInOpenPeriod: boolean;      // Transaction date in open fiscal period
  hasRequiredFields: boolean;   // All required fields populated
  errors: string[];
}
```

**Validation Rules:**
1. Double-entry validation: Sum of debits must equal sum of credits
2. Account validation: All accounts must exist, be active, and be leaf accounts
3. Amount validation: All amounts must be positive (except for reversals)
4. Date validation: Transaction date must be within open fiscal period
5. Permission validation: User must have permission for transaction type
6. Business rule validation: Transaction must comply with business rules (e.g., refund <= credit balance)

#### Invoice Validation

```typescript
interface InvoiceValidation {
  hasValidStudent: boolean;
  hasValidItems: boolean;
  hasValidAmounts: boolean;
  hasValidDueDate: boolean;
  hasValidAccounts: boolean;
  errors: string[];
}
```

**Validation Rules:**
1. Student must exist and be active
2. Invoice must have at least one line item
3. All amounts must be positive
4. Due date must be in the future (for new invoices)
5. All fee items must link to valid income accounts
6. Total amount must equal sum of line items
7. Discount amount must not exceed total amount

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*



### Property Reflection

After analyzing all acceptance criteria, I identified the following areas of potential redundancy:

1. **Audit Trail Properties**: Multiple requirements (3.5, 5.4, 8.5, 10.5, 13.6, 17.1, 17.2) all require audit trails. These can be consolidated into comprehensive audit trail properties rather than separate properties for each entity type.

2. **Unique Number Generation**: Requirements 6.4 and 8.4 both require unique receipt/reference numbers. These follow the same pattern and can be combined into a single property about unique identifier generation.

3. **Approval Workflow Properties**: Requirements 10.1, 11.4, 13.3 all involve routing through approval workflows. These can be consolidated into general approval workflow properties.

4. **Validation Properties**: Requirements 1.2, 3.2, 6.2, 8.1, 9.2, 20.1-20.6 all involve validation. Some of these can be combined into more comprehensive validation properties.

5. **Balance Calculation Properties**: Requirements 6.3, 6.5, 7.4, 8.3 all involve balance calculations. These can be consolidated into comprehensive balance tracking properties.

After reflection, I will write properties that provide unique validation value without redundancy.

### Correctness Properties

#### Property 1: Account Code Uniqueness
*For any* two accounts in the system, their account codes must be different.
**Validates: Requirements 1.2**

#### Property 2: Deactivated Account Transaction Prevention
*For any* deactivated account, attempting to post a new transaction to it should be rejected, while historical transactions remain accessible.
**Validates: Requirements 1.5**

#### Property 3: Leaf Account Transaction Enforcement
*For any* account that has child accounts (non-leaf), attempting to post a transaction to it should be rejected.
**Validates: Requirements 1.6**

#### Property 4: Fee Structure Modification Isolation
*For any* existing invoice, modifying the fee structure it was based on should not change the invoice amounts or line items.
**Validates: Requirements 2.6**

#### Property 5: Discount Amount Validation
*For any* discount application, the discount amount must not exceed the original fee amount, and the resulting net amount must be non-negative.
**Validates: Requirements 3.2**

#### Property 6: Scholarship Discount Application
*For any* approved scholarship and applicable invoice, the scholarship discount should be automatically applied to the invoice.
**Validates: Requirements 3.4**

#### Property 7: Late Fee Calculation Correctness
*For any* overdue invoice past its grace period, the calculated late fee should match the configured rule (percentage of outstanding amount or fixed amount).
**Validates: Requirements 4.2**

#### Property 8: Grace Period Enforcement
*For any* invoice within its grace period (days overdue < grace period days), no late fee should be applied.
**Validates: Requirements 4.3**

#### Property 9: Late Fee Notification Generation
*For any* late fee application, a notification record should be created for the associated student/parent.
**Validates: Requirements 4.4**

#### Property 10: Bulk Invoice Generation Completeness
*For any* set of students with an applicable fee structure, bulk invoice generation should create exactly one invoice per student with all fee structure items included.
**Validates: Requirements 5.1**

#### Property 11: Invoice Required Fields Completeness
*For any* generated invoice, it must contain student details, at least one fee line item, due date, and total amount.
**Validates: Requirements 5.3**

#### Property 12: Invoice Reversal Preservation
*For any* invoice reversal, the original invoice record must remain in the database with its original values, and a corresponding credit note must be created.
**Validates: Requirements 5.5**

#### Property 13: Payment Amount Validation
*For any* payment record, the amount must be positive and must not exceed the student's total outstanding balance plus the configured overpayment threshold.
**Validates: Requirements 6.2**

#### Property 14: Partial Payment Balance Calculation
*For any* partial payment against an invoice, the remaining balance should equal the original invoice net amount minus the sum of all allocated payments.
**Validates: Requirements 6.3**

#### Property 15: Receipt Unique Number Generation
*For any* two payment or refund receipts in the system, their receipt/reference numbers must be different.
**Validates: Requirements 6.4, 8.4**

#### Property 16: Credit Balance Maintenance
*For any* advance payment or overpayment, the student's credit balance should be increased by the unallocated amount and should be available for future invoice allocation.
**Validates: Requirements 6.5**

#### Property 17: Overpayment Flagging
*For any* payment that results in a credit balance exceeding a threshold, the payment should be flagged for Finance Officer review.
**Validates: Requirements 6.6**

#### Property 18: Automatic Payment Matching
*For any* payment with valid student ID and invoice number, the system should automatically create a payment allocation linking the payment to the invoice.
**Validates: Requirements 7.1**

#### Property 19: Unmatched Payment Flagging
*For any* payment without valid matching criteria (missing or invalid student ID/invoice number), the payment should be flagged for manual reconciliation.
**Validates: Requirements 7.2**

#### Property 20: Reconciliation Balance Update
*For any* completed payment reconciliation, all allocated invoices should have their paid amounts and statuses updated, and the sum of allocations should equal the payment amount.
**Validates: Requirements 7.4**

#### Property 21: Refund Validation
*For any* refund request, the refund amount must not exceed the student's available credit balance plus overpayment amount.
**Validates: Requirements 8.1**

#### Property 22: Refund Approval Threshold Enforcement
*For any* refund request with amount exceeding the configured threshold, the refund status must be PENDING until School Administrator approval is recorded.
**Validates: Requirements 8.2**

#### Property 23: Refund Balance Update
*For any* approved and completed refund, the student's credit balance should be decreased by the refund amount, and a refund transaction should be recorded.
**Validates: Requirements 8.3**

#### Property 24: Expense Category and Account Validation
*For any* expense record, it must be assigned to a valid expense category and a valid, active, leaf-level account.
**Validates: Requirements 9.2**

#### Property 25: Expense Attachment Storage and Retrieval
*For any* expense with attachments, all uploaded files should be stored and retrievable using their file paths.
**Validates: Requirements 9.4**

#### Property 26: Budget Utilization Tracking
*For any* approved expense linked to a budget line, the budget line's spent amount should be increased by the expense amount, and remaining amount should be recalculated.
**Validates: Requirements 9.6**

#### Property 27: Expense Approval Workflow Routing
*For any* submitted expense, it should be routed to the appropriate approval workflow based on configured rules (amount thresholds, expense category).
**Validates: Requirements 10.1**

#### Property 28: Multi-Level Approval Determination
*For any* expense, the required approval level should be determined by the expense amount matching the configured threshold ranges.
**Validates: Requirements 10.2**

#### Property 29: Pending Approval Payment Prevention
*For any* expense with status PENDING_APPROVAL or DRAFT, attempting to mark it as PAID should be rejected.
**Validates: Requirements 10.3**

#### Property 30: Rejection Notification
*For any* expense or budget rejection, a notification should be created for the submitter containing the rejection reason.
**Validates: Requirements 10.4**

#### Property 31: Budget Approval Workflow Routing
*For any* submitted budget, it should enter an approval workflow and status should be PENDING_APPROVAL until all required approvals are obtained.
**Validates: Requirements 11.4**

#### Property 32: Real-Time Budget Utilization Update
*For any* expense posted against a budget line, the budget line's utilization percentage should be recalculated as (spentAmount / allocatedAmount) * 100.
**Validates: Requirements 11.5**

#### Property 33: Budget Threshold Alert Generation
*For any* budget line where utilization percentage exceeds the configured alert threshold, an alert notification should be generated for Finance Officers.
**Validates: Requirements 11.6**

#### Property 34: Net Salary Calculation Correctness
*For any* salary structure, the calculated net salary should equal base salary plus sum of all allowances minus sum of all deductions.
**Validates: Requirements 12.4**

#### Property 35: Payroll Generation Completeness
*For any* payroll initiation, payroll items should be generated for all staff members with active status, and no inactive staff should have payroll items.
**Validates: Requirements 13.1**

#### Property 36: Payroll Approval Requirement
*For any* payroll with status COMPLETE, it should require School Administrator approval before status can change to APPROVED or PAID.
**Validates: Requirements 13.3**

#### Property 37: Payslip Generation Completeness
*For any* approved payroll, a payslip should be generated for each payroll item (one per staff member).
**Validates: Requirements 13.4**

#### Property 38: Payroll Accounting Entry Creation
*For any* approved payroll, accounting transaction entries should be created posting expenses to the appropriate salary and deduction accounts.
**Validates: Requirements 13.5**

#### Property 39: Outstanding Dues Calculation Correctness
*For any* set of invoices, the total outstanding dues should equal the sum of (net amount - paid amount) for all invoices with status not equal to PAID or CANCELLED.
**Validates: Requirements 15.1**

#### Property 40: Aging Period Categorization
*For any* unpaid invoice, its aging category should be determined by the number of days between due date and current date (current, 30 days, 60 days, 90+ days).
**Validates: Requirements 15.2**

#### Property 41: Outstanding Dues Summary Accuracy
*For any* outstanding dues report, the total outstanding amount should equal the sum of all individual invoice outstanding amounts in the report.
**Validates: Requirements 15.5**

#### Property 42: Role-Based Access Control Enforcement
*For any* user and protected function, access should be granted if and only if the user's role has permission for that function.
**Validates: Requirements 16.5**

#### Property 43: Access Attempt Logging
*For any* access attempt to a protected function, an audit log entry should be created recording the user, function, timestamp, and result (granted/denied).
**Validates: Requirements 16.6**

#### Property 44: Financial Transaction Audit Trail Creation
*For any* financial transaction (invoice, payment, expense, refund, payroll), an audit log entry should be created recording the action, user, and timestamp.
**Validates: Requirements 3.5, 5.4, 8.5, 10.5, 13.6, 17.1**

#### Property 45: Transaction Modification Audit Detail
*For any* modification to a financial record, the audit log entry should contain the user ID, timestamp, old value (before), and new value (after).
**Validates: Requirements 17.2**

#### Property 46: Soft Deletion with Audit Trail
*For any* delete operation on a financial record, the record should be marked as deleted (soft delete) rather than removed from the database, and an audit log entry should be created.
**Validates: Requirements 17.3**

#### Property 47: External Transaction Validation and Audit
*For any* financial transaction created by an external module via API, the transaction should be validated according to the same rules as internal transactions, and an audit trail should be created.
**Validates: Requirements 19.2**

#### Property 48: External Transaction Data Consistency
*For any* transaction received from an integrated module, if the transaction is accepted, all related data (accounts, balances, budgets) should be updated atomically to maintain consistency.
**Validates: Requirements 19.4**

#### Property 49: Double-Entry Accounting Balance
*For any* financial transaction, the sum of all debit amounts must equal the sum of all credit amounts.
**Validates: Requirements 20.1**

#### Property 50: Monetary Amount Non-Negativity
*For any* monetary amount field (except refunds and adjustments), the value must be greater than or equal to zero.
**Validates: Requirements 20.2**

#### Property 51: Fiscal Period Date Validation
*For any* transaction date, it must fall within a defined fiscal period that is currently open for posting.
**Validates: Requirements 20.3**

#### Property 52: Closed Period Posting Prevention
*For any* transaction with a date in a closed fiscal period, the transaction should be rejected unless the user has special authorization to post to closed periods.
**Validates: Requirements 20.4**

#### Property 53: Required Field Validation
*For any* financial record save operation, all fields marked as required in the schema must be populated with non-null, non-empty values.
**Validates: Requirements 20.5**

#### Property 54: Validation Error Message Clarity
*For any* validation failure, the error message should specifically identify which field or rule failed validation.
**Validates: Requirements 20.6**



## Error Handling

### Error Categories

The Finance Management Module implements comprehensive error handling across the following categories:

#### 1. Validation Errors (400 Bad Request)
- Invalid input data (negative amounts, missing required fields)
- Business rule violations (discount exceeds fee amount, refund exceeds credit balance)
- Constraint violations (duplicate account codes, invalid account hierarchy)
- Date validation failures (closed fiscal periods, invalid date ranges)

**Error Response Format:**
```json
{
  "error": "VALIDATION_ERROR",
  "message": "Validation failed",
  "details": [
    {
      "field": "amount",
      "message": "Amount must be positive",
      "code": "INVALID_AMOUNT"
    }
  ]
}
```

#### 2. Authorization Errors (403 Forbidden)
- Insufficient permissions for requested operation
- Role-based access control violations
- Approval authority violations (user cannot approve at required level)

**Error Response Format:**
```json
{
  "error": "AUTHORIZATION_ERROR",
  "message": "Insufficient permissions",
  "details": {
    "requiredRole": "FINANCE_OFFICER",
    "userRole": "AUDITOR",
    "operation": "CREATE_EXPENSE"
  }
}
```

#### 3. Not Found Errors (404 Not Found)
- Entity does not exist (invoice, payment, account, student)
- Referenced entity not found (parent account, fee structure)

**Error Response Format:**
```json
{
  "error": "NOT_FOUND",
  "message": "Invoice not found",
  "details": {
    "entityType": "Invoice",
    "entityId": "uuid-here"
  }
}
```

#### 4. Conflict Errors (409 Conflict)
- Concurrent modification conflicts
- State transition violations (cannot approve already-approved expense)
- Duplicate entity creation (account code already exists)

**Error Response Format:**
```json
{
  "error": "CONFLICT",
  "message": "Invoice has been modified by another user",
  "details": {
    "entityType": "Invoice",
    "entityId": "uuid-here",
    "currentVersion": 5,
    "attemptedVersion": 4
  }
}
```

#### 5. Business Logic Errors (422 Unprocessable Entity)
- Workflow violations (cannot pay unapproved expense)
- State-dependent operation failures (cannot reverse paid invoice)
- Budget constraint violations (expense exceeds budget)

**Error Response Format:**
```json
{
  "error": "BUSINESS_LOGIC_ERROR",
  "message": "Cannot process payment for unapproved expense",
  "details": {
    "expenseId": "uuid-here",
    "currentStatus": "PENDING_APPROVAL",
    "requiredStatus": "APPROVED"
  }
}
```

#### 6. Integration Errors (502 Bad Gateway)
- Payment gateway failures
- External module communication failures
- Third-party service unavailability

**Error Response Format:**
```json
{
  "error": "INTEGRATION_ERROR",
  "message": "Payment gateway unavailable",
  "details": {
    "service": "PaymentGateway",
    "provider": "MobileMoneyProvider",
    "retryable": true
  }
}
```

#### 7. System Errors (500 Internal Server Error)
- Database connection failures
- Unexpected exceptions
- Data corruption detection

**Error Response Format:**
```json
{
  "error": "SYSTEM_ERROR",
  "message": "An unexpected error occurred",
  "details": {
    "errorId": "error-tracking-id",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

### Error Handling Strategies

#### Transaction Rollback
All financial operations that modify multiple records are wrapped in database transactions. On any error, the entire transaction is rolled back to maintain data consistency.

```typescript
async function processPayment(paymentData) {
  const transaction = await prisma.$transaction(async (tx) => {
    // Create payment record
    const payment = await tx.payment.create({ data: paymentData });
    
    // Create payment allocations
    for (const allocation of paymentData.allocations) {
      await tx.paymentAllocation.create({ data: allocation });
      
      // Update invoice
      await tx.invoice.update({
        where: { id: allocation.invoiceId },
        data: { paidAmount: { increment: allocation.amount } }
      });
    }
    
    // Create audit log
    await tx.auditLog.create({ data: auditData });
    
    return payment;
  });
  
  return transaction;
}
```

#### Idempotency
Critical operations (invoice generation, payment processing) implement idempotency to prevent duplicate processing on retry.

```typescript
async function generateInvoice(params, idempotencyKey) {
  // Check if already processed
  const existing = await prisma.invoice.findUnique({
    where: { idempotencyKey }
  });
  
  if (existing) {
    return existing; // Return existing result
  }
  
  // Process new request
  const invoice = await createInvoice(params);
  return invoice;
}
```

#### Graceful Degradation
Non-critical failures (notification sending, report generation) are logged but do not block the main operation.

```typescript
async function recordPayment(paymentData) {
  const payment = await prisma.payment.create({ data: paymentData });
  
  // Send notification (non-blocking)
  try {
    await notificationService.sendPaymentReceipt(payment);
  } catch (error) {
    logger.error('Failed to send payment receipt', { paymentId: payment.id, error });
    // Continue - notification failure doesn't invalidate payment
  }
  
  return payment;
}
```

#### Retry Logic
Transient failures (network issues, temporary service unavailability) are retried with exponential backoff.

```typescript
async function callPaymentGateway(paymentData, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await paymentGateway.processPayment(paymentData);
    } catch (error) {
      if (attempt === maxRetries || !isRetryableError(error)) {
        throw error;
      }
      
      const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
      await sleep(delay);
    }
  }
}
```

### Logging and Monitoring

All errors are logged with appropriate context for debugging and monitoring:

```typescript
logger.error('Payment processing failed', {
  paymentId: payment.id,
  studentId: payment.studentId,
  amount: payment.amount,
  error: error.message,
  stack: error.stack,
  timestamp: new Date().toISOString()
});
```

Critical errors trigger alerts to system administrators for immediate attention.

## Testing Strategy

The Finance Management Module employs a comprehensive testing strategy combining unit tests, property-based tests, integration tests, and end-to-end tests.

### Testing Approach

#### 1. Unit Tests
Unit tests verify specific examples, edge cases, and error conditions for individual functions and components.

**Focus Areas:**
- Calculation functions (late fees, net salary, budget utilization)
- Validation functions (amount validation, date validation)
- Formatting functions (currency formatting, date formatting)
- Edge cases (zero amounts, boundary dates, empty collections)
- Error conditions (null inputs, invalid data types)

**Example Unit Tests:**
```typescript
describe('calculateLateFee', () => {
  it('should calculate percentage-based late fee correctly', () => {
    const invoice = { netAmount: 1000, dueDate: '2024-01-01' };
    const rule = { type: 'PERCENTAGE', value: 5, gracePeriodDays: 0 };
    const currentDate = '2024-01-10';
    
    const lateFee = calculateLateFee(invoice, rule, currentDate);
    
    expect(lateFee).toBe(50); // 5% of 1000
  });
  
  it('should return zero late fee within grace period', () => {
    const invoice = { netAmount: 1000, dueDate: '2024-01-01' };
    const rule = { type: 'PERCENTAGE', value: 5, gracePeriodDays: 10 };
    const currentDate = '2024-01-05';
    
    const lateFee = calculateLateFee(invoice, rule, currentDate);
    
    expect(lateFee).toBe(0);
  });
  
  it('should handle fixed amount late fees', () => {
    const invoice = { netAmount: 1000, dueDate: '2024-01-01' };
    const rule = { type: 'FIXED_AMOUNT', value: 25, gracePeriodDays: 0 };
    const currentDate = '2024-01-10';
    
    const lateFee = calculateLateFee(invoice, rule, currentDate);
    
    expect(lateFee).toBe(25);
  });
});
```

#### 2. Property-Based Tests
Property-based tests verify universal properties across randomly generated inputs to ensure correctness at scale.

**Property Testing Library:** fast-check (for TypeScript/JavaScript)

**Configuration:**
- Minimum 100 iterations per property test
- Each test tagged with feature name and property number
- Shrinking enabled to find minimal failing examples

**Example Property Tests:**
```typescript
import fc from 'fast-check';

describe('Property Tests - Finance Management', () => {
  /**
   * Feature: finance-management-module, Property 49: Double-Entry Accounting Balance
   * For any financial transaction, the sum of all debit amounts must equal the sum of all credit amounts.
   */
  it('should maintain double-entry balance for all transactions', () => {
    fc.assert(
      fc.property(
        fc.array(fc.record({
          accountId: fc.uuid(),
          debitAmount: fc.float({ min: 0, max: 100000, noNaN: true }),
          creditAmount: fc.float({ min: 0, max: 100000, noNaN: true })
        }), { minLength: 2, maxLength: 10 }),
        (transactionLines) => {
          // Ensure at least one debit and one credit
          const hasDebit = transactionLines.some(line => line.debitAmount > 0);
          const hasCredit = transactionLines.some(line => line.creditAmount > 0);
          fc.pre(hasDebit && hasCredit);
          
          const totalDebits = transactionLines.reduce((sum, line) => sum + line.debitAmount, 0);
          const totalCredits = transactionLines.reduce((sum, line) => sum + line.creditAmount, 0);
          
          // Validate transaction
          const isValid = validateTransaction({ lines: transactionLines });
          
          if (Math.abs(totalDebits - totalCredits) < 0.01) {
            expect(isValid).toBe(true);
          } else {
            expect(isValid).toBe(false);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
  
  /**
   * Feature: finance-management-module, Property 14: Partial Payment Balance Calculation
   * For any partial payment against an invoice, the remaining balance should equal 
   * the original invoice net amount minus the sum of all allocated payments.
   */
  it('should calculate remaining balance correctly for partial payments', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 100, max: 10000, noNaN: true }), // Invoice amount
        fc.array(fc.float({ min: 10, max: 1000, noNaN: true }), { minLength: 1, maxLength: 5 }), // Payments
        (invoiceAmount, payments) => {
          const totalPayments = payments.reduce((sum, p) => sum + p, 0);
          fc.pre(totalPayments < invoiceAmount); // Ensure partial payment
          
          const invoice = { netAmount: invoiceAmount, paidAmount: 0 };
          
          // Apply payments
          for (const payment of payments) {
            applyPayment(invoice, payment);
          }
          
          const expectedBalance = invoiceAmount - totalPayments;
          const actualBalance = invoice.netAmount - invoice.paidAmount;
          
          expect(Math.abs(actualBalance - expectedBalance)).toBeLessThan(0.01);
        }
      ),
      { numRuns: 100 }
    );
  });
  
  /**
   * Feature: finance-management-module, Property 34: Net Salary Calculation Correctness
   * For any salary structure, the calculated net salary should equal 
   * base salary plus sum of all allowances minus sum of all deductions.
   */
  it('should calculate net salary correctly for any salary structure', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 1000, max: 50000, noNaN: true }), // Base salary
        fc.array(fc.float({ min: 0, max: 5000, noNaN: true }), { maxLength: 5 }), // Allowances
        fc.array(fc.float({ min: 0, max: 10000, noNaN: true }), { maxLength: 5 }), // Deductions
        (baseSalary, allowances, deductions) => {
          const salaryStructure = {
            baseSalary,
            allowances: allowances.map((amount, i) => ({ name: `Allowance${i}`, amount })),
            deductions: deductions.map((amount, i) => ({ name: `Deduction${i}`, amount }))
          };
          
          const calculated = calculateNetSalary(salaryStructure);
          
          const expectedGross = baseSalary + allowances.reduce((sum, a) => sum + a, 0);
          const expectedNet = expectedGross - deductions.reduce((sum, d) => sum + d, 0);
          
          expect(Math.abs(calculated.grossSalary - expectedGross)).toBeLessThan(0.01);
          expect(Math.abs(calculated.netSalary - expectedNet)).toBeLessThan(0.01);
        }
      ),
      { numRuns: 100 }
    );
  });
  
  /**
   * Feature: finance-management-module, Property 1: Account Code Uniqueness
   * For any two accounts in the system, their account codes must be different.
   */
  it('should enforce unique account codes', () => {
    fc.assert(
      fc.property(
        fc.array(fc.record({
          code: fc.string({ minLength: 3, maxLength: 10 }),
          name: fc.string({ minLength: 5, maxLength: 50 }),
          type: fc.constantFrom('ASSET', 'LIABILITY', 'INCOME', 'EXPENSE')
        }), { minLength: 2, maxLength: 20 }),
        async (accounts) => {
          // Create first account
          const first = await createAccount(accounts[0]);
          expect(first).toBeDefined();
          
          // Try to create duplicate
          const duplicate = { ...accounts[1], code: accounts[0].code };
          
          await expect(createAccount(duplicate)).rejects.toThrow('Account code already exists');
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

#### 3. Integration Tests
Integration tests verify interactions between multiple components and modules.

**Focus Areas:**
- API endpoint testing (request/response validation)
- Database operations (CRUD operations, transactions)
- Approval workflow execution
- Payment reconciliation process
- Invoice generation pipeline
- Payroll processing pipeline

**Example Integration Test:**
```typescript
describe('Payment Reconciliation Integration', () => {
  it('should reconcile payment and update invoice status', async () => {
    // Setup: Create student, invoice, and payment
    const student = await createTestStudent();
    const invoice = await createTestInvoice(student.id, { netAmount: 1000 });
    const payment = await createTestPayment(student.id, { amount: 1000 });
    
    // Execute: Reconcile payment
    const result = await reconcilePayment({
      paymentId: payment.id,
      allocations: [{ invoiceId: invoice.id, amount: 1000 }]
    });
    
    // Verify: Payment allocated, invoice updated
    expect(result.success).toBe(true);
    expect(result.allocatedAmount).toBe(1000);
    
    const updatedInvoice = await getInvoice(invoice.id);
    expect(updatedInvoice.paidAmount).toBe(1000);
    expect(updatedInvoice.status).toBe('PAID');
    
    const allocations = await getPaymentAllocations(payment.id);
    expect(allocations).toHaveLength(1);
    expect(allocations[0].amount).toBe(1000);
  });
});
```

#### 4. End-to-End Tests
End-to-end tests verify complete user workflows through the UI.

**Focus Areas:**
- Fee structure creation and invoice generation
- Payment recording and receipt generation
- Expense submission and approval workflow
- Budget creation and utilization tracking
- Payroll processing and payslip generation
- Financial report generation

**Testing Tools:**
- Playwright or Cypress for browser automation
- Test data factories for consistent test setup
- Screenshot comparison for UI regression testing

### Test Coverage Goals

- **Unit Test Coverage**: Minimum 80% code coverage for business logic
- **Property Test Coverage**: All 54 correctness properties implemented as property tests
- **Integration Test Coverage**: All API endpoints and critical workflows
- **E2E Test Coverage**: All major user journeys

### Continuous Integration

All tests run automatically on:
- Pull request creation
- Commit to main branch
- Scheduled nightly builds

**CI Pipeline:**
1. Lint and type checking
2. Unit tests (parallel execution)
3. Property tests (100 iterations per property)
4. Integration tests (with test database)
5. E2E tests (with test environment)
6. Coverage report generation
7. Test result reporting

### Test Data Management

**Test Data Strategy:**
- Use factories for generating test data
- Seed test database with realistic data
- Clean up test data after each test
- Use transactions for test isolation

**Example Test Factory:**
```typescript
export const invoiceFactory = {
  build: (overrides = {}) => ({
    studentId: faker.string.uuid(),
    academicYearId: faker.string.uuid(),
    issueDate: faker.date.recent(),
    dueDate: faker.date.future(),
    totalAmount: faker.number.float({ min: 100, max: 10000 }),
    discountAmount: 0,
    lateFeeAmount: 0,
    netAmount: faker.number.float({ min: 100, max: 10000 }),
    paidAmount: 0,
    status: 'ISSUED',
    campusId: faker.string.uuid(),
    ...overrides
  }),
  
  create: async (overrides = {}) => {
    const data = invoiceFactory.build(overrides);
    return await prisma.invoice.create({ data });
  }
};
```

### Performance Testing

**Load Testing:**
- Simulate concurrent users (100+ simultaneous requests)
- Test bulk operations (1000+ invoice generation)
- Measure response times under load
- Identify bottlenecks and optimize

**Stress Testing:**
- Test system limits (maximum concurrent transactions)
- Test database connection pool limits
- Test memory usage under heavy load
- Verify graceful degradation

**Tools:**
- k6 or Artillery for load testing
- Database query profiling
- Application performance monitoring (APM)

### Security Testing

**Security Test Areas:**
- Authentication and authorization
- SQL injection prevention
- XSS prevention
- CSRF protection
- Input validation
- Sensitive data encryption
- Audit trail completeness

**Tools:**
- OWASP ZAP for vulnerability scanning
- npm audit for dependency vulnerabilities
- Manual security code review

## Deployment Considerations

### Database Migrations

All schema changes are managed through Prisma migrations:

```bash
# Create migration
npx prisma migrate dev --name add_finance_tables

# Apply migration to production
npx prisma migrate deploy
```

### Environment Configuration

Required environment variables:

```env
s
- Payment gateway success rates
- Background job execution times
- Error rates by endpoint
- User activity by role

**Logging:**
- Structured logging (JSON format)
- Log levels: ERROR, WARN, INFO, DEBUG
- Centralized log aggregation
- Log retention policy (90 days minimum for audit logs)

**Alerting:**
- Payment gateway failures
- Database connection issues
- High error rates
- Budget threshold breaches
- Failed scheduled jobs
ty

**Metrics to Monitor:**
- API response times
- Database query performance
- Transaction success/failure rateT=your-secret-key
PAYMENT_GATEWAY_API_KEY=your-api-key
FILE_STORAGE_PATH=/var/app/uploads
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=noreply@school.com
SMTP_PASSWORD=your-smtp-password
```

### Initial Setup

1. Run database migrations
2. Seed initial data (chart of accounts templates, roles, permissions)
3. Configure approval workflows
4. Set up payment gateway integration
5. Configure notification templates
6. Set up scheduled jobs (invoice generation, late fee application)

### Monitoring and ObservabiliDATABASE_URL=postgresql://user:password@localhost:5432/school_db
JWT_SECRE