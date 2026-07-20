/*
  Warnings:

  - A unique constraint covering the columns `[userId,videoId]` on the table `History` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "History_userId_videoId_key" ON "History"("userId", "videoId");
