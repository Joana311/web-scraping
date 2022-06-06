/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Set` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `UserWorkout` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Set" DROP COLUMN "createdAt";

-- AlterTable
ALTER TABLE "UserWorkout" DROP COLUMN "date",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "endedAt" TIMESTAMP(3);
