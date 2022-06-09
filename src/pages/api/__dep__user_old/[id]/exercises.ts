import { NextApiRequest, NextApiResponse } from "next";

export interface Exercise{
    id: number;
    name: string;
    link: string;
    //excerciseID?: number;
}
export default async function getUserIdExercises(req: NextApiRequest, res: NextApiResponse){
    if (req.method !== 'GET'){
        res.status(500).json({message:"Only Get Request Accepted"})
    }
    const db = await open({
        filename: './myNewDb.sqlite3',
        driver: sqlite3.Database,
    });
    const {exerciseID} = await db.get('SELECT exerciseID FROM User where id = ?', [req.query.id]);
    console.log(exerciseID);
    const currentUsers = await db.all<Exercise[]>('SELECT * FROM Exercise where id = ?', [exerciseID]);
    res.json(currentUsers);
}