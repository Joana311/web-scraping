import type{ Context } from '../graphql/context';
export const resolvers = {
    //this function looks up the dat for each feild in a query.
    //functions takes 3 up to three things (parent,argument,context)
    Query: {
      allExercises: async (_parent,_args, ctx: Context) => await ctx.prisma.exercise.findMany(),
      grabSingleUser: async (_parent, args :{name?: string, email?: string},ctx: Context) => await ctx.prisma.user.findFirst({
        where:{
          name: args.name,
          email: args.email,
        },
        rejectOnNotFound: true,
      })
    }  
};