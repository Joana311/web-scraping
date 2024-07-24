/**
 * This is your entry point to setup the root configuration for tRPC on the server.
 * - `initTRPC` should only be used once per app.
 * - We export only the functionality that we use so we can enforce which base procedures should be used
 *
 * Learn how to create protected base procedures and other things below:
 * @link https://trpc.io/docs/v10/router
 * @link https://trpc.io/docs/v10/procedures
 */
import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { TRPCClientCtx } from './context';
const trpcClient = initTRPC.context<TRPCClientCtx>().create({
  /**
   * @link https://trpc.io/docs/v10/data-transformers
   */
  transformer: superjson,
  /**
   * @link https://trpc.io/docs/v10/error-formatting
   */
  errorFormatter({ shape, error, ctx }) {
    return {
      code: shape.code,
      message: shape.message,
      data: {
        httpStatus: shape.data.httpStatus,
        code: shape.data.code,
        path: shape.data.path,
        req_source: ctx?.req?.url,
        session: ctx?.session
      }
    };
  }
});
/**
 * Create a router
 * @link https://trpc.io/docs/v10/router
 */
export const router = trpcClient.router;
/**
 * Create an unprotected procedure
 * @link https://trpc.io/docs/v10/procedures
 **/
export const publicProcedure = trpcClient.procedure;
/**
 * @link https://trpc.io/docs/v10/merging-routers
 */
export const mergeRouters = trpcClient.mergeRouters;