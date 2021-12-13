import { ApolloServer } from "apollo-server-micro";
import  Cors  from "micro-cors";
import { PageConfig } from "next";
import { typeDefs } from "../../../graphql/schema";
import { resolvers } from "../../../graphql/resolvers";
import { createContext } from "../../../graphql/context";

import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageDisabled,
} from "apollo-server-core";
//Apollo 
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

const cors = Cors({allowMethods: ['PUT', 'POST'] 
});
//Make sure u open Sanbox in INCOGNITO Adblock will fuck up the CORS
//Un-comment to run on old UI for Apollo
const server = new ApolloServer({
  // plugins: [
  //   process.env.NODE_ENV === "production"
  //     ? ApolloServerPluginLandingPageDisabled()
  //     : ApolloServerPluginLandingPageGraphQLPlayground(),
  // ],
  typeDefs,
  resolvers,
  context:createContext,
});
const startServer = server.start();

export default cors(async(req, res) => {
  if (req.method === "OPTIONS") {
    res.end();
    return false;
  }
  await startServer;
  await server.createHandler({ path: "/api/graphql" })(req, res);
});


