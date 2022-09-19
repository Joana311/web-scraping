/*
  Warnings:

  - A unique constraint covering the columns `[href,name,equipment_name,muscle_name]` on the table `Exercise` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Exercise_name_equipment_name_href_muscle_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Exercise_href_name_equipment_name_muscle_name_key" ON "Exercise"("href", "name", "equipment_name", "muscle_name");
