import fs from "fs";
import { PrismaClient } from "@prisma/client";
const testMuscleGroups = ["shoulders", "chest", "back", "upper arms"];
const exercise_data: [any] = JSON.parse(
  fs.readFileSync(process.cwd() + `/exrxData/data.json`, "utf8")
);
// console.log(exercise_data);

const chosen_data = exercise_data.filter((muscle_group) =>
  testMuscleGroups.includes(muscle_group.name.toLowerCase())
);

console.log(chosen_data);

chosen_data.map((muscle_group) => {
    
})
