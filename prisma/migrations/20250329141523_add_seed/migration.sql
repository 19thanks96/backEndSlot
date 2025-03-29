/*
  Warnings:

  - You are about to drop the column `name` on the `CurrentReels` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CurrentReels" DROP COLUMN "name",
ADD COLUMN     "bet" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "nonce" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "Seed" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Seed_pkey" PRIMARY KEY ("id")
);
