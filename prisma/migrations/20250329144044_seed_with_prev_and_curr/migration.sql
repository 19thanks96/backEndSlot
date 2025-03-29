/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Seed` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `previousSeeds` to the `Seed` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Seed` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Seed" ADD COLUMN     "clientSeed" TEXT NOT NULL DEFAULT '000000',
ADD COLUMN     "previousSeeds" TEXT NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Seed_userId_key" ON "Seed"("userId");

-- AddForeignKey
ALTER TABLE "Seed" ADD CONSTRAINT "Seed_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
