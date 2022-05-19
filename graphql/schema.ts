import { gql } from "apollo-server-micro";
//npx prisma format

//You should be getting recommendations the whole time you type
//(except for the top level names which you make up yourself). \
//If you’re not, run
//“Apollo: Reload Schema”
//again and see if there’s an error message you can decipher.

export const typeDefs = gql`
  type Query {
    allExercises(last: Int): [Exercise]
    workoutByExercises(id: ID!): [Exercise]
    users: [User]
    user(name: String, email: String, id: ID): User
    workouts(ownerID: ID!, date: String): [Workout]
    workout(id: ID!, date: String): Workout
    set(exerciseID: ID, ownerID: ID!): [Set]
    sets: [Set]
  }

  type Mutation {
    createUser(name: String!, email: String!): User!
    addEmptyWorkout(ownerID: ID!): User
    createWorkout(ownerID: ID!): User
    addWorkoutSet(
      id: ID
      workoutID: ID!
      exerciseID: ID!
      reps: Int
      rpe: Int
    ): Set
  }
  type User {
    id: ID!
    name: String!
    email: String!
    workouts: [Workout]
  }
  type Workout {
    id: ID!
    ownerID: ID!
    owner: User
    date: String!
    sets: [Set]
  }
  type Set {
    id: ID!
    createdAt: String
    exerciseID: ID
    workoutID: ID!
    weight: Int
    reps: Int
    rpe: Int
  }
  type Exercise {
    id: Int
    uuid: ID!
    name: String!
    url: String
    inSets: [Set]
  }
`;
