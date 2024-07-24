// UseTRPCQueryOptions,
import { createReactQueryHooks, createTRPCReact, TRPCClientErrorLike} from "@trpc/react-query";
import type { inferProcedureInput, inferProcedureOutput } from "@trpc/server";
import { NextPageContext } from "next";
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import { loggerLink } from "@trpc/client/links/loggerLink";
import { splitLink } from "@trpc/client/links/splitLink";
import { httpLink } from "@trpc/client/links/httpLink";
import superjson from "superjson";
import { IncomingHttpHeaders } from "http2";
// ℹ️ Type-only import:
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-export
import type { AppRouter } from "@server/routers/_app";
import { nextAuthOptions } from "src/pages/api/auth/[...nextauth]";
import { useQueryClient } from "@tanstack/react-query";
import { createTRPCNext } from "@trpc/next";

/**
 * Extend `NextPageContext` with meta data that can be picked up by `responseMeta()` when server-side rendering
 */
export interface SSRContext extends NextPageContext {
  /**
   * Set HTTP Status code
   * @usage
   * ```
   * const utils = trpc.useContext();
   * if (utils.ssrContext) {
   *   utils.ssrContext.status = 404;
   * }
   * ```
   */
  status?: number;
}
function getBaseUrl() {
  if (typeof window !== "undefined") {
    // return `http://localhost:${process.env.PORT ?? 3000}`;
    return "";
  }
  // reference for vercel.com
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

/**
 * A set of strongly-typed React hooks from your `AppRouter` type signature with `createReactQueryHooks`.
 * @link https://trpc.io/docs/react#3-create-trpc-hooks
 */
const trpcNextHooks = createTRPCNext<AppRouter>({
    config({ ctx }) {
      const host_url = ctx?.req?.headers?.host || '';
      if (typeof window !== "undefined") {
        return {
          // url: "/api/trpc",
          transformer: superjson,
          links: [
            loggerLink({
              enabled: (opts) => true
            }),
            // adds opt-out support for batching
            splitLink({
              condition(operation) {
                return operation.context.skipBatch === true;
              },
              false: httpBatchLink({
                url: `${getBaseUrl()}/api/trpc`
              }),
              true: httpLink({
                url: `${getBaseUrl()}/api/trpc`
              })
            })
          ]
        }
      }
      /**
       * If you want to use SSR, you need to use the server's full URL
       * @link https://trpc.io/docs/ssr
       */
      return {
        // url: getBaseUrl() + "/api/trpc", moved 
        // url: host_url + "/api/trpc",
        /**
         * @link https://trpc.io/docs/links
         */
        links: [
          // adds pretty logs to your console in development and logs errors in production
          loggerLink({
            enabled: (opts) =>
              process.env.NODE_ENV === "development" || true
            // || (opts.direction === "down" && opts.result! instanceof Error)
          }),
  
          // adds opt-out support for batching
          splitLink({
            condition(operation) {
              return operation.context.skipBatch === true;
            },
            false: httpBatchLink({
              url: `${getBaseUrl()}/api/trpc`
            }),
            true: httpLink({
              url: `${getBaseUrl()}/api/trpc`
            })
          })
        ],
        transformer: superjson,
        queryClientConfig: {},
        headers: () => {
          //on ssr forward cookies to the server to check for auth sessions
          const client_headers: IncomingHttpHeaders | undefined = ctx?.req?.headers;
          console.log("[trpc Handler] Forwarding request client headers to server (i think)");
          console.log("[trpc Handler] ", client_headers);
          return {
            ...client_headers,
            "x-ssr": "1"
          };
  
        }
      };
    },
    /**
     * @link https://trpc.io/docs/ssr
     */
    ssr: false,
    // responseMeta(opts) {
  
    //   const error = opts.clientErrors[0];
    //   if (error) {
    //     // const host_url = ctx.req?.headers?.host ?? getBaseUrl();
    //     // if (error.message.includes("NO_SESSION") && opts.ctx.asPath !== "/") {
    //     //   console.log("No sessions found should reroute to: ", host_url);
    //     //   return {
    //     //     status: 303, //"SEE_OTHER"
    //     //     headers: {
    //     //       location: '/api/auth/signin'
    //     //     }
    //     //   };
    //     // }
    //     // Propagate http first error from API calls
    //     return {
    //       status: error.data?.httpStatus ?? 500
    //     };
    //   }
    //   // For app caching with SSR see https://trpc.io/docs/caching
    //   // if (opts.)
    //   return {};
    // }
  });
export default trpcNextHooks;
// export const trpcHooks = createReactQueryHooks<AppRouter>();
// const queryClient = useQueryClient();
// queryClient.invalidateQueries({ predicate: (query) => query.queryKey.includes("user.") });
// export const transformer = superjson;
/**
 * This is a helper method to infer the output of a query resolver
 * @example type HelloOutput = inferQueryOutput<'hello'>
 */
export type inferQueryOutput<
  TRouteKey extends keyof AppRouter["_def"]["queries"]
> = inferProcedureOutput<AppRouter["_def"]["queries"][TRouteKey]>;

// export type inferQueryOptions<
//   TRouteKey extends keyof AppRouter["_def"]["queries"]
// > = CreateProcedureOptions<AppRouter["_def"]["queries"][TRouteKey]>;

export type inferQueryInput<
  TRouteKey extends keyof AppRouter["_def"]["queries"]
> = inferProcedureInput<AppRouter["_def"]["queries"][TRouteKey]>;

export type inferMutationOutput<
  TRouteKey extends keyof AppRouter["_def"]["mutations"]
> = inferProcedureOutput<AppRouter["_def"]["mutations"][TRouteKey]>;

export type inferMutationInput<
  TRouteKey extends keyof AppRouter["_def"]["mutations"]
> = inferProcedureInput<AppRouter["_def"]["mutations"][TRouteKey]>;

type ClientError = TRPCClientErrorLike<AppRouter>;

// export type inferUseTRPCQueryOptions<
//   TRouteKey extends keyof AppRouter["_def"]["queries"]
// > = UseTRPCQueryOptions<
//   TRouteKey,
//   inferQueryInput<TRouteKey>,
//   inferQueryOutput<TRouteKey>,
//   inferQueryOutput<TRouteKey>,
//   ClientError
// >;

// type authOptions = inferUseTRPCQueryOptions<"next-auth.get_session">;
// type authOutput = inferQueryOutput<"next-auth.get_session">;
// type authInput = inferQueryInput<"next-auth.get_session">;