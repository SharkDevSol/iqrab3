-- Add is_active column to all class tables in classes_schema
-- This script adds the is_active column with default value TRUE to all existing class tables

-- First, get a list of all tables in classes_schema and add the column to each
-- You'll need to run this for each class table

-- Example for common class names (adjust based on your actual class names):

-- Add is_active column to class A
ALTER TABLE classes_schema."A" 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Add is_active column to class B
ALTER TABLE classes_schema."B" 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Add is_active column to class C
ALTER TABLE classes_schema."C" 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Add is_active column to class D
ALTER TABLE classes_schema."D" 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Add is_active column to class E
ALTER TABLE classes_schema."E" 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Add is_active column to class F
ALTER TABLE classes_schema."F" 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Add is_active column to class G
ALTER TABLE classes_schema."G" 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Add is_active column to class H
ALTER TABLE classes_schema."H" 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- If you have more classes, add them here following the same pattern
-- ALTER TABLE classes_schema."CLASS_NAME" ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Verify the column was added
SELECT table_name, column_name, data_type, column_default
FROM information_schema.columns
WHERE table_schema = 'classes_schema' 
  AND column_name = 'is_active'
ORDER BY table_name;
