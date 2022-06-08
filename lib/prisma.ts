//https://www.prisma.io/docs/support/help-articles/nextjs-prisma-client-dev-practices#problem

import { Prisma, PrismaClient } from "@prisma/client";
declare global {
  namespace NodeJS {
    interface Global {
      prisma: PrismaClient;
    }
  }
}

let prisma: PrismaClient | undefined;

if (typeof window === "undefined") {
  if (process.env.NODE_ENV === "production") {
    prisma = new PrismaClient();
  } else {
    if (!global.prisma) {
      console.log(`No global prisma client. Creating new.`);
      // console.log(global);
      global.prisma = new PrismaClient({
        /*log: ['query']*/
      });
    }
    prisma = global.prisma;
  }
}
// prisma.$use(async (query, next) => {

// });

export default prisma;
