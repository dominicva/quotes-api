/*
  Warnings:

  - You are about to drop the column `authorId` on the `Quote` table. All the data in the column will be lost.
  - You are about to drop the `Author` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `author` to the `Quote` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Quote" DROP CONSTRAINT "Quote_authorId_fkey";

-- DropIndex
DROP INDEX "Quote_text_authorId_key";

-- AlterTable
ALTER TABLE "Quote" DROP COLUMN "authorId",
ADD COLUMN     "author" TEXT NOT NULL;

-- DropTable
DROP TABLE "Author";
