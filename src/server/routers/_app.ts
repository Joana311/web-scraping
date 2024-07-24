/**
 * This file contains the root router of your tRPC-backend
 */
import { userRouter } from "./user";
import { workoutRouter } from "./workout";
import { exerciseRouter } from "./exercise";
import { authRouter } from "./next-auth";
import { publicProcedure, router } from "@server/trpc";

/**
 * Create your application's root router
 * If you want to use SSG, you need export this
 * @link https://trpc.io/docs/ssg
 * @link https://trpc.io/docs/router
 */
const mainRouter = router({
  greeting: publicProcedure.query(() => "hello from trpc v10"),
  user: userRouter,
  workout: workoutRouter,
  exercise: exerciseRouter,
  next_auth: authRouter
});

export const appRouter = mainRouter;
export type AppRouter = typeof appRouter;
