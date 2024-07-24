import { publicProcedure, router } from "@server/trpc";
import { TRPCError } from "@trpc/server";

export const authRouter = router({
  get_session: publicProcedure.query(async ({ ctx }) => {
    console.log("headers in req for get_session", ctx.req?.headers);
    console.log("get_session route response: ", ctx.session);
    if (!ctx.session) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "NO_SESSION. No auth session found for incoming request.",
        });
    }
    return ctx.session;
  })
});
