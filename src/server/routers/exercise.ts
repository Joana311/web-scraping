import { Prisma, UserWorkout } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "@server/trpc/createRouter";
import prisma from "@server/prisma/client";
import { defaultWorkoutSelect, open_workout_if_exists } from "./workout";

export const exerciseRouter = createRouter()
  .query("public.directory", {
    async resolve() {
      return await prisma.exercise.findMany();
    },
  })
  .mutation("add_set", {
    input: z.object({
      user_exercise_id: z.string().cuid(),
      workout_id: z.string().cuid(),
      set: z.object({
        reps: z.number().lt(700).gt(0),
        weight: z.number().gt(0).optional(),
        rpe: z.number().lt(15).gt(0).optional(),
      }),
    }),
    async resolve({ input: { user_exercise_id, set, workout_id }, ctx }) {
      const current_workout = await open_workout_if_exists(ctx.session?.user.id!);
      if (current_workout?.id !== workout_id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Workout is not open or does not exist",
        });
      }
      let workout = await prisma.userWorkout.update({
        where: { id: workout_id },
        data: {
          exercises: {
            update: {
              where: { id: user_exercise_id },
              data: {
                sets: {
                  create: set,
                },
              },
            },
          },
        },
        include: defaultWorkoutSelect,
      });
      return workout;
    },
  })
  .mutation("add_to_current_workout", {
    input: z.object({
      exercise_id: z.string().uuid().array(),
    }),
    async resolve({ input: { exercise_id }, ctx }) {
      const owner_id = ctx?.session?.user.id;
      let open_workout = await open_workout_if_exists(owner_id!);
      if (!open_workout) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "open workout does not exist",
        });
      } else {
        console.log("trying to add to workout", open_workout);
        const workout = await prisma.userWorkout.update({
          where: { id: open_workout.id },
          data: {
            exercises: {
              createMany: {
                data: exercise_id.map((cuid) => ({
                  exercise_id: cuid,
                })),
              },
            },
          },
          include: {
            exercises: { include: { exercise: true, sets: true } },
          },
        });
        console.log("workout updated");
        return workout;
      }
    },
  });
