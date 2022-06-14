/**
 * This file contains the root router of your tRPC-backend
 */
import { createRouter } from "../trpc/createRouter";
import { userRouter } from "./user";
import superjson from "superjson";
import { workoutRouter } from "./workout";
import { exerciseRouter } from "./exercise";

/**
 * Create your application's root router
 * If you want to use SSG, you need export this
 * @link https://trpc.io/docs/ssg
 * @link https://trpc.io/docs/router
 */
export const appRouter = createRouter()
  /**
   * Add data transformers
   * @link https://trpc.io/docs/data-transformers
   */
  .transformer(superjson)
  /**
   * Optionally do custom error (type safe!) formatting
   * @link https://trpc.io/docs/error-formatting
   */
  // .formatError(({ shape, error }) => { })
  /**
   * Add a health check endpoint to be called with `/api/trpc/healthz`
   */
  .query("healthz", {
    async resolve() {
      return "yay!";
    },
  })
  /**
   * Merge `postRouter` under `post.`
   */
  .merge("user.", userRouter)
  .merge("workout.", workoutRouter)
  .merge("exercise.", exerciseRouter);
export type AppRouter = typeof appRouter;
