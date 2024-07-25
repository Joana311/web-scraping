/**
 * This is your entry point to setup the root configuration for tRPC on the server.
 * - `initTRPC` should only be used once per app.
 * - We export only the functionality that we use so we can enforce which base procedures should be used
 *
 * Learn how to create protected base procedures and other things below:
 * @link https://trpc.io/docs/v10/router
 * @link https://trpc.io/docs/v10/procedures
 */
import { initTRPC, TRPCError } from '@trpc/server';
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

export const cachedProcedure = publicProcedure.use(async (opts) => {
    const { ctx, next, path, type } = opts;
    if (path.includes("public")) {
        console.log("[trpc Handler][cached procedure] Adding Cache headers to public query response: ", path);
        const ONE_HOUR_IN_SECONDS = 60 * 60;
        const ONE_DAY_IN_SECONDS = ONE_HOUR_IN_SECONDS * 24;
        const ONE_WEEK_IN_SECONDS = ONE_DAY_IN_SECONDS * 7;
        // use `s-maxage` if caching for CDN only
        const headers = {
            "Cache-Control": `maxage=${ONE_WEEK_IN_SECONDS}, public, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`
        };
        for (const [key, value] of Object.entries(headers)) {
            ctx.res?.setHeader(key, value);
        }
        console.log("[trpc Handler] Set additional response Headers: ", headers);
    }
    return next(opts);
});

// these procedures all validate the user with the action
export const sessionProcedure = publicProcedure.use(async (opts) => {
    if (!opts.ctx.session) {
      throw new TRPCError({code: "UNAUTHORIZED", message: "NO_SESSION. No auth session found for incoming request."});
    }
    console.log("[trpc handler][Session Procedure]: incoming opts for procedure:", opts.path);
    console.log("[trpc handler][Session Procedure]: request cookies: ", opts.ctx.req?.cookies);
    console.log("[trpc handler][Session Procedure]: request headers: ", opts.ctx.req?.headers);
    return opts.next(opts);
  }
);
export const appUserProcedure = sessionProcedure.use(async (opts) => {
  // ensure the cookie auth token matches up with the db auth token
  if (!opts.ctx.session?.user.id) {
    throw new TRPCError({code: "UNPROCESSABLE_CONTENT", message: "No user id found in session for current user."});
  
  }
  return opts.next(opts);
});
/**
 * @link https://trpc.io/docs/v10/merging-routers
 */
export const mergeRouters = trpcClient.mergeRouters;