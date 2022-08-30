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
            console.log("Signing in user")
            console.log("isNewUser: ", isNewUser)
            // delete expire sessions
            console.log("Cleaning up expired sessions")
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
        session({ session, }) {
        },
    },

    callbacks: {
        async session({ session, user }) {
            // console.log("session callback")
            // console.log("user is: ", user)
            session.user = {
                id: user.id,
                name: user.name || null,
                username: user.name || null,
                image: user.image || null,
            }
            return session
        }
    },
    session: {
        strategy: "database",
        maxAge: 60 * 90, // 90 minutes
    },
    theme: {
        logo: "https://i.imgur.com/OX5mAdU.png",
        colorScheme: "dark",
        brandColor: "#ff0000",
    },
    debug: true,//process.env.NODE_ENV !== 'production',
    secret: process.env.NEXTAUTH_SECRET!,

}

export default NextAuth(
    { ...nextAuthOptions, }

)
type callback_types = NonNullable<typeof nextAuthOptions.callbacks>
type session_cb = NonNullable<callback_types["session"]>
export type UserSession = Awaited<ReturnType<session_cb>>