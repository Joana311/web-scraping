import prisma from "../../src/server/prisma/client";
import { Prisma } from "@prisma/client";
import dayjs from "dayjs";
// const prisma = new PrismaClient();
export type UserWorkoutWithExercises = Prisma.PromiseReturnType<
  typeof createWorkout
>;
class FetchWorkoutError {
  public message: string;
  public workout: UserWorkoutWithExercises | null;
  constructor(message: string, workout) {
    this.workout = workout;
    this.message = message;
  }
}
const isWorkoutEmpty = (workout: UserWorkoutWithExercises) => {
  const no_exercises = workout.exercises.length === 0;
  if (no_exercises) return true;
  const no_sets = workout.exercises?.every((exercise) => {
    return exercise.sets.length === 0;
  });
  if (no_sets) return true;
  else return false;
};

export default async function createWorkout(owner_id) {

  console.log(`owner id -> ${owner_id}`);
  const openWorkout = await prisma.userWorkout.findFirst({
    where: { endedAt: null },
    include: {
      exercises: { include: { exercise: true, sets: true } },
    },
  });
  if (openWorkout) {
    // if there is an open workout NOT from today
    if (!dayjs().isSame(dayjs(openWorkout.createdAt), "day")) {
      // check if it is empty and delete it if it is
      if (isWorkoutEmpty(openWorkout)) {
        console.log("open workout is old & empty, deleting...");
        await prisma.userWorkout.delete({
          where: { id: openWorkout.id },
        });
      } else {
        // otherwise if it is not empty, end it
        console.log("Closing yesterday's Workout");
        // get the most current updatedAt time for any set from openWorkout.exercises
        const lastUpdatedAt = openWorkout.exercises
          .map((exercise) => {
            return exercise.sets.map((set) => {
              if (set.updatedAt) return set.updatedAt;
            });
          })
          .flat()
          .sort((a, b) => dayjs(a).valueOf() - dayjs(b).valueOf())[0];
        console.log(`lastUpdatedAt -> ${lastUpdatedAt}`);
        // end the workout using the most recent updatedAt time as the end time
        await prisma.userWorkout.update({
          where: { id: openWorkout.id },
          data: {
            endedAt: lastUpdatedAt,
          },
          include: {
            exercises: { include: { exercise: true, sets: true } },
          },
        });
      }
      // if the open workout is from today, just return it inside of an Exception
    } else
      throw new FetchWorkoutError("Open workout already exists", openWorkout);
  }
  // finally create a new workout and return it
  console.log("Creating new workout");
  const workout = await prisma.userWorkout.create({
    data: { owner_id },
    include: {
      exercises: { include: { exercise: true, sets: true } },
    },
  });
  return workout;
}
