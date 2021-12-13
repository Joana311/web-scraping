import { gql } from "apollo-server-micro";
//npx prisma format 

//You should be getting recommendations the whole time you type 
//(except for the top level names which you make up yourself). \
//If you’re not, run
//“Apollo: Reload Schema”
//again and see if there’s an error message you can decipher.

export const typeDefs = gql`
  type Query {
    getAllUsers(last: Int): [User!]!
    allExercises(last: Int): [Exercise]
    exercisehistory(name: String): User
    users:[User]
    user(name: String, email: String, id: ID): User
    # workouts: [Workout]
    workout(ownerID: ID, date: String): [Workout]
    set(exerciseID: ID, ownerID: ID): [Set]
    sets: [Set]
    exercise(uuid:ID!,name:String): Exercise
  }

  type Mutation {
    createUser(name: String!, email: String!): User!
    addEmptyWorkout(ownerID: ID!): [Workout]
    createWorkout(ownerID: ID!): User
    }
  type User {
    id: ID!
    name: String!
    email: String!
    workouts: [Workout]
  }
  type Workout {
    ownerID: ID!
    owner: User
    date: String!
    sets: [Set]
  }
  type Set {
    exerciseID: ID
    ownerID: ID!
    reps: Int
    rpe: Int
  }
  type Exercise {
    id: Int
    uuid:ID!
    name: String!
    url: String
    inSets: [Set]
  }
`;

// {
//     getAllExercisesLogged{
//      allUsers{
//         name
//             email
//                 exerciseHistory{
//                     sets{
//                         exercise
//             }
//         }
//      }
//     }
//   }