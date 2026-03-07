-- AlterTable
ALTER TABLE "users" ADD COLUMN     "telegram_chat_id" TEXT,
ADD COLUMN     "telegram_notifications_enabled" BOOLEAN NOT NULL DEFAULT false;
