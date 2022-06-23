import NextAuth from "next-auth"
import { User as PrismaUser } from "@prisma/client"
declare module "next-auth" {

    export interface Session {
        user: Omit<PrismaUser, "email" | "emailVerified" | "created_at">
    }
}