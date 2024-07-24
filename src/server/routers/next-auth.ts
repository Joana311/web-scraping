import { appUserProcedure, publicProcedure, router } from "@server/trpc";
import { TRPCError } from "@trpc/server";

export const authRouter = router({
  get_session: appUserProcedure.query(async ({ ctx }) => {
    console.log(`[trpc Procedure]["get_session"] Incoming request headers: `, ctx.req?.headers);
    console.log(`[trpc Procedure]["get_session"] Available Session: `, ctx.session);
    if (!ctx.session) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "NO_SESSION. No auth session found for incoming request.",
        });
    }
    return ctx.session;
  })
});
