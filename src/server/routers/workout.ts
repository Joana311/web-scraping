import { Prisma as _Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import prisma from "@server/prisma/client";
import dayjs from "dayjs";
import { publicProcedure, router } from "@server/trpc";
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

export const workoutRouter = router({
  all_by_owner_id: publicProcedure
    .input(z.object({ owner_id: z.string().cuid() }))
    .query(async ({ input: { owner_id } }) => {
      return await prisma.userWorkout.findMany({
        where: { owner_id },
        include: defaultWorkoutSelect
      });
    }),
  current_by_owner_id: publicProcedure
    .input(
      z.object({
        owner_id: z.string().cuid()
      })
    )
    .query(async ({ input: { owner_id } }) => {
      let open_workout = await open_workout_if_exists(owner_id);
      console.log("open_workout", open_workout);
      return open_workout;
    }),
  get_by_id: publicProcedure
    .input(z.object({ workout_id: z.string().cuid() }))
    .query(async ({ input: { workout_id }, ctx }) => {
      return await prisma.userWorkout.findFirst({
        where: { id: workout_id },
        include: defaultWorkoutSelect
      });
    }),
  get_recent: publicProcedure
    .input(z.object({ amount: z.number().optional() }))
    .query(async ({ input: { amount }, ctx }) => {
      const owner_id = ctx?.session?.user.id;
      return await prisma.userWorkout.findMany({
        orderBy: { created_at: "desc" },
        where: { owner_id },
        include: { exercises: { include: { exercise: true, sets: true } } },
        take: amount || 1
      });
    }),
  get_daily_recent: publicProcedure
    .input(z.object({ amount: z.number().optional() }))
    .query(async ({ input: { amount }, ctx }) => {
      const owner_id = ctx?.session?.user.id;
      const todays_date = dayjs();
      const todays_workouts = await prisma.userWorkout.findMany({
        orderBy: { created_at: "desc" },
        where: {
          AND: [
            { owner_id },
            {
              created_at: {
                gte: todays_date.startOf("day").toISOString()
              }
            }
          ]
        },
        include: { exercises: { include: { exercise: true, sets: true } } },
        take: amount
      });
      return todays_workouts;
    }),
  get_current: publicProcedure.query(async ({ ctx }) => {
    const owner_id = ctx?.session?.user.id;
    return await open_workout_if_exists(owner_id!);
  }),
  create_new: publicProcedure.mutation(async ({ ctx }) => {
    const owner_id = ctx?.session?.user.id;
    let open_workout = await open_workout_if_exists(owner_id!);
    if (open_workout) {
      throw new TRPCError({
        message: "open workout already exists",
        code: "BAD_REQUEST"
      });
    } else {
      return await prisma.userWorkout.create({
        data: { owner_id },
        include: defaultWorkoutSelect
      });
    }
  }),
  close_by_id: publicProcedure
    .input(z.object({ workout_id: z.string().cuid() }))
    .mutation(async ({ input: { workout_id }, ctx: { session } }) => {
      const owner_id = session?.user.id!;
      try {
        let workout = await prisma.userWorkout.update({
          where: {
            owner_and_workout_id: {
              owner_id: owner_id,
              id: workout_id
            }
          },
          data: {
            closed: true,
            ended_at: new Date()
          },
          select: defaultWorkoutSelect
        });
        if (!workout) {
          throw new TRPCError({
            message: "workout not found",
            code: "BAD_REQUEST"
          });
        } else {
          console.log("workout updated", workout);
          return true;
        }
      } catch (error) {
        console.log("error", error);
        // throw new TRPCError({
        //   message: error.message,
        //   code: "BAD_REQUEST",
        // });
      }
    }),
  delete_by_id: publicProcedure
    .input(
      z.object({
        workout_id: z.string().cuid(),
        is_confirmed: z.boolean().optional()
      })
    )
    .mutation(async ({ input: { workout_id, is_confirmed }, ctx: { session } }) => {
        const owner_id = session?.user.id!;
        try {
          let workout = await prisma.userWorkout.findUniqueOrThrow({
            where: {
              owner_and_workout_id: {
                owner_id: owner_id,
                id: workout_id
              }
            },
            select: defaultWorkoutSelect
          });
          if (is_confirmed || is_workout_empty(workout)) {
            try {
              await prisma.userWorkout.delete({
                where: {
                  owner_and_workout_id: {
                    owner_id: owner_id,
                    id: workout_id
                  }
                }
              });
            } catch (error) {
              throw new TRPCError({
                message: "There was an error deleting the workout",
                code: "INTERNAL_SERVER_ERROR"
              });
            }
          } else {
            throw new TRPCError({
              message: "workout is not empty",
              code: "BAD_REQUEST"
            });
          }
        } catch (error: any) {
          throw new TRPCError({
            message: error.message,
            code: "BAD_REQUEST"
          });
        }
      }
    )
});
