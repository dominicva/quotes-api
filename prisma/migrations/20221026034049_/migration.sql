/*
  Warnings:

  - A unique constraint covering the columns `[id,createdByUserId]` on the table `Quote` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Quote_id_createdByUserId_idx";

-- CreateIndex
CREATE UNIQUE INDEX "Quote_id_createdByUserId_key" ON "Quote"("id", "createdByUserId");
