-- CreateEnum
CREATE TYPE "TenantStatus" AS ENUM ('pending', 'active', 'inactive', 'suspended');

-- AlterTable
ALTER TABLE "tenants" ADD COLUMN     "status" "TenantStatus" NOT NULL DEFAULT 'active';
