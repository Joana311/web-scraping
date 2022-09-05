import { createRouter } from "@server/trpc/createRouter";
import { TRPCError } from "@trpc/server";

export const authRouter = createRouter().
    query("get_session", {
        resolve: async ({ ctx }) => {
            // if (!ctx.session) {
            //     throw new TRPCError({
            //         code: "UNAUTHORIZED",
            //         message: "NO_SESSION. No auth session found for incoming request.",
            //     });
            // }
            console.log("session in get_session", ctx.session);
            console.log("req headers in get_session", ctx.req.headers);
            return ctx.session;
        }

    })