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
  .query("get_by_name", {
    input: z.object({
      name: z.string(),
    }),
    async resolve({ input: { name } }) {
      const user = await prisma?.user.findFirst({
        where: { name },
        include: defaultUserInclude,
      });
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
