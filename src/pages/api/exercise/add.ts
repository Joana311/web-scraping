import { Prisma } from "@prisma/client";
import superjson from "superjson";
import { NextApiRequest, NextApiHandler, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
export default async (req: NextApiRequest, res: NextApiResponse) => {
  console.group("addExerciseToWorkout API route handler");
  let exercises_cuid: Array<Prisma.UserExerciseCreateManyInput> = [];
  let error_message: string | null = null;
  let workout_id, exerciseIDs;
  try {
    const query = superjson.parse(req.body) as {
      id: string;
      new: string[] | string;
    };
    workout_id = query.id;
    exerciseIDs = query.new;
  } catch (error) {
    console.log("could not parse query");
    console.log("error message: ", error.message);
    console.groupEnd();
    res.status(500).json({ error: error.message });
    return;
  }
  console.log(workout_id, exerciseIDs);
  // debugger;
  if (req.method !== "POST") {
    res.status(500);
    error_message = "Only Post Request Accepted";
    console.log(error_message);
  }
  if (!prisma && !error_message) {
    res.status(503);
    error_message = "database client not found";
    console.log(error_message);
  }
  if (!workout_id && !error_message) {
    res.status(400);
    error_message = "workout_id missing";
    console.log(error_message);
  }
  const are_valid_exercises = (
    exerciseIDs: string[] | string | null
  ): boolean => {
    // convert a single add query to an array
    let is_valid = false;
    if (typeof exerciseIDs === "string") {
      exerciseIDs = [exerciseIDs];
    }
    if (exerciseIDs && exerciseIDs.length) {
      let invalid_ids;
      exercises_cuid = exerciseIDs.map((id) => {
        if (!/c(\S){24}/.test(id)) {
          invalid_ids += id + ", ";
        } else
          return {
            exercise_id: id,
          };
      });
      if (invalid_ids) {
        error_message = `invalid exercise ids: ${invalid_ids}`;
      } else {
        is_valid = true;
      }
    } else error_message = "no exercise ids provided";
    return is_valid;
  };

  if (!error_message && !are_valid_exercises(exerciseIDs)) {
    exercises_cuid.length || (error_message = "no valid exercise ids provided");
    console.log(error_message);
    res.status(400);
  }
  if (error_message) {
    console.groupEnd();
    res.json({ message: error_message });
    return;
  }
  console.log(`selected: `);
  console.log(exercises_cuid);

  let workout = null;
  console.log(`creating exercises for workout_id: ${workout_id}`);
  try {
    workout = await prisma.userWorkout.update({
      where: { id: workout_id },
      data: {
        exercises: {
          createMany: {
            data: exercises_cuid,
          },
        },
      },
      include: {
        exercises: { include: { exercise: true, sets: true } },
      },
    });
    console.log(`created exercises for workout_id: ${workout_id}`);
  } catch (error) {
    error_message = error.message;
    console.log(error_message);
    res.status(500);
  }
  if (!workout) {
    error_message = "workout not found";
    console.log(error_message);
    res.status(404);
  }
  if (!error_message) {
    const data = superjson.stringify(workout);
    console.log("API call successful");
    console.log("data:", data);
    res.status(200).json({ data });
    console.groupEnd();
    return;
  }
  console.groupEnd();
  res.json({ message: error_message });
  return;
};
