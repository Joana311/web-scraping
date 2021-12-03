import { gql } from "apollo-server-micro";
export const typeDefs = gql`
  type Query {
    hello: String!
    getAllUsers(last: Int): [User!]!
    allExercises(last: Int): [Exercise!]!
  }

  type mutation {
    createUser(name: String!, email: String!): User!
  }
  type User {
    id: ID!
    name: String!
    email: String!
    exerciseHistory: [ExerciseHistory!]!
  }
  type ExerciseHistory {
    ownerID: ID!
    date: String!
    sets: [Set!]!
  }
  type Set {
    exerciseID: ID!
    reps: Int!
    rpe: Int!
  }
  type Exercise {
    id:ID!
    name: String!
    url: String
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