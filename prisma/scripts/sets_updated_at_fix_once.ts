import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {
    // const bad_sets =
    // prisma.set.deleteMany({where: {id: {in: bad_sets.map(set => set.id)} }})
    const sets = await prisma.set.findMany({
        select: {
            id: true,
            UserExercise: {
                select: {
                    Workout: {
                        select: { created_at: true }
                    }
                }
            }
        },
    });
    const good_sets = sets.filter(s => s.UserExercise.Workout != null)
    const bad_sets = sets.filter(s => s.UserExercise.Workout == null)
    await prisma.set.deleteMany({ where: { id: { in: bad_sets.map(set => set.id) } } })

    console.log(good_sets.forEach(async (set) => {
        await prisma.set.update({
            where: {
                id: set.id,
            },
            data: {
                updated_at: set.UserExercise.Workout!.created_at
            }
        })
    }));
};
main();