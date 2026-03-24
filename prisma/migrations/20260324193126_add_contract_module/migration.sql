-- CreateEnum
CREATE TYPE "ContractStatus" AS ENUM ('DRAFT', 'PENDING_TENANT', 'PENDING_LANDLORD', 'PENDING_BROKER', 'PENDING_KEBELE', 'ACTIVE', 'EXPIRED', 'TERMINATED', 'DISPUTED');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('RENT', 'SECURITY_DEPOSIT', 'PENALTY', 'COMMISSION', 'RENEWAL_FEE');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'OVERDUE', 'PARTIAL', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('CONTRACT', 'AMENDMENT', 'ADDENDUM', 'ID_PROOF', 'PROPERTY_DOCUMENT', 'RECEIPT', 'OTHER');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('PAYMENT_REMINDER', 'PAYMENT_RECEIVED', 'CONTRACT_SIGNED', 'CONTRACT_APPROVED', 'CONTRACT_EXPIRING', 'CONTRACT_TERMINATED', 'MAINTENANCE_REQUEST', 'GENERAL');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('PENDING', 'SENT', 'FAILED', 'READ', 'SCHEDULED');

-- CreateTable
CREATE TABLE "contracts" (
    "id" TEXT NOT NULL,
    "contract_number" TEXT NOT NULL,
    "property_id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "landlord_id" TEXT NOT NULL,
    "broker_id" TEXT,
    "monthly_rent" DOUBLE PRECISION NOT NULL,
    "security_deposit" DOUBLE PRECISION NOT NULL,
    "payment_day" INTEGER NOT NULL DEFAULT 1,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "terms_and_conditions" TEXT,
    "special_clauses" JSONB,
    "status" "ContractStatus" NOT NULL DEFAULT 'DRAFT',
    "landlord_signed" BOOLEAN NOT NULL DEFAULT false,
    "tenant_signed" BOOLEAN NOT NULL DEFAULT false,
    "broker_signed" BOOLEAN NOT NULL DEFAULT false,
    "landlord_signed_at" TIMESTAMP(3),
    "tenant_signed_at" TIMESTAMP(3),
    "broker_signed_at" TIMESTAMP(3),
    "kebele_approved" BOOLEAN NOT NULL DEFAULT false,
    "kebele_approved_by" TEXT,
    "kebele_approved_at" TIMESTAMP(3),
    "kebele_seal" TEXT,
    "kebele_notes" TEXT,
    "pdf_url" TEXT,
    "pdf_version" INTEGER NOT NULL DEFAULT 1,
    "terminated_at" TIMESTAMP(3),
    "termination_reason" TEXT,
    "termination_by" TEXT,
    "renewal_count" INTEGER NOT NULL DEFAULT 0,
    "last_renewed_at" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_schedules" (
    "id" TEXT NOT NULL,
    "contract_id" TEXT NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "payment_type" "PaymentType" NOT NULL DEFAULT 'RENT',
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paid_at" TIMESTAMP(3),
    "paid_amount" DOUBLE PRECISION,
    "penalty_amount" DOUBLE PRECISION,
    "penalty_applied_at" TIMESTAMP(3),
    "transaction_id" TEXT,
    "payment_method" TEXT,
    "receipt_url" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_history" (
    "id" TEXT NOT NULL,
    "contract_id" TEXT NOT NULL,
    "schedule_id" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "paid_at" TIMESTAMP(3) NOT NULL,
    "paymentType" "PaymentType" NOT NULL DEFAULT 'RENT',
    "payment_method" TEXT NOT NULL,
    "transaction_id" TEXT,
    "transaction_ref" TEXT,
    "paid_by" TEXT NOT NULL,
    "paid_by_name" TEXT,
    "received_by" TEXT,
    "received_by_name" TEXT,
    "is_penalty" BOOLEAN NOT NULL DEFAULT false,
    "original_amount" DOUBLE PRECISION,
    "penalty_amount" DOUBLE PRECISION,
    "receipt_url" TEXT,
    "receipt_number" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contract_documents" (
    "id" TEXT NOT NULL,
    "contract_id" TEXT NOT NULL,
    "documentType" "DocumentType" NOT NULL DEFAULT 'CONTRACT',
    "title" TEXT NOT NULL,
    "description" TEXT,
    "file_url" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_size" INTEGER,
    "mime_type" TEXT,
    "uploaded_by" TEXT NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "verified_by" TEXT,
    "verified_at" TIMESTAMP(3),

    CONSTRAINT "contract_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contract_notifications" (
    "id" TEXT NOT NULL,
    "contract_id" TEXT NOT NULL,
    "notificationType" "NotificationType" NOT NULL DEFAULT 'PAYMENT_REMINDER',
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "recipient_id" TEXT NOT NULL,
    "recipient_role" TEXT NOT NULL,
    "status" "NotificationStatus" NOT NULL DEFAULT 'PENDING',
    "sent_at" TIMESTAMP(3),
    "sent_via_email" BOOLEAN NOT NULL DEFAULT false,
    "sent_via_sms" BOOLEAN NOT NULL DEFAULT false,
    "sent_via_push" BOOLEAN NOT NULL DEFAULT false,
    "sent_via_in_app" BOOLEAN NOT NULL DEFAULT false,
    "error_message" TEXT,
    "scheduled_for" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contract_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "contracts_contract_number_key" ON "contracts"("contract_number");

-- CreateIndex
CREATE INDEX "contracts_contract_number_idx" ON "contracts"("contract_number");

-- CreateIndex
CREATE INDEX "contracts_property_id_idx" ON "contracts"("property_id");

-- CreateIndex
CREATE INDEX "contracts_tenant_id_idx" ON "contracts"("tenant_id");

-- CreateIndex
CREATE INDEX "contracts_landlord_id_idx" ON "contracts"("landlord_id");

-- CreateIndex
CREATE INDEX "contracts_status_idx" ON "contracts"("status");

-- CreateIndex
CREATE INDEX "contracts_start_date_idx" ON "contracts"("start_date");

-- CreateIndex
CREATE INDEX "contracts_end_date_idx" ON "contracts"("end_date");

-- CreateIndex
CREATE INDEX "payment_schedules_contract_id_idx" ON "payment_schedules"("contract_id");

-- CreateIndex
CREATE INDEX "payment_schedules_status_idx" ON "payment_schedules"("status");

-- CreateIndex
CREATE INDEX "payment_schedules_due_date_idx" ON "payment_schedules"("due_date");

-- CreateIndex
CREATE UNIQUE INDEX "payment_schedules_contract_id_due_date_key" ON "payment_schedules"("contract_id", "due_date");

-- CreateIndex
CREATE INDEX "payment_history_contract_id_idx" ON "payment_history"("contract_id");

-- CreateIndex
CREATE INDEX "payment_history_schedule_id_idx" ON "payment_history"("schedule_id");

-- CreateIndex
CREATE INDEX "payment_history_transaction_id_idx" ON "payment_history"("transaction_id");

-- CreateIndex
CREATE INDEX "payment_history_paid_at_idx" ON "payment_history"("paid_at");

-- CreateIndex
CREATE INDEX "contract_documents_contract_id_idx" ON "contract_documents"("contract_id");

-- CreateIndex
CREATE INDEX "contract_documents_documentType_idx" ON "contract_documents"("documentType");

-- CreateIndex
CREATE INDEX "contract_notifications_contract_id_idx" ON "contract_notifications"("contract_id");

-- CreateIndex
CREATE INDEX "contract_notifications_recipient_id_idx" ON "contract_notifications"("recipient_id");

-- CreateIndex
CREATE INDEX "contract_notifications_status_idx" ON "contract_notifications"("status");

-- CreateIndex
CREATE INDEX "contract_notifications_notificationType_idx" ON "contract_notifications"("notificationType");

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_landlord_id_fkey" FOREIGN KEY ("landlord_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_broker_id_fkey" FOREIGN KEY ("broker_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_schedules" ADD CONSTRAINT "payment_schedules_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "contracts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_history" ADD CONSTRAINT "payment_history_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "contracts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_history" ADD CONSTRAINT "payment_history_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "payment_schedules"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contract_documents" ADD CONSTRAINT "contract_documents_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "contracts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contract_notifications" ADD CONSTRAINT "contract_notifications_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "contracts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
