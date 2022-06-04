import fs from "fs";
import { PrismaClient } from "@prisma/client";
const testMuscleGroups = ["shoulders", "chest", "back", "upper arms"];
const exercise_data: [any] = JSON.parse(
  fs.readFileSync(process.cwd() + `/exrxData/data.json`, "utf8")
);

// const prisma = new PrismaClient({ log: ["query", "info", "warn"] });
export function seedExercisesData() {
  const chosen_data = exercise_data.filter((muscle_group) =>
  testMuscleGroups.includes(muscle_group.name.toLowerCase())
);
  chosen_data.map(async (muscle_group) => {
    const { name: bodypart_name, href: bodypart_href, muscles } = muscle_group;
    for (const muscle_name in muscles) {
      const equipment_list = muscles[muscle_name];
      for (const equipment_name in equipment_list) {
        const exercises = equipment_list[equipment_name];
        await exercises.map(async (exercise) => {
          // debugger;
          try {
            await prisma.exercise.create({
              data: {
                name: exercise.name.toLowerCase(),
                href: exercise.href,
                video_url: exercise.vimeoUrl,
                equipment: {
                  connectOrCreate: {
                    create: {
                      name: equipment_name.toLowerCase(),
                    },
                    where: {
                      name: equipment_name.toLowerCase(),
                    },
                  },
                },
                force: exercise.classification.force,
                muscle: {
                  connectOrCreate: {
                    create: {
                      name: muscle_name.toLowerCase(),
                      bodypart: {
                        connectOrCreate: {
                          create: {
                            name: bodypart_name.toLowerCase(),
                            href: bodypart_href,
                          },
                          where: {
                            name: bodypart_name.toLowerCase(),
                          },
                        },
                      },
                    },
                    where: {
                      name: muscle_name.toLowerCase(),
                    },
                  },
                },
              },
            });
          } catch (error) {
            console.log(error);
            debugger;
          }
        });
      }
    }
  });
}
