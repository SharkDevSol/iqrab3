-- Create Finance Module Tables
-- This script creates ONLY the missing finance tables without touching existing tables

-- Chart of Accounts
CREATE TABLE IF NOT EXISTS "Account" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "code" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "type" TEXT NOT NULL CHECK ("type" IN ('ASSET', 'LIABILITY', 'INCOME', 'EXPENSE')),
  "parentId" UUID REFERENCES "Account"("id"),
  "campusId" UUID,
  "isActive" BOOLEAN DEFAULT true,
  "isLeaf" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW(),
  "createdBy" UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS "Account_code_idx" ON "Account"("code");
CREATE INDEX IF NOT EXISTS "Account_type_idx" ON "Account"("type");
CREATE INDEX IF NOT EXISTS "Account_campusId_idx" ON "Account"("campusId");
CREATE INDEX IF NOT EXISTS "Account_isActive_idx" ON "Account"("isActive");

-- Fee Structure
CREATE TABLE IF NOT EXISTS "FeeStructure" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "academicYearId" UUID NOT NULL,
  "termId" UUID,
  "gradeLevel" TEXT,
  "campusId" UUID,
  "studentCategory" TEXT,
  "description" TEXT,
  "isActive" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "FeeStructure_academicYearId_idx" ON "FeeStructure"("academicYearId");
CREATE INDEX IF NOT EXISTS "FeeStructure_campusId_idx" ON "FeeStructure"("campusId");
CREATE INDEX IF NOT EXISTS "FeeStructure_isActive_idx" ON "FeeStructure"("isActive");

-- Fee Structure Items
CREATE TABLE IF NOT EXISTS "FeeStructureItem" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "feeStructureId" UUID NOT NULL REFERENCES "FeeStructure"("id") ON DELETE CASCADE,
  "feeCategory" TEXT NOT NULL,
  "amount" DECIMAL(15, 2) NOT NULL,
  "accountId" UUID NOT NULL REFERENCES "Account"("id"),
  "paymentType" TEXT NOT NULL CHECK ("paymentType" IN ('ONE_TIME', 'RECURRING', 'INSTALLMENT')),
  "dueDate" TIMESTAMPTZ,
  "installmentCount" INTEGER,
  "description" TEXT
);

CREATE INDEX IF NOT EXISTS "FeeStructureItem_feeStructureId_idx" ON "FeeStructureItem"("feeStructureId");
CREATE INDEX IF NOT EXISTS "FeeStructureItem_feeCategory_idx" ON "FeeStructureItem"("feeCategory");

-- Late Fee Rules
CREATE TABLE IF NOT EXISTS "LateFeeRule" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "type" TEXT NOT NULL CHECK ("type" IN ('PERCENTAGE', 'FIXED_AMOUNT')),
  "value" DECIMAL(15, 2) NOT NULL,
  "gracePeriodDays" INTEGER NOT NULL,
  "applicableFeeCategories" JSONB NOT NULL,
  "campusId" UUID,
  "isActive" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "LateFeeRule_campusId_idx" ON "LateFeeRule"("campusId");
CREATE INDEX IF NOT EXISTS "LateFeeRule_isActive_idx" ON "LateFeeRule"("isActive");

-- Invoices
CREATE TABLE IF NOT EXISTS "Invoice" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "invoiceNumber" TEXT UNIQUE NOT NULL,
  "receiptNumber" TEXT UNIQUE,
  "studentId" UUID NOT NULL,
  "academicYearId" UUID NOT NULL,
  "termId" UUID,
  "feeStructureId" UUID REFERENCES "FeeStructure"("id"),
  "issueDate" TIMESTAMPTZ NOT NULL,
  "dueDate" TIMESTAMPTZ NOT NULL,
  "totalAmount" DECIMAL(15, 2) NOT NULL,
  "discountAmount" DECIMAL(15, 2) DEFAULT 0,
  "lateFeeAmount" DECIMAL(15, 2) DEFAULT 0,
  "netAmount" DECIMAL(15, 2) NOT NULL,
  "paidAmount" DECIMAL(15, 2) DEFAULT 0,
  "status" TEXT NOT NULL CHECK ("status" IN ('DRAFT', 'ISSUED', 'PARTIALLY_PAID', 'PAID', 'OVERDUE', 'CANCELLED')),
  "metadata" JSONB,
  "campusId" UUID NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW(),
  "createdBy" UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS "Invoice_invoiceNumber_idx" ON "Invoice"("invoiceNumber");
