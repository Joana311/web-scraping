import { TRPCError } from "@trpc/server";
import { z } from "zod";
import prisma from "@server/prisma/client";
import { defaultWorkoutSelect, open_workout_if_exists } from "./workout";
import { Exercise } from "@prisma/client";
import { publicProcedure, router } from "@server/trpc";

export const exerciseRouter = router({
  public_search_exercises: publicProcedure
    .input( z.object({ query: z.string().optional() }))
    .query(async ({ input }) => {
      if (!input.query || input.query.length === 0) return [];
      const found_ids: [{ id: string }] = await prisma.$queryRaw`SELECT id FROM search_exercises(${input.query});`
      // async function usingFindMany() {
      //   let start = Date.now();
      //   const found_exercises = await prisma.exercise.findMany({
      //     where: {
      //       id: {
      //         in: found_ids.map((x) => x.id),
      //       }
      //     },
      //   })
      //   console.log(`found ${found_exercises.length} exercises in ${Date.now() - start}ms using findMany`)
      // }

      // async function usingPromiseAll() {
      //   let start = Date.now();
      //   const _exercises = found_ids.map(x => prisma.exercise.findUnique({ where: { id: x.id } }))
      //   const found_exercises = await Promise.all(_exercises)

      //   console.log(`found ${found_exercises.length} exercises in ${Date.now() - start}ms using Promise.all`)
      // }

      // async function usingAwaitUnique() {
      //   let start = Date.now();
      //   const found_exercises = []
      //   for (const id of found_ids) {
      //     const exercise = await prisma.exercise.findUnique({ where: { id: id.id } })
      //     found_exercises.push(exercise)
      //   }
      //   console.log(`found ${found_exercises.length} exercises in ${Date.now() - start}ms using await unique`)
      // }

      let start = Date.now();
      const unstable_found = await prisma.exercise.findMany({
        where: {
          id: {
            in: found_ids.map((x) => x.id),
          }
        },
      })
      // match the order of the ids
      const found_exercises = found_ids.map((x) => unstable_found.find((y) => y.id === x.id)) as Exercise[]
      console.log(`found ${found_exercises.length} exercises in ${Date.now() - start}ms using findMany then matching order`)



      // console.log("results from FTS (ranked)")
      // console.log("total found: ", found_ids.length)
      // console.log(found_ids.slice(0, 15))
      // console.log("results from findMany() using 'in' ")
      // console.log('total found: ', found_exercises.length);
      // console.log(found_exercises.map(e => e?.id).slice(0, 15))

      function doesOrderMatch() {
        if (found_exercises.length !== found_ids.length) {
          console.log("lengths don't match")
          return false;
        }
        for (let i = 0; i < found_exercises.length; i++) {
          if (found_exercises[i]?.id !== found_ids[i].id) {
            console.log('order does not match at index: ', i);
            return false;
          }
        }
        return true
      }
      // await usingFindMany()
      // await usingPromiseAll()
      // await usingAwaitUnique()
      // await usingFindManySort()

      console.log("order matches?: ", doesOrderMatch())
      return found_exercises;
  }),
  public_directory: publicProcedure.query(async() => {
      return await prisma.exercise.findMany();
  }),
  me_recent_unique: publicProcedure
    .input( z.object({ limit: z.number().optional().default(25) }))
    .query(async({ input, ctx }) => {
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
    }),
  
  add_set: publicProcedure.
    input( z.object({
      user_exercise_id: z.number().gte(0),
      workout_id: z.string().cuid(),
      set: z.object({
        reps: z.number().lt(255).gt(0),
        weight: z.number().gt(0).optional(),
        rpe: z.number().lte(11).gt(0).optional(),
      }),
    }))
    .mutation(async ({ input: { user_exercise_id, set, workout_id }, ctx }) => {
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
  }),
  remove_set: publicProcedure
    .input(z.object({
      user_exercise_id: z.number().gte(0),
      workout_id: z.string().cuid(),
      set_id: z.number().gt(0)
    }))
    .mutation(async ({ input: { user_exercise_id, set_id, workout_id }, ctx }) => {
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
    }),
  add_to_current_workout: publicProcedure
  .input(z.object({
      exercise_id: z.string().uuid().array(),
    }))
  .mutation(async({ input: { exercise_id }, ctx }) => {
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
    }),
  remove_from_current_workout: publicProcedure
    .input( z.object({
      user_exercise_id: z.number().gte(0),
    }))
    .mutation(async ({ input: { user_exercise_id }, ctx }) => {
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
    })
});
