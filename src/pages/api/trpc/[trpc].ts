/**
 * This file contains tRPC's HTTP response handler
 */
import * as trpcNext from "@trpc/server/adapters/next";
import { createContext } from "@server/trpc/context";
import { appRouter } from "@server/routers/_app";
import type { NodeHTTPHandlerOptions } from "@trpc/server/dist/declarations/src/adapters/node-http";
import { NextApiRequest, NextApiResponse } from "next/types";

type TRPCHandlerOptions = NodeHTTPHandlerOptions<typeof appRouter, NextApiRequest, NextApiResponse>
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
export default trpcNext.createNextApiHandler({
  responseMeta: (opts) => {
    const error = opts.errors[0];
    if (error) {
      if (error.message.includes("NO_SESSION")
        && opts.ctx?.req.url !== '/') {
        console.log("base url: ", getBaseUrl());
        console.log("should reroute. broken atm")
        opts.ctx?.res.setHeader("Location", getBaseUrl() + "/api/auth/signin")
        return {
          status: 303,
        }
      }
    }
    return {}
  },
  router: appRouter,
  /**
   * @link https://trpc.io/docs/context
   */
  createContext,
  /**
   * @link https://trpc.io/docs/error-handling
   */

  onError({ error }) {
    if (error.code === "INTERNAL_SERVER_ERROR") {
      // send to bug reporting
      // console.error("Something went wrong", error);
      console.error("Something went wrong");
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
