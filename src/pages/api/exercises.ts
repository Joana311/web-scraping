import { NextApiRequest, NextApiResponse } from "next";
import {open} from 'sqlite';
import sqlite3 from 'sqlite3';

export interface Exercise{
    id: number;
    name: string;
    link: string;
    excerciseID?: number;
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
