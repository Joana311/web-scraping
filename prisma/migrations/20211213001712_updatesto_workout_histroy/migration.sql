/*
  Warnings:

  - The primary key for the `Set` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[workoutID]` on the table `Set` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Set" DROP CONSTRAINT "Set_exerciseID_fkey";

-- AlterTable
ALTER TABLE "Set" DROP CONSTRAINT "Set_pkey",
ALTER COLUMN "exerciseID" DROP NOT NULL,
ALTER COLUMN "reps" SET DEFAULT 0,
ALTER COLUMN "rpe" SET DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "Set_workoutID_key" ON "Set"("workoutID");

-- AddForeignKey
ALTER TABLE "Set" ADD CONSTRAINT "Set_exerciseID_fkey" FOREIGN KEY ("exerciseID") REFERENCES "Exercise"("id") ON DELETE SET NULL ON UPDATE CASCADE;
