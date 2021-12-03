-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workout" (
    "id" TEXT NOT NULL,
    "ownerID" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Workout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exercise" (
    "id" SERIAL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Set" (
    "exerciseID" INTEGER NOT NULL,
    "workoutID" TEXT NOT NULL,
    "reps" INTEGER NOT NULL,
    "rpe" INTEGER NOT NULL,

    CONSTRAINT "Set_pkey" PRIMARY KEY ("exerciseID","workoutID")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Exercise_id_key" ON "Exercise"("id");

-- AddForeignKey
ALTER TABLE "Workout" ADD CONSTRAINT "Workout_ownerID_fkey" FOREIGN KEY ("ownerID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Set" ADD CONSTRAINT "Set_exerciseID_fkey" FOREIGN KEY ("exerciseID") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Set" ADD CONSTRAINT "Set_workoutID_fkey" FOREIGN KEY ("workoutID") REFERENCES "Workout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
