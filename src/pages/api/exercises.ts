import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { Exercise } from "./exercise/[id]";
const prisma = new PrismaClient();
export default async function getAllExercises(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.status(500).json({ message: "Only Get Request Accepted" });
  }

  const exercises = await prisma.exercise.findMany();
  res.status(200).json(exercises);
}
