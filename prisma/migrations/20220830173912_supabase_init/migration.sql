/*
  Warnings:

  - A unique constraint covering the columns `[owner_id,id]` on the table `UserWorkout` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Set" DROP CONSTRAINT "Set_user_exercise_id_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "UserWorkout_owner_id_id_key" ON "UserWorkout"("owner_id", "id");

-- AddForeignKey
ALTER TABLE "Set" ADD CONSTRAINT "Set_user_exercise_id_fkey" FOREIGN KEY ("user_exercise_id") REFERENCES "UserExercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
