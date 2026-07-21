-- CreateTable
CREATE TABLE "UnauthenticatedViewsRegistry" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UnauthenticatedViewsRegistry_pkey" PRIMARY KEY ("id")
);
