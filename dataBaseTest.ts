import {open} from 'sqlite';
import sqlite3 from 'sqlite3';

export interface User{
    name: string;
    email: string;
    excerciseID?: number;
};
export interface Exercise{
    id: number;
    name: string;
    link: string;
    //excerciseID?: number;
};
const populateDB = async()=>{

};


const setup = async() => {
    
    //debugger;
    sqlite3.verbose();
    const db = await open({
        filename: './myNewDb.sqlite3',
        driver: sqlite3.Database,
    });
    await db.migrate({force: true, migrationsPath: "./migrations"});
    const currentUsers = await db.all<User[]>('SELECT * FROM User');
    const currentExercises = await db.all<Exercise[]>('SELECT * FROM Exercise');
    //debugger;
    console.log(typeof currentUsers);
    console.log('All users', JSON.stringify(currentUsers,null,2));
    console.log('All Excercises', JSON.stringify(currentExercises,null,2));
    

};

setup().catch((err)=>{
    console.log(err.message)
});
