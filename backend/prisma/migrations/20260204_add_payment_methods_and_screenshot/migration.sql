-- AlterEnum
-- Add new payment methods to PaymentMethod enum
ALTER TYPE "PaymentMethod" ADD VALUE IF NOT EXISTS 'CBE';
ALTER TYPE "PaymentMethod" ADD VALUE IF NOT EXISTS 'ABAY';
ALTER TYPE "PaymentMethod" ADD VALUE IF NOT EXISTS 'ABYSSINIA';
ALTER TYPE "PaymentMethod" ADD VALUE IF NOT EXISTS 'EBIRR';

-- AlterTable
-- Add screenshot column to Payment table
ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "screenshot" TEXT;
