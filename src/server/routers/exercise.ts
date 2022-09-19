import { Prisma, UserWorkout } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "@server/trpc/createRouter";
import prisma from "@server/prisma/client";
import { defaultWorkoutSelect, open_workout_if_exists } from "./workout";
import { Exercise } from "@prisma/client";

export const exerciseRouter = createRouter()
  .query("public.directory", {
    async resolve({ ctx }) {
      return await prisma.exercise.findMany();
    }
  })

  .query("me.recent_unique", {
    input: z.object({
      limit: z.number().optional().default(25),
    }),
    async resolve({ input, ctx }) {
      const { session } = ctx
      const { limit } = input
      // get the most recent unique exercises from userExercise
      const recent_exercise_ids = await prisma.userExercise.findMany({
        where: {
          Workout: {
            owner_id: session!.user.id
          }
        },
        distinct: ["exercise_id"],
        take: -limit,
        orderBy: {
          Workout: {
            created_at: "asc",
          }
        },
        select: {
          exercise_id: true,
          Workout: {
            select: {
              created_at: true
            }
          }
        }
      })
      //sort by most recent
      // recent_exercise_ids.sort((a, b) => { return b.Workout!.created_at.getTime() - a.Workout!.created_at.getTime() })
      // reverse in place
      recent_exercise_ids.reverse()
      // console.log(`unique exercise id's for ${session!.user.name}: `, recent_exercise_ids)
      // create a promise for each exercise, preserving order of recent_exercise_ids, and return the result in a promise.all
      let exercises = await Promise.all(recent_exercise_ids.map(async (ue) => {
        let res = await prisma.exercise.findUnique({
          where: {
            id: ue.exercise_id
          }
        })
        return res
      }))

      exercises = (exercises.filter(e => e !== null))
      // console.log(`unique exercises for ${session!.user.name}: `, exercises)
      return exercises as Exercise[]
    }

  })
  .mutation("add_set", {
    input: z.object({
      user_exercise_id: z.number().gte(0),
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

  .mutation("remove_set", {
    input: z.object({
      user_exercise_id: z.number().gte(0),
      workout_id: z.string().cuid(),
      set_id: z.number().gt(0)
    }),
    async resolve({ input: { user_exercise_id, set_id, workout_id }, ctx }) {
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
                  delete: {
                    id: set_id,
                  },
                },
              },
            },
          },
        },
        include: defaultWorkoutSelect,
      });
      return workout;
    }
  })
  .mutation("add_to_current_workout", {
    input: z.object({
      exercise_id: z.string().uuid().array(),
    }),
    async resolve({ input: { exercise_id }, ctx }) {
      console.log("adding exercises", exercise_id);
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
        console.log("workout updated: Exercise(s) added");
        return workout;
      }
    },
  })
  .mutation("remove_from_current_workout", {
    input: z.object({
      user_exercise_id: z.number().gte(0),
    }),
    async resolve({ input: { user_exercise_id }, ctx }) {
      const owner_id = ctx?.session?.user.id;
      let open_workout = await open_workout_if_exists(owner_id!);

      if (!open_workout) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "open workout does not exist",
        });
      } else {
        console.log("removing exercise", user_exercise_id);
        const workout = await prisma.userWorkout.update({
          where: { id: open_workout.id },
          data: {
            exercises: {
              delete: {
                id: user_exercise_id,
              }
            },
          },
          include: {
            exercises: { include: { exercise: true, sets: true } },
          },
        });
        console.log("workout updated: Exercise removed");
        return workout;
      }
    },
  });
