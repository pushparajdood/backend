-- AlterTable
ALTER TABLE "users" ADD COLUMN     "password_reset_token" TEXT,
ADD COLUMN     "password_reset_token_expiry" TIMESTAMPTZ(6);
