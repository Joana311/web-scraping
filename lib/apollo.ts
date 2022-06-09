import { ApolloClient, InMemoryCache, NormalizedCacheObject } from "@apollo/client";
import { useMemo } from "react";
import { DateTimeResolver } from 'graphql-scalars'
import getConfig from 'next/config';
import { typeDefs } from "../__dep__graphql/schema";
import { resolvers } from '../__dep__graphql/resolvers';
import { schema } from "../src/pages/api/graphql";

//const { publicRuntimeConfig } = getConfig();

//This unitilized variable for apolloClient takes the type of data
//where it has an insitance of ApolloClient with a cache type of NomalizedCacheObject
//Normalized Cache Object is just a basic cache provided by apollo

//https://www.youtube.com/watch?v=y34ym0-KZ8A

let apolloClient: ApolloClient<NormalizedCacheObject>;

const myApolloClient = new ApolloClient({
  connectToDevTools: true,
  ssrMode: typeof window === 'undefined',
  uri: "http://localhost:3000/api/graphql",
  //link: createIsomorphicLink(),
  cache: new InMemoryCache(),
});
export default myApolloClient


// //Isomorphic Link lets the App know if were on the server or client
// //Nextjs might do some parsing to check for these "window" conditions

// function createIsomorphicLink(){
//  if(typeof window === "undefined"){
//    //server
//    const {SchemaLink} = require ("@apollo/client/link/schema")
//    console.log('using Server Side')
//    return new SchemaLink({schema})
//  } else{
//    //client 
//    console.log('On Client')
//    const {HttpLink} = require ("@apollo/client/link/http")
//    return new HttpLink({uri: "http://localhost:3000/api/graphql"})
//  }
// }

// const createApolloClient = () => new ApolloClient({
//     //if a window object is available tells the system what it
//     //needs to know about if were doing SSR or not 
//     ssrMode: typeof window === 'undefined',
//     uri: "http://localhost:3000/api/graphql",
//     //link: createIsomorphicLink(),
//     cache: new InMemoryCache(),
//   });

// export function initializeApollo(initialState = null) {
//   //nullish coalescing operator ?? 
//   const _apolloClient = apolloClient ?? createApolloClient();

//   // If your page has Next.js data fetching methods that use Apollo Client,
//   // the initial state gets hydrated here
//   if (initialState) {
//     // Get existing cache, loaded during client side data fetching
//     const existingCache = _apolloClient.extract();

//     // Restore the cache using the data passed from
//     // getStaticProps/getServerSideProps combined with the existing cached data
//     _apolloClient.cache.restore({ ...existingCache, ...initialState });
//   }

//   // For SSG and SSR always create a new Apollo Client
//   if (typeof window === 'undefined') return _apolloClient;

//   // Create the Apollo Client once in the client
//   if (!apolloClient) apolloClient = _apolloClient;
//   return _apolloClient;
// }

// export function useApollo(initialState) {
//   const store = useMemo(() => initializeApollo(initialState), [initialState]);
//   return store;
// }
// // This apolloClient does not hyrdate. 