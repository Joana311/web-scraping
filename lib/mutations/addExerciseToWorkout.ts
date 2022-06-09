import prisma from "../../src/server/prisma/prisma";
import { Prisma, PrismaClient } from "@prisma/client";
import { UserWorkoutWithExercises } from "./createWorkout";
// const prisma = new PrismaClient();

class FetchError {
  public message: string;
  public workout?: UserWorkoutWithExercises | null;
  constructor(message: string, workout) {
    this.workout = workout;
    this.message = message;
  }
}
export default async function addExerciseToWorkout(
  workout_id: string,
  exerciseIDs: string[]
) {
  let exercises_cuid: Array<Prisma.UserExerciseCreateManyInput> = [];
  exercises_cuid = exerciseIDs.map((id) => {
    return {
      exercise_id: id,
    };
  });
  let workout = null;
  if (!prisma) {
    console.log("Prisma client not found. Creating new.");
    global.prisma = new PrismaClient();
    console.log(global.prisma);
    console.log(prisma);
    console.log(global);
  }
  console.log(`selected exercise id's`);
  console.log(exercises_cuid);
  if (exercises_cuid.length) {
    console.log(`creating exercises for workout_id: ${workout_id}`);
    try {
      workout = await prisma.userWorkout.update({
        where: { id: workout_id },
        data: {
          exercises: {
            createMany: {
              data: exercises_cuid,
            },
          },
        },
        include: {
          exercises: { include: { exercise: true, sets: true } },
        },
      });
    } catch (error) {
      throw new FetchError(error.message, null);
    }
    if (!workout) {
    }
  }

  return workout;
}
