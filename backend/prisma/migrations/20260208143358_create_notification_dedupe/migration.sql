/*
  Warnings:

  - You are about to drop the `monthlyspendinggoal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `notifications` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "monthlyspendinggoal" DROP CONSTRAINT "monthlyspendinggoal_userId_fkey";

-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_user_id_fkey";

-- DropTable
DROP TABLE "monthlyspendinggoal";

-- DropTable
DROP TABLE "notifications";

-- CreateTable
CREATE TABLE "monthly_spending_goals" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "month" TIMESTAMP(3) NOT NULL,
    "amount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "monthly_spending_goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "push_notifications" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bill_id" TEXT,
    "due_date" TEXT,

    CONSTRAINT "push_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "monthly_spending_goals_userId_month_idx" ON "monthly_spending_goals"("userId", "month");

-- CreateIndex
CREATE UNIQUE INDEX "monthly_spending_goals_userId_month_key" ON "monthly_spending_goals"("userId", "month");

-- CreateIndex
CREATE INDEX "push_notifications_user_id_is_read_created_at_idx" ON "push_notifications"("user_id", "is_read", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "push_notifications_user_id_type_bill_id_due_date_key" ON "push_notifications"("user_id", "type", "bill_id", "due_date");

-- AddForeignKey
ALTER TABLE "monthly_spending_goals" ADD CONSTRAINT "monthly_spending_goals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "push_notifications" ADD CONSTRAINT "push_notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
