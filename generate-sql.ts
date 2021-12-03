//COULDNT FIGURE OUT HOW TO GET THIS PACKAGE WORKING 


import {gql} from "graphql-tag"
import * as fs from 'fs'
import {makeSqlSchema, getSchemaDirectives, sqlDirectiveDeclaration} from "graphql-directive-sql";
//https://www.npmjs.com/package/graphql-directive-sql
//databaseOnlyField: Type @sql @private

const typeDefs = gql`
  directive @sql (
    unicode: Boolean
    constraints: String
    auto: Boolean
    default: String
    index: Boolean
    nullable: Boolean
    primary: Boolean
    type: String
    unique: Boolean
  ) on OBJECT | FIELD_DEFINITION
  directive @private on OBJECT | FIELD_DEFINITION

  type User {
    id: ID @sql(primary: true)
    name: String @sql()
    email: String @sql()
    workoutHistory: [Workout!]!
  }
  type Workout @sql(constraints: "FOREIGN KEY(ownerID) REFERENCES User(id)") {
    id: ID @sql() @private(primary: true)
    ownerID: ID @sql() @private()
    owner: User
    date: String @sql(type:"TIMESTAMP" , default: "CURRENT_TIMESTAMP")
    sets: [Set!]!
  }
  type Set @sql(constraints: 
    "FOREIGN KEY(exerciseID) REFERENCES Exercise(id),\\n
     FOREIGN KEY(workoutID) REFERENCES Workout(id)"
    ){
    exerciseID: ID @sql() @private()
    workoutID: ID @sql() @private()
    exercise: Exercise
    reps: Int
    rpe: Int
  }
  type Exercise {
    id: ID @sql ()
    name: String @sql()
    url: String @sql()
  }
`;
const outputFilepath = 'schemaScript.sql'
const directives = getSchemaDirectives()
makeSqlSchema({
  typeDefs,
  schemaDirectives: directives,
  outputFilepath,
  databaseName: 'dbname',
  tablePrefix: 'test_',
})
