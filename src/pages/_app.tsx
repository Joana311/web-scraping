import React from "react";
import Head from "next/head";
import { AppType } from "next/dist/shared/lib/utils";
import superjson from "superjson";
import { MainLayout } from "../layouts/mainLayout";
import { appRouter } from "@server/routers/_app";
import trpcNextHooks from "src/client/trpc";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"; 
import "../../styles/globals.css";
import { useRouter } from "next/router";
import { Session } from "next-auth/core/types";
import { GetStaticProps, GetStaticPropsContext } from "next";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
// interface MyAppProps extends AppProps {
//   emotionCache?: EmotionCache;
//   pageProps: any;
// }
type AuthCtx = {
  session?: Session | null;
}
const AuthContext = React.createContext<AuthCtx>({
  session: undefined,
});
export function useSession() {
  return React.useContext(AuthContext);
}
const App: AppType = ({ pageProps, Component }): JSX.Element => {
  const { data: auth_data, error } = trpcNextHooks.next_auth.get_session.useQuery(undefined, {
    // context: { skipBatch: true },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    enabled: typeof window !== "undefined",
    // 5 minutes in milliseconds
    staleTime: 5 * 60 * 1000,
    retryOnMount: false,
  });
  const queryContext = trpcNextHooks.useContext();
  const isInit = React.useRef(false)
  const router = useRouter();
  const queryClient = useQueryClient(); // the react-query client should have been instantiated by withTRPC()
  // One-time use effect to set the react-query client default behaviors
  React.useEffect(() => {
    if (queryContext && typeof window !== "undefined" && !isInit.current) {
      console.log("setting react-query defaults");
      queryClient.setDefaultOptions({
        queries: {
          retry(failureCount, error: any) {
            if (
              (error.data?.code === "UNAUTHORIZED" &&
                error.message.includes("NO_SESSION")) &&
              failureCount == 1
            ) {
              console.log("Session not found invalidating client session")
              console.log("failureCount: ", 2);
              // i think whats happening here is that 2 queries are fired. then on failure query is invalidated.
              // which causes itself to be refetched. which causes the error to be thrown again.
              // i dont think we actually need to invalidate. the purpose of it is for when the session expires-
              // if any other query that is not "next-auth.get_session" picks up on the expiration, the error gets propogated down.
              console.log("error with auth session. should re-route to home.")
              queryContext.next_auth.get_session.setData(undefined, () => null as any); // what happens if i dont try to invalidate?
              router.push("/");
              // }
              return false;
            }
            return true;
          },
        }
      });
      isInit.current = true;
    }
  }, []);
  const sessionRef = React.useRef(auth_data);
  const session = React.useMemo(() => {
    console.log("new session or error found")
    // console.log("session: ", auth_data);
    // console.log("error: ", error?.message?.includes("NO_SESSION"));
    if (!sessionRef.current && auth_data) {
      sessionRef.current = auth_data;
      return sessionRef.current;
    }
    if (auth_data == sessionRef.current) return sessionRef.current;
    return undefined;
  }, [auth_data, error]);

  const appLocation = React.useMemo(() => {
    switch (router.pathname) {
      case "/":
        // set the head title
        return "Welcome!";
      case "/[user]":
        return "Daily Summary";
      case "/[user]/workout/[workout_id]":
        return "Workout Report";
      case "/[user]/workout/history":
        return "Workout History";
      case "/[user]/exercise/[exercise_id]":
        return "Exercise Info";
      default:
        return "404";
    }
  }, [router.pathname]);
  return (
    <AuthContext.Provider value={{ session: session }} >
      <Head >
        <title>{`ExBuddy${appLocation != '404' && (' | ' + appLocation)}`}</title>
        <meta name="viewport" content="initial-scale=1, width=device-width, user-scalable=no" />
      </Head >
      <MainLayout session={session} appLocation={appLocation}>
        <Component {...pageProps} />
      </MainLayout>
      {process.env.NODE_ENV === "development" && <ReactQueryDevtools />}
    </AuthContext.Provider>
  )
};
const getStaticProps: GetStaticProps = async (ctx: GetStaticPropsContext) => {
  // create a dummy request and response to pass to the server;

  const ssg = await createServerSideHelpers({
    router: appRouter,
    ctx: { session: undefined, },
    transformer: superjson,
  })
  // todo: setup static caching for the exercise directory to improve SEO by keeping all the exercise data in the index page?
  const directoryQueryKey = getQueryKey(trpcNextHooks.exercise.public_directory, undefined, 'query')
  await ssg.queryClient.fetchQuery(directoryQueryKey);
  return {
    props: {
      trpcState: ssg.dehydrate(),
      exerciseDirectory: ssg.queryClient.getQueryData(directoryQueryKey)
    },
    // 1 hour in seconds
    revalidate: 60 * 60,
  }
}

export default trpcNextHooks.withTRPC(App)