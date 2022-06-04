import { NextApiRequest, NextApiResponse } from "next";
export interface Exercise{
    id: number;
    name: string;
    link: string;
    //excerciseID?: number;
}
export default async function getExerciseById(req: NextApiRequest, res: NextApiResponse){
    if (req.method !== 'GET'){
        res.status(500).json({message:"Only Get Request Accepted"})
    }
    const db = await open({
        filename: './myNewDb.sqlite3',
        driver: sqlite3.Database,
    });

    const currentUsers = await db.get<Exercise>('SELECT * FROM Exercise where id = ?', [req.query.id]);
    res.json(currentUsers);
}