CREATE INDEX IF NOT EXISTS "Invoice_receiptNumber_idx" ON "Invoice"("receiptNumber");
CREATE INDEX IF NOT EXISTS "Invoice_studentId_idx" ON "Invoice"("studentId");
CREATE INDEX IF NOT EXISTS "Invoice_feeStructureId_idx" ON "Invoice"("feeStructureId");
CREATE INDEX IF NOT EXISTS "Invoice_status_idx" ON "Invoice"("status");
CREATE INDEX IF NOT EXISTS "Invoice_dueDate_idx" ON "Invoice"("dueDate");
CREATE INDEX IF NOT EXISTS "Invoice_campusId_idx" ON "Invoice"("campusId");

-- Invoice Items
CREATE TABLE IF NOT EXISTS "InvoiceItem" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "invoiceId" UUID NOT NULL REFERENCES "Invoice"("id") ON DELETE CASCADE,
  "feeCategory" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "amount" DECIMAL(15, 2) NOT NULL,
  "accountId" UUID NOT NULL REFERENCES "Account"("id"),
  "quantity" INTEGER DEFAULT 1
);

CREATE INDEX IF NOT EXISTS "InvoiceItem_invoiceId_idx" ON "InvoiceItem"("invoiceId");

-- Payments
CREATE TABLE IF NOT EXISTS "Payment" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "receiptNumber" TEXT UNIQUE NOT NULL,
  "studentId" UUID NOT NULL,
  "amount" DECIMAL(15, 2) NOT NULL,
  "paymentMethod" TEXT NOT NULL CHECK ("paymentMethod" IN ('CASH', 'CBE', 'ABAY', 'ABYSSINIA', 'EBIRR', 'MOBILE_MONEY', 'ONLINE')),
  "paymentDate" TIMESTAMPTZ NOT NULL,
  "referenceNumber" TEXT,
  "screenshot" TEXT,
  "status" TEXT NOT NULL CHECK ("status" IN ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED')),
  "campusId" UUID NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "createdBy" UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS "Payment_receiptNumber_idx" ON "Payment"("receiptNumber");
CREATE INDEX IF NOT EXISTS "Payment_studentId_idx" ON "Payment"("studentId");
CREATE INDEX IF NOT EXISTS "Payment_status_idx" ON "Payment"("status");
CREATE INDEX IF NOT EXISTS "Payment_paymentDate_idx" ON "Payment"("paymentDate");
CREATE INDEX IF NOT EXISTS "Payment_campusId_idx" ON "Payment"("campusId");

-- Payment Allocations
CREATE TABLE IF NOT EXISTS "PaymentAllocation" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "paymentId" UUID NOT NULL REFERENCES "Payment"("id") ON DELETE CASCADE,
  "invoiceId" UUID NOT NULL REFERENCES "Invoice"("id") ON DELETE CASCADE,
  "amount" DECIMAL(15, 2) NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "PaymentAllocation_paymentId_idx" ON "PaymentAllocation"("paymentId");
CREATE INDEX IF NOT EXISTS "PaymentAllocation_invoiceId_idx" ON "PaymentAllocation"("invoiceId");

-- Audit Log
CREATE TABLE IF NOT EXISTS "AuditLog" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "entityType" TEXT NOT NULL,
  "entityId" UUID NOT NULL,
  "action" TEXT NOT NULL CHECK ("action" IN ('CREATE', 'UPDATE', 'DELETE', 'APPROVE', 'REJECT')),
  "userId" UUID NOT NULL,
  "oldValue" JSONB,
  "newValue" JSONB,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "timestamp" TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");
CREATE INDEX IF NOT EXISTS "AuditLog_userId_idx" ON "AuditLog"("userId");
CREATE INDEX IF NOT EXISTS "AuditLog_timestamp_idx" ON "AuditLog"("timestamp");

-- Sync Locks (for preventing duplicate invoice generation)
CREATE TABLE IF NOT EXISTS "sync_locks" (
  "lock_key" TEXT PRIMARY KEY,
  "locked_at" TIMESTAMPTZ DEFAULT NOW(),
  "locked_by" TEXT,
  "expires_at" TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS "sync_locks_expires_at_idx" ON "sync_locks"("expires_at");

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Finance tables created successfully!';
END $$;
