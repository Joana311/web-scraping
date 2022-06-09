/**
 * @typedef { import("@prisma/client").PrismaClient } Prisma
 
@typedef { import("@prisma/client").UserCreateArgs } UserCreateArgs
 */
import { ownerWindow } from "@mui/material";
import type { Context } from "./context";

import { typeDefs } from "./schema";
import { gql } from "@apollo/client";
import { DateTimeResolver } from "graphql-scalars";
import { TurnSlightRightTwoTone } from "@mui/icons-material";
import { ExerciseResolvers } from "./generated/graphql";
import { connect } from "http2";

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
      return await ctx.prisma.exercise.findMany({
        select: {
          name: true,
          id: true,
          url: true,
          uuid: true,
        },
      });
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
      args: { workoutId: string; date: string },
      ctx: Context
    ) => {
      return await ctx.prisma.workout.findFirst({
        where: {
          id: args.workoutId,
          date: args.date,
        },
        include: {
          owner: true,
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
    workoutByExercises: async (parent, args, ctx: Context) => {
      return await ctx.prisma.exercise.findMany({
        where: {
          inSets: {
            every: {
              workoutID: args.id,
            },
          },
        },
        include:{
          inSets:true
        }
      });
    },
  },
  Mutation: {
    addWorkoutSet: async (
      parent,
      args: {
        id: string;
        workoutID: string;
        exerciseID: string;
        reps: number;
        rpe: number;
      },
      ctx: Context
    ) => {
      const data = await ctx.prisma.set.upsert({
        where: {
          id: args.id || "",
        },
        create: {
          workoutID: String(args.workoutID),
          exerciseID: String(args.exerciseID),
          reps: args.reps,
          rpe: 0,
        },
        update: {
          workoutID: String(args.workoutID),
          exerciseID: String(args.exerciseID),
          reps: args.reps,
          rpe: 0,
        },
        select: {
          id: true,
        },
      });
      //console.log(data)
      if (!args.id) return data;
      else return null;
    },

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
              reps: Number(0),
              rpe: Number(0),
            },
          },
        },
      });
      return ctx.prisma.user.findUnique({
        where: {
          id: args.ownerID,
        },
        include: {
          workouts: {
            include: {
              sets: true,
            },
          },
        },
      });
    },
  },
  Exercise: {
    id: async (parent) => {
      //console.log(parent.id);
      return parent.id;
    },
    uuid: async (parent) => {
      return parent.uuid;
    },
    inSets: async (parent, args, ctx) => {
      return await ctx.prisma.set.findMany({
        where: {
          exerciseID: parent.uuid,
        }
      });
    },
  },
  Workout: {
    // owner: async (parent, args, ctx) =>{
    //   const res = await ctx.prisma.user.findUnique({
    //     where:{
    //       id: parent.ownerID
    //     }
    //   })
    //   return res
    // },
    sets: async (parent, args, ctx) => {
      //console.log(parent.ownerID);
      const res = await ctx.prisma.set.findMany({
        where: {
          workoutID: parent.id,
        },
      });
      //console.log(res)
      return res;
    },
  },
};
