import prisma from "../prisma";
import { Prisma, PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient();
export type UserWorkoutWithExercises = Prisma.PromiseReturnType<
  typeof createWorkout
>;
export default async function createWorkout(owner_id) {
  console.log(`owner id -> ${owner_id}`);
  const openWorkoutExists = await prisma.userWorkout.findFirst({
    where: { endedAt: null },
  });
  if (openWorkoutExists) {
    throw new Error("Open workout already exists");
  }
  const workout = await prisma.userWorkout.create({
    data: { owner_id },
    include: {
      exercises: { include: { exercise: true, sets: true } },
    },
  });
  return workout;
}
