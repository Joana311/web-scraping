import { NextApiRequest, NextApiResponse } from "next";

export interface Exercise{
    id: number;
    excerciseID?: string;
    name: string;
    url: string;
}
export default async function getAllExercises(req: NextApiRequest, res: NextApiResponse){
    if (req.method !== 'GET'){
        res.status(500).json({message:"Only Get Request Accepted"})
    }
    const db = await open({
        filename: './myNewDb.sqlite3',
        driver: sqlite3.Database,
    });

    const currentUsers = await db.all<Exercise[]>('SELECT * FROM Exercise');
    res.json(currentUsers);
}
