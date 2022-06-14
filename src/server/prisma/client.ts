//https://www.prisma.io/docs/support/help-articles/nextjs-prisma-client-dev-practices#problem

import { Prisma, PrismaClient } from "@prisma/client";
type global_with_prisma = typeof globalThis & {
  prisma: PrismaClient;
};

const generate_prisma_client = () => {
  const _global = global as global_with_prisma;

  let prisma_client: PrismaClient;

  if (typeof window === "undefined") {
    if (process.env.NODE_ENV === "production") {
      return new PrismaClient();
    } else {
      if (!_global.prisma) {
        console.log(`No global prisma client. Creating new.`);
        // console.log(global);
        _global.prisma = new PrismaClient({
          /*log: ['query']*/
        });
      }
    }
  }
  return _global.prisma;
};
// prisma.$use(async (query, next) => {

// });
let prisma = generate_prisma_client();
export default prisma;
