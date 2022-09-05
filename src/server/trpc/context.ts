/* eslint-disable @typescript-eslint/no-unused-vars */
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";

import { type Session } from "next-auth";

import { unstable_getServerSession as getServerSession } from "next-auth";

// import { PrismaClient } from "@prisma/client";
import { nextAuthOptions } from "../../pages/api/auth/[...nextauth]";

import { TRPCError } from "@trpc/server";
import { NextApiRequest, NextApiResponse } from "next";
import { NextAuthHandlerParams } from "next-auth/core";

//using getSession is slower than getServerSession 

/**
 * Uses faster "getServerSession" in next-auth v4 that avoids a fetch request to /api/auth.
 * This function also updates the session cookie whereas getSession does not
 * Note: If no req -> SSG is being used -> no session exists (null)
 * @link https://github.com/nextauthjs/next-auth/issues/1535
 */

// eslint-disable-next-line @typescript-eslint/no-empty-interface
// type a = ReturnType<typeof useSession>;
// type b = Pick<a, "data">;
// type session = NonNullable<b["data"]>;
interface CreateContextOptions extends CreateNextContextOptions {
  session?: Session
}

/**
 * Inner function for `createContext` where we create the context.
 * This is useful for testing when we don't want to mock Next.js' request/response
 */
export async function createContextInner(_opts: CreateContextOptions) {
  let session = _opts.session;

  if (typeof _opts.req.query.trpc === "string" && _opts.req.query.trpc.includes(".public")) {
    return {
      ..._opts,
    }
  }

  // console.log("Actually in SSR session", await getServerSession({ req: _opts.req, res: _opts.res }, nextAuthOptions));
  if (!session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "NO_SESSION. No auth session found for incoming request.",
    });
  }
  // next-auth didn't have a way to make user_id 
  // inferrable from the actual `session` return type. 
  // const user = session.user as any as User;
  return {
    ..._opts,
    session,
  };
}

export type Context = trpc.inferAsyncReturnType<typeof createContextInner>;

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext(
  opts: trpcNext.CreateNextContextOptions
): Promise<Context> {
  // for API-response caching see https://trpc.io/docs/caching
  console.log("trpc route: ", opts.req.query.trpc)
  // opts.req.query['nextauth'] = " ";
  console.log("req incomming", opts.req.query);
  console.log("cookie info, ", opts.req.cookies);

  // innerContext usefull for testing purposes to mock req/res
  // const ctx = await createContextInner({ session, req: opts.req, res: opts.res });

  // check first for public routes
  // if (typeof opts.req.query.trpc === "string" && opts.req.query.trpc.includes(".public")) {
  //   console.log("public route, no session needed");
  //   return {
  //     ...opts,
  //   }
  // }
  const session = await getServerSession(opts.req as NextApiRequest, opts.res as NextApiResponse, { ...nextAuthOptions })
  console.log("session returned from next-atuh", session);
  // console.log("Creating context from session: ", session)
  if (!session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "NO_SESSION. No auth session found for incoming request.",
    });
  }
  const ctx = {
    ...opts,
    session,
  }
  return ctx
}

