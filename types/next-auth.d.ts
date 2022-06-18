import NextAuth from "next-auth"

declare module "next-auth" {

    export interface Session {
        user: {
            /** The user's name. */
            id: string
        }
    }
}