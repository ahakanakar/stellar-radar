-- CreateTable
CREATE TABLE "Dapp" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "websiteUrl" TEXT NOT NULL,
    "tvl" DOUBLE PRECISION,
    "userCount" INTEGER,
    "txCount" INTEGER,
    "lastActivity" TIMESTAMP(3),
    "isMock" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Dapp_pkey" PRIMARY KEY ("id")
);
