/**
 * This file contains tRPC's HTTP response handler
 */
import { createNextApiHandler } from "@trpc/server/adapters/next";
import { createTRPCClientContext } from "@server/context";
import { appRouter } from "@server/routers/_app";
import { NextApiRequest, NextApiResponse } from "next/types";

// type TRPCHandlerOptions = NodeHTTPHandlerOptions<typeof appRouter, NextApiRequest, NextApiResponse>
function getBaseUrl() {
  if (typeof window !== "undefined") {
    return "";
  }
  // reference for vercel.com
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export default createNextApiHandler({
  responseMeta: ({ paths, errors, ctx, data }) => {
    // if (errors) {
    //   let error = errors[0];
    //   const host_url = ctx?.req?.headers?.host;
    //   console.log(ctx)
    //   if (error.message.includes("NO_SESSION") && ctx?.asPath !== "/") {
    //     console.log("No sessions found should reroute to: ", host_url);
    //     return {
    //       status: 303, //"SEE_OTHER"
    //       headers: {
    //         location: '/api/auth/signin'
    //       }
    //     };
    //   }
    // }
    console.log("[trpc Handler] NextJS Response Generated!")
    console.log("[trpc Handler] Response Object Exists: ", !!ctx?.res)
    console.log("[trpc Handler] Response Session: ", ctx?.session)
    console.log("[trpc Handler] Response Data: ", data)
    return {};
  },
  router: appRouter,
  /**
   * @link https://trpc.io/docs/context
   */
  createContext: createTRPCClientContext,
  /**
   * @link https://trpc.io/docs/error-handling
   */

  onError({ error, }) {
    if (error.code === "INTERNAL_SERVER_ERROR") {
      console.error(error);
      // send to bug reporting
      // console.error("Something went wrong", error);
      console.error("Something went wrong, check TRPC logging - Julio");
    }
  },
  /**
   * Enable query batching
   */
  batching: {
    enabled: true,
  },
  /**
   * @link https://trpc.io/docs/caching#api-response-caching
   */
}); 
