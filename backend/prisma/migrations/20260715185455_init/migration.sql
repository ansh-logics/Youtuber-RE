/*
  Warnings:

  - You are about to drop the column `channelId` on the `Like` table. All the data in the column will be lost.
  - You are about to drop the column `likeCount` on the `Like` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,videoId]` on the table `Like` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `videoId` to the `Like` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Like" DROP COLUMN "channelId",
DROP COLUMN "likeCount",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "videoId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Uploads" ADD COLUMN     "like" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Like_videoId_idx" ON "Like"("videoId");

-- CreateIndex
CREATE UNIQUE INDEX "Like_userId_videoId_key" ON "Like"("userId", "videoId");

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Uploads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
