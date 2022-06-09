import { User } from "@prisma/client";
import { EventEmitter } from "events";
import { Prisma, UserWorkout } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "@server/trpc/createRouter";
import prisma from "@server/prisma/client";

interface UserEvents {
  get_by_id: (user_id: string) => User;
  get_by_name: (username: string) => User;
}
const defaultUserSelect = Prisma.validator<Prisma.UserInclude>()({
  workouts: false,
});

const authorizedUserSelect = Prisma.validator<Prisma.UserInclude>()({
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

export const userRouter = createRouter().query("get_by_name", {
  input: z.object({
    name: z.string(),
  }),
  async resolve({ input: { name } }) {
    return await prisma?.user.findFirst({
      where: { name },
      select: authorizedUserSelect,
    });
  },
});
