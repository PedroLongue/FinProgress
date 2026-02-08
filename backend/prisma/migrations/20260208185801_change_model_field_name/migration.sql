/*
  Warnings:

  - You are about to drop the column `push_notifications_enabled` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "push_notifications_enabled",
ADD COLUMN     "notifications_enabled" BOOLEAN NOT NULL DEFAULT false;
