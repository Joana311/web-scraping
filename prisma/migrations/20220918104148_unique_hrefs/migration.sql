/*
  Warnings:

  - A unique constraint covering the columns `[href]` on the table `Exercise` will be added. If there are existing duplicate values, this will fail.
  - Made the column `workout_id` on table `UserExercise` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "UserExercise" DROP CONSTRAINT "UserExercise_workout_id_fkey";

-- DropIndex
DROP INDEX "Exercise_href_name_equipment_name_muscle_name_key";

-- AlterTable
ALTER TABLE "Exercise" ADD COLUMN     "base_exercise_id" TEXT;

-- AlterTable
ALTER TABLE "UserExercise" ALTER COLUMN "workout_id" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Exercise_href_key" ON "Exercise"("href");

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_base_exercise_id_fkey" FOREIGN KEY ("base_exercise_id") REFERENCES "Exercise"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserExercise" ADD CONSTRAINT "UserExercise_workout_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "UserWorkout"("id") ON DELETE CASCADE ON UPDATE CASCADE;
