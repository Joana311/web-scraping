import { User } from "@prisma/client";
import { EventEmitter } from "events";
import { Prisma, UserWorkout } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "@server/trpc/createRouter";
import prisma from "@server/prisma/client";
import { resolve } from "path";

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

export const userRouter = createRouter()
  .mutation("login", {
    input: z.object({
      username: z.string(),
      password: z.string(),
    }),
    async resolve({ input: { username, password } }) {
      // throw new TRPCError({
      //   code: "METHOD_NOT_SUPPORTED",
      //   message: "not implemented ",
      // });
      const user = await prisma.user.findFirst({
        where: {
          name: username,
        },
        include: authorizedUserInclude,
      });
      return user;
    },
  })
  .query("me.get_exercise_data_by_id", {
    input: z.object({
      exercise_id: z.string().uuid()
    }),
    async resolve({ input: { exercise_id }, ctx }) {
      const me = ctx.session!.user;
      let exercise_history = await prisma.userExercise.findMany({
        where: {

          AND: [{ Workout: { owner_id: me.id } }, { exercise: { id: exercise_id, } }]

        },
        include: {
          sets: true,
          exercise: true,
        }
      });
      // we have an array of exercises with a created_at date. for the workout that the exercise was seen in
      // we also have an array of sets for that exercise in that workout
      // really what we want is the list of sets. sorted by set.updated_at
      // flatten into a single object with 1 exercise and 1 array of sets
      let ex_data = {
        exercise: exercise_history[0].exercise,
        sets: exercise_history.flatMap(ex => ex.sets).sort((a, b) => b.updated_at.getTime() - a.updated_at.getTime())
      }
      console.log(ex_data)
      return ex_data;
    }
  })
  .query("get_by_name", {
    input: z.object({
      name: z.string(),
    }),
    async resolve({ ctx, input: { name } }) {
      const user = await prisma?.user.findFirst({
        where: { name },
        include: defaultUserInclude,
      });
      console.log(ctx.session?.user)
      if (!user) {
        throw new TRPCError({
          message: "User not found.",
          code: "NOT_FOUND",
        });
      } else {
        return user;
      }
    },
  });
