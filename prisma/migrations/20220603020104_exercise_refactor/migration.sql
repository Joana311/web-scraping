/*
  Warnings:

  - The primary key for the `Exercise` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `url` on the `Exercise` table. All the data in the column will be lost.
  - You are about to drop the column `uuid` on the `Exercise` table. All the data in the column will be lost.
  - You are about to drop the column `exerciseID` on the `Set` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[href,name,equipment_name,muscle_name]` on the table `Exercise` will be added. If there are existing duplicate values, this will fail.
  - Made the column `id` on table `Exercise` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Set" DROP CONSTRAINT "Set_exerciseID_fkey";

-- DropIndex
DROP INDEX "Exercise_id_key";

-- AlterTable
ALTER TABLE "Exercise" DROP CONSTRAINT "Exercise_pkey",
DROP COLUMN "url",
DROP COLUMN "uuid",
ADD COLUMN     "equipment_name" TEXT,
ADD COLUMN     "force" TEXT,
ADD COLUMN     "href" TEXT,
ADD COLUMN     "muscle_name" TEXT,
ADD COLUMN     "video_url" TEXT,
ALTER COLUMN "id" SET NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Exercise_id_seq";

-- AlterTable
ALTER TABLE "Set" DROP COLUMN "exerciseID",
ADD COLUMN     "userExerciseID" TEXT,
ADD COLUMN     "weight" INTEGER;

-- CreateTable
CREATE TABLE "UserExercise" (
    "exerciseID" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,

    CONSTRAINT "UserExercise_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Equipment" (
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "BodyPart" (
    "name" TEXT NOT NULL,
    "href" TEXT
);

-- CreateTable
CREATE TABLE "Muscle" (
    "name" TEXT NOT NULL,
    "bodypart_name" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Equipment_name_key" ON "Equipment"("name");

-- CreateIndex
CREATE UNIQUE INDEX "BodyPart_name_key" ON "BodyPart"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Muscle_name_key" ON "Muscle"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Exercise_href_name_equipment_name_muscle_name_key" ON "Exercise"("href", "name", "equipment_name", "muscle_name");

-- AddForeignKey
ALTER TABLE "UserExercise" ADD CONSTRAINT "UserExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Set" ADD CONSTRAINT "Set_userExerciseID_fkey" FOREIGN KEY ("userExerciseID") REFERENCES "UserExercise"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_equipment_name_fkey" FOREIGN KEY ("equipment_name") REFERENCES "Equipment"("name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_muscle_name_fkey" FOREIGN KEY ("muscle_name") REFERENCES "Muscle"("name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Muscle" ADD CONSTRAINT "Muscle_bodypart_name_fkey" FOREIGN KEY ("bodypart_name") REFERENCES "BodyPart"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
