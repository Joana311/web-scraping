/**
 * @typedef { import("@prisma/client").PrismaClient } Prisma
 
@typedef { import("@prisma/client").UserCreateArgs } UserCreateArgs
 */
import { ownerWindow } from "@mui/material";
import type { Context } from "../graphql/context";

import { typeDefs } from "./schema";
import { gql } from "@apollo/client";
import { UserWorkouts } from '../src/containers/UserWorkouts';
export const resolvers = {
  //this function looks up the dat for each feild in a query.
  //functions takes 3 up to three things (parent,argument,context)
  //Since we are using prisma. all the Query language is taken care of 
  Query: {
    allExercises: async (_parent, _args, ctx: Context) =>
      await ctx.prisma.exercise.findMany(),
    grabSingleUser: async (
      _parent,
      args: { name?: string; email?: string },
      ctx: Context
    ) =>
      await ctx.prisma.user.findFirst({
        where: {
          name: args.name,
          email: args.email,
        },
        rejectOnNotFound: true,
      }),
  },
  Mutation: {
    createWorkout: async (
      _parent,
      args: { ownerID: string },
      ctx: Context
    ) => {
      //console.log({args})
      await ctx.prisma.workout.create({
        
        data:{
          owner:{
            connect: {id: args.ownerID},
        },
        sets: undefined,
      },
    })
    const data = await ctx.prisma.user.findUnique({
      where:{
        id: args.ownerID
      },
      include:{
        exerciseHistory:true,
      },
    })
    return data;
    },
  },
  User: {},
  Workout: {},
};
