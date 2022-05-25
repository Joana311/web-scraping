import { ApolloServer } from "apollo-server-micro";
import  Cors  from "micro-cors";
import { PageConfig } from "next";
import { typeDefs } from "../../../graphql/schema";
import { resolvers } from "../../../graphql/resolvers";
import { createContext } from "../../../graphql/context";
import { makeExecutableSchema } from "@graphql-tools/schema";
<<<<<<< Updated upstream
=======
import {SCHEMA_QUERY} from "@graphql-tools/apollo-engine-loader";
>>>>>>> Stashed changes

import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageDisabled,
} from "apollo-server-core";

export const config : PageConfig= {
  api: {
    bodyParser: false,
  },
};
export const schema = makeExecutableSchema({ typeDefs });

export const schema = makeExecutableSchema({ typeDefs, resolvers });
//console.log(schema)

const cors = Cors({allowMethods: ['PUT', 'POST'] 
});
//Make sure u open Sanbox in INCOGNITO Adblock will fuck up the CORS

const server = new ApolloServer({
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


