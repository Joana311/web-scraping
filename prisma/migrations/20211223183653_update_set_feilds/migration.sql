/*
  Warnings:

  - The required column `id` was added to the `Set` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "Set" DROP CONSTRAINT "Set_exerciseID_fkey";

-- DropForeignKey
ALTER TABLE "Set" DROP CONSTRAINT "Set_workoutID_fkey";

-- DropIndex
DROP INDEX "Set_workoutID_key";

-- AlterTable
ALTER TABLE "Set" ADD COLUMN     "id" TEXT NOT NULL,
ALTER COLUMN "exerciseID" SET DATA TYPE TEXT,
ALTER COLUMN "workoutID" DROP NOT NULL,
ADD CONSTRAINT "Set_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Set" ADD CONSTRAINT "Set_exerciseID_fkey" FOREIGN KEY ("exerciseID") REFERENCES "Exercise"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Set" ADD CONSTRAINT "Set_workoutID_fkey" FOREIGN KEY ("workoutID") REFERENCES "Workout"("id") ON DELETE SET NULL ON UPDATE CASCADE;
