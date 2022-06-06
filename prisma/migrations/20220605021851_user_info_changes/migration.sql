/*
  Warnings:

  - You are about to drop the column `userExerciseID` on the `Set` table. All the data in the column will be lost.
  - You are about to drop the column `workoutID` on the `Set` table. All the data in the column will be lost.
  - The primary key for the `UserExercise` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `exerciseID` on the `UserExercise` table. All the data in the column will be lost.
  - You are about to drop the column `exerciseId` on the `UserExercise` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `UserExercise` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `UserExercise` table. All the data in the column will be lost.
  - You are about to drop the column `uuid` on the `UserExercise` table. All the data in the column will be lost.
  - You are about to drop the `Workout` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `Set` table without a default value. This is not possible if the table is not empty.
  - Added the required column `exercise_id` to the `UserExercise` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `UserExercise` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "Set" DROP CONSTRAINT "Set_userExerciseID_fkey";

-- DropForeignKey
ALTER TABLE "Set" DROP CONSTRAINT "Set_workoutID_fkey";

-- DropForeignKey
ALTER TABLE "UserExercise" DROP CONSTRAINT "UserExercise_exerciseId_fkey";

-- DropForeignKey
ALTER TABLE "Workout" DROP CONSTRAINT "Workout_ownerID_fkey";

-- AlterTable
ALTER TABLE "Set" DROP COLUMN "userExerciseID",
DROP COLUMN "workoutID",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_exercise_id" TEXT;

-- AlterTable
ALTER TABLE "UserExercise" DROP CONSTRAINT "UserExercise_pkey",
DROP COLUMN "exerciseID",
DROP COLUMN "exerciseId",
DROP COLUMN "name",
DROP COLUMN "url",
DROP COLUMN "uuid",
ADD COLUMN     "exercise_id" TEXT NOT NULL,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "workout_id" TEXT,
ADD CONSTRAINT "UserExercise_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "Workout";

-- CreateTable
CREATE TABLE "UserWorkout" (
    "id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserWorkout_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserWorkout" ADD CONSTRAINT "UserWorkout_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserExercise" ADD CONSTRAINT "UserExercise_workout_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "UserWorkout"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserExercise" ADD CONSTRAINT "UserExercise_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Set" ADD CONSTRAINT "Set_user_exercise_id_fkey" FOREIGN KEY ("user_exercise_id") REFERENCES "UserExercise"("id") ON DELETE SET NULL ON UPDATE CASCADE;
