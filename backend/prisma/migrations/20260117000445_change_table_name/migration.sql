/*
  Warnings:

  - You are about to drop the `MonthlySpendingGoal` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MonthlySpendingGoal" DROP CONSTRAINT "MonthlySpendingGoal_userId_fkey";

-- DropTable
DROP TABLE "MonthlySpendingGoal";

-- CreateTable
CREATE TABLE "monthlyspendinggoal" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "month" TIMESTAMP(3) NOT NULL,
    "amount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "monthlyspendinggoal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "monthlyspendinggoal_userId_month_idx" ON "monthlyspendinggoal"("userId", "month");

-- CreateIndex
CREATE UNIQUE INDEX "monthlyspendinggoal_userId_month_key" ON "monthlyspendinggoal"("userId", "month");

-- AddForeignKey
ALTER TABLE "monthlyspendinggoal" ADD CONSTRAINT "monthlyspendinggoal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
