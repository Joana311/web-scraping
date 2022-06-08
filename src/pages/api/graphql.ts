import { ApolloServer } from "apollo-server-micro";
import Cors from "micro-cors";
import { PageConfig } from "next";
import { typeDefs } from "../../../graphql/schema";
import { resolvers } from "../../../graphql/resolvers";
import { createContext } from "../../../graphql/context";
import { makeExecutableSchema } from "@graphql-tools/schema";

import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageDisabled,
} from "apollo-server-core";

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};

export const schema = makeExecutableSchema({ typeDefs, resolvers });
//console.log(schema)

const cors = Cors({ allowMethods: ["PUT", "POST"] });
//Make sure u open Sandbox in INCOGNITO Adblock will fuck up the CORS

const server = new ApolloServer({
  schema,
  // typeDefs,
  // resolvers,
  context: createContext,
});

const server_start = server.start();

export default cors(async (req, res) => {
  const server_handler = server.createHandler({ path: "/api/graphql" })(
    req,
    res
  );
  if (req.method === "OPTIONS") {
    res.end();
    return false;
  }
  await Promise.all([server_start, server_handler]);
});
