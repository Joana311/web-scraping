import NextAuth from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import type { NextAuthOptions } from 'next-auth';
import prisma from '@server/prisma/client';
import { PrismaAdapter } from '@next-auth/prisma-adapter';

export const nextAuthOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID!,
            clientSecret: process.env.DISCORD_CLIENT_SECRET!,
        })
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            // check if user exists in database
            let db_user = await prisma.user.findUnique({
                where: {
                    email: user.email || "",
                }
            })
            // if not, create user
            if (!db_user) {
                console.log("creating user in database")
                console.log(user)
                console.log(account)
                // db_user = await prisma.user.create({data:{}})
            } else { console.log("user already exists in database: ", db_user) }
            return true
        },
    },
    session: {},
    debug: false, // process.env.NODE_ENV !== 'production',
    // secret: process.env.AUTH_SECRET!,
    jwt: {
        // secret: process.env.JWT_SECRET!,
        // encode: async () => { return {} },

    }
}

export default NextAuth(
    nextAuthOptions,
)