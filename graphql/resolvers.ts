
export const resolvers = {
    //this function looks up the dat for each feild in a query.
    //functions takes 3 up to three things (parent,argument,context)
    Query: {
      allExercises: async (_parent,_args, ctx) => await ctx.prisma.exercise.findMany(),
    }  
};