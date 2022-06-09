import { gql } from "apollo-server-micro";
import { makeSchema } from "nexus";
import { join } from "path";

export const schema = makeSchema({
    types: [],
    outputs: {
        typegen: join(
            process.cwd(),
            'node_modules',
            '@types',
            'nexus-typegen',
            'index.d.ts'
        ),
        schema: join(process.cwd(), "graphql", "schema.graphql"),
    },
    contextType: {
        export: 'Context',
        module: join(process.cwd(), 'graphql, "context.ts'),
    },
});

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
    exerciseHistory: [Workout!]!
  }
  type Workout {
    ownerID: ID!
    owner: User!
    date: String!
    sets: [Set!]!
  }
  type Set {
    exerciseID: ID!
    ownerID: ID!
    reps: Int!
    rpe: Int!
  }
  type Exercise {
    id: Int
    uuid:ID!
    name: String!
    url: String
    inSets: [Set]
  }
`;
