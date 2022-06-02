import { PrismaClient } from "@prisma/client";
const exercisesData = [
  {
    //id: undefined,
    name: "Barbell-BenchPress",
    url: "https://exrx.net/WeightExercises/PectoralSternal/BBBenchPress",
  },
  {
    //id: undefined,
    name: "Barbell-Deadlift",
    url: "https://exrx.net/WeightExercises/GluteusMaximus/BBDeadlift",
  },
  {
    //id: undefined,
    name: "Barbell-Lying Triceps Extension",
    url: "https://exrx.net/WeightExercises/Triceps/BBLyingTriExt",
  },
  {
    //id: undefined,
    name: "Barbell-Hammer Curl",
    url: "https://exrx.net/WeightExercises/Brachioradialis/CBHammerCurl",
  },
  {
    //id: undefined,
    name: "Cable-Neck Flexion",
    url: "https://exrx.net/WeightExercises/Sternocleidomastoid/STNeckFlexion",
  },
];
const prisma = new PrismaClient();

// function reformattData(ExerciseData: typeof ExercisesData){
//   let store = [];
//   ExerciseData.forEach(e => {
//     store.push({
//       name: e.name,
//       url: e.url,
//     });
//   });
//   return store;
// };
// const Data =  reformattData(ExercisesData);
// const reformattedData = (async(ExercisesData) => {
//   let store = [];
//   ExercisesData.forEach(e => {
//     store.push({
//       //id: undefined,
//       name: e.name,
//       url: e.url,
//     });
//   });
//   return store;
// })(ExercisesData);

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
  await prisma.exercise.createMany({
    data: exercisesData,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
