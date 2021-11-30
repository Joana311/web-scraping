
import { NextApiRequest, NextApiResponse } from "next";
import  sqlite3  from "sqlite3";
import { open } from "sqlite";

export interface User{
    name: string;
    email: string;
    Exercise?: number;
    ExerciseHistory?: {};
}

export default async function getUserById(req: NextApiRequest, res: NextApiResponse){
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
