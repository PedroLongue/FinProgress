/*
  Warnings:

  - The values [CANCELLED] on the enum `BillStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BillStatus_new" AS ENUM ('PENDING', 'PAID', 'PAID_LATE', 'OVERDUE');
ALTER TABLE "public"."bills" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "bills" ALTER COLUMN "status" TYPE "BillStatus_new" USING ("status"::text::"BillStatus_new");
ALTER TYPE "BillStatus" RENAME TO "BillStatus_old";
ALTER TYPE "BillStatus_new" RENAME TO "BillStatus";
DROP TYPE "public"."BillStatus_old";
ALTER TABLE "bills" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;
