-- CreateTable
CREATE TABLE "PublicLead" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "pageUrl" TEXT,
    "referrer" TEXT,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PublicLead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PublicLead_createdAt_idx" ON "PublicLead"("createdAt");

-- CreateIndex
CREATE INDEX "PublicLead_email_idx" ON "PublicLead"("email");
