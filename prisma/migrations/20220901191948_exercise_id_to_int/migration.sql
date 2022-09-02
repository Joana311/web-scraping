/*
  Warnings:

  - The primary key for the `UserExercise` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `UserExercise` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `user_exercise_id` on the `Set` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Set" DROP CONSTRAINT "Set_user_exercise_id_fkey";

-- AlterTable
ALTER TABLE "Set" DROP COLUMN "user_exercise_id",
ADD COLUMN     "user_exercise_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "UserExercise" DROP CONSTRAINT "UserExercise_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "UserExercise_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "UserExercise_exercise_id_workout_id_id_key" ON "UserExercise"("exercise_id", "workout_id", "id");

-- AddForeignKey
ALTER TABLE "Set" ADD CONSTRAINT "Set_user_exercise_id_fkey" FOREIGN KEY ("user_exercise_id") REFERENCES "UserExercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
