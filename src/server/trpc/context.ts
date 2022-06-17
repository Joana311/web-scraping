/* eslint-disable @typescript-eslint/no-unused-vars */
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { getServerSession, Session } from "next-auth";
// import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/react";
import { getCookieParser } from "next/dist/server/api-utils";
import { nextAuthOptions } from "src/pages/api/auth/[...nextauth]";
import prisma from "../prisma/client";

//using getSession is slower than getServerSession 

/**
 * Uses faster "getServerSession" in next-auth v4 that avoids a fetch request to /api/auth.
 * This function also updates the session cookie whereas getSession does not
 * Note: If no req -> SSG is being used -> no session exists (null)
 * @link https://github.com/nextauthjs/next-auth/issues/1535
 */

// eslint-disable-next-line @typescript-eslint/no-empty-interface

interface CreateContextOptions {
  session: Session | null
  cookies: string | null
}

/**
 * Inner function for `createContext` where we create the context.
 * This is useful for testing when we don't want to mock Next.js' request/response
 */
export async function createContextInner(_opts: CreateContextOptions) {
  console.log("passing user into server context:", _opts.session?.user?.name ?? "unknown user");
  let session = _opts.session;
  let parsed_cookies = getCookieParser({ "cookie": _opts.cookies || undefined })()
  // console.log("cookies", parsed_cookies)

  console.log("passing cookie into server context:", parsed_cookies ?? "no cookie");
  // here create some user context based on the session
  // const user = await prisma.user.findOne({{ where: { id: session?.user?.. } }});
  return {
    // user,
    auth: parsed_cookies["next-auth.session-token"] ?? null,
    session
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
  const session = opts && (await getServerSession(opts, nextAuthOptions));
  const cookies = opts.req.headers.cookie ? opts.req.headers.cookie : null;
  const ctx = await createContextInner({ session, cookies });
  return ctx
}

