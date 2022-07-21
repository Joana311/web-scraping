import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {
  const user = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      workouts: true
    }
  });
  console.log(user.forEach(user => console.log(user.workouts)));
};
main();
