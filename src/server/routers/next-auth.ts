import { createRouter } from "@server/trpc/createRouter";

export const authRouter = createRouter().
    query("get_session", {
        resolve: async ({ ctx }) => {
            return ctx.session;
        }

    })