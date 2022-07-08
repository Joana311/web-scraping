import NextAuth, { type Session, type SessionOptions } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import type { NextAuthOptions } from 'next-auth';
import prisma from '@server/prisma/client';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import dayjs from 'dayjs';
export const nextAuthOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID!,
            clientSecret: process.env.DISCORD_CLIENT_SECRET!,

        })
    ],

    events: {
        createUser: ({ user }) => {
            console.log("creating user in database")
            console.log(user)
        },
        linkAccount({ user, account }) {
            console.log("linkAccount");
            console.log(account)
        },
        signIn: async ({ user, isNewUser, account }) => {
            console.log("signing in user")
            console.log("isNewUser: ", isNewUser)

        },
        updateUser({ user }) {
            console.log('updateUser', user);
        },
    },

    callbacks: {
        // async redirect(params) {
        //     console.log("nextauth redirect")
        //     console.log(params)
        //     return params.url
        // },
        async session({ session, user }) {
            console.log("session callback")
            // console.log("user is: ", user)
            session.user = {
                id: user.id,
                name: user.name || null,
                username: user.name || null,
                image: user.image || null,
            }
            // console.log("passed user is: ", session.user)
            return session
            // session.expires = dayjs().add(5, "minutes").toISOString()
            // return {
            //     user: {
            //         
            //     },
            //     expires: session.expires,
            // } as Session;
        }
    },
    session: {
        strategy: "database",
        maxAge: 60 * 10, // 10 minutes
    },
    theme: {
        logo: "https://i.imgur.com/OX5mAdU.png",
        colorScheme: "dark",
        brandColor: "#ff0000",
    },
    debug: false, // process.env.NODE_ENV !== 'production',
    // secret: process.env.AUTH_SECRET!,
    // jwt: {
    //     // secret: process.env.JWT_SECRET!,
    //     // encode: async () => { return {} },

    // }

}

export default NextAuth(
    { ...nextAuthOptions, }

)
type callback_types = NonNullable<typeof nextAuthOptions.callbacks>
type session_cb = NonNullable<callback_types["session"]>
export type UserSession = Awaited<ReturnType<session_cb>>