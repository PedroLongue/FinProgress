-- CreateTable
CREATE TABLE "MonthlySpendingGoal" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "month" TIMESTAMP(3) NOT NULL,
    "amount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MonthlySpendingGoal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MonthlySpendingGoal_userId_month_idx" ON "MonthlySpendingGoal"("userId", "month");

-- CreateIndex
CREATE UNIQUE INDEX "MonthlySpendingGoal_userId_month_key" ON "MonthlySpendingGoal"("userId", "month");

-- AddForeignKey
ALTER TABLE "MonthlySpendingGoal" ADD CONSTRAINT "MonthlySpendingGoal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
