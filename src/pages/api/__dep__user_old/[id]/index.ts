
import { NextApiRequest, NextApiResponse } from "next";


export interface User{
    name: string;
    email: string;
    Exercise?: number;
    ExerciseHistory?: {};
}

export default async function getUserByName(req: NextApiRequest, res: NextApiResponse){
    if (req.method !== 'GET'){
        res.status(500).json({message:"Only Get Request Accepted"})
    }
    const db = await open({
        filename: './myNewDb.sqlite3',
        driver: sqlite3.Database,
    });

    const currentUsers = await db.all<User[]>('SELECT * FROM User where id = ?', [req.query.id]);
    res.json(currentUsers);
}
