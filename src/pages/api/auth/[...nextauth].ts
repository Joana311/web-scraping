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
    callbacks: {
        signIn(params) {
            console.log("[NextAuth] signIn callback invoked w/ params: ", params)
            return true
        },
        async session({ session, user, token}) {
            console.log("[NextAuth] Invoking /api/session")
            // Token only used with jwt strategy, not the session cookie strategy
            console.log("[NextAuth] next-auth session token :", token)
            session.user = {
                id: user.id,
                name: user.name || null,
                username: user.name || null,
                image: user.image || null,
            }
            return session
        },
    },
    events: {
        createUser: ({ user }) => {
            console.log("[NextAuth] Creating user in database")
            console.log(user)
        },
        linkAccount({ user, account }) {
            console.log("[NextAuth] User provider accounts linked");
            console.log(user, account)
        },
        signIn: async ({ user, isNewUser, account }) => {
            console.log("[NextAuth] User has been 'Signed-In': ", user.name)
            console.log("[NextAuth] Provider Account: ", account)
            console.log("[NextAuth] Cleaning up expired sessions for User")
            await prisma.session.deleteMany({
                where: {
                    userId: user.id,
                    expires: {
                        lt: dayjs().toISOString()
                    }
                }
            });
        },
        updateUser({ user }) {
            console.log('updateUser', user);
        },
    },
    session: {
        strategy: "database",
        maxAge: 60 * 60 * 2, // 2 hours
    },
    theme: {
        logo: "https://i.imgur.com/OX5mAdU.png",
        colorScheme: "dark",
        brandColor: "#ff0000",
    },
    debug: true,
    secret: process.env.SECRET!,

}

export default NextAuth(nextAuthOptions)
type callback_types = NonNullable<typeof nextAuthOptions.callbacks>
type session_cb = NonNullable<callback_types["session"]>
export type UserSession = Awaited<ReturnType<session_cb>>