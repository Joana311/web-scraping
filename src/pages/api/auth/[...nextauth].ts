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
            let db_user = await prisma.user.findUnique({
                where: {
                    email: user.email || "",
                }
            })
            console.log("our isNewuser: ", db_user ? true : false)
            console.log("next isNewUser: ", isNewUser)
            if (!db_user) {
            } else { console.log("user already exists in database: ", db_user) }

        },
        updateUser({ user }) {
            console.log('updateUser', user);
        },
    },

    callbacks: {
        async session({ session, user }) {
            session.app = {
                user_id: user.id,
            };
            session.user = user
            // session.expires = dayjs().add(5, "minutes").toISOString()
            return {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                },
                expires: session.expires,
            } as Session;
        }
    },
    session: {
        strategy: "database",
        maxAge: 60 * 5, // 5 minutes
    },
    theme: {
        logo: "https://i.imgur.com/OX5mAdU.png",
        colorScheme: "dark",
        brandColor: "#ff0000",
    },
    debug: true, // process.env.NODE_ENV !== 'production',
    // secret: process.env.AUTH_SECRET!,
    // jwt: {
    //     // secret: process.env.JWT_SECRET!,
    //     // encode: async () => { return {} },

    // }

}

export default NextAuth(
    nextAuthOptions,
)
type callback_types = NonNullable<typeof nextAuthOptions.callbacks>
type session_cb = NonNullable<callback_types["session"]>
export type UserSession = Awaited<ReturnType<session_cb>>