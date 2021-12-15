/**
 * @typedef { import("@prisma/client").PrismaClient } Prisma
 
@typedef { import("@prisma/client").UserCreateArgs } UserCreateArgs
 */
import { ownerWindow } from "@mui/material";
import type { Context } from "../graphql/context";

import { typeDefs } from "./schema";
import { gql } from "@apollo/client";
import { UserWorkouts } from "../src/containers/UserWorkouts";
import { DateTimeResolver } from "graphql-scalars";

//You should be getting recommendations the whole time you type
//(except for the top level names which you make up yourself). \
//If you’re not, run
//“Apollo: Reload Schema”
//again and see if there’s an error message you can decipher.

export const resolvers = {
  //this function looks up the dat for each feild in a query.
  //functions takes 3 up to three things (parent,argument,context)
  //Since we are using prisma. all the Query language is taken care of
  // date: DateTimeResolver,
  Query: {
    allExercises: async (_parent, _args, ctx: Context) => {
      await ctx.prisma.exercise.findMany();
    },
    user: async (
      _parent,
      args: { name?: string; email?: string },
      ctx: Context
    ) =>
      await ctx.prisma.user.findFirst({
        where: {
          name: args.name,
          email: args.email,
        },
        include: {
          workouts: true,
        },
        rejectOnNotFound: true,
      }),
    workout: async (
      _parent,
      args: { ownerID: string; date: string },
      ctx: Context
    ) => {
      return await ctx.prisma.workout.findFirst({
        where: {
          ownerID: args.ownerID,
          date: args.date,
        },
      });
    },
    workouts: async (
      _parent,
      args: { ownerID: string; date: string },
      ctx: Context
    ) => {
      return await ctx.prisma.workout.findMany({
        where: {
          ownerID: args.ownerID,
        },
        include: { sets: true },
      });
    },
  },
  Mutation: {
    addEmptyWorkout: async (
      parent,
      args: { ownerID: string },
      ctx: Context
    ) => {
      //console.log({args})
      await ctx.prisma.workout.create({
        data: {
          owner: {
            connect: { id: args.ownerID },
          },
          sets: {
            create: {
              exerciseID: undefined,
              reps: 0,
              rpe: 0,
            },
          },
        },
      });
      return ctx.prisma.user.findUnique({
        where: {
          id: args.ownerID,
        },
      });
    },
  },
  Workout:{
    
  }
};
