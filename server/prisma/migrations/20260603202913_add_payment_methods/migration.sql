-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "instapayConfigSnapshot" JSONB,
ADD COLUMN     "instapaySenderEmail" TEXT,
ADD COLUMN     "instapaySenderPhone" TEXT;

-- CreateTable
CREATE TABLE "PaymentMethodConfig" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "config" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentMethodConfig_pkey" PRIMARY KEY ("id")
);
