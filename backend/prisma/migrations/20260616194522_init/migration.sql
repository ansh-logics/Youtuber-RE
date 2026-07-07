/*
  Warnings:

  - You are about to drop the column `thumbnail` on the `Uploads` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Uploads` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `description` to the `Uploads` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbnailUrl` to the `Uploads` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Uploads` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Uploads" DROP COLUMN "thumbnail",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "thumbnailUrl" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "Uploads_slug_key" ON "Uploads"("slug");
