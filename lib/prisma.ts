import { PrismaClient } from "@prisma/client";

//https://www.prisma.io/docs/support/help-articles/nextjs-prisma-client-dev-practices#problem

declare global {
    var prisma: PrismaClient | undefined
  }
  // export const prisma =
  //   global.prisma ||
  //   new PrismaClient({
  //     log: ['query'],
  //   })
  
  // if (process.env.NODE_ENV !== 'production') global.prisma = prisma

  if (process.env.NODE_ENV === 'production'){
    prisma = new PrismaClient();
  }else{
    if (!global.prisma){
      global.prisma = new PrismaClient();
    }
    prisma = global.prisma;
  }
  export default prisma;