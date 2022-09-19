/*
  Warnings:

  - Made the column `workout_id` on table `UserExercise` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "UserExercise" DROP CONSTRAINT "UserExercise_workout_id_fkey";

-- AlterTable
ALTER TABLE "Exercise" ADD COLUMN     "base_exercise_id" TEXT;

-- AlterTable
ALTER TABLE "UserExercise" ALTER COLUMN "workout_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_base_exercise_id_fkey" FOREIGN KEY ("base_exercise_id") REFERENCES "Exercise"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserExercise" ADD CONSTRAINT "UserExercise_workout_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "UserWorkout"("id") ON DELETE CASCADE ON UPDATE CASCADE;
