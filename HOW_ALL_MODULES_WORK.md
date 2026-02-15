# Complete Guide: How All ERP Modules Work

## 📚 Table of Contents
1. [Finance Management Module](#1-finance-management-module)
2. [Inventory & Stock Management Module](#2-inventory--stock-management-module)
3. [Property & Asset Management Module](#3-property--asset-management-module)
4. [HR & Staff Management Module](#4-hr--staff-management-module)
5. [Module Integrations](#5-module-integrations)
6. [Data Flow & Relationships](#6-data-flow--relationships)
7. [User Roles & Permissions](#7-user-roles--permissions)
8. [Common Workflows](#8-common-workflows)

---

## 1. Finance Management Module

### Overview
Complete financial management system for tracking income, expenses, budgets, and generating financial reports.

### Components (10)

#### 1.1 Finance Dashboard
**Path**: `/finance`
**Purpose**: Overview of financial health

**Features**:
- Total revenue, expenses, profit metrics
- Monthly trends charts
- Quick action buttons
- Recent transactions
- Budget vs actual comparison

**How it Works**:
1. Fetches financial stats from `/api/finance/stats`
2. Displays key metrics in cards
3. Shows charts for trends
4. Provides navigation to other finance modules


#### 1.2 Chart of Accounts
**Path**: `/finance/accounts`
**Purpose**: Manage accounting structure

**Features**:
- Account hierarchy (Assets, Liabilities, Equity, Revenue, Expenses)
- Account codes and names
- Account types and categories
- Active/inactive status

**How it Works**:
1. User creates account with code, name, type
2. System organizes by account type
3. Accounts used in all financial transactions
4. Supports multi-level hierarchy

**Data Source**: Fetches from `/api/finance/accounts`

#### 1.3 Fee Management
**Path**: `/finance/fee-management`
**Purpose**: Configure student fee structures

**Features**:
- Fee structures by class/term
- Multiple fee types (Tuition, Transport, Library, etc.)
- Recurring fees
- Academic year tracking

**How it Works**:
1. Admin creates fee structure for specific class/term
2. Sets amount and due date
3. Marks as recurring if needed
4. Fee structures used when generating invoices

**Data Source**: Fetches from `/api/finance/fee-structures`


#### 1.4 Invoice Management
**Path**: `/finance/invoices`
**Purpose**: Generate and track student invoices

**Features**:
- Generate invoices for students
- Track payment status (Issued, Partially Paid, Paid, Overdue)
- View balance due
- Download invoices
- Record payments

**How it Works**:
1. Select student from dropdown (fetches from `/api/students`)
2. Select fee structure (fetches from `/api/finance/fee-structures`)
3. Set due date and academic year
4. System generates invoice with unique number
5. Invoice appears in list with status
6. Can record payments against invoice

**Data Sources**:
- Students: `/api/students`
- Fee Structures: `/api/finance/fee-structures`
- Invoices: `/api/finance/invoices`

**Student Integration**: ✅ Automatically fetches all students from existing student list

#### 1.5 Payment Management
**Path**: `/finance/payments`
**Purpose**: Record and track all payments

**Features**:
- Record payments (Cash, Bank Transfer, Cheque, Card, Mobile Money)
- Link payments to invoices
- Generate receipts
- Payment history
- Reconciliation

**How it Works**:
1. User records payment with amount and method
2. Links to student invoice
3. System generates receipt number
4. Updates invoice status automatically
5. Payment appears in history

**Data Source**: Fetches from `/api/finance/payments`

