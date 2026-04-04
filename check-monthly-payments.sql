-- Diagnostic script to check why class isn't showing in Monthly Payments

-- 1. Check active fee structures
SELECT 
  id,
  name,
  "gradeLevel" as class_name,
  "isActive",
  description
FROM "FeeStructure"
WHERE "isActive" = true;

-- 2. Check if invoices exist for the fee structures
SELECT 
  fs."gradeLevel" as class_name,
  COUNT(i.id) as invoice_count,
  COUNT(DISTINCT i."studentId") as student_count
FROM "FeeStructure" fs
LEFT JOIN "Invoice" i ON i."feeStructureId" = fs.id
WHERE fs."isActive" = true
GROUP BY fs."gradeLevel";

-- 3. Check available classes in school_schema_points
SELECT class_names 
FROM school_schema_points.classes 
WHERE id = 1;

-- 4. Sample invoice data (first 5)
SELECT 
  "invoiceNumber",
  "studentId",
  "feeStructureId",
  "totalAmount",
  "paidAmount",
  status,
  metadata
FROM "Invoice"
ORDER BY "createdAt" DESC
LIMIT 5;
