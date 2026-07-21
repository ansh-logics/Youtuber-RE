/*
  Warnings:

  - A unique constraint covering the columns `[sessionId,videoId]` on the table `UnauthenticatedViewsRegistry` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "UnauthenticatedViewsRegistry_videoId_idx" ON "UnauthenticatedViewsRegistry"("videoId");

-- CreateIndex
CREATE UNIQUE INDEX "UnauthenticatedViewsRegistry_sessionId_videoId_key" ON "UnauthenticatedViewsRegistry"("sessionId", "videoId");

-- AddForeignKey
ALTER TABLE "UnauthenticatedViewsRegistry" ADD CONSTRAINT "UnauthenticatedViewsRegistry_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Uploads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
