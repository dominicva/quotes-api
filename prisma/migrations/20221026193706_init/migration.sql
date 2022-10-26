/*
  Warnings:

  - A unique constraint covering the columns `[author,text]` on the table `Quote` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Quote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Quote" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Quote_author_text_key" ON "Quote"("author", "text");
