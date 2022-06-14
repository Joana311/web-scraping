import { Prisma as _Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "@server/trpc/createRouter";
import prisma from "@server/prisma/client";
import dayjs from "dayjs";

const defaultWorkoutSelect = _Prisma.validator<_Prisma.UserWorkoutInclude>()({
  exercises: { include: { exercise: true, sets: true } },
});

const is_workout_empty = (workout: any) => {
  // console.log("exercises", workout?.exercises);
  const no_exercises =
    workout.exercises == null || workout.exercises.length === 0;
  if (no_exercises) return true;
  const no_sets = workout.exercises.every((exercise: any) => {
    return exercise.sets.length === 0;
  });
  if (no_sets) return true;
  else return false;
};

export const open_workout_if_exists = async (owner_id: string) => {
  const todays_date = dayjs();
  let open_workout = await prisma.userWorkout.findFirst({
    where: {
      AND: [{ owner_id }, { endedAt: null }],
    },
    include: defaultWorkoutSelect,
  });

  if (!open_workout) return null;

  // console.log("open_workout", open_workout);

  let is_same_day = todays_date.isSame(dayjs(open_workout?.createdAt), "day");
  const is_empty = is_workout_empty(open_workout);
  if (is_empty && is_same_day) {
    return open_workout;
  } else {
    if (open_workout === null) debugger;
    await prisma.userWorkout.delete({
      where: { id: open_workout?.id },
    });
    return null;
  }
};

export const workoutRouter = createRouter()
  .mutation("create", {
    input: z.object({
      owner_id: z.string().uuid(),
    }),
    async resolve({ input: { owner_id } }) {
      let open_workout = await open_workout_if_exists(owner_id);

      if (open_workout) {
        throw new TRPCError({
          message: "open workout already exists",
          code: "FORBIDDEN",
        });
      } else {
        return await prisma.userWorkout.create({
          data: { owner_id },
          include: defaultWorkoutSelect,
        });
      }
    },
  })
  .query("all_by_owner_id", {
    input: z.object({
      owner_id: z.string().uuid(),
    }),
    async resolve({ input: { owner_id } }) {
      return await prisma.userWorkout.findMany({
        where: { owner_id },
        include: defaultWorkoutSelect,
      });
    },
  })
  .query("current_by_owner_id", {
    input: z.object({
      owner_id: z.string().uuid(),
    }),
    async resolve({ input: { owner_id } }) {
      let open_workout = await open_workout_if_exists(owner_id);
      console.log("open_workout", open_workout);
      return open_workout;
    },
  })
  .query("get_by_id", {
    input: z.object({
      workout_id: z.string().cuid(),
    }),
    async resolve({ input: { workout_id } }) {
      return await prisma.userWorkout.findFirst({
        where: { id: workout_id },
        include: defaultWorkoutSelect,
      });
    },
  });
