-- AlterTable
ALTER TABLE "users" ADD COLUMN     "email_notifications_enabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "push_notifications_enabled" BOOLEAN NOT NULL DEFAULT false;
