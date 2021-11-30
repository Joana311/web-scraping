import { ApolloServer } from "apollo-server-micro";
import  Cors  from "micro-cors";
import { PageConfig } from "next";
import { typeDefs } from "../../../graphql/schema";
import { resolvers } from "../../../graphql/resolvers";

import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageDisabled,
} from "apollo-server-core";

//Apollo Server simply resolves the graphql schemas using the resolver functions
//ApolloServer3 doesnt auto use Playground anymore. it redirects to apollo studio so
//we need to use micro CORS to deal with the  CORS errors for the requests
//comming in from outside of the domain

//https://github.com/apollographql/apollo-server/discussions/5503

//we dont want it to pasrse the body
//Graphql by defualt will handle that, we just want the headers?
export const config : PageConfig= {
  api: {
    bodyParser: false,
  },
};

// const cors = Cors({
//   origin: "https://studio.apollographql.com/",
//   allowCredentials: true
// });

  // plugins: [
  //   process.env.NODE_ENV === "production"
  //     ? ApolloServerPluginLandingPageDisabled()
  //     : ApolloServerPluginLandingPageGraphQLPlayground(),
  // ],
const server = new ApolloServer({
  typeDefs,
  resolvers,
});
const startServer = server.start();

export default async(req, res) => {
  if (req.method === "OPTIONS") {
    res.end();
    return false;
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://studio.apollographql.com");
  res.setHeader("Access-Control-Allow-Methods", "POST");
  await startServer;
  await server.createHandler({ path: "/api/graphql" })(req, res);
};

// module.exports = server.start().then(async (req,res) => {
//   return await server.createHandler({path:'/api/graphql'})(req, res);
// });

// module.exports = server.start().then((req) => {
//     server.createHandler({path:'/api/graphql'})(req,res)
//     .then(()=>{
//       return cors((req, res) => {
//         req.method === 'OPTIONS' ? console.log('Message') : handler(req, res)
//     });
//   });
//   });
