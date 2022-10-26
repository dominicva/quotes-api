/*
  Warnings:

  - You are about to drop the column `author` on the `Quote` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[authorName,text]` on the table `Quote` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `authorName` to the `Quote` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Quote_author_text_key";

-- AlterTable
ALTER TABLE "Quote" DROP COLUMN "author",
ADD COLUMN     "authorName" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Author" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Author_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Author_name_key" ON "Author"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Quote_authorName_text_key" ON "Quote"("authorName", "text");

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_authorName_fkey" FOREIGN KEY ("authorName") REFERENCES "Author"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
