import { ApolloClient, InMemoryCache } from "@apollo/client";
import { useMemo } from "react";
import { DateTimeResolver } from 'graphql-scalars'
const apolloClient = new ApolloClient({
  ssrMode: typeof window === 'undefined',
  uri: "http://localhost:3000/api/graphql",
  cache: new InMemoryCache(),
});


 export default apolloClient