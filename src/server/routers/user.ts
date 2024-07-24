import { User } from "@prisma/client";
import { Prisma, UserWorkout } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import prisma from "@server/prisma/client";
import { appUserProcedure, publicProcedure, router, sessionProcedure } from "@server/trpc";

const defaultUserInclude = Prisma.validator<Prisma.UserInclude>()({
  workouts: false,
});

const authorizedUserInclude = Prisma.validator<Prisma.UserInclude>()({
  workouts: {
    include: {
      exercises: {
        include: {
          exercise: true,
          sets: true,
        },
      },
    },
    take: 5,
  },
});

export const userRouter = router({
  login: publicProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string()
      })
    )
    .mutation(async ({ input: { username, password } }) => {
      throw new TRPCError({
        code: "METHOD_NOT_SUPPORTED",
        message: "not implemented ",
      });
      // const user = await prisma.user.findFirst({
      //   where: {
      //     name: username,
      //   },
      //   include: authorizedUserInclude,
      // });
      // return user;
    }),
  my_specific_exercise_data: appUserProcedure
    .input(z.object({ exercise_id: z.string().uuid() }))
    .query(async ({ input: { exercise_id }, ctx }) => {
      const me = ctx.session!.user;
      let exercise_history = await prisma.userExercise.findMany({
        where: {
          AND: [
            { Workout: { owner_id: me.id } },
            { exercise: { id: exercise_id } }
          ]
        },
        include: {
          sets: true,
          exercise: true
        }
      });
      // we have an array of exercises with a created_at date. for the workout that the exercise was seen in
      // we also have an array of sets for that exercise in that workout
      // really what we want is the list of sets. sorted by set.updated_at
      // flatten into a single object with 1 exercise and 1 array of sets
      let ex_data = {
        exercise: exercise_history[0].exercise,
        sets: exercise_history
          .flatMap((ex) => ex.sets)
          .sort((a, b) => b.updated_at.getTime() - a.updated_at.getTime())
      };
      console.log(ex_data);
      return ex_data;
    }),
  get_user_by_name: sessionProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ ctx, input: { name } }) => {
      const user = await prisma?.user.findFirst({
        where: { name },
        include: defaultUserInclude
      });
      console.log(ctx.session?.user);
      if (!user) {
        throw new TRPCError({
          message: "User not found.",
          code: "NOT_FOUND"
        });
      } else {
        return user;
      }
    })
});
