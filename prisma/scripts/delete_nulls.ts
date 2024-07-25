// import prismaClient then delete ever userExercise who's workout_id is null
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const main = async () => {
    const bad_exercises = await prisma.userExercise.findMany({
        where: {
            workout_id: null as any
        }
    })
    console.log("to be deleted", bad_exercises)
    await prisma.userExercise.deleteMany({ where: { id: { in: bad_exercises.map(exercise => exercise.id) } } })
    console.log("done")
    await prisma.$disconnect();
}

main();