import { Prisma as _Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "@server/trpc/createRouter";
import prisma from "@server/prisma/client";
import dayjs from "dayjs";
import { resolve } from "path";

export const defaultWorkoutSelect =
  _Prisma.validator<_Prisma.UserWorkoutInclude>()({
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
    orderBy: { created_at: "desc" },
    where: {
      AND: [{ owner_id }, { closed: false }],
    },
    include: defaultWorkoutSelect,
  });
  if (!open_workout) return null;

  let is_same_day = todays_date.isSame(dayjs(open_workout?.created_at), "day");
  // console.log("open_workout created at", open_workout?.created_at);
  // console.log("todays date: ", todays_date.toISOString());
  // console.log("is_same_day", is_same_day);
  // console.log(todays_date.format("MMDDZ"), dayjs(open_workout?.created_at).format("MMDDZ"));
  if (!is_same_day) return null;
  return open_workout;

  // console.log("open_workout", open_workout);

};

export const workoutRouter = createRouter()
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
  }).query("get_recent", {
    input: z.object({
      amount: z.number().optional(),
    }),
    async resolve({ input: { amount }, ctx }) {
      const owner_id = ctx?.user.id;
      return await prisma.userWorkout.findMany({
        orderBy: { created_at: "desc" },
        where: { owner_id },
        include: { exercises: { include: { exercise: true, sets: true } } },
        take: amount || 1,
      });
    },
  }).query("get_current", {
    async resolve({ ctx }) {
      const owner_id = ctx?.user.id;
      return await open_workout_if_exists(owner_id);
    }

  }).mutation("create_new", {
    async resolve({ ctx }) {
      const owner_id = ctx?.user.id;
      // console.log("owner_id", owner_id);
      let open_workout = await open_workout_if_exists(owner_id);
      // console.log("open_workout", open_workout);
      if (open_workout) {
        throw new TRPCError({
          message: "open workout already exists",
          code: "BAD_REQUEST",
        });
      } else {
        return await prisma.userWorkout.create({
          data: { owner_id },
          include: defaultWorkoutSelect,
        });
      }
    },
  });
