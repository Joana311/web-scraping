import { PrismaClient } from "@prisma/client";
import fs from "fs";

const testMuscleGroups = ["shoulders", "chest", "back", "upper arms"];
const exercise_data: [any] = JSON.parse(
  fs.readFileSync(process.cwd() + `/exrxData/data.json`, "utf8")
);

const prisma = new PrismaClient({ log: ["query", "info", "warn"] });

async function seedExercisesData() {
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

async function main() {
  await prisma.user.createMany({
    data: [
      {
        name: "Pablo123",
        email: "pigbig@test.com",
      },
      {
        name: "xGirl",
        email: "catch_me@outside.com",
      },
      {
        name: "SeniorDaddy",
        email: "bartGooden24@quest.com",
      },
      {
        name: "MikeBiggums",
        email: "rogue@quest.com",
      },
      {
        name: "Kitten",
        email: "goodgirl@hotmail.com",
      },
      {
        name: "Pablo_007",
        email: "bigpig@tiktok.com",
      },
      {
        name: "Scott",
        email: "scott@dobyns.co",
      },
    ],
  });
  await seedExercisesData();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
