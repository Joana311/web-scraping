//
import fs from "fs";
import { Prisma, PrismaClient } from "@prisma/client";
type BodyParts = {
  name: string,
  href: string,
  muscles?: ExrxMuscle[]
}
type ExrxMuscle = {
  name: string,
  links: [name: string, href: string][]
  exercises?: ExrxEquipment[]
}
type ExrxEquipment = {
  equipment: string;
  exercises: ExrxExercise[];
}
type ExrxExercise = {
  name: string;
  href?: string;
  data: ExerciseData;
  is_variant: boolean;
  variants?: ExrxExercise[];
}
type ExerciseData = {
  classification: {
    force?: string;
    mechanics?: string;
    utility?: string;
  };
  muscles: {
    target?: [string];
    synergist?: [string];
  };
  instructions: {
    preparation?: string;
    execution?: string;
  };
  mp4?: string;
  vimeoUrl?: string;
  comments?: string;
}

const testMuscleGroups = ["shoulders", "chest", "back", "upper arms"];
const exercise_data: [BodyParts] = JSON.parse(
  fs.readFileSync(process.cwd() + `/exrxData/final_data.json`, "utf8")
);

const prisma = new PrismaClient();
export function seedExercisesData() {
  const chosen_data = exercise_data
    .filter((muscle_group) =>
      testMuscleGroups.includes(muscle_group.name.toLowerCase())
    );
  let errors = [] as any[];
  chosen_data
    .forEach(async (body_part) => {
      const { name: bodypart_name, href: bodypart_href, muscles: bodypart_muscles } = body_part;
      if (!bodypart_muscles) return;
      // Create BodyPart in DB
      await prisma.bodyPart.upsert({
        where: {
          name: bodypart_name.toLowerCase(),
        },
        update: {},
        create: {
          name: bodypart_name.toLowerCase(),
          href: bodypart_href,
        }
      })

      bodypart_muscles.forEach(async (muscle) => {
        if (!muscle.exercises) return;
        // create muscle in DB
        await prisma.muscle.upsert({
          where: {
            name: muscle.name.toLowerCase(),
          }, update: {},
          create: {
            name: muscle.name.toLowerCase(),
            bodypart: {
              connect: {
                name: bodypart_name.toLowerCase(),
              }
            }
          }
        });

        muscle.exercises.forEach(async (equipment) => {
          let equipment_name = equipment.equipment;

          // create equipment in DB
          await prisma.equipment.upsert({
            where: {
              name: equipment_name.toLowerCase(),
            },
            update: {},
            create: {
              name: equipment_name.toLowerCase(),
            }
          });

          equipment.exercises.forEach(async (exercise) => {
            try {
              insertNestedExercises(exercise, equipment_name, muscle.name, bodypart_name, bodypart_href)
            } catch (error) {
              console.log(error as any);
              console.log({
                exercise,
                equipment_name,
                muscle_name: muscle.name,
                bodypart_name,
                bodypart_href
              })
              errors.push(error);
            }
          });
        });
      });
    });
  fs.writeFileSync(process.cwd() + `/exrxData/error.json`, JSON.stringify(errors, null, 2), "utf8");
}
const insertNestedExercises = async (root_exercise: ExrxExercise,
  equipment_name: string,
  muscle_name: string,
  bodypart_name: string,
  bodypart_href: string): Promise<void> => {
  let nestedHelper = async (exercise: ExrxExercise, root_id?: string) => {
    const { name: exercise_name, href: exercise_href, data: exercise_data } = exercise;
    const { classification, muscles, instructions, mp4, vimeoUrl, comments } = exercise_data;

    const { force, mechanics, utility } = classification;
    const { target, synergist } = muscles;
    const { preparation, execution } = instructions;


    let base_exercise: Prisma.ExerciseCreateNestedOneWithoutVariationsInput | undefined = undefined;
    if (exercise.is_variant) {
      base_exercise = {
        connect: {
          id: root_id,
        }
      }
    }
    const CreateExerciseArgs: Prisma.ExerciseCreateInput = {
      name: exercise_name.toLowerCase(),
      href: exercise_href,
      force,
      video_url: mp4,
      base_exercise,
      equipment: {
        connect: {
          name: equipment_name.toLowerCase(),
        },
      },
      muscle: {
        connect: {
          name: muscle_name.toLowerCase(),
        },
      },
    }
    let root_exercise_id: string;
    try {
      root_exercise_id = (await prisma.exercise.create({
        data: CreateExerciseArgs
      })).id;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.log(exercise_name, equipment_name, exercise_href, muscle_name)
        console.log("error inserting exercise", error);
        debugger
      }
      // throw error;
    }

    // console.log(rootExercise);
    let results = [] as Promise<void>[];
    if (exercise.variants) {
      exercise.variants.forEach((variant) => {
        results.push(nestedHelper(variant, root_exercise_id));
      });
    }
    await Promise.all(results);
  };
  await nestedHelper(root_exercise);
}

async function main() {
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
