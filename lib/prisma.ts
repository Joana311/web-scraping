//https://www.prisma.io/docs/support/help-articles/nextjs-prisma-client-dev-practices#problem
// export const prisma =
//   global.prisma ||
//   new PrismaClient({
//     log: ['query'],
//   })

import { Prisma, PrismaClient } from "@prisma/client";
// declare global {
//   namespace NodeJS {
//     interface Global {
//       prisma: PrismaClient;
//     }
//   }
// }
let prisma: PrismaClient;

if (typeof window === "undefined") {
  if (process.env.NODE_ENV === "production") {
    prisma = new PrismaClient();
  } else {
    if (!global.prisma) {
      console.log(`global prisma client shouldnt exist: ${global}}`);
      global.prisma = new PrismaClient({
        /*log: ['query']*/
      });
    }
    prisma = global.prisma;
  }
}

export default prisma;
