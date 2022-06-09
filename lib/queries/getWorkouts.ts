import { Prisma, UserWorkout, PrismaClient } from "@prisma/client";
import prisma from "../../src/server/prisma/prisma";

export default async function getWorkouts(owner_id) {
  // console.log(owner_id);
  // debugger;
  const workouts = await prisma.userWorkout.findMany({
    where: { owner_id: owner_id },
    include: { exercises: { include: { exercise: true, sets: true } } },
    take: 7,
  });
  // debugger;
  console.log.apply(workouts);
  return workouts;
}
export async function getWorkoutById(workout_id) {
  const workout = await prisma.userWorkout.findUnique({
    where: { id: workout_id },
    include: { exercises: { include: { exercise: true, sets: true } } },
  });
  return workout;
}